from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User=get_user_model()


class Task(models.Model):
    class Status(models.TextChoices):
        TODO='TODO','To Do'
        IN_PROGRESS = 'IN_PROGRESS','In Progress'
        DONE='Done','DONE'

    class Priority(models.TextChoices):
        LOW='LOW','Low'
        MEDIUM='MEDIUM','Medium'
        HIGH='HIGH','High'
    title =models.CharField(max_length=200)
    description =models.TextField()
    task_type =models.CharField(max_length=10)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.TODO)
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.MEDIUM)

    created_by =models.ForeignKey(User,on_delete=models.CASCADE,related_name='task_created')
    assigned_to =models.ForeignKey(User,on_delete=models.CASCADE,related_name='task_assigned')
    created_at =models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

   

class Comment(models.Model):
    task =models.ForeignKey(Task,on_delete=models.CASCADE)
    user =models.ForeignKey(User,on_delete=models.CASCADE)
    comment =models.TextField()




    
# Create your models here
