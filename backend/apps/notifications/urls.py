from django.urls import path
from .views import (
    NotificationListView,
    NotificationUnreadCountView,
    MarkNotificationReadView,
    MarkAllNotificationsReadView,
)

urlpatterns = [
    path("notifications/", NotificationListView.as_view(), name="notifications-list"),
    path("notifications/unread-count/", NotificationUnreadCountView.as_view(), name="notifications-unread-count"),
    path("notifications/<str:pk>/read/", MarkNotificationReadView.as_view(), name="notification-mark-read"),
    path("notifications/read-all/", MarkAllNotificationsReadView.as_view(), name="notifications-mark-all-read"),
]
