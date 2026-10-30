
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from .models import Assignment
from .serializers import AssignmentSerializer
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User

# Student registration
@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')

    if not username or not password:
        return Response(
            {'error': 'Username and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {'error': 'This username is already taken.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    if len(password) < 8:
        return Response(
            {'error': 'Password must contain at least 8 characters.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(
        username=username,
        password=password
    )

    return Response(
        {'message': 'Student registered successfully.'},
        status=status.HTTP_201_CREATED
    )

# Student login
@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    username = request.data.get('username', '').strip()
    password = request.data.get('password', '')

    if not username or not password:
        return Response(
            {'error': 'Username and password are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(
        request,
        username=username,
        password=password
    )

    if user is None:
        return Response(
            {'error': 'Invalid username or password.'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    login(request, user)

    return Response({
        'message': 'Login successful!',
        'username': user.username
    })



# Student logout
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    logout(request)

    return Response({
        'message': 'Logout successful!'
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def csrf_token(request):
    return JsonResponse({
        'csrfToken': get_token(request)
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def api_home(request):
    return Response({
        'message': 'Welcome to the Student Assignment Manager API!',
        'status': 'success',
    })


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def assignment_list_create(request):

    if request.method == 'GET':
        assignments = Assignment.objects.filter(user=request.user)
        serializer = AssignmentSerializer(assignments, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = AssignmentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET', 'PUT', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def assignment_detail(request, pk):

    try:
        assignment = Assignment.objects.get(
            pk=pk,
            user=request.user
        )
    except Assignment.DoesNotExist:
        return Response(
            {'error': 'Assignment not found.'},
            status=status.HTTP_404_NOT_FOUND
        )

    # GET: Retrieve one assignment
    if request.method == 'GET':
        serializer = AssignmentSerializer(assignment)
        return Response(serializer.data)

    # PUT/PATCH: Update an assignment
    elif request.method in ['PUT', 'PATCH']:
        serializer = AssignmentSerializer(
            assignment,
            data=request.data,
            partial=(request.method == 'PATCH')
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    # DELETE: Delete an assignment
    elif request.method == 'DELETE':
        assignment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    return Response({
        'username': request.user.username
    })
