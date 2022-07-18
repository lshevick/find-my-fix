from django.urls import path

from .views import CarListAPIView, CarDetailAPIView, RecordListAPIView, RecordDetailAPIView

app_name = 'cars'

urlpatterns = [
    path('', CarListAPIView.as_view()),
    path('<int:pk>/', CarDetailAPIView.as_view()),
    path('<int:car>/records/', RecordListAPIView.as_view()),
    path('<int:car>/records/<int:pk>/', RecordDetailAPIView.as_view()),


]
