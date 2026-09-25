from django.db.models import Avg, Count
from .models import ProviderProfile

def toggle_online_status(provider: ProviderProfile) -> bool:
    provider.is_online = not provider.is_online
    provider.save(update_fields=["is_online", "updated_at"])
    return provider.is_online

def recalculate_provider_rating(provider: ProviderProfile):
    from apps.reviews.models import Review
    stats = Review.objects.filter(provider=provider).aggregate(
        avg_rating=Avg("rating"),
        total_reviews=Count("id"),
        avg_quality=Avg("quality_rating"),
        avg_punctuality=Avg("punctuality_rating"),
        avg_price=Avg("price_rating"),
    )

    if stats["total_reviews"]:
        provider.rating_avg = round(stats["avg_rating"], 2)
        provider.review_count = stats["total_reviews"]
        if stats["avg_quality"]:
            provider.quality_rating = round(stats["avg_quality"], 2)
        if stats["avg_punctuality"]:
            provider.punctuality_rating = round(stats["avg_punctuality"], 2)
        if stats["avg_price"]:
            provider.price_fairness_rating = round(stats["avg_price"], 2)
        provider.save(update_fields=["rating_avg", "review_count", "quality_rating", "punctuality_rating", "price_fairness_rating", "updated_at"])
