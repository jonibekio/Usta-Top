from django.contrib import admin
from .models import Booking, BookingTimelineStep, BookingStatusHistory

class TimelineStepInline(admin.TabularInline):
    model = BookingTimelineStep
    extra = 1

class StatusHistoryInline(admin.TabularInline):
    model = BookingStatusHistory
    extra = 0
    readonly_fields = ("old_status", "new_status", "changed_by", "reason", "created_at")

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ("order_number", "customer", "provider", "service_name", "total_price", "status", "payment_method", "is_paid", "created_at")
    list_filter = ("status", "payment_method", "is_paid")
    search_fields = ("order_number", "customer__phone", "provider__display_name", "destination_address")
    inlines = [TimelineStepInline, StatusHistoryInline]
