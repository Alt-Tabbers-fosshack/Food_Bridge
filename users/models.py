from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    DONOR = 'donor'
    VOLUNTEER = 'volunteer'
    RECEIVER = 'receiver'
    
    ROLE_CHOICES = [
        (DONOR, 'Donor'),
        (VOLUNTEER, 'Volunteer'),
        (RECEIVER, 'Receiver'),
    ]
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default=DONOR
    )
    
    # Make email required and unique
    email = models.EmailField(unique=True)
    
    # Optional: Add phone field for future
    phone = models.CharField(max_length=15, blank=True, null=True)
    
    def __str__(self):
        return f"{self.username} ({self.role})"