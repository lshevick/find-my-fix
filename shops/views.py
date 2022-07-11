from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.forms.models import model_to_dict

import logging
import requests
import urllib.parse
import os
import json

from .models import Shop
from .serializers import ShopSerializer, NoDistanceSerializer
from reviews.models import Review
from reviews.serializers import ReviewSerializer

logger = logging.getLogger("django")

# origin = urllib.parse.quote('34.9139306,-82.4231325')
# shops = Shop.objects.all()


def sort_shops_by_distance(shops, origin):
    def get_addresses(shop):
        return shop.address

    address_list = list(map(get_addresses, shops))
    address_pipe = ('|').join(address_list)
    encoded_addresses = urllib.parse.quote(address_pipe)

    url = f"https://maps.googleapis.com/maps/api/distancematrix/json?destinations={encoded_addresses}&origins={origin}&key={os.environ['MAP_SECRET_KEY']}"

    response = requests.get(url)
    res = json.loads(response.text)
    el = res['rows'][0]['elements']

    new_list = []

    for (index, e) in enumerate(el):
        try:
            shops[index].distance = e['distance']['value'] / 1609.34
            new_list.append(shops[index])
        except:
            pass

    # logger.info(sorted(new_list, key=lambda i: i.distance))
    return sorted(new_list, key=lambda i: i.distance)


# Create your views here.


# class ShopListAPIView(generics.ListAPIView):
#     queryset = Shop.objects.all()
#     serializer_class = ShopSerializer


class ShopDetailAPIView(generics.RetrieveAPIView):
    queryset = Shop.objects.all()
    serializer_class = NoDistanceSerializer


class ShopReviewListAPIView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        shop = self.kwargs['shop']
        return Review.objects.filter(shop=shop)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
def shop_distances(request):
    # control flow based on lat and lon values in the url
    # check if location_string exists in kwargs
    shops = Shop.objects.all()
    origin = request.query_params.get('location_string')

    if origin is not None:
        sorted_shops = sort_shops_by_distance(shops, origin)
        return Response(ShopSerializer(sorted_shops, many=True).data)
    return Response(NoDistanceSerializer(shops, many=True).data)


# @api_view(['GET'])
# def shop_by_reviews(request):
#     shops = Shop.objects.filter(review__shop='shop_name')
#     return Response(ShopSerializer(shops).data)


#check out related name adding to model for reviews
