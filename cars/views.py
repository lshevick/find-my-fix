from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.response import Response
from rest_framework.decorators import api_view

from .models import Car
from .serializers import CarSerializer

import requests
import os

# Create your views here.
# @api_view(['GET'])
# def get_makes(request):

#     headers = {
#         "X-RapidAPI-Key": os.environ["CAR_API_KEY"],
#         "X-RapidAPI-Host": "car-data.p.rapidapi.com"
#     }
#     make_list = requests.get('https://car-data.p.rapidapi.com/cars/makes/', headers=headers)
#     data = make_list.json()
#     print(data)
#     return Response(data)

class CarListAPIView(generics.ListCreateAPIView):
    # queryset = Car.objects.all()
    serializer_class = CarSerializer

    def get_queryset(self):
        user = self.request.user
        return Car.objects.filter(user=user.id)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CarDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer

