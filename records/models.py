from tkinter import CASCADE
from django.db import models
from django.conf import settings

from shops.models import Shop
from cars.models import Car
# Create your models here.

class Record(models.Model):
    shop = models.CharField(max_length=255)
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='records')
    image = models.ImageField(null=True, blank=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True)
    date = models.DateField(auto_now_add=True)
    note = models.TextField(max_length=300)
    service = models.JSONField()

    def __str__(self):
        return self.note[:20]