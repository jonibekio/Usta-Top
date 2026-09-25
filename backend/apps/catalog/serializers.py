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

class ServiceCategorySerializer(serializers.ModelSerializer):
    iconName = serializers.CharField(source="icon", read_only=True)
    mastersCount = serializers.IntegerField(source="masters_count", read_only=True)
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
