from django.urls import path

from shops.models import Shop
from .views import ShopListAPIView, ShopDetailAPIView

app_name='shops'

urlpatterns = [
    path('', ShopListAPIView.as_view()),
    path('<int:pk>/', ShopDetailAPIView.as_view()),
]
