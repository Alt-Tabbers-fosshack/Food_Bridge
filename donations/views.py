from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db import models
from math import radians, cos, sin, asin, sqrt

from .models import FoodDonation
from .serializers import FoodDonationSerializer, DonationStatusUpdateSerializer


def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Calculate distance between two points using Haversine formula
    Returns distance in kilometers
    """
    # Convert to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    km = 6371 * c  # Radius of earth in kilometers
    return round(km, 2)


class FoodDonationListCreateView(generics.ListCreateAPIView):
    """
    List all donations or create a new donation
    """
    serializer_class = FoodDonationSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]
    
    def get_queryset(self):
        queryset = FoodDonation.objects.select_related('donor', 'volunteer', 'receiver')
        
        # Filter by status
        status_filter = self.request.query_params.get('status', None)
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        # Filter by role
        user = self.request.user
        if user.is_authenticated:
            role = self.request.query_params.get('role', user.role)
            
            if role == 'donor':
                queryset = queryset.filter(donor=user)
            elif role == 'volunteer':
                # Show available donations + assigned to this volunteer
                queryset = queryset.filter(
                    models.Q(status='available') | 
                    models.Q(volunteer=user)
                )
            elif role == 'receiver':
                queryset = queryset.filter(receiver=user)
        
        return queryset
    
    def list(self, request, *args, **kwargs):
        """Override to add distance calculation"""
        queryset = self.get_queryset()
        
        # Get user location if provided
        user_lat = request.query_params.get('lat')
        user_lng = request.query_params.get('lng')
        
        donations = []
        for donation in queryset:
            serializer = self.get_serializer(donation)
            data = serializer.data
            
            # Calculate distance if user location provided
            if user_lat and user_lng:
                try:
                    distance = calculate_distance(
                        float(user_lat),
                        float(user_lng),
                        float(donation.latitude),
                        float(donation.longitude)
                    )
                    data['distance'] = distance
                except (ValueError, TypeError):
                    pass
            
            donations.append(data)
        
        # Sort by distance if calculated
        if user_lat and user_lng:
            donations.sort(key=lambda x: x.get('distance', float('inf')))
        
        return Response(donations)
    
    def perform_create(self, serializer):
        """Save donation with current user as donor"""
        serializer.save(donor=self.request.user)


class FoodDonationDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a donation
    """
    serializer_class = FoodDonationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return FoodDonation.objects.select_related('donor', 'volunteer', 'receiver')


class FoodDonationStatusUpdateView(APIView):
    """
    Update donation status (pickup/deliver)
    """
    permission_classes = [IsAuthenticated]
    
    def post(self, request, pk):
        donation = get_object_or_404(FoodDonation, pk=pk)
        action = request.data.get('action')
        
        if action == 'pickup':
            # Volunteer picking up donation
            if request.user.role != 'volunteer':
                return Response(
                    {'detail': 'Only volunteers can pickup donations'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            if donation.status != 'available':
                return Response(
                    {'detail': 'Donation is not available for pickup'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            donation.status = 'picked_up'
            donation.volunteer = request.user
            
        elif action == 'deliver':
            # Volunteer delivering to receiver
            if request.user.role != 'volunteer':
                return Response(
                    {'detail': 'Only volunteers can mark as delivered'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            if donation.status != 'picked_up':
                return Response(
                    {'detail': 'Donation must be picked up first'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            if donation.volunteer != request.user:
                return Response(
                    {'detail': 'You are not assigned to this donation'},
                    status=status.HTTP_403_FORBIDDEN
                )
            
            donation.status = 'delivered'
            
        else:
            return Response(
                {'detail': 'Invalid action. Use "pickup" or "deliver"'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        donation.save()
        serializer = FoodDonationSerializer(donation)
        return Response(serializer.data)
