from django.urls import path
from .views import (
    FoodDonationListCreateView,
    FoodDonationDetailView,
    FoodDonationStatusUpdateView
)

# Django specifically looks for this variable name:
urlpatterns = [
    path('', FoodDonationListCreateView.as_view(), name='donation-list-create'),
    path('<int:pk>/', FoodDonationDetailView.as_view(), name='donation-detail'),
    path('<int:pk>/status/', FoodDonationStatusUpdateView.as_view(), name='donation-status'),
]