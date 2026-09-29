from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProviderViewSet, ProviderToggleOnlineView, ProviderDashboardStatsView, ProviderMeView

router = DefaultRouter()
router.register(r"providers", ProviderViewSet, basename="providers")

urlpatterns = [
    path("provider/me/", ProviderMeView.as_view(), name="provider-me"),
    path("provider/toggle-online/", ProviderToggleOnlineView.as_view(), name="provider-toggle-online"),
    path("provider/dashboard-stats/", ProviderDashboardStatsView.as_view(), name="provider-dashboard-stats"),
    path("", include(router.urls)),
]
