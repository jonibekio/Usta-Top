from rest_framework import permissions, status
from rest_framework.views import APIView
from common.utils import standard_response
from apps.service_requests.models import ServiceRequest
from .models import Quote
from .serializers import QuoteSerializer, CreateQuoteSerializer
from .services import create_quote_service, accept_quote_service, reject_quote_service

class RequestQuotesView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, request_id):
        try:
            req_obj = ServiceRequest.objects.get(id=request_id)
        except Exception:
            try:
                req_obj = ServiceRequest.objects.get(code=request_id)
            except ServiceRequest.DoesNotExist:
                req_obj = ServiceRequest.objects.first()

        if not req_obj:
            return standard_response(data=[])

        quotes = Quote.objects.filter(request=req_obj).select_related("provider", "provider__user", "request")
        serializer = QuoteSerializer(quotes, many=True)
        return standard_response(data=serializer.data)

    def post(self, request, request_id):
        serializer = CreateQuoteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        quote = create_quote_service(request.user, request_id, serializer.validated_data)
        output = QuoteSerializer(quote)
        return standard_response(
            data=output.data,
            message="Narx taklifi muvaffaqiyatli yuborildi.",
            status_code=status.HTTP_201_CREATED,
        )

class AcceptQuoteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        quote, booking = accept_quote_service(pk, request.user)
        return standard_response(
            data={
                "quote": QuoteSerializer(quote).data,
                "bookingId": str(booking.id),
                "orderNumber": booking.order_number,
            },
            message="Taklif qabul qilindi va buyurtma tasdiqlandi.",
        )

class RejectQuoteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        quote = reject_quote_service(pk, request.user)
        return standard_response(
            data=QuoteSerializer(quote).data,
            message="Taklif rad etildi.",
        )
