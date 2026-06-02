from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_task_notification(title, email):
    send_mail(
        subject="New Task Assigned",
        message=f"You have been assigned a new task: {title}",
        from_email="admin@workflowapp.com",
        recipient_list=[email],
        fail_silently=False,
    )
    return f"Notification sent successfully to {email}"


@shared_task
def send_password_reset_email(email, uid, token):
    reset_link = f"http://localhost:3000/reset-password/{uid}/{token}/"
    
    email_body = (
        f"You requested a password reset for your account.\n\n"
        f"Please click the secure link below to reset your password:\n"
        f"{reset_link}\n\n"
        f"If you did not request this change, please ignore this email."
    )
    
    send_mail(
        subject="Password Reset Request",
        message=email_body,
        from_email="security@workflowapp.com",
        recipient_list=[email],
        fail_silently=False,
    )
    return f"Password reset email dispatched to {email}"