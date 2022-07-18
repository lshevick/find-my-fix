from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from .models import Shop
from .serializers import ShopSerializer
from rest_framework import status

# Create your tests here.

User = get_user_model()
client = Client()