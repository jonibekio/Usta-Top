import uuid
from django.db import models
from django.conf import settings
from apps.locations.models import Region, District

class ProviderProfile(models.Model):
    class Status(models.TextChoices):
        PENDING = "PENDING", "Kutilmoqda"
        ACTIVE = "ACTIVE", "Faol"
        SUSPENDED = "SUSPENDED", "Vaqtinchalik to‘xtatilgan"
        BLOCKED = "BLOCKED", "Bloklangan"

    class VerificationStatus(models.TextChoices):
        PENDING = "PENDING", "Tekshiruvda"
        VERIFIED = "VERIFIED", "Tasdiqlangan"
        REJECTED = "REJECTED", "Rad etilgan"
        EXPIRED = "EXPIRED", "Muddati o‘tgan"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="provider_profile",
        verbose_name="Foydalanuvchi hisobi",
    )
    slug = models.SlugField(max_length=150, unique=True)
    display_name = models.CharField(max_length=150, verbose_name="Usta nomi")
    title = models.CharField(max_length=200, verbose_name="To‘liq mutaxassislik")
    short_title = models.CharField(max_length=100, blank=True, verbose_name="Qisqa mutaxassislik")
    cover_image = models.URLField(max_length=500, blank=True, verbose_name="Muqova rasm URL")
    about_text = models.TextField(blank=True, verbose_name="Usta haqida batafsil")
    experience_years = models.PositiveIntegerField(default=1, verbose_name="Tajriba yillari")

    rating_avg = models.DecimalField(max_digits=3, decimal_places=2, default=5.00, db_index=True, verbose_name="O‘rtacha reyting")
    review_count = models.PositiveIntegerField(default=0, verbose_name="Sharhlar soni")
    completed_jobs = models.PositiveIntegerField(default=0, db_index=True, verbose_name="Bajarilgan ishlar soni")
    response_minutes = models.PositiveIntegerField(default=30, verbose_name="Javob berish vaqti (daqiqa)")

    verification_status = models.CharField(
        max_length=20,
        choices=VerificationStatus.choices,
        default=VerificationStatus.PENDING,
        db_index=True,
    )
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.ACTIVE,
        db_index=True,
    )

    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, blank=True)
    district = models.ForeignKey(District, on_delete=models.SET_NULL, null=True, blank=True)
    city = models.CharField(max_length=100, default="Toshkent")
    district_text = models.CharField(max_length=100, default="Chilonzor")
    address_full = models.CharField(max_length=255, blank=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    price_min = models.DecimalField(max_digits=12, decimal_places=2, default=80000)
    price_max = models.DecimalField(max_digits=12, decimal_places=2, default=350000)

    available_time = models.CharField(max_length=100, default="Bugun 17:00 dan boshlab")
    is_online = models.BooleanField(default=True, db_index=True)
    warranty_months = models.PositiveIntegerField(default=12)

    quality_rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.90)
    punctuality_rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.80)
    price_fairness_rating = models.DecimalField(max_digits=3, decimal_places=2, default=4.90)

    vehicle_model = models.CharField(max_length=100, default="Cobalt oq")
    vehicle_plate = models.CharField(max_length=50, default="01 A 777 BA")

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Usta profili"
        verbose_name_plural = "Ustalar profillari"
        ordering = ["-rating_avg", "-completed_jobs"]

    def __str__(self):
        return f"{self.display_name} ({self.title})"

    @property
    def is_verified(self):
        return self.verification_status == self.VerificationStatus.VERIFIED

class ProviderService(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey(ProviderProfile, on_delete=models.CASCADE, related_name="services")
    service = models.ForeignKey("catalog.Service", on_delete=models.SET_NULL, null=True, blank=True)
    custom_name = models.CharField(max_length=150, verbose_name="Xizmat nomi")
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Narx (so‘m)")
    badge = models.CharField(max_length=50, blank=True)
    icon_name = models.CharField(max_length=50, default="Wrench")
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = "Usta xizmati"
        verbose_name_plural = "Usta xizmatlari"

    def __str__(self):
        return f"{self.custom_name} - {self.price} so'm ({self.provider.display_name})"

class ProviderPortfolio(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey(ProviderProfile, on_delete=models.CASCADE, related_name="portfolio")
    title = models.CharField(max_length=150)
    location = models.CharField(max_length=150, blank=True)
    image_url = models.URLField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Portfolio ishi"
        verbose_name_plural = "Portfolio ishlari"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.title} ({self.provider.display_name})"

class ProviderServiceArea(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey(ProviderProfile, on_delete=models.CASCADE, related_name="service_areas")
    district = models.ForeignKey(District, on_delete=models.CASCADE)
    radius_km = models.PositiveIntegerField(default=15)

    class Meta:
        unique_together = ("provider", "district")

class ProviderAvailability(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    provider = models.ForeignKey(ProviderProfile, on_delete=models.CASCADE, related_name="availabilities")
    weekday = models.PositiveSmallIntegerField(help_text="0=Dushanba, 6=Yakshanba")
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("provider", "weekday")
