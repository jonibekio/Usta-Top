from django.contrib import admin
from .models import ServiceRequest, RequestAttachment, RequestStatusHistory

class AttachmentInline(admin.TabularInline):
    model = RequestAttachment
    extra = 0

class StatusHistoryInline(admin.TabularInline):
    model = RequestStatusHistory
    extra = 0
    readonly_fields = ("old_status", "new_status", "changed_by", "reason", "created_at")

@admin.register(ServiceRequest)
class ServiceRequestAdmin(admin.ModelAdmin):
    list_display = ("code", "customer", "category", "urgency", "status", "city", "district", "created_at")
    list_filter = ("status", "urgency", "category", "city")
    search_fields = ("code", "customer__phone", "problem_description", "address_text")
    inlines = [AttachmentInline, StatusHistoryInline]
