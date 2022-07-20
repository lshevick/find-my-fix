from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from .models import Record
from cars.models import Car
from rest_framework import status

# Create your tests here.
User = get_user_model()
client = Client()


class RecordViewTestCase(TestCase):
    @classmethod
    def setUpTestData(cls):
        user = User.objects.create_user(
            username='levi',
            email='levi@example.com',
            password='safepass1',
        )

        car = Car.objects.create(year='1999', make='Honda',
                           model='Civic', service_list=["test"], user=user)

        Record.objects.create(shop='Test Shop', date='2022-07-18', note='test note',
                              service=['test service'], cost='1.00', car=car, user=user)
    
    def test_get_record(self):
        response = client.get('/api/v1/cars/1/records/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_record_has_shop(self):
        response = client.get('/api/v1/cars/1/records/1/')
        self.assertEqual(response.data['shop'], 'Test Shop')