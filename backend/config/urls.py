from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
    SpectacularRedocView,
)

def health_check(request):
    return JsonResponse({"status": "ok", "service": "usta_top_backend", "version": "1.0.0"})

def health_ready(request):
    from django.db import connection
    try:
        connection.ensure_connection()
        db_ok = True
    except Exception:
        db_ok = False

    return JsonResponse({
        "status": "ready" if db_ok else "unhealthy",
        "database": db_ok,
    })

api_v1_patterns = [
    path("auth/", include("apps.users.urls")),
    path("", include("apps.locations.urls")),
    path("", include("apps.catalog.urls")),
    path("", include("apps.providers.urls")),
    path("", include("apps.service_requests.urls")),
    path("", include("apps.matching.urls")),
    path("", include("apps.quotes.urls")),
    path("", include("apps.bookings.urls")),
    path("", include("apps.conversations.urls")),
    path("", include("apps.reviews.urls")),
    path("", include("apps.favorites.urls")),
    path("", include("apps.disputes.urls")),
    path("", include("apps.verification.urls")),
    path("", include("apps.notifications.urls")),
    path("", include("apps.payments.urls")),
    path("", include("apps.promotions.urls")),
    path("", include("apps.analytics.urls")),
    path("", include("apps.ai_intake.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    path("health/", health_check, name="health-check"),
    path("health/ready/", health_ready, name="health-ready"),
    path("api/v1/", include(api_v1_patterns)),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="swagger-ui"),
    path("api/redoc/", SpectacularRedocView.as_view(url_name="schema"), name="redoc"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
