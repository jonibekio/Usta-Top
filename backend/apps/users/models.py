import uuid
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models
from common.validators import validate_uz_phone
from .managers import UserManager

class User(AbstractBaseUser, PermissionsMixin):
    class Role(models.TextChoices):
        CUSTOMER = "CUSTOMER", "Mijoz"
        PROVIDER = "PROVIDER", "Usta"
        ADMIN = "ADMIN", "Admin"
        MODERATOR = "MODERATOR", "Moderator"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    phone = models.CharField(
        max_length=20,
        unique=True,
        db_index=True,
        validators=[validate_uz_phone],
        verbose_name="Telefon raqam",
    )
    email = models.EmailField(null=True, blank=True, verbose_name="Email")
    first_name = models.CharField(max_length=150, blank=True, verbose_name="Ism")
    last_name = models.CharField(max_length=150, blank=True, verbose_name="Familiya")
    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CUSTOMER,
        db_index=True,
        verbose_name="Rol",
    )
    avatar = models.URLField(max_length=500, blank=True, verbose_name="Avatar URL")
    is_active = models.BooleanField(default=True, verbose_name="Faol")
    is_staff = models.BooleanField(default=False, verbose_name="Xodim")
    is_verified = models.BooleanField(default=False, verbose_name="Tasdiqlangan")
    date_joined = models.DateTimeField(auto_now_add=True, verbose_name="Ro‘yxatdan o‘tgan sana")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Tahrirlangan sana")

    objects = UserManager()

    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = []

    class Meta:
        verbose_name = "Foydalanuvchi"
        verbose_name_plural = "Foydalanuvchilar"
        ordering = ["-date_joined"]

    @property
    def full_name(self):
        name = f"{self.first_name} {self.last_name}".strip()
        return name if name else self.phone

    def __str__(self):
        return f"{self.full_name} ({self.phone})"
