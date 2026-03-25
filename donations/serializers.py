from rest_framework import serializers
from .models import FoodDonation

class FoodDonationSerializer(serializers.ModelSerializer):
    donor = serializers.HiddenField(default=serializers.CurrentUserDefault())
    donor_username = serializers.CharField(source='donor.username', read_only=True)
    donor_email = serializers.CharField(source='donor.email', read_only=True)
    donor_role = serializers.CharField(source='donor.role', read_only=True)

    class Meta:
        model = FoodDonation
        fields = ['id', 'donor', 'donor_username', 'donor_email', 'donor_role', 'food_type', 'quantity', 'hours_until_expiry', 'created_at', 'status']
        read_only_fields = ['created_at']

    def validate_hours_until_expiry(self, value):
        if value <= 0:
            raise serializers.ValidationError('hours_until_expiry must be greater than 0')
        return value
