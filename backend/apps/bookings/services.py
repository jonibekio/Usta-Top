import random
from django.db import transaction
from common.exceptions import BookingConflictError, BusinessLogicError
from apps.notifications.models import Notification
from .models import Booking, BookingTimelineStep, BookingStatusHistory

STATUS_TEXTS = {
    Booking.Status.CREATED: "Yangi buyurtma (Usta tasdiqlashi kutilmoqda)",
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
def create_direct_booking_service(customer, provider, data):
    order_num = f"UT-{random.randint(10000, 99999)}"
    service_name = data.get("service_name") or data.get("serviceName", "Xizmat")
    total_price = data.get("total_price") or data.get("price") or provider.price_min
    scheduled_date = data.get("scheduled_date") or data.get("scheduledDate", "Bugun")
    scheduled_time_slot = data.get("scheduled_time") or data.get("scheduledTime", "")
    full_schedule = f"{scheduled_date} {scheduled_time_slot}".strip()

    destination_address = (
        data.get("destination_address")
        or data.get("address_text")
        or data.get("address")
        or f"{provider.city}, {provider.district_text}"
    )
    notes = data.get("notes") or data.get("problem_description", "")

    booking = Booking.objects.create(
        order_number=order_num,
        customer=customer,
        provider=provider,
        service_name=service_name,
        total_price=total_price,
        status=Booking.Status.CREATED,
        status_text="Yangi buyurtma (Usta tasdiqlashi kutilmoqda)",
        scheduled_time=full_schedule,
        destination_address=destination_address,
        problem_description=notes,
        vehicle_model=provider.vehicle_model or "Avtomobil",
        vehicle_plate=provider.vehicle_plate or "",
        payment_method=Booking.PaymentMethod.CASH,
        is_paid=False,
    )

    steps = [
        ("Buyurtma yuborildi", "Mijoz tomonidan buyurtma rasmiylashtirildi", "Hozir", True, False, 1),
        ("Usta tasdiqlashi", "Usta buyurtmani ko‘rib chiqmoqda", "Kutilmoqda", False, True, 2),
        ("Yo‘lga chiqish", "Belgilangan vaqtda usta yo‘lga chiqadi", "--:--", False, False, 3),
        ("Ish jarayoni", "Xizmat ko‘rsatilmoqda", "--:--", False, False, 4),
        ("Yakunlash & Baholash", "Xizmat yakunlanadi", "--:--", False, False, 5),
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

    Notification.objects.create(
        user=provider.user,
        notification_type=Notification.NotificationType.NEW_REQUEST,
        title=f"Yangi buyurtma: {service_name}",
        body=f"Mijoz {customer.full_name} sizga buyurtma yubordi. Manzil: {destination_address}",
        data={"booking_id": str(booking.id), "order_number": booking.order_number},
    )

    return booking

@transaction.atomic
def advance_booking_status(booking: Booking, next_status: str, user):
    old_status = booking.status
    booking.status = next_status
    booking.status_text = STATUS_TEXTS.get(next_status, next_status)

    if next_status == Booking.Status.COMPLETED:
        booking.estimated_minutes_left = 0
        booking.is_paid = True
        booking.provider.completed_jobs += 1
        booking.provider.save(update_fields=["completed_jobs", "updated_at"])

    booking.save(update_fields=["status", "status_text", "estimated_minutes_left", "is_paid", "updated_at"])

    BookingStatusHistory.objects.create(
        booking=booking,
        old_status=old_status,
        new_status=next_status,
        changed_by=user,
        reason=f"Status {old_status} dan {next_status} ga o‘zgartirildi",
    )

    # Customer notification
    type_map = {
        Booking.Status.CONFIRMED: (
            Notification.NotificationType.BOOKING_CONFIRMED,
            "Buyurtmangiz tasdiqlandi",
            f"Usta {booking.provider.display_name} buyurtmangizni qabul qildi.",
        ),
        Booking.Status.IN_TRANSIT: (
            Notification.NotificationType.BOOKING_STARTED,
            "Usta yo‘lga chiqdi",
            f"{booking.provider.display_name} manzilingiz tomon yo‘lga chiqdi.",
        ),
        Booking.Status.IN_PROGRESS: (
            Notification.NotificationType.BOOKING_STARTED,
            "Ish boshlandi",
            f"Usta {booking.provider.display_name} ishni bajarishga kirishdi.",
        ),
        Booking.Status.COMPLETED: (
            Notification.NotificationType.BOOKING_COMPLETED,
            "Xizmat yakunlandi!",
            f"Buyurtmangiz muvaffaqiyatli yakunlandi. Iltimos ustaga baho va sharh qoldiring.",
        ),
        Booking.Status.CANCELLED: (
            Notification.NotificationType.BOOKING_CANCELLED,
            "Buyurtma bekor qilindi",
            f"Buyurtma #{booking.order_number} bekor qilindi.",
        ),
    }

    if next_status in type_map and booking.customer:
        ntype, ntitle, nbody = type_map[next_status]
        Notification.objects.create(
            user=booking.customer,
            notification_type=ntype,
            title=ntitle,
            body=nbody,
            data={"booking_id": str(booking.id), "order_number": booking.order_number},
        )

    return booking
