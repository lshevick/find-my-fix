from django.urls import path, include

app_name = 'api_v1'

urlpatterns = [
    path('accounts/', include('accounts.urls', namespace='accounts')),
    path('cars/', include('cars.urls', namespace='cars')),
]