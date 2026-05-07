from rest_framework import serializers
from .models import *

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields= ["title" , "description", "task_type",  "status", "priority" , "created_by" , "assigned_to" ]