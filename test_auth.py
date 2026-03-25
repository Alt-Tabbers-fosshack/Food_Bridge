import os
import django
import json
import base64

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'foodbridge_backend.settings')
django.setup()

from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

User = get_user_model()
client = APIClient()

print("=" * 70)
print("FOODBRIDGE API - AUTHENTICATION & TESTING")
print("=" * 70)

# Create test user if needed
user = User.objects.filter(username='testuser').first()
if not user:
    user = User.objects.create_user(
        username='testuser',
        email='test@test.com',
        password='testpass123',
        role='volunteer'
    )
    print(f"✓ Created test user: testuser (role: volunteer)")
else:
    print(f"✓ Using existing user: testuser (role: {user.role})")

print("\n" + "=" * 70)
print("STEP 1: LOGIN - Create Session")
print("=" * 70)

# Login to create session
response = client.post('/api/auth/login/', {
    'username': 'testuser',
    'password': 'testpass123'
})

print(f"POST /api/auth/login/")
print(f"Status Code: {response.status_code}")

if response.status_code == 200:
    data = response.json()
    print(f"✓ Login successful!")
    print(f"\n  User ID: {data['user_id']}")
    print(f"  Username: {data['username']}")
    print(f"  Role: {data['role']}")
    print(f"  Message: {data['message']}")
else:
    print(f"✗ Login failed: {response.json()}")
    exit(1)

print("\n" + "=" * 70)
print("STEP 2: USE SESSION - Access Protected API")
print("=" * 70)

# Cliente now has session cookie from login
response = client.get('/api/donations/')
print(f"\nGET /api/donations/")
print(f"Status Code: {response.status_code}")

if response.status_code == 200:
    data = response.json()
    print(f"✓ Success! Retrieved {len(data)} donations")
    if data:
        print(f"\n  First donation:")
        print(f"    ID: {data[0]['id']}")
        print(f"    Status: {data[0]['status']}")
        print(f"    Food Type: {data[0]['food_type']}")
else:
    print(f"✗ Failed: {response.json()}")

print("\n" + "=" * 70)
print("STEP 3: TEST STATUS UPDATE - Volunteer Pickups Donation")
print("=" * 70)

# Get a donation to test with
donations = response.json() if response.status_code == 200 else []
if donations:
    donation_id = donations[0]['id']
    response = client.post(f'/api/donations/{donation_id}/pickup/')
    print(f"\nPOST /api/donations/{donation_id}/pickup/")
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✓ Status updated successfully!")
        print(f"  New status: {data['status']}")
    else:
        print(f"✗ Update failed: {response.json()}")

print("\n" + "=" * 70)
print("HOW TO USE THE API")
print("=" * 70)
print(f"""
METHOD 1: Session-based (recommended for browsers/postman):
---
1. Login first:
   POST /api/auth/login/
   Body: {{"username": "testuser", "password": "testpass123"}}
   
2. Use the session cookie (automatically included):
   GET /api/donations/
   POST /api/donations/1/pickup/

METHOD 2: HTTP Basic Auth (for API clients):
---
1. No need to login first
2. Include Authorization header:
   Authorization: Basic {base64.b64encode(b'testuser:testpass123').decode()}
   
3. Make requests:
   GET /api/donations/
   POST /api/donations/1/pickup/

TEST CREDENTIALS:
- Username: testuser
- Password: testpass123
- Role: volunteer
""")

