import uuid
from django.db import models
from django.conf import settings

class Notification(models.Model):
    class NotificationType(models.TextChoices):
        NEW_REQUEST = "NEW_REQUEST", "Yangi buyurtma"
        NEW_QUOTE = "NEW_QUOTE", "Yangi smeta taklifi"
        QUOTE_ACCEPTED = "QUOTE_ACCEPTED", "Taklif qabul qilindi"
        BOOKING_CONFIRMED = "BOOKING_CONFIRMED", "Buyurtma tasdiqlandi"
        BOOKING_CANCELLED = "BOOKING_CANCELLED", "Buyurtma bekor qilindi"
        BOOKING_STARTED = "BOOKING_STARTED", "Ish boshlandi"
        BOOKING_COMPLETED = "BOOKING_COMPLETED", "Ish yakunlandi"
        NEW_MESSAGE = "NEW_MESSAGE", "Yangi xabar"
        NEW_REVIEW = "NEW_REVIEW", "Yangi sharh"
        DISPUTE_UPDATED = "DISPUTE_UPDATED", "Nizo holati yangilandi"
        VERIFICATION_UPDATED = "VERIFICATION_UPDATED", "Verifikatsiya natijasi"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notifications")
    notification_type = models.CharField(max_length=30, choices=NotificationType.choices, db_index=True)
    title = models.CharField(max_length=200)
    body = models.TextField()
    data = models.JSONField(default=dict, blank=True)
    is_read = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user.phone} - {self.title} ({'O‘qilgan' if self.is_read else 'Yangi'})"
