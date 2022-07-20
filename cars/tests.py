from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from .models import Car
from .serializers import CarSerializer
from rest_framework import status
from django.urls import reverse

# Create your tests here.

User = get_user_model()
client = Client()


class CarViewsTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create_user(
            username='levi',
            email='levi@example.com',
            password='safepass1',
        )

        Car.objects.create(year='1999', make='Honda', model='Civic', service_list=["test"], user=user)

    def test_get_user_car(self):
        response = client.get('/api/v1/cars/1/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_car_has_year(self):
        response = client.get('/api/v1/cars/1/')
        self.assertEquals(response.data['year'], '1999')
