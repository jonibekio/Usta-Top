from rest_framework import permissions, status
from rest_framework.views import APIView
from common.utils import standard_response
from .models import Conversation
from .serializers import ConversationSerializer, ChatMessageSerializer
from .services import send_message_service

class ConversationListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        convs = Conversation.objects.filter(participants__user=request.user).prefetch_related("participants__user", "messages")
        serializer = ConversationSerializer(convs, many=True, context={"request": request})
        return standard_response(data=serializer.data)

class ConversationMessagesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, pk):
        try:
            conv = Conversation.objects.get(id=pk, participants__user=request.user)
        except Conversation.DoesNotExist:
            conv = Conversation.objects.filter(participants__user=request.user).first()

        if not conv:
            return standard_response(data=[])

        msgs = conv.messages.all()
        serializer = ChatMessageSerializer(msgs, many=True, context={"request": request})
        return standard_response(data=serializer.data)

    def post(self, request, pk):
        text = request.data.get("text", "").strip()
        if not text:
            return standard_response(message="Xabar matni bo‘sh bo‘lishi mumkin emas", success=False, status_code=status.HTTP_400_BAD_REQUEST)

        msg = send_message_service(conversation_id=pk, sender=request.user, text=text)
        serializer = ChatMessageSerializer(msg, context={"request": request})
        return standard_response(
            data=serializer.data,
            message="Xabar yuborildi.",
            status_code=status.HTTP_201_CREATED,
        )
