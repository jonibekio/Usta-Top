from django.contrib import admin
from .models import (
    ProviderProfile,
    ProviderService,
    ProviderPortfolio,
)

class ProviderServiceInline(admin.TabularInline):
    model = ProviderService
    extra = 1

class ProviderPortfolioInline(admin.TabularInline):
    model = ProviderPortfolio
    extra = 1

@admin.register(ProviderProfile)
class ProviderProfileAdmin(admin.ModelAdmin):
    list_display = (
        "display_name",
        "title",
        "user",
        "rating_avg",
        "review_count",
        "completed_jobs",
        "verification_status",
        "status",
        "is_online",
    )
    list_filter = ("verification_status", "status", "is_online", "district")
    search_fields = ("display_name", "title", "user__phone", "about_text")
    prepopulated_fields = {"slug": ("display_name",)}
    inlines = [ProviderServiceInline, ProviderPortfolioInline]

@admin.register(ProviderService)
class ProviderServiceAdmin(admin.ModelAdmin):
    list_display = ("custom_name", "provider", "price", "is_active")
    list_filter = ("is_active",)
    search_fields = ("custom_name", "provider__display_name")
