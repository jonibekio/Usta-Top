from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegionViewSet, DistrictViewSet, NeighborhoodViewSet, AddressViewSet, LocationHierarchyView

router = DefaultRouter()
router.register(r"regions", RegionViewSet, basename="regions")
router.register(r"districts", DistrictViewSet, basename="districts")
router.register(r"neighborhoods", NeighborhoodViewSet, basename="neighborhoods")
router.register(r"addresses", AddressViewSet, basename="addresses")

urlpatterns = [
    path("hierarchy/", LocationHierarchyView.as_view(), name="location-hierarchy"),
    path("", include(router.urls)),
]
