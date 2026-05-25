from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_task_notification(title,email):

    send_mail(
        subject="New Task Assigned",
        message=f"You have been assigned a new task: {title}",
        from_email="admin@example.com",
        recipient_list=[email],
        fail_silently=False,
    )
    return "Done"