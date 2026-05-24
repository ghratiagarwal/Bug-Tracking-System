from celery import shared_task

@shared_task
def send_task_notification(task_title):

    print(f"Notification sent for {task_title}")

    return "Done"