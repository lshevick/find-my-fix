from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Shop
from .serializers import ShopSerializer
from reviews.models import Review
from reviews.serializers import ReviewSerializer
# Create your views here.

class ShopListAPIView(generics.ListAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer


class ShopDetailAPIView(generics.RetrieveAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

class ShopReviewListAPIView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer

    def get_queryset(self):
        shop = self.kwargs['shop']
        return Review.objects.filter(shop=shop)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)