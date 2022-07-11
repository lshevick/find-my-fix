from rest_framework import serializers

from .models import Shop

class ShopSerializer(serializers.ModelSerializer):
    distance = serializers.SerializerMethodField()
    class Meta:
        model = Shop
        fields = '__all__'

    def get_distance(self, obj):
            return obj.distance

class NoDistanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shop
        fields = '__all__'