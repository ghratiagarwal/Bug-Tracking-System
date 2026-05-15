from rest_framework.routers import DefaultRouter
from workflow.views import TaskViewSet,CommentViewSet

router=DefaultRouter()
router.register('tasks',TaskViewSet,basename='tasks')
router.register('comments',CommentViewSet,basename='comments')

urlpatterns = router.urls
