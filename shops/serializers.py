from rest_framework import serializers

from .models import Shop
from reviews.serializers import ReviewSerializer

from functools import reduce

# tell serializer to include reviews
# get all reviews where shop = object shop id
import logging
logger = logging.getLogger("django")


class ShopSerializer(serializers.ModelSerializer):
    distance = serializers.SerializerMethodField()
    reviews = ReviewSerializer('reviews', many=True)
    average = serializers.SerializerMethodField()

    class Meta:
        model = Shop
        fields = '__all__'

    def get_distance(self, obj):
        return obj.distance


    def get_average(self, obj):
        try:
            total = []
            average = None
            for review in obj.reviews.all():
                total.append(int(review.rating))
            average = int(sum(total) / len(obj.reviews.all()))
            return average
        except:
            return 0

class NoDistanceSerializer(serializers.ModelSerializer):
    reviews = ReviewSerializer('reviews', many=True)

    class Meta:
        model = Shop
        fields = '__all__'
