from rest_framework import serializers

from .models import Shop
from reviews.serializers import ReviewSerializer

# tell serializer to include reviews
# get all reviews where shop = object shop id

class ShopSerializer(serializers.ModelSerializer):
    distance = serializers.SerializerMethodField()
    reviews = ReviewSerializer('reviews', many=True)
    
    class Meta:
        model = Shop
        fields = '__all__'

    def get_distance(self, obj):
            return obj.distance

class NoDistanceSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer('reviews', many=True)
    
    class Meta:
        model = Shop
        fields = '__all__' 