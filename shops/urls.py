from django.urls import path

from shops.models import Shop
from .views import ShopDetailAPIView, ShopReviewListAPIView, shop_distances

app_name='shops'

urlpatterns = [
    path('', shop_distances),
    # path('sorted_reviews/', shop_by_reviews),
    path('<int:pk>/', ShopDetailAPIView.as_view()),
    path('<int:shop>/reviews/', ShopReviewListAPIView.as_view()),
    # path('<str:location_text>/', shop_distances),
]
