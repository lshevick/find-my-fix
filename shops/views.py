from rest_framework import generics


from .models import Shop
from .serializers import ShopSerializer
# Create your views here.

class ShopListAPIView(generics.ListAPIView):
    queryset = Shop.objects.all()
    serializer_class = ShopSerializer
    