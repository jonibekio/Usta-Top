from django.urls import path
from .views import ConversationListView, ConversationMessagesView

urlpatterns = [
    path("conversations/", ConversationListView.as_view(), name="conversations-list"),
    path("conversations/<str:pk>/messages/", ConversationMessagesView.as_view(), name="conversation-messages"),
]
