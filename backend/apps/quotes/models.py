import uuid
from django.db import models
from apps.service_requests.models import ServiceRequest
from apps.providers.models import ProviderProfile

class Quote(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Kutilmoqda"
        ACCEPTED = "ACCEPTED", "Qabul qilindi"
        REJECTED = "REJECTED", "Rad etildi"
        EXPIRED = "EXPIRED", "Muddati o‘tgan"
        WITHDRAWN = "WITHDRAWN", "Qaytarib olingan"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE, related_name="quotes", verbose_name="Buyurtma")
    provider = models.ForeignKey(ProviderProfile, on_delete=models.CASCADE, related_name="quotes", verbose_name="Usta")

    labor_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Xizmat haqi (so‘m)")
    parts_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Ehtiyot qismlar narxi (so‘m)")
    additional_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0, verbose_name="Qo‘shimcha xarajatlar (so‘m)")
    total_amount = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Umumiy narx (so‘m)")

    arrival_time = models.CharField(max_length=150, verbose_name="Yetib borish vaqti")
    warranty = models.CharField(max_length=150, default="12 oy kafolat", verbose_name="Kafolat muddati")
    notes = models.TextField(blank=True, verbose_name="Izoh")

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
        db_index=True,
    )

    expires_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Smeta taklifi"
        verbose_name_plural = "Smeta takliflari"
        unique_together = ("request", "provider")
        ordering = ["-created_at"]

    def save(self, *args, **kwargs):
        self.total_amount = self.labor_amount + self.parts_amount + self.additional_amount
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.provider.display_name} -> {self.request.code}: {self.total_amount} so'm ({self.status})"

class QuoteItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE, related_name="items")
    title = models.CharField(max_length=200)
    quantity = models.PositiveIntegerField(default=1)
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)

    def save(self, *args, **kwargs):
        self.total_price = self.quantity * self.unit_price
        super().save(*args, **kwargs)
