from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

from .models import FoodDonation
from .serializers import FoodDonationSerializer

class FoodDonationListCreateView(generics.ListCreateAPIView):
    permission_classes = [AllowAny]
    queryset = FoodDonation.objects.all()
    serializer_class = FoodDonationSerializer

    def perform_create(self, serializer):
        # Remove authentication requirement - anyone can create donations
        serializer.save()

class FoodDonationStatusUpdateView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, pk, action):
        donation = get_object_or_404(FoodDonation, pk=pk)

        if action == 'pickup':
            # Remove role check - anyone can pickup
            if donation.status != 'available':
                return Response({'detail': 'Donation is not available for pickup.'}, status=status.HTTP_400_BAD_REQUEST)
            donation.status = 'picked_up'

        elif action == 'complete':
            # Remove role check - anyone can complete
            if donation.status != 'picked_up':
                return Response({'detail': 'Donation must be picked up before completion.'}, status=status.HTTP_400_BAD_REQUEST)
            donation.status = 'completed'

        else:
            return Response({'detail': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)

        donation.save()
        serializer = FoodDonationSerializer(donation)
        return Response(serializer.data, status=status.HTTP_200_OK)
