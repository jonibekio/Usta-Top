from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ("phone", "full_name", "role", "is_verified", "is_active", "date_joined")
    list_filter = ("role", "is_verified", "is_active", "is_staff")
    search_fields = ("phone", "first_name", "last_name", "email")
    ordering = ("-date_joined",)
    fieldsets = (
        (None, {"fields": ("phone", "password")}),
        ("Shaxsiy ma’lumotlar", {"fields": ("first_name", "last_name", "email", "avatar")}),
        ("Ruxsatlar va Rol", {"fields": ("role", "is_verified", "is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Muhim sanalar", {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("phone", "password", "role", "first_name", "last_name"),
        }),
    )
