from django.urls import path

from shops.models import Shop
from .views import ShopListAPIView

app_name='shops'

urlpatterns = [
    path('', ShopListAPIView.as_view()),
]
