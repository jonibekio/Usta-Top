from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "amount", "currency", "provider", "status", "created_at")
    list_filter = ("provider", "status")
    search_fields = ("user__phone", "idempotency_key", "external_id")
