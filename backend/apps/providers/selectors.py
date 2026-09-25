from django.db.models import Q
from .models import ProviderProfile

def list_providers(search=None, category=None, district=None, min_price=None, max_price=None, verified_only=False):
    qs = (
        ProviderProfile.objects.filter(status=ProviderProfile.Status.ACTIVE)
        .select_related("user", "region", "district")
        .prefetch_related("services__service__category", "portfolio", "received_reviews")
    )

    if search:
        q = search.strip()
        qs = qs.filter(
            Q(display_name__icontains=q)
            | Q(title__icontains=q)
            | Q(short_title__icontains=q)
            | Q(about_text__icontains=q)
            | Q(services__custom_name__icontains=q)
        ).distinct()

    if category:
        qs = qs.filter(
            Q(services__service__category__slug=category)
            | Q(title__icontains=category)
            | Q(short_title__icontains=category)
        ).distinct()

    if district:
        qs = qs.filter(Q(district__slug=district) | Q(district_text__icontains=district))

    if min_price:
        qs = qs.filter(price_min__gte=min_price)

    if max_price:
        qs = qs.filter(price_min__lte=max_price)

    if verified_only:
        qs = qs.filter(verification_status=ProviderProfile.VerificationStatus.VERIFIED)

    return qs.order_by("-rating_avg", "-completed_jobs")

def get_provider_by_id_or_slug(identifier):
    qs = (
        ProviderProfile.objects.select_related("user", "region", "district")
        .prefetch_related("services__service__category", "portfolio", "received_reviews")
    )
    try:
        return qs.get(id=identifier)
    except Exception:
        try:
            return qs.get(slug=identifier)
        except Exception:
            from rest_framework.exceptions import NotFound
            raise NotFound("Usta profili topilmadi.")
