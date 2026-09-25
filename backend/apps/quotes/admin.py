from django.contrib import admin
from .models import Quote, QuoteItem

class QuoteItemInline(admin.TabularInline):
    model = QuoteItem
    extra = 1

@admin.register(Quote)
class QuoteAdmin(admin.ModelAdmin):
    list_display = ("request", "provider", "total_amount", "arrival_time", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("request__code", "provider__display_name")
    inlines = [QuoteItemInline]
