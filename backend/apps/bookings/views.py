from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from common.utils import standard_response
from apps.providers.models import ProviderProfile
from .models import Booking
from .serializers import BookingSerializer
from .services import advance_booking_status, create_direct_booking_service

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

    def create(self, request, *args, **kwargs):
        provider_id = request.data.get("provider_id") or request.data.get("providerId")
        if not provider_id:
            return standard_response(
                message="Usta tanlanishi shart",
                success=False,
                status_code=status.HTTP_400_BAD_REQUEST,
            )

        try:
            provider = ProviderProfile.objects.get(id=provider_id)
        except Exception:
            try:
                provider = ProviderProfile.objects.get(slug=provider_id)
            except Exception:
                return standard_response(
                    message="Tanlangan usta topilmadi",
                    success=False,
                    status_code=status.HTTP_404_NOT_FOUND,
                )

        booking = create_direct_booking_service(
            customer=request.user,
            provider=provider,
            data=request.data,
        )

        serializer = BookingSerializer(booking)
        return standard_response(
            data=serializer.data,
            message="Buyurtmangiz muvaffaqiyatli qabul qilindi va ustaga yuborildi.",
            status_code=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"], url_path="advance_status")
    def advance_status(self, request, pk=None):
        booking = self.get_object()
        next_status = request.data.get("target_status") or request.data.get("status")
        if not next_status:
            return standard_response(message="Status ko‘rsatilmadi", success=False, status_code=status.HTTP_400_BAD_REQUEST)

        updated = advance_booking_status(booking, next_status, request.user)
        return standard_response(
            data=BookingSerializer(updated).data,
            message="Buyurtma holati muvaffaqiyatli yangilandi.",
        )

    @action(detail=True, methods=["post"])
    def advance(self, request, pk=None):
        return self.advance_status(request, pk=pk)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        reason = request.data.get("reason", "Bekor qilindi")
        advance_booking_status(booking, Booking.Status.CANCELLED, request.user)
        return standard_response(
            data=BookingSerializer(booking).data,
            message="Buyurtma bekor qilindi.",
        )
