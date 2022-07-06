from tkinter.font import names
from django.urls import path, include

app_name = 'api_v1'

urlpatterns = [
    path('accounts/', include('accounts.urls', namespace='accounts')),
    path('cars/', include('cars.urls', namespace='cars')),
    path('shops/', include('shops.urls', namespace='shops')),
    path('reviews/', include('reviews.urls', namespace='reviews')),
]