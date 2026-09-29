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

    def post(self, request):
        provider_id = request.data.get("providerId") or request.data.get("provider_id")
        booking_id = request.data.get("bookingId") or request.data.get("booking_id")
        request_id = request.data.get("requestId") or request.data.get("request_id")
        text = request.data.get("initialMessage", "").strip()

        from apps.providers.models import ProviderProfile
        from apps.bookings.models import Booking
        from apps.service_requests.models import ServiceRequest
        from .services import get_or_create_conversation

        provider_user = None
        if provider_id:
            try:
                p = ProviderProfile.objects.get(id=provider_id)
                provider_user = p.user
            except Exception:
                try:
                    p = ProviderProfile.objects.get(slug=provider_id)
                    provider_user = p.user
                except Exception:
                    pass

        booking_obj = None
        if booking_id:
            booking_obj = Booking.objects.filter(id=booking_id).first()
            if booking_obj and not provider_user:
                provider_user = booking_obj.provider.user

        req_obj = None
        if request_id:
            req_obj = ServiceRequest.objects.filter(id=request_id).first()

        if not provider_user:
            return standard_response(
                message="Muloqot boshlash uchun usta ko‘rsatilmadi",
                success=False,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        conv = get_or_create_conversation(
            request_obj=req_obj,
            customer=request.user,
            provider_user=provider_user,
            booking=booking_obj,
        )

        if text:
            from .models import Message
            Message.objects.create(
                conversation=conv,
                sender=request.user,
                text=text,
                message_type=Message.MessageType.TEXT,
            )

        serializer = ConversationSerializer(conv, context={"request": request})
        return standard_response(data=serializer.data, status_code=status.HTTP_201_CREATED)

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
