from django.db import models

# Create your models here.

class Shop(models.Model):
    name = models.CharField(max_length=255)
    labor_rate = models.CharField(max_length=255)
    services = models.JSONField()
    makes = models.JSONField()
    website = models.CharField(max_length=255)
    address = models.CharField(max_length=255)
    phone = models.CharField(max_length=255)
    
    def __str__(self):
        return self.name