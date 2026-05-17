from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Task,Comment,User,Activity
from .serializer import TaskSerializer,CommentSerializer,ActivitySerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(["GET"])
def current_user(request):
    user = User.objects.get(auth_user=request.user)
    return Response({
        "id": user.id,
        "name": user.name,
        "email": user.email
        })

class TaskViewSet(ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_current_user(self):
        user, created = User.objects.get_or_create(
            auth_user=self.request.user,
            defaults={
                "name": self.request.user.username,
                "email": self.request.user.email,
                "role": "Tester",
                "skills": "None"
                }
                )
        return user


    def get_queryset(self):
        user = self.get_current_user()
        queryset=Task.objects.all()
        view_type=self.request.query_params.get("type")
        if view_type=="assigned_to_me":
            queryset=queryset.filter(assigned_to=user)
        elif view_type=="created_by_me":
            queryset=queryset.filter(created_by=user)
        else:
            queryset=queryset.filter(assigned_to=user)

        status = self.request.query_params.get("status")
        if status:
            queryset = queryset.filter(status__iexact=status)
        return queryset
    
    def perform_create(self, serializer):
        user = self.get_current_user()
        serializer.save(created_by=user)

    def update(self,request,*args,**kwargs):
        task = self.get_object()
        user = self.get_current_user()

        task_status=request.data.get("status")
        assigned_to_id = request.data.get("assigned_to")

        if task_status:
            task.status = task_status

        if assigned_to_id:
            assigned_user=User.objects.get(id=assigned_to_id)
            task.assigned_to = assigned_user

        task.save()

        return Response({"message":"Task updated Successfully"})
    
    def destroy(self,request,*args,**kwargs):
        task=self.get_object()
        task.delete()
        return Response({"message":"Task deleted successfully"})
    
    
    
class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class=CommentSerializer
    permission_classes=[IsAuthenticated]

    def get_current_user(self):
        user, created = User.objects.get_or_create(
            auth_user=self.request.user,
            defaults={"name": self.request.user.username,
                      "email": self.request.user.email,
                      "role":"Tester","skills":"none"})
        return user
    
    def get_queryset(self):
        
        queryset=Comment.objects.all()
        task_id=self.request.query_params.get("task")
        if task_id:
            queryset=queryset.filter(task_id=task_id)
        return queryset
    
    def perform_create(self,serializer):
        comment = serializer.save()
        Activity.objects.create(
            task=comment.task,
            user=comment.user,
            action="Added a comment"

    )

class ActivityViewSet(ModelViewSet):
    queryset = Activity.objects.all()
    serializer_class = ActivitySerializer
    permission_classes = [IsAuthenticated]