from django.db import models
from django.contrib.auth.models import User as AuthUser
from django.utils import timezone



class User(models.Model):
    auth_user = models.OneToOneField(AuthUser, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    role = models.CharField(max_length=100)
    skills = models.TextField()

    def __str__(self):
        return self.name


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
    screenshot = models.ImageField(upload_to="screenshots/",null=True,blank=True)
    task_type =models.CharField(max_length=10)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.TODO)
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.MEDIUM)
    created_by =models.ForeignKey(User,on_delete=models.CASCADE,related_name='task_created')
    assigned_to =models.ForeignKey(User,on_delete=models.CASCADE,related_name='task_assigned')
    collaborators=models.ManyToManyField(User,blank=True)
    created_at =models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    task =models.ForeignKey(Task,on_delete=models.CASCADE,related_name='comments')
    user =models.ForeignKey(User,on_delete=models.CASCADE)
    comment =models.TextField()
    screenshot = models.ImageField(upload_to="comments/",null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)


class Activity(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.action