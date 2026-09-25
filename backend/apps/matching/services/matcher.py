from apps.providers.models import ProviderProfile
from apps.service_requests.models import ServiceRequest
from apps.matching.models import MatchingScore

MATCHING_WEIGHTS = {
    "service_match": 0.30,
    "location_match": 0.25,
    "rating": 0.15,
    "experience": 0.10,
    "verification": 0.10,
    "response_time": 0.10,
}

def calculate_provider_score(request_obj: ServiceRequest, provider: ProviderProfile):
    # 1. Service / Category Match (0 - 100)
    service_score = 70.0
    req_cat = request_obj.category.slug
    has_category = provider.services.filter(service__category__slug=req_cat).exists() or req_cat in provider.slug or req_cat in provider.title.lower()
    if has_category:
        service_score = 100.0

    # 2. Location Match (0 - 100)
    loc_score = 60.0
    if provider.district_text.lower() in request_obj.district.lower() or request_obj.district.lower() in provider.district_text.lower():
        loc_score = 98.0
    elif provider.city.lower() in request_obj.city.lower():
        loc_score = 80.0

    # 3. Rating Score (0 - 100)
    rating_score = min(100.0, float(provider.rating_avg) * 20.0)

    # 4. Experience & Completed Jobs Score (0 - 100)
    exp_score = min(100.0, (provider.experience_years * 5.0) + min(50.0, provider.completed_jobs * 0.4))

    # 5. Verification Status (0 - 100)
    verif_score = 100.0 if provider.is_verified else 50.0

    # 6. Response Time & Online Status (0 - 100)
    response_score = 100.0 if provider.is_online else 70.0
    if provider.response_minutes <= 15:
        response_score += 10.0
    response_score = min(100.0, response_score)

    # Weighted Total
    total = (
        service_score * MATCHING_WEIGHTS["service_match"] +
        loc_score * MATCHING_WEIGHTS["location_match"] +
        rating_score * MATCHING_WEIGHTS["rating"] +
        exp_score * MATCHING_WEIGHTS["experience"] +
        verif_score * MATCHING_WEIGHTS["verification"] +
        response_score * MATCHING_WEIGHTS["response_time"]
    )

    reason = f"{int(total)}% mos keldi. {provider.district_text}da {provider.completed_jobs} ta muvaffaqiyatli buyurtma va {provider.response_minutes} daqiqada javob berish ko‘rsatkichi."

    return round(total, 1), {
        "service_score": service_score,
        "location_score": loc_score,
        "rating_score": rating_score,
        "experience_score": exp_score,
        "verification_score": verif_score,
        "response_score": response_score,
    }, reason

def match_providers_for_request(request_obj: ServiceRequest, limit=10):
    providers = ProviderProfile.objects.filter(status=ProviderProfile.Status.ACTIVE)

    results = []
    for provider in providers:
        score, breakdown, reason = calculate_provider_score(request_obj, provider)
        MatchingScore.objects.update_or_create(
            request=request_obj,
            provider=provider,
            defaults={
                "total_score": score,
                "breakdown": breakdown,
                "match_reason": reason,
            },
        )
        results.append((provider, score, reason))

    results.sort(key=lambda x: x[1], reverse=True)
    return results[:limit]
