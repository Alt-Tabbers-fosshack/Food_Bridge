import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'foodbridge_backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from donations.models import FoodDonation

User = get_user_model()
client = APIClient()

print("=" * 60)
print("TESTING FOODBRIDGE API")
print("=" * 60)

# Check if users exist, create them if needed
donor_user = User.objects.filter(username='donor_test').first()
if not donor_user:
    donor_user = User.objects.create_user(
        username='donor_test',
        email='donor@test.com',
        password='testpass123',
        role='donor'
    )
    print(f"✓ Created donor user: {donor_user.username}")
else:
    print(f"✓ Donor user exists: {donor_user.username}")

volunteer_user = User.objects.filter(username='volunteer_test').first()
if not volunteer_user:
    volunteer_user = User.objects.create_user(
        username='volunteer_test',
        email='volunteer@test.com',
        password='testpass123',
        role='volunteer'
    )
    print(f"✓ Created volunteer user: {volunteer_user.username}")
else:
    print(f"✓ Volunteer user exists: {volunteer_user.username}")

# Create test donation
donation = FoodDonation.objects.create(
    donor=donor_user,
    food_type='Rice',
    quantity=10,
    hours_until_expiry=24,
    status='available'
)
print(f"\n✓ Created test donation ID: {donation.id} with status: {donation.status}")

# Test 1: GET donations list
print("\n" + "-" * 60)
print("TEST 1: GET /api/donations/")
print("-" * 60)
client.force_authenticate(user=donor_user)
response = client.get('/api/donations/')
print(f"Status Code: {response.status_code}")
if response.status_code == 200:
    data = response.json()
    print(f"✓ Successfully fetched {len(data)} donations")
    if data:
        print(f"  First donation: {data[0]}")
else:
    print(f"✗ Error: {response.content}")

# Test 2: UPDATE status - Volunteer picks up
print("\n" + "-" * 60)
print(f"TEST 2: POST /api/donations/{donation.id}/pickup/")
print("-" * 60)
client.force_authenticate(user=volunteer_user)
response = client.post(f'/api/donations/{donation.id}/pickup/')
print(f"Status Code: {response.status_code}")
if response.status_code == 200:
    print(f"✓ Status update successful!")
    data = response.json()
    print(f"  New status: {data.get('status')}")
    print(f"  Full response: {json.dumps(data, indent=2)}")
else:
    print(f"✗ Error: {response.content}")

# Test 3: Check database
print("\n" + "-" * 60)
print("TEST 3: Check database state")
print("-" * 60)
donation.refresh_from_db()
print(f"✓ Donation status in DB: {donation.status}")
print(f"  Expected: picked_up")
print(f"  Match: {'✓ YES' if donation.status == 'picked_up' else '✗ NO'}")

print("\n" + "=" * 60)
print("TESTS COMPLETE")
print("=" * 60)
