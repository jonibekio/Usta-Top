import uuid
from django.db import models
from django.conf import settings
from apps.catalog.models import ServiceCategory, Service
from common.utils import generate_order_code

class ServiceRequest(models.Model):
    class Urgency(models.TextChoices):
        URGENT = "URGENT", "⚡ Shoshilinch (1-2 soatda)"
        TODAY = "TODAY", "Bugun kun davomida"
        TOMORROW = "TOMORROW", "Ertaga qulay vaqtda"

    class Status(models.TextChoices):
        DRAFT = "DRAFT", "Qoralama"
        OPEN = "OPEN", "Ochiq (Takliflar qabul qilinmoqda)"
        MATCHED = "MATCHED", "Ustalar tavsiya etildi"
        ASSIGNED = "ASSIGNED", "Usta biriktirildi"
        IN_PROGRESS = "IN_PROGRESS", "Ish bajarilmoqda"
        COMPLETED = "COMPLETED", "Yakunlandi"
        CANCELLED = "CANCELLED", "Bekor qilindi"
        DISPUTED = "DISPUTED", "Nizo holatida"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=20, unique=True, db_index=True)
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="service_requests",
        verbose_name="Mijoz",
    )
    category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.PROTECT,
        related_name="requests",
        verbose_name="Toifa",
    )
    service = models.ForeignKey(
        Service,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="requests",
        verbose_name="Xizmat",
    )
    title = models.CharField(max_length=200, blank=True)
    problem_description = models.TextField(verbose_name="Muammo tavsifi")
    detected_issues = models.JSONField(default=list, blank=True)
    answers = models.JSONField(default=dict, blank=True)

    city = models.CharField(max_length=100, default="Toshkent")
    district = models.CharField(max_length=100, default="Chilonzor")
    address_text = models.CharField(max_length=255, verbose_name="Manzil")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    urgency = models.CharField(
        max_length=20,
        choices=Urgency.choices,
        default=Urgency.URGENT,
    )
    urgency_text = models.CharField(max_length=100, default="⚡ Shoshilinch")
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN,
        db_index=True,
    )

    has_audio = models.BooleanField(default=False)
    audio_duration = models.CharField(max_length=20, blank=True)
    audio_url = models.URLField(max_length=500, blank=True)

    budget_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    budget_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    preferred_date = models.DateField(null=True, blank=True)
    preferred_time_slot = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Xizmat buyurtmasi"
        verbose_name_plural = "Xizmat buyurtmalari"
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        if not self.code:
            self.code = generate_order_code("UT")
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.code} - {self.category.name} ({self.customer.phone})"

class RequestAttachment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE, related_name="attachments")
    file_url = models.URLField(max_length=500, verbose_name="Fayl URL")
    file_type = models.CharField(max_length=20, default="image")
    original_name = models.CharField(max_length=255, blank=True)
    size_bytes = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

class RequestStatusHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE, related_name="status_history")
    old_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
