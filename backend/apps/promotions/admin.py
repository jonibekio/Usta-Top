from django.contrib import admin
from .models import Promotion

@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ("code", "discount_type", "value", "is_active", "used_count", "usage_limit")
    list_filter = ("discount_type", "is_active")
    search_fields = ("code", "description")
