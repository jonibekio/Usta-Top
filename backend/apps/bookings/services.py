from django.db import transaction
from common.exceptions import BookingConflictError
from .models import Booking, BookingTimelineStep, BookingStatusHistory

STATUS_TEXTS = {
    Booking.Status.CREATED: "Buyurtma yaratildi",
    Booking.Status.CONFIRMED: "Buyurtma tasdiqlandi",
    Booking.Status.IN_TRANSIT: "Usta yo‘lda",
    Booking.Status.IN_PROGRESS: "Ish bajarilmoqda",
    Booking.Status.COMPLETED: "Ish yakunlandi",
    Booking.Status.CANCELLED: "Buyurtma bekor qilindi",
}

@transaction.atomic
def create_booking_from_accepted_quote(quote):
    # Check for concurrency conflicts on provider
    active_conflicts = Booking.objects.select_for_update().filter(
        provider=quote.provider,
        status__in=[Booking.Status.IN_TRANSIT, Booking.Status.IN_PROGRESS],
    )
    if active_conflicts.count() > 5:
        raise BookingConflictError("Ushbu usta ayni paytda maksimal faol buyurtmalarni bajarmoqda.")

    order_num = f"#{quote.request.code}"
    # Check idempotency
    existing = Booking.objects.filter(order_number=order_num).first()
    if existing:
        return existing

    booking = Booking.objects.create(
        order_number=order_num,
        request=quote.request,
        quote=quote,
        customer=quote.request.customer,
        provider=quote.provider,
        service_name=quote.request.category.name,
        total_price=quote.total_amount,
        status=Booking.Status.IN_TRANSIT,
        status_text="Usta yo‘lda",
        scheduled_time="Bugun, 17:30 – 19:30",
        estimated_arrival="17:50",
        estimated_minutes_left=10,
        vehicle_model=quote.provider.vehicle_model or "Cobalt",
        vehicle_color="Oq",
        vehicle_plate=quote.provider.vehicle_plate or "01 A 777 BA",
        destination_address=quote.request.address_text or "Chilonzor tumani, 9-mavze, 14-uy",
        distance_km=3.2,
        payment_method=Booking.PaymentMethod.ESCROW,
        is_paid=True,
    )

    steps = [
        ("Buyurtma tasdiqlandi", "Taklif qabul qilindi", "15:35", True, False, 1),
        ("Usta yo‘lga chiqdi", f"{booking.vehicle_model} {booking.vehicle_plate}", "17:25", True, False, 2),
        ("Usta yo‘lda", "Taxminan 10 daqiqa qoldi", "Hozir", False, True, 3),
        ("Yetib kelish", "Chilonzor-9, 14-uy manzili", "17:50", False, False, 4),
        ("Ish bajarilishi", "Nosozlik bartaraf etiladi", "18:00", False, False, 5),
    ]

    for title, sub, ts, comp, curr, ord_num in steps:
        BookingTimelineStep.objects.create(
            booking=booking,
            title=title,
            subtitle=sub,
            timestamp_text=ts,
            completed=comp,
            current=curr,
            order=ord_num,
        )

    BookingStatusHistory.objects.create(
        booking=booking,
        old_status=Booking.Status.CREATED,
        new_status=Booking.Status.IN_TRANSIT,
        changed_by=quote.request.customer,
        reason="Taklif qabul qilinishi bilan buyurtma faollashtirildi",
    )

    return booking

@transaction.atomic
def advance_booking_status(booking: Booking, next_status: str, user):
    valid_next = {
        Booking.Status.CONFIRMED: Booking.Status.IN_TRANSIT,
        Booking.Status.IN_TRANSIT: Booking.Status.IN_PROGRESS,
        Booking.Status.IN_PROGRESS: Booking.Status.COMPLETED,
    }

    old_status = booking.status
    booking.status = next_status
    booking.status_text = STATUS_TEXTS.get(next_status, next_status)

    if next_status == Booking.Status.COMPLETED:
        booking.estimated_minutes_left = 0
        # Increment provider completed jobs
        booking.provider.completed_jobs += 1
        booking.provider.save(update_fields=["completed_jobs", "updated_at"])

    booking.save(update_fields=["status", "status_text", "estimated_minutes_left", "updated_at"])

    BookingStatusHistory.objects.create(
        booking=booking,
        old_status=old_status,
        new_status=next_status,
        changed_by=user,
        reason="Usta tomonidan bosqich yangilandi",
    )
    return booking
