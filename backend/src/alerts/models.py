from django.db import models
from users.models import User
import uuid

class Alert(models.Model):
    SEVERITY_CHOICES = [
        ("Low", "Low"),
        ("Medium", "Medium"),
        ("High", "High"),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=255)
    description = models.TextField()
    crop = models.CharField(max_length=100)
    location = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES)
    date = models.DateField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=100)
    radius = models.FloatField()

    def __str__(self):
        return self.title