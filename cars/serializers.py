from rest_framework import serializers

from .models import Car
from records.serializers import RecordSerializer

class CarSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')
    records = RecordSerializer('records', many=True)

    class Meta:
        model = Car
        fields = '__all__'