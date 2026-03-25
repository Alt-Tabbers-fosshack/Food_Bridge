from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate, login as auth_login

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login endpoint - creates session and returns user info
    POST /api/auth/login/
    Body: {
        "username": "your_username",
        "password": "your_password"
    }
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'detail': 'Username and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response(
            {'detail': 'Invalid username or password.'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Create session
    auth_login(request, user)
    
    return Response({
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'role': user.role if hasattr(user, 'role') else None,
        'message': 'Login successful. Use the session cookie for subsequent requests.'
    }, status=status.HTTP_200_OK)


