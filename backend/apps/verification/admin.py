from django.contrib import admin
from .models import ProviderVerification

@admin.register(ProviderVerification)
class ProviderVerificationAdmin(admin.ModelAdmin):
    list_display = ("provider", "category_name", "passport_serial", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("provider__display_name", "passport_serial")
