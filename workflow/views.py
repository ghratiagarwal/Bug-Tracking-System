from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from .models import Task,Comment,User
from .serializer import TaskSerializer,CommentSerializer

class TaskViewSet(ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]
    def get_current_user(self):
        return User.objects.get(auth_user=self.request.user)

    def get_queryset(self):
        user = self.get_current_user()
        queryset=Task.objects.all()
        view_type=self.request.query_params.get("type")
        if view_type=="assigned_to_me":
            queryset==queryset.filter(assigned_to=user)
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

        status=request.data.get("status")
        assigned_to_id = request.data.get("assigned_to")

        if status:
            task.status = status

        if assigned_to_id:
            user=User.object.get(id=assigned_to_id)
            task.assigned_to = assigned_user

        task.save()

        return Response({"message":"Task updated Successfully"})
    
    def destroy(self,request,*args,**kwargs):
        task=self.get_object()
        task.delete()
        return Response({"message":"Task deleetd successfully"})
    
class CommentViewSet(ModelViewSet):
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
    
    def perform_created(self,serializer):
        user = self.get_current_user()
        serializer.save(sender=user)