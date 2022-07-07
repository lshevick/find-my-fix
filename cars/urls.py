from django.urls import path

from .views import CarListAPIView, CarDetailAPIView

app_name = 'cars'

urlpatterns = [
    path('', CarListAPIView.as_view()),
    path('<int:pk>/', CarDetailAPIView.as_view()),

]
