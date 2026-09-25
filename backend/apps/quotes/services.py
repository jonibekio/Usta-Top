from django.db import transaction
from django.utils import timezone
from common.exceptions import BusinessLogicError, QuoteExpiredError
from apps.service_requests.models import ServiceRequest
from apps.providers.models import ProviderProfile
from .models import Quote

@transaction.atomic
def create_quote_service(provider_user, request_id_or_code, validated_data):
    provider = getattr(provider_user, "provider_profile", None)
    if not provider:
        raise BusinessLogicError("Faqat ro‘yxatdan o‘tgan ustalar narx taklifi yuborishi mumkin.")

    if provider.status != ProviderProfile.Status.ACTIVE:
        raise BusinessLogicError("Hisobingiz faol emas, taklif yubora olmaysiz.")

    try:
        req_obj = ServiceRequest.objects.get(id=request_id_or_code)
    except Exception:
        req_obj = ServiceRequest.objects.get(code=request_id_or_code)

    if req_obj.status not in (ServiceRequest.Status.OPEN, ServiceRequest.Status.MATCHED):
        raise BusinessLogicError("Ushbu buyurtma takliflar qabul qilish uchun ochiq emas.")

    labor = validated_data.get("serviceFee", 0)
    parts = validated_data.get("partsFee", 0)
    additional = validated_data.get("additionalAmount", 0)
    total = labor + parts + additional

    quote, created = Quote.objects.update_or_create(
        request=req_obj,
        provider=provider,
        defaults={
            "labor_amount": labor,
            "parts_amount": parts,
            "additional_amount": additional,
            "total_amount": total,
            "arrival_time": validated_data.get("arrivalTime", "Bugun 18:00"),
            "warranty": validated_data.get("warranty", "12 oy kafolat"),
            "notes": validated_data.get("notes", ""),
            "status": Quote.Status.PENDING,
        },
    )
    return quote

@transaction.atomic
def accept_quote_service(quote_id, user):
    quote = Quote.objects.select_for_update().select_related("request", "provider", "provider__user").get(id=quote_id)

    if quote.request.customer != user and not user.is_staff and user.role != "ADMIN":
        raise BusinessLogicError("Faqat buyurtma egasi smetani qabul qilishi mumkin.")

    if quote.status != Quote.Status.PENDING:
        raise BusinessLogicError("Faqat kutilayotgan taklifni qabul qilish mumkin.")

    if quote.expires_at and quote.expires_at < timezone.now():
        quote.status = Quote.Status.EXPIRED
        quote.save(update_fields=["status", "updated_at"])
        raise QuoteExpiredError("Ushbu taklifning amal qilish muddati tugagan.")

    # 1. Accept this quote
    quote.status = Quote.Status.ACCEPTED
    quote.save(update_fields=["status", "updated_at"])

    # 2. Reject other competing quotes on the same request
    Quote.objects.filter(request=quote.request).exclude(id=quote.id).update(status=Quote.Status.REJECTED)

    # 3. Update request status
    req = quote.request
    req.status = ServiceRequest.Status.ASSIGNED
    req.save(update_fields=["status", "updated_at"])

    # 4. Automatically create Booking
    from apps.bookings.services import create_booking_from_accepted_quote
    booking = create_booking_from_accepted_quote(quote)

    # 5. Create conversation / chat channel
    from apps.conversations.services import get_or_create_conversation
    get_or_create_conversation(request_obj=req, customer=req.customer, provider_user=quote.provider.user, booking=booking)

    return quote, booking

@transaction.atomic
def reject_quote_service(quote_id, user):
    quote = Quote.objects.get(id=quote_id)
    if quote.request.customer != user and not user.is_staff and user.role != "ADMIN":
        raise BusinessLogicError("Faqat buyurtma egasi smetani rad etishi mumkin.")

    quote.status = Quote.Status.REJECTED
    quote.save(update_fields=["status", "updated_at"])
    return quote
