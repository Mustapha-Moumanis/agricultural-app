from django.db import models

# Create your models here.
import os
import random

from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import date, timedelta

def GenerateProfileImagePath(instance, filename):
    ext = filename.split('.')[-1]
    path = f'static/accounts/{instance.id}/images/'
    name = f'profile_image.{ext}'
    return os.path.join(path, name)

def GenerateDefaultImagePath():
    path = f'/static/default/{random.randint(1, 2)}.svg'
    return path

def default_18_years_ago():
    return date.today().replace(year=date.today().year - 18)

class User(AbstractUser):
    class Roles(models.TextChoices):
        AGRONOME = "AGRONOME", "Agronome"
        FERMIER = "FERMIER", "Fermier"
    
    avatar = models.ImageField(upload_to=GenerateProfileImagePath, max_length=200, default=GenerateDefaultImagePath)
    date_of_birth = models.DateField(null=True, blank=True)
    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.FERMIER
    )