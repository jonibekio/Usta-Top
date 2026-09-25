from rest_framework import serializers
from apps.providers.serializers import ProviderSerializer
from .models import FavoriteProvider

class FavoriteProviderSerializer(serializers.ModelSerializer):
    provider = ProviderSerializer(read_only=True)

    class Meta:
        model = FavoriteProvider
        fields = ["id", "provider", "created_at"]
