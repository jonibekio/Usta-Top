from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):
    userName = serializers.CharField(source="customer.full_name", read_only=True)
    userAvatar = serializers.CharField(source="customer.avatar", read_only=True)
    date = serializers.SerializerMethodField()
    serviceTitle = serializers.CharField(source="service_title")
    location = serializers.CharField(source="location_text")

    class Meta:
        model = Review
        fields = [
            "id",
            "userName",
            "userAvatar",
            "rating",
            "comment",
            "date",
            "serviceTitle",
            "location",
        ]

    def get_date(self, obj):
        return obj.created_at.strftime("%d-%B")

class CreateReviewSerializer(serializers.Serializer):
    rating = serializers.IntegerField(min_value=1, max_value=5)
    qualityRating = serializers.DecimalField(max_digits=3, decimal_places=2, required=False, default=5.0)
    punctualityRating = serializers.DecimalField(max_digits=3, decimal_places=2, required=False, default=5.0)
    priceRating = serializers.DecimalField(max_digits=3, decimal_places=2, required=False, default=5.0)
    comment = serializers.CharField()
