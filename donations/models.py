from django.db import models
from django.conf import settings

class FoodDonation(models.Model):
    """Model for food donations"""
    
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('picked_up', 'Picked Up'),
        ('delivered', 'Delivered'),
    ]

    donor = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='donations'
    )
    food_type = models.CharField(max_length=200)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    unit = models.CharField(
        max_length=20,
        default='plates',
        choices=[
            ('plates', 'Plates'),
            ('kg', 'Kilograms'),
            ('boxes', 'Boxes'),
            ('packets', 'Packets'),
        ]
    )
    
    # Location fields
    latitude = models.DecimalField(max_digits=9, decimal_places=6, default=0.0)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, default=0.0)
    
    hours_until_expiry = models.PositiveIntegerField(default=4)
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='available'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Optional fields
    volunteer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='volunteer_tasks'
    )
    receiver = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='received_donations'
    )
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.food_type} - {self.quantity}{self.unit} ({self.status})"