from django.contrib import admin
from .models import FoodDonation
from users.models import User


@admin.register(FoodDonation)
class FoodDonationAdmin(admin.ModelAdmin):
    list_display = ('id', 'donor', 'food_type', 'quantity', 'hours_until_expiry', 'created_at')

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'donor':
            kwargs['queryset'] = User.objects.filter(role='donor')
        return super().formfield_for_foreignkey(db_field, request, **kwargs)

