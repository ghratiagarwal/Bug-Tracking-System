from rest_framework import serializers
from django.contrib.auth.models import User as AuthUser
from .models import UserProfile, Task, Comment, Activity

class UserProfileSerializer(serializers.ModelSerializer):
    # Fetching values directly from the linked AuthUser model safely
    username = serializers.ReadOnlyField(source='auth_user.username')
    email = serializers.ReadOnlyField(source='auth_user.email')
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ["id", "username", "email", "full_name", "role", "skills"]

    def get_full_name(self, obj):
        return obj.auth_user.get_full_name() or obj.auth_user.username


class CommentSerializer(serializers.ModelSerializer):
    # Fixed the broken source pointer to point to the user profile's string representation
    commented_by = serializers.ReadOnlyField(source='user.__str__')

    class Meta:
        model = Comment
        fields = ["id", "task", "commented_by", "comment", "screenshot", "created_at"]
        read_only_fields = ["user"]


class TaskSerializer(serializers.ModelSerializer):
    # Fixed broken source pointer and utilized our new UserProfileSerializer
    created_by_name = serializers.ReadOnlyField(source='created_by.__str__')
    assigned_to = UserProfileSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['created_by']


class ActivitySerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.__str__')

    class Meta:
        model = Activity
        fields = ["id", "task", "user", "user_name", "action", "created_at"]


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    email = serializers.EmailField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    role = serializers.CharField()
    skills = serializers.CharField(required=False, allow_blank=True)

    def validate_username(self, value):
        if AuthUser.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value

    def create(self, validated_data):
        
        auth_user = AuthUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"]
        )
        
        profile = UserProfile.objects.create(
            auth_user=auth_user,
            role=validated_data["role"],
            skills=validated_data.get("skills", "")
        )
        return profile