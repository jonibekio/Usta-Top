from django.contrib import admin
from .models import Region, District, Address

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    prepopulated_fields = {"slug": ("name",)}
    search_fields = ("name",)

@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ("name", "region", "slug")
    list_filter = ("region",)
    search_fields = ("name", "region__name")
    prepopulated_fields = {"slug": ("name",)}

@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = ("address_text", "user", "district", "region", "is_default")
    list_filter = ("is_default", "region")
    search_fields = ("address_text", "user__phone", "user__first_name")
