from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegionViewSet, DistrictViewSet, AddressViewSet

router = DefaultRouter()
router.register(r"regions", RegionViewSet, basename="regions")
router.register(r"districts", DistrictViewSet, basename="districts")
router.register(r"addresses", AddressViewSet, basename="addresses")

urlpatterns = [
    path("", include(router.urls)),
]
