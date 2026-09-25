from django.db import transaction
from common.exceptions import BusinessLogicError
from apps.bookings.models import Booking
from apps.providers.services import recalculate_provider_rating
from .models import Review

@transaction.atomic
def create_review_service(booking_id, customer, validated_data):
    booking = Booking.objects.select_for_update().get(id=booking_id)

    if booking.customer != customer and not customer.is_staff and customer.role != "ADMIN":
        raise BusinessLogicError("Faqat o‘z buyurtmangizga sharh qoldirishingiz mumkin.")

    if booking.status != Booking.Status.COMPLETED:
        raise BusinessLogicError("Faqat to‘liq yakunlangan buyurtmalarga sharh qoldirish mumkin.")

    if hasattr(booking, "review"):
        raise BusinessLogicError("Ushbu buyurtmaga allaqachon sharh qoldirilgan.")

    review = Review.objects.create(
        booking=booking,
        customer=customer,
        provider=booking.provider,
        rating=validated_data["rating"],
        quality_rating=validated_data.get("qualityRating", 5.0),
        punctuality_rating=validated_data.get("punctualityRating", 5.0),
        price_rating=validated_data.get("priceRating", 5.0),
        service_title=booking.service_name,
        location_text=booking.destination_address.split(",")[0] if "," in booking.destination_address else "Toshkent",
        comment=validated_data["comment"],
    )

    recalculate_provider_rating(booking.provider)
    return review
