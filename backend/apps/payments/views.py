from django.db import transaction
from rest_framework import permissions, status
from rest_framework.views import APIView
from common.utils import standard_response
from apps.bookings.models import Booking
from .models import Payment
from .serializers import PaymentSerializer
from .gateways import get_payment_gateway

class CreatePaymentIntentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        booking_id = request.data.get("bookingId")
        amount = request.data.get("amount")
        provider_name = request.data.get("provider", Payment.Provider.ESCROW)
        idempotency_key = request.data.get("idempotencyKey")

        booking = None
        if booking_id:
            try:
                booking = Booking.objects.get(id=booking_id)
                if not amount:
                    amount = booking.total_price
            except Booking.DoesNotExist:
                pass

        if not amount:
            return standard_response(message="To‘lov miqdori ko‘rsatilmadi", success=False, status_code=status.HTTP_400_BAD_REQUEST)

        # Idempotency check
        if idempotency_key:
            existing = Payment.objects.filter(idempotency_key=idempotency_key).first()
            if existing:
                return standard_response(data=PaymentSerializer(existing).data)

        payment = Payment.objects.create(
            user=request.user,
            booking=booking,
            amount=amount,
            provider=provider_name,
            idempotency_key=idempotency_key,
            status=Payment.Status.PENDING,
        )

        gateway = get_payment_gateway(provider_name)
        result = gateway.create_transaction(payment)

        if booking and payment.status == Payment.Status.SUCCEEDED:
            booking.is_paid = True
            booking.save(update_fields=["is_paid", "updated_at"])

        return standard_response(
            data={
                "payment": PaymentSerializer(payment).data,
                "gatewayResult": result,
            },
            message="To‘lov jarayoni boshlandi.",
            status_code=status.HTTP_201_CREATED,
        )

class PaymeWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        gateway = get_payment_gateway(Payment.Provider.PAYME)
        if not gateway.verify_webhook(request.data, request.headers):
            return standard_response(message="Invalid signature", success=False, status_code=status.HTTP_400_BAD_REQUEST)

        return standard_response(data={"result": {"state": 2}})

class ClickWebhookView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        gateway = get_payment_gateway(Payment.Provider.CLICK)
        if not gateway.verify_webhook(request.data, request.headers):
            return standard_response(message="Invalid signature", success=False, status_code=status.HTTP_400_BAD_REQUEST)

        return standard_response(data={"error": 0, "error_note": "Success"})
