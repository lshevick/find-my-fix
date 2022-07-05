from rest_framework import serializers

from .models import Car

class CarSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    class Meta:
        model = Car
        fields = '__all__'