import uuid
from django.db import models
from django.utils import timezone

class Promotion(models.Model):
    class DiscountType(models.TextChoices):
        PERCENTAGE = "PERCENTAGE", "Foiz (%)"
        FIXED = "FIXED", "Aniq summa (so‘m)"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=50, unique=True, db_index=True)
    description = models.CharField(max_length=255, blank=True)
    discount_type = models.CharField(max_length=20, choices=DiscountType.choices, default=DiscountType.PERCENTAGE)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    max_discount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    min_order_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    starts_at = models.DateTimeField(default=timezone.now)
    ends_at = models.DateTimeField(null=True, blank=True)
    usage_limit = models.PositiveIntegerField(default=1000)
    used_count = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True, db_index=True)

    def is_valid(self, order_amount: float = 0):
        now = timezone.now()
        if not self.is_active:
            return False, "Promokod faol emas."
        if self.ends_at and self.ends_at < now:
            return False, "Promokod muddati o‘tgan."
        if self.used_count >= self.usage_limit:
            return False, "Promokod ishlatilish chegarasiga yetgan."
        if order_amount < float(self.min_order_amount):
            return False, f"Minimal buyurtma summasi {self.min_order_amount} so‘m bo‘lishi kerak."
        return True, "Yaroqli"

    def calculate_discount(self, order_amount: float) -> float:
        if self.discount_type == self.DiscountType.PERCENTAGE:
            discount = order_amount * (float(self.value) / 100.0)
            if self.max_discount:
                discount = min(discount, float(self.max_discount))
            return discount
        else:
            return min(float(self.value), order_amount)
