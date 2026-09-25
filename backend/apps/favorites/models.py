import uuid
from django.db import models
from django.conf import settings
from apps.providers.models import ProviderProfile

class FavoriteProvider(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="favorite_providers")
    provider = models.ForeignKey(ProviderProfile, on_delete=models.CASCADE, related_name="favorited_by")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("customer", "provider")
        ordering = ["-created_at"]
