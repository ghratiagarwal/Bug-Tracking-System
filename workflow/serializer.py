from rest_framework import serializers
from .models import *

class TaskSerializer(serializers.ModelSerializer):
    created_by=serializers.ReadOnlyField(source='sender.name')
    created_by = serializers.StringRelatedField()
    class Meta:
        model = Task
        fields= "__all__"
       

class CommentSerializer(serializers.ModelSerializer):
    sender=serializers.ReadOnlyField(source='sender.name')
    class Meta:
         model=Comment
         fields="__all__"