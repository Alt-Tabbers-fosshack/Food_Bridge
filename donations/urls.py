from django.urls import path
from .views import FoodDonationListCreateView, FoodDonationStatusUpdateView

# Django specifically looks for this variable name:
urlpatterns = [
    path('', FoodDonationListCreateView.as_view(), name='donation-list-create'),
    path('<int:pk>/<str:action>/', FoodDonationStatusUpdateView.as_view(), name='donation-status-update'),
]