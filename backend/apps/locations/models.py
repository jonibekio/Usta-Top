import uuid
from django.db import models
from django.conf import settings

class Region(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True, verbose_name="Viloyat/Shahar")
    slug = models.SlugField(max_length=100, unique=True)

    class Meta:
        verbose_name = "Viloyat / Shahar"
        verbose_name_plural = "Viloyatlar va Shaharlar"
        ordering = ["name"]

    def __str__(self):
        return self.name

class District(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name="districts", verbose_name="Viloyat")
    name = models.CharField(max_length=100, verbose_name="Tuman/Shahar")
    slug = models.SlugField(max_length=100)

    class Meta:
        verbose_name = "Tuman"
        verbose_name_plural = "Tumanlar"
        unique_together = ("region", "slug")
        ordering = ["name"]

    def __str__(self):
        return f"{self.name}, {self.region.name}"

class Address(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="addresses", verbose_name="Foydalanuvchi")
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Viloyat")
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Tuman")
    address_text = models.CharField(max_length=255, verbose_name="To‘liq manzil")
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, verbose_name="Kenglik")
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True, verbose_name="Uzunlik")
    is_default = models.BooleanField(default=False, verbose_name="Asosiy manzil")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Manzil"
        verbose_name_plural = "Manzillar"
        ordering = ["-is_default", "-created_at"]

    def save(self, *args, **kwargs):
        if self.is_default:
            Address.objects.filter(user=self.user, is_default=True).exclude(pk=self.pk).update(is_default=False)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.address_text
