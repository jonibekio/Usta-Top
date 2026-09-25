import uuid
from django.db import models
from django.conf import settings
from apps.bookings.models import Booking

class Payment(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Kutilmoqda"
        PROCESSING = "PROCESSING", "Jarayonda"
        SUCCEEDED = "SUCCEEDED", "Muvaffaqiyatli to‘landi"
        FAILED = "FAILED", "Xatolik yuz berdi"
        CANCELLED = "CANCELLED", "Bekor qilindi"
        REFUNDED = "REFUNDED", "Qaytarildi"

    class Provider(models.TextChoices):
        ESCROW = "ESCROW", "Usta Top Xavfsiz Hisob (Escrow)"
        PAYME = "PAYME", "Payme"
        CLICK = "CLICK", "Click"
        UZUM = "UZUM", "Uzum Pay"
        CASH = "CASH", "Naqd pul"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payments")
    booking = models.ForeignKey(Booking, on_delete=models.SET_NULL, null=True, blank=True, related_name="payments")
    amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="To‘lov miqdori (so‘m)")
    currency = models.CharField(max_length=3, default="UZS")
    provider = models.CharField(max_length=20, choices=Provider.choices, default=Provider.ESCROW)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PENDING, db_index=True)
    external_id = models.CharField(max_length=150, blank=True, db_index=True)
    idempotency_key = models.CharField(max_length=150, unique=True, null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"To‘lov #{self.id} ({self.amount} {self.currency}) - {self.status}"
