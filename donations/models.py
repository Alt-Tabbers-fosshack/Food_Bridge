from django.db import models
from django.conf import settings

class FoodDonation(models.Model):
    # 📜 Our list of approved stages
    STATUS_CHOICES = [
        ('available', 'Available 🟢'),
        ('picked_up', 'Picked Up 🚗'),
        ('completed', 'Completed ✅'),
    ]

    donor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    food_type = models.CharField(max_length=100)
    quantity = models.PositiveIntegerField()
    hours_until_expiry = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    # 🚦 The new status field
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='available' # This sets the starting stage
    )