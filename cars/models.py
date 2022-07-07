from django.db import models
from django.conf import settings
# Create your models here.

class Car(models.Model):
    year = models.CharField(max_length=255)
    make = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    image = models.ImageField(null=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True)
    service_list = models.JSONField(blank=True)

    def __str__(self):
        return self.model