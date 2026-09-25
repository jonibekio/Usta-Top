from rest_framework import serializers
from apps.providers.serializers import ProviderSerializer
from .models import Booking, BookingTimelineStep

class BookingTimelineStepSerializer(serializers.ModelSerializer):
    timestamp = serializers.CharField(source="timestamp_text")

    class Meta:
        model = BookingTimelineStep
        fields = ["title", "subtitle", "timestamp", "completed", "current"]

class BookingSerializer(serializers.ModelSerializer):
    orderNumber = serializers.CharField(source="order_number")
    requestId = serializers.CharField(source="request.id", read_only=True)
    quoteId = serializers.CharField(source="quote.id", read_only=True, allow_null=True)
    customerId = serializers.CharField(source="customer.id", read_only=True)
    customerName = serializers.CharField(source="customer.full_name", read_only=True)
    customerPhone = serializers.CharField(source="customer.phone", read_only=True)
    provider = ProviderSerializer(read_only=True)
    serviceName = serializers.CharField(source="service_name")
    totalPrice = serializers.IntegerField(source="total_price")
    statusText = serializers.CharField(source="status_text")
    scheduledTime = serializers.CharField(source="scheduled_time")
    estimatedArrival = serializers.CharField(source="estimated_arrival")
    estimatedMinutesLeft = serializers.IntegerField(source="estimated_minutes_left")
    destinationAddress = serializers.CharField(source="destination_address")
    distanceKm = serializers.FloatField(source="distance_km")
    paymentMethod = serializers.CharField(source="payment_method")
    isPaid = serializers.BooleanField(source="is_paid")
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    vehicle = serializers.SerializerMethodField()
    timeline = BookingTimelineStepSerializer(source="timeline_steps", many=True, read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "orderNumber",
            "requestId",
            "quoteId",
            "customerId",
            "customerName",
            "customerPhone",
            "provider",
            "serviceName",
            "totalPrice",
            "status",
            "statusText",
            "scheduledTime",
            "estimatedArrival",
            "estimatedMinutesLeft",
            "vehicle",
            "destinationAddress",
            "distanceKm",
            "timeline",
            "paymentMethod",
            "isPaid",
            "createdAt",
        ]

    def get_vehicle(self, obj):
        return {
            "model": obj.vehicle_model,
            "color": obj.vehicle_color,
            "plateNumber": obj.vehicle_plate,
        }
