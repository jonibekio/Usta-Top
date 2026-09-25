from django.db import transaction
from .models import Conversation, ConversationParticipant, Message

@transaction.atomic
def get_or_create_conversation(request_obj, customer, provider_user, booking=None):
    # Find conversation with both participants
    conv = Conversation.objects.filter(
        participants__user=customer
    ).filter(
        participants__user=provider_user
    ).first()

    if not conv:
        conv = Conversation.objects.create(request=request_obj, booking=booking)
        ConversationParticipant.objects.create(conversation=conv, user=customer)
        ConversationParticipant.objects.create(conversation=conv, user=provider_user)

        # Welcome message
        Message.objects.create(
            conversation=conv,
            sender=provider_user,
            text="Assalomu alaykum! Buyurtmangiz qabul qilindi. Tez orada yetib boraman.",
            message_type=Message.MessageType.TEXT,
        )

    return conv

@transaction.atomic
def send_message_service(conversation_id, sender, text):
    conv = Conversation.objects.get(id=conversation_id)
    msg = Message.objects.create(
        conversation=conv,
        sender=sender,
        text=text,
        message_type=Message.MessageType.TEXT,
    )
    return msg
