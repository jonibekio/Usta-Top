from rest_framework import permissions
from rest_framework.views import APIView
from common.utils import standard_response
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        notifs = Notification.objects.filter(user=request.user)[:50]
        serializer = NotificationSerializer(notifs, many=True)
        return standard_response(data=serializer.data)

class MarkNotificationReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        Notification.objects.filter(id=pk, user=request.user).update(is_read=True)
        return standard_response(message="Xabarnoma o‘qildi deb belgilandi.")

class MarkAllNotificationsReadView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        Notification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        return standard_response(message="Barcha xabarnomalar o‘qildi deb belgilandi.")
