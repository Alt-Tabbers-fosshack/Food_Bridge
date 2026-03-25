import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'foodbridge_backend.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()
user = User.objects.get(username='admin')
user.set_password('admin123')
user.save()

print("✓ Admin password set to: admin123")
print("✓ Username: admin")
print("✓ Email: admin@test.com")