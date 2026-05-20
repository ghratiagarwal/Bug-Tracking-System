from rest_framework.routers import DefaultRouter
from workflow.views import (TaskViewSet,CommentViewSet,ActivityViewSet,register,forgot_password,current_user,users_list)
from django.urls import path


router=DefaultRouter()
router.register('tasks',TaskViewSet,basename='tasks')
router.register('comments',CommentViewSet,basename='comments')
router.register('activities',ActivityViewSet )

urlpatterns = router.urls + [
    path("register/", register),
    path("forgot-password/", forgot_password),
    path("me/", current_user),
    path("users/", users_list)
]
