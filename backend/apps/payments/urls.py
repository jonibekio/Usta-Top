from django.urls import path
from .views import CreatePaymentIntentView, PaymeWebhookView, ClickWebhookView

urlpatterns = [
    path("payments/create-intent/", CreatePaymentIntentView.as_view(), name="payment-create-intent"),
    path("payments/webhooks/payme/", PaymeWebhookView.as_view(), name="payment-webhook-payme"),
    path("payments/webhooks/click/", ClickWebhookView.as_view(), name="payment-webhook-click"),
]
