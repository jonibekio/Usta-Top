import uuid
from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.bookings.models import Booking
from apps.providers.models import ProviderProfile

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE, related_name="review", verbose_name="Buyurtma")
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="given_reviews", verbose_name="Mijoz")
    provider = models.ForeignKey(ProviderProfile, on_delete=models.CASCADE, related_name="received_reviews", verbose_name="Usta")

    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        verbose_name="Umumiy baho (1-5)",
    )
    quality_rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    punctuality_rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    price_rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)

    service_title = models.CharField(max_length=200, default="Konditsioner ta'miri")
    location_text = models.CharField(max_length=150, default="Chilonzor")
    comment = models.TextField(verbose_name="Mijoz fikri")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Sharh va baho"
        verbose_name_plural = "Sharhlar va baholar"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.customer.full_name} -> {self.provider.display_name}: {self.rating}★"
