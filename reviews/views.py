from rest_framework import generics
from rest_framework.permissions import IsAuthenticatedOrReadOnly

from .models import Review
from .serializers import ReviewSerializer


# Create your views here.

class ReviewListAPIView(generics.ListCreateAPIView):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

