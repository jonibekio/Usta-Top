from django.urls import path
from .views import AdminStatsView, PlatformOverviewView

urlpatterns = [
    path("admin/analytics/", AdminStatsView.as_view(), name="admin-analytics"),
    path("admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
    path("analytics/overview/", PlatformOverviewView.as_view(), name="platform-overview"),
]
