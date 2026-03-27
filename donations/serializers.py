from rest_framework import serializers
from .models import FoodDonation
from django.contrib.auth import get_user_model

User = get_user_model()


class DonorSerializer(serializers.ModelSerializer):
    """Minimal donor info for donations list"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email']


class FoodDonationSerializer(serializers.ModelSerializer):
    """Serializer for food donations"""
    
    donor = DonorSerializer(read_only=True)
    donor_id = serializers.IntegerField(write_only=True, required=False)
    
    # Add distance calculation field (will be set dynamically)
    distance = serializers.DecimalField(
        max_digits=6, 
        decimal_places=2, 
        read_only=True,
        required=False
    )
    # Add aliases for frontend compatibility
    lat = serializers.DecimalField(source='latitude', max_digits=9, decimal_places=6, read_only=True)
    lng = serializers.DecimalField(source='longitude', max_digits=9, decimal_places=6, read_only=True)
    
    class Meta:
        model = FoodDonation
        fields = [
            'id', 'donor', 'donor_id', 'food_type', 'quantity', 'unit',
            'latitude', 'longitude','lat' ,'lng','hours_until_expiry', 'status',
            'volunteer', 'receiver', 'created_at', 'updated_at', 'distance'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'donor']
    
    def create(self, validated_data):
        # Automatically set donor from request user
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            validated_data['donor'] = request.user
        return super().create(validated_data)


class DonationStatusUpdateSerializer(serializers.Serializer):
    """Serializer for updating donation status"""
    
    action = serializers.ChoiceField(choices=['pickup', 'deliver'])
