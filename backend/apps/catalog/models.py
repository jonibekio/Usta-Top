import uuid
from django.db import models

class ServiceCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    parent = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="children",
        verbose_name="Yuqori toifa",
    )
    name = models.CharField(max_length=150, verbose_name="Toifa nomi")
    slug = models.SlugField(max_length=150, unique=True)
    description = models.TextField(blank=True, verbose_name="Tavsif")
    icon = models.CharField(max_length=50, default="Wrench", verbose_name="Ikonka nomi")
    image = models.URLField(max_length=500, blank=True, verbose_name="Rasm URL")
    masters_count = models.PositiveIntegerField(default=0, verbose_name="Ustalar soni")
    featured = models.BooleanField(default=False, verbose_name="Asosiy ekranda ko‘rsatish")
    is_active = models.BooleanField(default=True, verbose_name="Faol")
    sort_order = models.PositiveIntegerField(default=0, verbose_name="Tartib")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Xizmat toifasi"
        verbose_name_plural = "Xizmat toifalari"
        ordering = ["sort_order", "name"]

    def __str__(self):
        return self.name

class Service(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(
        ServiceCategory,
        on_delete=models.CASCADE,
        related_name="services",
        verbose_name="Kategoriya",
    )
    name = models.CharField(max_length=150, verbose_name="Xizmat nomi")
    slug = models.SlugField(max_length=150)
    description = models.TextField(blank=True, verbose_name="Tavsif")
    base_price = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        verbose_name="Boshlang‘ich narx (so‘m)",
    )
    is_active = models.BooleanField(default=True, verbose_name="Faol")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Xizmat"
        verbose_name_plural = "Xizmatlar"
        unique_together = ("category", "slug")
        ordering = ["name"]

    def __str__(self):
        return f"{self.name} ({self.category.name})"
