from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.views import APIView
from common.utils import standard_response
from common.permissions import IsAdmin
from apps.bookings.models import Booking
from .models import Dispute
from .serializers import DisputeSerializer, CreateDisputeSerializer

class CreateBookingDisputeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, booking_id):
        serializer = CreateDisputeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = Booking.objects.get(id=booking_id)

        dispute = Dispute.objects.create(
            booking=booking,
            opened_by=request.user,
            reason=serializer.validated_data["reason"],
            description=serializer.validated_data["description"],
            status=Dispute.Status.OPEN,
        )

        # Update booking status to disputed
        booking.status_text = "Nizo ochilgan"
        booking.save(update_fields=["status_text", "updated_at"])

        return standard_response(
            data=DisputeSerializer(dispute).data,
            message="Kafolat da’vosi (nizo) muvaffaqiyatli ro‘yxatga olindi. Moderatorlarimiz 24 soat ichida bog‘lanishadi.",
            status_code=status.HTTP_201_CREATED,
        )

class DisputeListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        if user.role == "ADMIN" or user.is_staff:
            disputes = Dispute.objects.all().select_related("booking", "opened_by").prefetch_related("evidences")
        else:
            disputes = Dispute.objects.filter(opened_by=user).select_related("booking", "opened_by").prefetch_related("evidences")

        serializer = DisputeSerializer(disputes, many=True)
        return standard_response(data=serializer.data)

class ResolveDisputeView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request, pk):
        dispute = Dispute.objects.get(id=pk)
        resolution = request.data.get("resolution", Dispute.Resolution.CUSTOMER_FAVOR)
        resolution_note = request.data.get("note", "Moderator qarori qabul qilindi.")

        dispute.status = Dispute.Status.RESOLVED
        dispute.resolution = resolution
        dispute.resolution_note = resolution_note
        dispute.resolved_by = request.user
        dispute.resolved_at = timezone.now()
        dispute.save()

        return standard_response(
            data=DisputeSerializer(dispute).data,
            message="Nizo muvaffaqiyatli hal qilindi.",
        )
