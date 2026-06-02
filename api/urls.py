from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter
from django.urls import path
from workflow.views import (
    TaskViewSet, CommentViewSet, ActivityViewSet, 
    register, forgot_password, current_user, users_list, forgot_password_confirm
)

router=DefaultRouter()
router.register('tasks',TaskViewSet,basename='tasks')
router.register('comments',CommentViewSet,basename='comments')
router.register('activities',ActivityViewSet )

urlpatterns = router.urls + [
    path("register/", register),
    path("login/", obtain_auth_token),
    path("forgot-password/", forgot_password),
    path('forgot-password-confirm/', forgot_password_confirm, name='forgot_password_confirm'),
    path("me/", current_user),
    path("users/", users_list)
]
