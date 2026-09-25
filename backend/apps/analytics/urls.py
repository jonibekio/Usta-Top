from django.urls import path
from .views import AdminStatsView

urlpatterns = [
    path("admin/analytics/", AdminStatsView.as_view(), name="admin-analytics"),
    path("admin/stats/", AdminStatsView.as_view(), name="admin-stats"),
]
