from rest_framework import serializers
from .models import Conversation, Message

class ChatMessageSerializer(serializers.ModelSerializer):
    senderId = serializers.CharField(source="sender.id", read_only=True)
    senderName = serializers.CharField(source="sender.full_name", read_only=True)
    senderRole = serializers.CharField(source="sender.role", read_only=True)
    timestamp = serializers.SerializerMethodField()
    isMe = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ["id", "senderId", "senderName", "senderRole", "text", "timestamp", "isMe"]

    def get_timestamp(self, obj):
        return obj.created_at.strftime("%H:%M")

    def get_isMe(self, obj):
        req = self.context.get("request")
        if req and req.user.is_authenticated:
            return obj.sender == req.user
        return False

class ConversationSerializer(serializers.ModelSerializer):
    peerId = serializers.SerializerMethodField()
    peerName = serializers.SerializerMethodField()
    peerAvatar = serializers.SerializerMethodField()
    peerRole = serializers.SerializerMethodField()
    lastMessage = serializers.SerializerMethodField()
    lastMessageTime = serializers.SerializerMethodField()
    unreadCount = serializers.SerializerMethodField()
    messages = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            "id",
            "peerId",
            "peerName",
            "peerAvatar",
            "peerRole",
            "lastMessage",
            "lastMessageTime",
            "unreadCount",
            "messages",
        ]

    def _get_peer(self, obj):
        req = self.context.get("request")
        current_user = req.user if req else None
        for p in obj.participants.all():
            if p.user != current_user:
                return p.user
        return None

    def get_peerId(self, obj):
        peer = self._get_peer(obj)
        return str(peer.id) if peer else ""

    def get_peerName(self, obj):
        peer = self._get_peer(obj)
        return peer.full_name if peer else "Usta"

    def get_peerAvatar(self, obj):
        peer = self._get_peer(obj)
        return peer.avatar if peer else ""

    def get_peerRole(self, obj):
        peer = self._get_peer(obj)
        if peer and hasattr(peer, "provider_profile"):
            return peer.provider_profile.title
        return "Mijoz"

    def get_lastMessage(self, obj):
        last = obj.messages.last()
        return last.text if last else ""

    def get_lastMessageTime(self, obj):
        last = obj.messages.last()
        return last.created_at.strftime("%H:%M") if last else ""

    def get_unreadCount(self, obj):
        return 0

    def get_messages(self, obj):
        msgs = obj.messages.all()[:50]
        return ChatMessageSerializer(msgs, many=True, context=self.context).data
