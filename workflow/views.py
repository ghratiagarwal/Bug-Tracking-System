from django.contrib.auth import authenticate
from django.contrib.auth.models import User as AuthUser
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes

from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .models import Task, Comment, UserProfile, Activity
from .serializer import (RegisterSerializer, TaskSerializer, CommentSerializer, ActivitySerializer,UserProfileSerializer)
from .tasks import send_task_notification, send_password_reset_email

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        profile = serializer.save()
        token, _ = Token.objects.get_or_create(user=profile.auth_user)
        
        return Response(
            {
                "message": "User created successfully",
                "token": token.key,
                "user": UserProfileSerializer(profile).data
            }, 
            status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")
    
    if not username or not password:
        return Response({"error": "Please provide both username and password"}, status=status.HTTP_400_BAD_REQUEST)
        
    user = authenticate(username=username, password=password)
    if user is not None:
        token, _ = Token.objects.get_or_create(user=user)
        profile = UserProfile.objects.get(auth_user=user)
        return Response({
            "token": token.key,
            "user": UserProfileSerializer(profile).data
        }, status=status.HTTP_200_OK)
        
    return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(["POST"])
@permission_classes([AllowAny])
def forgot_password(request):
    username = request.data.get("username")
    if not username:
        return Response({"username": "This field is required."}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = AuthUser.objects.get(username=username)
    except AuthUser.DoesNotExist:
        return Response({"message": "If the account exists, a password reset link has been sent."}, status=status.HTTP_200_OK)
    
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    send_password_reset_email.delay(user.email, uid, token)
    
    return Response({"message": "If the account exists, a password reset link has been sent."}, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password_confirm(request):
    uidb64 = request.data.get('uid')
    token = request.data.get('token')
    new_password = request.data.get('new_password') # Matches React payload key exactly

    if not all([uidb64, token, new_password]):
        return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Decode the user ID from the base64 string sent via the URL link
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({"error": "Invalid user link reference."}, status=status.HTTP_400_BAD_REQUEST)

    # Validate that the unique token matching this user hasn't expired or been altered
    if default_token_generator.check_token(user, token):
        user.set_password(new_password)
        user.save()
        return Response({"message": "Password updated successfully!"}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Reset link is invalid or expired."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):

    try:
        profile = UserProfile.objects.get(auth_user=request.user)
        serializer = UserProfileSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except UserProfile.DoesNotExist:
        return Response({"error": "Profile details not configured."}, status=status.HTTP_404_NOT_FOUND)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def users_list(request):
    users = UserProfile.objects.all().select_related('auth_user')
    serializer = UserProfileSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_current_profile(self):
        profile, _ = UserProfile.objects.get_or_create(
            auth_user=self.request.user,
            defaults={"role": "Developer", "skills": ""}
        )
        return profile

    def get_queryset(self):
        profile = self.get_current_profile()
        queryset = Task.objects.all().select_related('created_by__auth_user', 'assigned_to__auth_user')
        
        if self.action == "retrieve":
            return queryset
            
        view_type = self.request.query_params.get("type")
        if view_type == "assigned_to_me":
            queryset = queryset.filter(assigned_to=profile)
        elif view_type == "created_by_me":
            queryset = queryset.filter(created_by=profile)
        else:
            queryset = queryset.filter(assigned_to=profile)

        status_param = self.request.query_params.get("status")
        if status_param:
            queryset = queryset.filter(status__iexact=status_param)
            
        return queryset

    def perform_create(self, serializer):
        core_user = self.request.user
        user_profile = core_user.profile
        serializer.save(created_by=user_profile)
        profile = self.get_current_profile()
        task = serializer.save(created_by=profile)
        if task.assigned_to and task.assigned_to.auth_user.email:
            send_task_notification.delay(task.title, task.assigned_to.auth_user.email)

    def perform_update(self, serializer):
        task = serializer.save()
        Activity.objects.create(
            task=task,
            user=self.get_current_profile(),
            action=f"Updated Task parameters or changed status to: {task.status}"
        )


class CommentViewSet(viewsets.ModelViewSet):

    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Comment.objects.all().select_related('user__auth_user')
        task_id = self.request.query_params.get("task")
        if task_id:
            queryset = queryset.filter(task_id=task_id)
        return queryset

    def perform_create(self, serializer):
        profile = UserProfile.objects.get(auth_user=self.request.user)
        comment = serializer.save(user=profile)
        
        Activity.objects.create(
            task=comment.task,
            user=profile,
            action="Added a comment to the system tracking thread"
        )


class ActivityViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Activity.objects.all().select_related('task', 'user__auth_user')
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]