from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from .models import Shop
from .serializers import ShopSerializer
from rest_framework import status
from django.urls import reverse

# Create your tests here.

User = get_user_model()
client = Client()


class ShopViewsTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create_user(
            username='levi',
            email='levi@example.com',
            password='safepass1',
        )

        Shop.objects.create(name='Test Shop', labor_rate='0.00', services=[
                            'service', 'test'], makes=['test', 'makes'], website='www.shop.com', phone='5555555555', address='123 test court')

    def test_get_all_shops_near_user(self):
        response = client.get('/shops/?location_string=29651')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_shop_detail(self):
        response = client.get('/api/v1/shops/1/')
        # print(response.data['name'])
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_shop_reviews(self):
        response = client.get('/api/v1/shops/1/reviews/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_review_detail(self):
        response = client.get('/shops/1/reviews/1/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_shops_by_services(self):
        response = client.get('/shops/services/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_geocode_location(self):
        response = client.get('/shops/location/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ShopContentTestCase(TestCase):
    def setUp(self):
        user = User.objects.create_user(
            username='levi',
            email='levi@example.com',
            password='safepass1',
        )

        Shop.objects.create(name='Test Shop', labor_rate='0.00', services=[
                            'service', 'test'], makes=['test', 'makes'], website='www.shop.com', phone='5555555555', address='123 test court')

    def test_shop_has_name(self):
        response = client.get('/api/v1/shops/1/')
        # print(response.data['name'])
        self.assertEquals(response.data['name'], 'Test Shop')