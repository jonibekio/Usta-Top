from rest_framework import serializers
from .models import Dispute, DisputeEvidence

class DisputeEvidenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = DisputeEvidence
        fields = ["id", "file_url", "description", "created_at"]

class DisputeSerializer(serializers.ModelSerializer):
    orderNumber = serializers.CharField(source="booking.order_number", read_only=True)
    openedByName = serializers.CharField(source="opened_by.full_name", read_only=True)
    evidences = DisputeEvidenceSerializer(many=True, read_only=True)

    class Meta:
        model = Dispute
        fields = [
            "id",
            "orderNumber",
            "openedByName",
            "reason",
            "description",
            "status",
            "resolution",
            "resolution_note",
            "evidences",
            "created_at",
        ]

class CreateDisputeSerializer(serializers.Serializer):
    reason = serializers.CharField(max_length=200)
    description = serializers.CharField()
