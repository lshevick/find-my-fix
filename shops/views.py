from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Shop
from .serializers import ShopSerializer
# Create your views here.

class ShopListAPIView(generics.ListAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer


class ShopDetailAPIView(generics.RetrieveAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

