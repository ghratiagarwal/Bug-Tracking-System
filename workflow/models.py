from django.db import models
from django.contrib.auth.models import User as AuthUser

class UserProfile(models.Model):
    auth_user=models.OneToOneField(AuthUser,on_delete=models.CASCADE,related_name='profile')
    role=models.CharField(max_length=100)
    skills=models.TextField(blank=True)

    def __str__(self):
        return self.auth_user.get_full_name() or self.auth_user.username
    
class Task(models.Model):
    class Status(models.TextChoices):
        TODO = 'TODO', 'To Do'
        IN_PROGRESS = 'IN_PROGRESS', 'In Progress'
        DONE = 'DONE', 'Done'  # Fixed consistent string casing here

    class Priority(models.TextChoices):
        LOW = 'LOW', 'Low'
        MEDIUM = 'MEDIUM', 'Medium'
        HIGH = 'HIGH', 'High'

    title = models.CharField(max_length=200)
    description = models.TextField()
    screenshot = models.ImageField(upload_to="screenshots/", null=True, blank=True)
    task_type = models.CharField(max_length=10) # Bug or Feature
    
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.TODO, db_index=True)
    priority = models.CharField(max_length=20, choices=Priority.choices, default=Priority.MEDIUM, db_index=True)
    
    created_by = models.ForeignKey(UserProfile, on_delete=models.PROTECT, related_name='task_created')
    assigned_to = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True, blank=True, related_name='task_assigned')
    collaborators = models.ManyToManyField(UserProfile, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True, db_index=True) # Indexed for sorting by newest
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['assigned_to', 'status']),
        ]

    def __str__(self):
        return self.title


class Comment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    comment = models.TextField()
    screenshot = models.ImageField(upload_to="comments/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class Activity(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='activities')
    user = models.ForeignKey(UserProfile, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user} performed {self.action} on {self.task}"