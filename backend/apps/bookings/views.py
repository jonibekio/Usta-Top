from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from common.utils import standard_response
from .models import Booking
from .serializers import BookingSerializer
from .services import advance_booking_status

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return Booking.objects.none()
        user = self.request.user
        qs = Booking.objects.select_related("request", "quote", "customer", "provider", "provider__user").prefetch_related("timeline_steps")
        if user.role == "ADMIN" or user.is_staff:
            return qs.all()
        elif user.role == "PROVIDER":
            return qs.filter(provider__user=user)
        else:
            return qs.filter(customer=user)

    def get_object(self):
        lookup_val = self.kwargs.get("pk")
        qs = self.get_queryset()
        clean_val = lookup_val.lstrip("#")
        try:
            return qs.get(id=lookup_val)
        except Exception:
            obj = (
                qs.filter(order_number__iexact=clean_val).first()
                or qs.filter(order_number__iexact=lookup_val).first()
                or qs.filter(request__code__iexact=clean_val).first()
            )
            if obj:
                return obj
            from rest_framework.exceptions import NotFound
            raise NotFound("Buyurtma topilmadi.")

    @action(detail=True, methods=["post"])
    def advance(self, request, pk=None):
        booking = self.get_object()
        next_status = request.data.get("status")
        if not next_status:
            return standard_response(message="Status ko‘rsatilmadi", success=False, status_code=status.HTTP_400_BAD_REQUEST)

        updated = advance_booking_status(booking, next_status, request.user)
        return standard_response(
            data=BookingSerializer(updated).data,
            message="Buyurtma holati muvaffaqiyatli o‘zgartirildi.",
        )

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        reason = request.data.get("reason", "Mijoz tomonidan bekor qilindi")
        booking.status = Booking.Status.CANCELLED
        booking.status_text = "Bekor qilindi"
        booking.save(update_fields=["status", "status_text", "updated_at"])
        return standard_response(message="Buyurtma bekor qilindi.")
