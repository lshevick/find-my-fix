from ast import Pass
import re
from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db.models import Q

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


def get_addresses(shop):
    return shop.address


def sort_shops_by_distance(shops, origin):
    address_list = list(map(get_addresses, shops))
    address_pipe = ('|').join(address_list)
    encoded_addresses = urllib.parse.quote(address_pipe)

    url = f"https://maps.googleapis.com/maps/api/distancematrix/json?destinations={encoded_addresses}&origins={origin}&key={os.environ['MAP_SECRET_KEY']}"

    response = requests.get(url)
    res = json.loads(response.text)
    elements = res['rows'][0]['elements']

    new_list = []

    for (index, element) in enumerate(elements):
        try:
            shops[index].distance = element['distance']['value'] / 1609.34
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
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get_queryset(self):
        shop = self.kwargs['shop']
        return Review.objects.filter(shop=shop).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

@api_view(['GET'])
def get_location(request):
    try:
        origin = request.query_params.get('location_string')
        url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={origin}&key={os.environ['MAP_SECRET_KEY']}"

        response = requests.get(url)
        res = json.loads(response.text)
        element = res['results'][0]['address_components'][6]['long_name']
        return Response(element)
    except:
        pass

@api_view(['GET'])
def shop_distances(request):
    shops = Shop.objects.all()

    if hasattr(request.user, 'cars'):
        query = Q(makes__icontains='any')
        cars = request.user.cars.all()
        makes = []
        for car in cars:
            if car.make not in makes:
                makes.append(car.make)

        for make in makes:
            query |= Q(makes__icontains=make)
        shops = Shop.objects.filter(query)

    origin = request.query_params.get('location_string')

    # control flow based on lat and lon values in the url
    if origin is not None:
        sorted_shops = sort_shops_by_distance(shops, origin)
        return Response(ShopSerializer(sorted_shops, many=True).data)
    return Response(NoDistanceSerializer(shops, many=True).data)


@api_view(['GET'])
def shop_by_services(request):
    # this function view should filter by the reviews on all shops for the service the user has selected to filter by
    # this may need to be done in the front end where we can easily access all of the corresponding services
    # and vehicles the user owns
    # should use query params to pass a service value through the api request and use that to filter shops by?
    #
    specific_year = request.query_params.get('specific_year')
    specific_make = request.query_params.get('specific_make')
    specific_model = request.query_params.get('specific_model')
    car_queries = Q(year__icontains=specific_year) & Q(make__icontains=specific_make) & Q(model__icontains=specific_model) 
    cars = request.user.cars.filter(car_queries)

    service_query = Q()
    services = []
    for car in cars:
        for service in car.service_list:
                services.append(service)

    for service in services:
        s = ''.join(service)
        service_query |= Q(services__icontains=s)

    shops = Shop.objects.filter(service_query & (Q(makes__icontains=specific_make) | Q(makes__icontains='any')))
    origin = request.query_params.get('location_string')

    if origin is not None:
        sorted_shops = sort_shops_by_distance(shops, origin)
        return Response(ShopSerializer(sorted_shops, many=True).data)
    return Response(NoDistanceSerializer(shops, many=True).data)


