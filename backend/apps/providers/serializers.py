from rest_framework import serializers
from common.utils import format_uzs
from .models import (
    ProviderProfile,
    ProviderService,
    ProviderPortfolio,
)

class ProviderServiceItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="custom_name")
    priceFormatted = serializers.SerializerMethodField()
    iconName = serializers.CharField(source="icon_name")

    class Meta:
        model = ProviderService
        fields = ["id", "name", "description", "price", "priceFormatted", "badge", "iconName"]

    def get_priceFormatted(self, obj):
        return format_uzs(obj.price)

class ProviderPortfolioItemSerializer(serializers.ModelSerializer):
    imageUrl = serializers.CharField(source="image_url")

    class Meta:
        model = ProviderPortfolio
        fields = ["id", "title", "location", "imageUrl"]

class ProviderSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="display_name")
    shortTitle = serializers.CharField(source="short_title")
    avatar = serializers.CharField(source="user.avatar", read_only=True)
    coverImage = serializers.CharField(source="cover_image")
    rating = serializers.FloatField(source="rating_avg")
    reviewsCount = serializers.IntegerField(source="review_count")
    completedJobsCount = serializers.IntegerField(source="completed_jobs")
    experienceYears = serializers.IntegerField(source="experience_years")
    responseMinutes = serializers.IntegerField(source="response_minutes")
    verified = serializers.BooleanField(source="is_verified")
    phone = serializers.CharField(source="user.phone", read_only=True)
    addressFull = serializers.CharField(source="address_full")
    district = serializers.CharField(source="district_text")
    isOnline = serializers.BooleanField(source="is_online")
    availableTime = serializers.CharField(source="available_time")
    warrantyMonths = serializers.IntegerField(source="warranty_months")
    aboutText = serializers.CharField(source="about_text")
    distanceKm = serializers.SerializerMethodField()
    priceRange = serializers.SerializerMethodField()
    services = ProviderServiceItemSerializer(many=True, read_only=True)
    portfolio = ProviderPortfolioItemSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()
    ratingMetrics = serializers.SerializerMethodField()
    vehicleInfo = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()
    categoryIds = serializers.SerializerMethodField()

    class Meta:
        model = ProviderProfile
        fields = [
            "id",
            "slug",
            "name",
            "title",
            "shortTitle",
            "avatar",
            "coverImage",
            "rating",
            "reviewsCount",
            "completedJobsCount",
            "experienceYears",
            "responseMinutes",
            "verified",
            "phone",
            "city",
            "district",
            "addressFull",
            "priceRange",
            "distanceKm",
            "availableTime",
            "isOnline",
            "tags",
            "categoryIds",
            "services",
            "portfolio",
            "reviews",
            "ratingMetrics",
            "warrantyMonths",
            "aboutText",
            "vehicleInfo",
        ]

    def get_distanceKm(self, obj):
        return 3.2

    def get_priceRange(self, obj):
        return {
            "min": int(obj.price_min),
            "max": int(obj.price_max),
            "formatted": f"{int(obj.price_min):,} – {int(obj.price_max):,} so‘m".replace(",", " "),
        }

    def get_ratingMetrics(self, obj):
        return {
            "quality": float(obj.quality_rating),
            "punctuality": float(obj.punctuality_rating),
            "priceFairness": float(obj.price_fairness_rating),
        }

    def get_vehicleInfo(self, obj):
        return {
            "model": obj.vehicle_model,
            "plateNumber": obj.vehicle_plate,
        }

    def get_tags(self, obj):
        tags = [obj.short_title or obj.title, f"{obj.experience_years} yil tajriba"]
        if obj.is_verified:
            tags.append("Tekshirilgan usta")
        return tags

    def get_categoryIds(self, obj):
        # Gather categories from services
        cats = set()
        for s in obj.services.all():
            if s.service and s.service.category:
                cats.add(s.service.category.slug)
        return list(cats) or ["konditsioner"]

    def get_reviews(self, obj):
        from apps.reviews.serializers import ReviewSerializer
        reviews_qs = obj.received_reviews.all()[:10]
        return ReviewSerializer(reviews_qs, many=True).data
