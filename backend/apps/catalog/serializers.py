from rest_framework import serializers
from .models import ServiceCategory, Service

class ServiceSerializer(serializers.ModelSerializer):
    categoryName = serializers.CharField(source="category.name", read_only=True)
    categorySlug = serializers.CharField(source="category.slug", read_only=True)

    class Meta:
        model = Service
        fields = [
            "id",
            "category",
            "categoryName",
            "categorySlug",
            "name",
            "slug",
            "description",
            "base_price",
            "is_active",
        ]

from django.db import models

class ServiceCategorySerializer(serializers.ModelSerializer):
    iconName = serializers.CharField(source="icon", read_only=True)
    mastersCount = serializers.SerializerMethodField()
    services = ServiceSerializer(many=True, read_only=True)

    class Meta:
        model = ServiceCategory
        fields = [
            "id",
            "slug",
            "name",
            "description",
            "iconName",
            "image",
            "mastersCount",
            "featured",
            "is_active",
            "sort_order",
            "services",
        ]

    def get_mastersCount(self, obj):
        from apps.providers.models import ProviderProfile
        return ProviderProfile.objects.filter(
            status=ProviderProfile.Status.ACTIVE
        ).filter(
            models.Q(services__service__category=obj) |
            models.Q(slug__icontains=obj.slug) |
            models.Q(title__icontains=obj.name)
        ).distinct().count()
