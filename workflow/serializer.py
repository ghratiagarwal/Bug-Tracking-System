from rest_framework import serializers
from django.contrib.auth.models import User as AuthUser
from .models import *


       

class CommentSerializer(serializers.ModelSerializer):
    sender=serializers.ReadOnlyField(source='sender.name')
    class Meta:
        model=Comment
        fields = "__all__"

class TaskSerializer(serializers.ModelSerializer):
    created_by=serializers.ReadOnlyField(source='sender.name')
    created_by = serializers.StringRelatedField()
    comments = CommentSerializer(many=True, read_only=True)
    class Meta:
        model = Task
        fields = "__all__"


class ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = "__all__"

class RegisterSerializer(serializers.Serializer):
    username=serializers.CharField()
    password=serializers.CharField(write_only=True)
    email=serializers.EmailField()
    name=serializers.CharField()
    role=serializers.CharField()
    skills = serializers.CharField()

    def validate_username(self, value):

        if AuthUser.objects.filter(username=value).exists():
            raise serializers.ValidationError(
                "User already exists"
            )
        return value

    def create(self,validated_data):
        auth_user = AuthUser.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"])
        workflow_user = User.objects.create(
            auth_user = auth_user,
            name=validated_data["name"],
            email=validated_data["email"],
            role=validated_data["role"],
            skills=validated_data["skills"]
        )

        return workflow_user
    
class ForgotPasswordSerializer(serializers.Serializer):

    username = serializers.CharField()
    new_password = serializers.CharField(write_only=True)
    
    def save(self):
        username = self.validated_data["username"]
        new_password = self.validated_data["new_password"]
        user = AuthUser.objects.get(username=username)
        user.set_password(new_password)
        user.save()
        return user