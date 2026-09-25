from rest_framework import serializers
from apps.providers.serializers import ProviderSerializer
from .models import MatchingScore

class MatchedProviderSerializer(serializers.ModelSerializer):
    provider = ProviderSerializer()
    matchScore = serializers.FloatField(source="total_score")
    matchReason = serializers.CharField(source="match_reason")

    class Meta:
        model = MatchingScore
        fields = ["id", "provider", "matchScore", "matchReason", "breakdown", "created_at"]
