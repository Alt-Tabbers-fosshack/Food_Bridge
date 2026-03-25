from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from users.models import User
from donations.models import FoodDonation

class FoodDonationPermissionsTests(APITestCase):
    def setUp(self):
        self.donor = User.objects.create_user(username='donor1', password='pass', role='donor')
        self.volunteer = User.objects.create_user(username='vol1', password='pass', role='volunteer')
        self.receiver = User.objects.create_user(username='rcv1', password='pass', role='receiver')

    def test_only_donor_can_create_donation(self):
        self.client.login(username='vol1', password='pass')
        url = reverse('donation-list-create')
        data = {'food_type': 'Sandwich', 'quantity': 5, 'hours_until_expiry': 4}
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

        self.client.logout()
        self.client.login(username='donor1', password='pass')
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(FoodDonation.objects.count(), 1)
        self.assertEqual(FoodDonation.objects.first().donor, self.donor)

    def test_volunteer_can_pickup_and_receiver_complete(self):
        self.client.login(username='donor1', password='pass')
        url = reverse('donation-list-create')
        donation_data = {'food_type': 'Rice', 'quantity': 2, 'hours_until_expiry': 6}
        create_response = self.client.post(url, donation_data)
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        donation_id = create_response.data['id']

        self.client.logout()
        self.client.login(username='vol1', password='pass')
        pickup_url = reverse('donation-status-update', args=[donation_id, 'pickup'])
        pickup_response = self.client.post(pickup_url)
        self.assertEqual(pickup_response.status_code, status.HTTP_200_OK)
        self.assertEqual(pickup_response.data['status'], 'picked_up')

        self.client.logout()
        self.client.login(username='rcv1', password='pass')
        complete_url = reverse('donation-status-update', args=[donation_id, 'complete'])
        complete_response = self.client.post(complete_url)
        self.assertEqual(complete_response.status_code, status.HTTP_200_OK)
        self.assertEqual(complete_response.data['status'], 'completed')

