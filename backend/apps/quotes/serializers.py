from rest_framework import serializers
from apps.providers.serializers import ProviderSerializer
from .models import Quote, QuoteItem

class QuoteItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuoteItem
        fields = ["id", "title", "quantity", "unit_price", "total_price"]

class QuoteSerializer(serializers.ModelSerializer):
    requestId = serializers.CharField(source="request.id", read_only=True)
    providerId = serializers.CharField(source="provider.id", read_only=True)
    provider = ProviderSerializer(read_only=True)
    serviceFee = serializers.IntegerField(source="labor_amount")
    partsFee = serializers.IntegerField(source="parts_amount")
    totalPrice = serializers.IntegerField(source="total_amount")
    arrivalTime = serializers.CharField(source="arrival_time")
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)

    class Meta:
        model = Quote
        fields = [
            "id",
            "requestId",
            "providerId",
            "provider",
            "serviceFee",
            "partsFee",
            "totalPrice",
            "arrivalTime",
            "warranty",
            "notes",
            "status",
            "createdAt",
        ]
        read_only_fields = ["id", "totalPrice", "status", "createdAt"]

class CreateQuoteSerializer(serializers.Serializer):
    serviceFee = serializers.DecimalField(max_digits=12, decimal_places=2)
    partsFee = serializers.DecimalField(max_digits=12, decimal_places=2, default=0)
    additionalAmount = serializers.DecimalField(max_digits=12, decimal_places=2, default=0, required=False)
    arrivalTime = serializers.CharField(max_length=150)
    warranty = serializers.CharField(max_length=150, default="12 oy kafolat")
    notes = serializers.CharField(required=False, allow_blank=True)
