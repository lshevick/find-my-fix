from django.urls import path

from .views import CarListAPIView #, get_makes

app_name = 'cars'

urlpatterns = [
    path('', CarListAPIView.as_view()),
    # path('makes/', get_makes),
    
]
