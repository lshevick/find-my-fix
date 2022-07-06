from django.urls import path

from .views import ReviewListAPIView

app_name = 'reviews'

urlpatterns = [
    path('', ReviewListAPIView.as_view()),
]
