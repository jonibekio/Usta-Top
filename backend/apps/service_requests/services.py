from django.db import transaction
from common.exceptions import InvalidStatusTransitionError
from apps.catalog.models import ServiceCategory
from .models import ServiceRequest, RequestAttachment, RequestStatusHistory

VALID_TRANSITIONS = {
    ServiceRequest.Status.DRAFT: [ServiceRequest.Status.OPEN, ServiceRequest.Status.CANCELLED],
    ServiceRequest.Status.OPEN: [ServiceRequest.Status.MATCHED, ServiceRequest.Status.ASSIGNED, ServiceRequest.Status.CANCELLED],
    ServiceRequest.Status.MATCHED: [ServiceRequest.Status.ASSIGNED, ServiceRequest.Status.CANCELLED],
    ServiceRequest.Status.ASSIGNED: [ServiceRequest.Status.IN_PROGRESS, ServiceRequest.Status.CANCELLED],
    ServiceRequest.Status.IN_PROGRESS: [ServiceRequest.Status.COMPLETED, ServiceRequest.Status.DISPUTED],
    ServiceRequest.Status.COMPLETED: [ServiceRequest.Status.DISPUTED],
    ServiceRequest.Status.DISPUTED: [ServiceRequest.Status.COMPLETED, ServiceRequest.Status.CANCELLED],
    ServiceRequest.Status.CANCELLED: [],
}

@transaction.atomic
def create_request_service(customer, data):
    cat_identifier = data.get("categoryId")
    category = None
    try:
        category = ServiceCategory.objects.get(slug=cat_identifier)
    except ServiceCategory.DoesNotExist:
        try:
            category = ServiceCategory.objects.get(id=cat_identifier)
        except Exception:
            category = ServiceCategory.objects.first()

    loc = data.get("location", {})
    coords = loc.get("coordinates")
    lat, lng = None, None
    if coords and len(coords) == 2:
        lat, lng = coords[0], coords[1]

    req = ServiceRequest.objects.create(
        customer=customer,
        category=category,
        problem_description=data.get("problemDescription", ""),
        detected_issues=data.get("detectedIssues", []),
        answers=data.get("answers", {}),
        city=loc.get("city", "Toshkent"),
        district=loc.get("district", "Chilonzor"),
        address_text=loc.get("address", "Chilonzor tumani"),
        latitude=lat,
        longitude=lng,
        urgency=data.get("urgency", ServiceRequest.Urgency.URGENT),
        urgency_text=data.get("urgencyText", "⚡ Shoshilinch"),
        has_audio=data.get("hasAudio", False),
        audio_duration=data.get("audioDuration", ""),
        status=ServiceRequest.Status.OPEN,
    )

    photos = data.get("photos", [])
    for photo_url in photos:
        RequestAttachment.objects.create(
            request=req,
            file_url=photo_url,
            file_type="image",
        )

    RequestStatusHistory.objects.create(
        request=req,
        old_status=ServiceRequest.Status.DRAFT,
        new_status=ServiceRequest.Status.OPEN,
        changed_by=customer,
        reason="Buyurtma yaratildi va e’lon qilindi",
    )

    # Run matching engine asynchronously or immediately
    try:
        from apps.matching.services.matcher import match_providers_for_request
        match_providers_for_request(req)
    except Exception:
        pass

    return req

@transaction.atomic
def transition_request_status(request_obj: ServiceRequest, new_status: str, user, reason: str = ""):
    allowed = VALID_TRANSITIONS.get(request_obj.status, [])
    if new_status not in allowed:
        raise InvalidStatusTransitionError(
            f"Buyurtma holatini '{request_obj.status}' dan '{new_status}' ga o‘zgartirib bo‘lmaydi."
        )

    old_status = request_obj.status
    request_obj.status = new_status
    request_obj.save(update_fields=["status", "updated_at"])

    RequestStatusHistory.objects.create(
        request=request_obj,
        old_status=old_status,
        new_status=new_status,
        changed_by=user,
        reason=reason,
    )
    return request_obj
