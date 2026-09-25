import uuid
from django.db import models
from apps.service_requests.models import ServiceRequest
from apps.providers.models import ProviderProfile

class MatchingScore(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE, related_name="matching_scores")
    provider = models.ForeignKey(ProviderProfile, on_delete=models.CASCADE, related_name="matching_scores")
    total_score = models.FloatField(default=0.0, db_index=True)
    breakdown = models.JSONField(default=dict)
    match_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("request", "provider")
        ordering = ["-total_score"]

    def __str__(self):
        return f"{self.provider.display_name} -> {self.request.code}: {self.total_score:.1f}%"
