import uuid
from django.db import models
from django.conf import settings
from apps.providers.models import ProviderProfile

class ProviderVerification(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Kutilmoqda"
        APPROVED = "APPROVED", "Tasdiqlangan"
        REJECTED = "REJECTED", "Rad etilgan"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.OneToOneField(ProviderProfile, on_delete=models.CASCADE, related_name="verification")
    category_name = models.CharField(max_length=150, default="Konditsioner")
    passport_serial = models.CharField(max_length=50, default="AA 1234567")

    passport_photo_url = models.URLField(max_length=500)
    face_photo_url = models.URLField(max_length=500)
    certificates = models.JSONField(default=list)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )
    rejection_reason = models.TextField(blank=True)
    reviewed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.provider.display_name} - {self.status}"
