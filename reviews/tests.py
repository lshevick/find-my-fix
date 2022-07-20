from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from .models import Review
from shops.models import Shop
from rest_framework import status

# Create your tests here.
User = get_user_model()
client = Client()


class ReviewViewTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create_user(
            username='levi',
            email='levi@example.com',
            password='safepass1',
        )

        shop = Shop.objects.create(name='Test Shop', labor_rate='0.00', services=[
            'service', 'test'], makes=['test', 'makes'], website='www.shop.com', phone='5555555555', address='123 test court')

        Review.objects.create(body='test review', service=['test service'], rating=5.0, user=user, shop=shop)

    def test_get_review(self):
        response = client.get('/api/v1/shops/1/reviews/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_review_has_body(self):
        response = client.get('/api/v1/shops/1/reviews/1/')
        self.assertEqual(response.data['body'], 'test review')
