import uuid
from django.db import models
from django.conf import settings
from apps.service_requests.models import ServiceRequest
from apps.quotes.models import Quote
from apps.providers.models import ProviderProfile

class Booking(models.Model):
    class Status(models.TextChoices):
        CREATED = "CREATED", "Yaratildi"
        CONFIRMED = "CONFIRMED", "Tasdiqlandi"
        IN_TRANSIT = "IN_TRANSIT", "Usta yo‘lda"
        IN_PROGRESS = "IN_PROGRESS", "Ish jarayonda"
        COMPLETED = "COMPLETED", "Bajarildi"
        CANCELLED = "CANCELLED", "Bekor qilindi"

    class PaymentMethod(models.TextChoices):
        CASH = "CASH", "Naqd pul"
        CARD = "CARD", "Plastik karta"
        ESCROW = "ESCROW", "Xavfsiz depozit"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order_number = models.CharField(max_length=50, unique=True, db_index=True)
    request = models.ForeignKey(ServiceRequest, on_delete=models.CASCADE, related_name="bookings")
    quote = models.ForeignKey(Quote, on_delete=models.SET_NULL, null=True, blank=True, related_name="bookings")
    customer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="customer_bookings")
    provider = models.ForeignKey(ProviderProfile, on_delete=models.CASCADE, related_name="provider_bookings")

    service_name = models.CharField(max_length=200, default="Konditsioner ta'miri")
    total_price = models.DecimalField(max_digits=12, decimal_places=2)

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.IN_TRANSIT,
        db_index=True,
    )
    status_text = models.CharField(max_length=100, default="Usta yo‘lda")

    scheduled_time = models.CharField(max_length=150, default="Bugun, 17:30 – 19:30")
    estimated_arrival = models.CharField(max_length=50, default="17:50")
    estimated_minutes_left = models.PositiveIntegerField(default=10)

    vehicle_model = models.CharField(max_length=100, default="Cobalt")
    vehicle_color = models.CharField(max_length=50, default="Oq")
    vehicle_plate = models.CharField(max_length=50, default="01 A 777 BA")

    destination_address = models.CharField(max_length=255, default="Chilonzor tumani, 9-mavze, 14-uy")
    distance_km = models.FloatField(default=3.2)

    payment_method = models.CharField(
        max_length=20,
        choices=PaymentMethod.choices,
        default=PaymentMethod.ESCROW,
    )
    is_paid = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Buyurtma"
        verbose_name_plural = "Buyurtmalar"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.order_number} ({self.status}) - {self.total_price} so'm"

class BookingTimelineStep(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="timeline_steps")
    title = models.CharField(max_length=150)
    subtitle = models.CharField(max_length=200, blank=True)
    timestamp_text = models.CharField(max_length=50, blank=True)
    completed = models.BooleanField(default=False)
    current = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order"]

class BookingStatusHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="status_history")
    old_status = models.CharField(max_length=20)
    new_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True)
    reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
