from django.db.models import Q
from .models import ProviderProfile

def list_providers(
    search=None,
    category=None,
    region=None,
    district=None,
    min_price=None,
    max_price=None,
    min_rating=None,
    experience_years=None,
    is_online=None,
    verified_only=False,
    ordering=None,
):
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
            | Q(services__service__slug=category)
            | Q(title__icontains=category)
            | Q(short_title__icontains=category)
        ).distinct()

    if region and region not in ("Barcha viloyatlar", "all", ""):
        qs = qs.filter(
            Q(region__slug=region)
            | Q(region__name__icontains=region)
            | Q(city__icontains=region)
        )

    if district and district not in ("Barcha tumanlar", "all", ""):
        qs = qs.filter(
            Q(district__slug=district)
            | Q(district__name__icontains=district)
            | Q(district_text__icontains=district)
        )

    if min_price:
        try:
            qs = qs.filter(price_min__gte=float(min_price))
        except (ValueError, TypeError):
            pass

    if max_price:
        try:
            qs = qs.filter(price_min__lte=float(max_price))
        except (ValueError, TypeError):
            pass

    if min_rating:
        try:
            qs = qs.filter(rating_avg__gte=float(min_rating))
        except (ValueError, TypeError):
            pass

    if experience_years:
        try:
            qs = qs.filter(experience_years__gte=int(experience_years))
        except (ValueError, TypeError):
            pass

    if is_online:
        qs = qs.filter(is_online=True)

    if verified_only:
        qs = qs.filter(verification_status=ProviderProfile.VerificationStatus.VERIFIED)

    if ordering == "price_asc":
        return qs.order_by("price_min", "-rating_avg")
    elif ordering == "price_desc":
        return qs.order_by("-price_min", "-rating_avg")
    elif ordering == "rating":
        return qs.order_by("-rating_avg", "-review_count")
    elif ordering == "experience":
        return qs.order_by("-experience_years", "-rating_avg")
    elif ordering == "jobs":
        return qs.order_by("-completed_jobs", "-rating_avg")

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
