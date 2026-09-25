import uuid
from django.db import models
from django.conf import settings
from apps.bookings.models import Booking

class Dispute(models.Model):
    class Status(models.TextChoices):
        OPEN = "OPEN", "Ochiq"
        UNDER_REVIEW = "UNDER_REVIEW", "Ko‘rib chiqilmoqda"
        RESOLVED = "RESOLVED", "Hal qilindi"
        REJECTED = "REJECTED", "Rad etildi"

    class Resolution(models.TextChoices):
        CUSTOMER_FAVOR = "CUSTOMER_FAVOR", "Mijoz foydasiga (Pullar qaytariladi)"
        PROVIDER_FAVOR = "PROVIDER_FAVOR", "Usta foydasiga"
        PARTIAL = "PARTIAL", "Qisman qaytarish"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="disputes")
    opened_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="opened_disputes")
    reason = models.CharField(max_length=200, verbose_name="Nizo sababi")
    description = models.TextField(verbose_name="Batafsil tavsif")

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN,
        db_index=True,
    )
    resolution = models.CharField(
        max_length=20,
        choices=Resolution.choices,
        null=True,
        blank=True,
    )
    resolution_note = models.TextField(blank=True)
    resolved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="resolved_disputes")
    resolved_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Nizo #{self.booking.order_number}: {self.reason} ({self.status})"

class DisputeEvidence(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    dispute = models.ForeignKey(Dispute, on_delete=models.CASCADE, related_name="evidences")
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    file_url = models.URLField(max_length=500)
    description = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
