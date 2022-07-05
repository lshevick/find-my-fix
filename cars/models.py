from django.db import models
from django.conf import settings
# Create your models here.

class Car(models.Model):
    year = models.IntegerField()
    make = models.CharField(max_length=255)
    model = models.CharField(max_length=255)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True)
    service_list = models.JSONField()