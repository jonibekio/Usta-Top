from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser
from common.utils import standard_response
from common.validators import validate_file_upload
from .models import ServiceRequest
from .serializers import ServiceRequestSerializer, CreateServiceRequestSerializer
from .services import transition_request_status

class ServiceRequestViewSet(viewsets.ModelViewSet):
    queryset = ServiceRequest.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.action == "create":
            return CreateServiceRequestSerializer
        return ServiceRequestSerializer

    def get_queryset(self):
        if getattr(self, "swagger_fake_view", False) or not self.request.user.is_authenticated:
            return ServiceRequest.objects.none()
        user = self.request.user
        if user.role == "ADMIN" or user.is_staff:
            return ServiceRequest.objects.all().select_related("category", "customer").prefetch_related("attachments")
        elif user.role == "PROVIDER":
            # Providers see published/open requests in their region or general stream
            return ServiceRequest.objects.filter(
                status__in=[ServiceRequest.Status.OPEN, ServiceRequest.Status.MATCHED]
            ).select_related("category", "customer").prefetch_related("attachments")
        else:
            # Customers see only their own requests
            return ServiceRequest.objects.filter(customer=user).select_related("category", "customer").prefetch_related("attachments")

    def get_object(self):
        lookup_val = self.kwargs.get("pk")
        qs = self.get_queryset()
        try:
            return qs.get(id=lookup_val)
        except Exception:
            from rest_framework.exceptions import NotFound
            try:
                return qs.get(code=lookup_val)
            except Exception:
                raise NotFound("Xizmat so‘rovi topilmadi.")

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        instance = serializer.save()
        output_serializer = ServiceRequestSerializer(instance)
        return standard_response(
            data=output_serializer.data,
            message="Xizmat buyurtmasi muvaffaqiyatli yaratildi.",
            status_code=status.HTTP_201_CREATED,
        )

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        req = self.get_object()
        reason = request.data.get("reason", "Mijoz tomonidan bekor qilindi")
        transition_request_status(req, ServiceRequest.Status.CANCELLED, request.user, reason)
        return standard_response(message="Buyurtma bekor qilindi.")

class RequestAttachmentUploadView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, pk=None):
        file_obj = request.FILES.get("file")
        if not file_obj:
            return standard_response(message="Fayl yuklanmadi", success=False, status_code=status.HTTP_400_BAD_REQUEST)

        file_category = request.data.get("type", "image")
        validate_file_upload(file_obj, file_category=file_category)

        # In production S3 or media storage
        from django.core.files.storage import default_storage
        saved_path = default_storage.save(f"attachments/{file_obj.name}", file_obj)
        file_url = f"/media/{saved_path}"

        return standard_response(
            data={"url": file_url, "name": file_obj.name, "size": file_obj.size},
            message="Fayl muvaffaqiyatli yuklandi."
        )
