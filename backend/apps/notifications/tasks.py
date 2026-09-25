from celery import shared_task
from django.contrib.auth import get_user_model
from .services import create_notification

@shared_task
def async_send_notification(user_id, notification_type, title, body, data=None, channels=("IN_APP",)):
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
        create_notification(user, notification_type, title, body, data, channels)
    except User.DoesNotExist:
        pass
