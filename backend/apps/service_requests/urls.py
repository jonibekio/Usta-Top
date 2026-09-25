from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceRequestViewSet, RequestAttachmentUploadView

router = DefaultRouter()
router.register(r"requests", ServiceRequestViewSet, basename="requests")

urlpatterns = [
    path("requests/<str:pk>/attachments/", RequestAttachmentUploadView.as_view(), name="request-upload-attachment"),
    path("", include(router.urls)),
]
