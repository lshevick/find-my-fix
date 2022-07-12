from rest_framework import serializers

from dj_rest_auth.serializers import TokenModel

from .models import User
from cars.serializers import CarSerializer

class UserSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField (source='user.username')
    cars = CarSerializer('cars', many=True)
    class Meta:
        model = User
        fields = '__all__'