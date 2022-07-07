from django.urls import path

from shops.models import Shop
from .views import ShopListAPIView, ShopDetailAPIView, ShopReviewListAPIView

app_name='shops'

urlpatterns = [
    path('', ShopListAPIView.as_view()),
    path('<int:pk>/', ShopDetailAPIView.as_view()),
    path('<int:shop>/reviews/', ShopReviewListAPIView.as_view()),
]
