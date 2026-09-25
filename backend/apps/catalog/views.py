from rest_framework import viewsets
from common.permissions import IsAdminOrReadOnly
from .models import ServiceCategory, Service
from .serializers import ServiceCategorySerializer, ServiceSerializer

class ServiceCategoryViewSet(viewsets.ModelViewSet):
    queryset = ServiceCategory.objects.filter(is_active=True).prefetch_related("services").order_by("sort_order")
    serializer_class = ServiceCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = "slug"
    filterset_fields = ["featured", "slug"]
    search_fields = ["name", "description"]

    def get_object(self):
        lookup_url_kwarg = self.lookup_url_kwarg or self.lookup_field
        lookup_value = self.kwargs[lookup_url_kwarg]
        # Allow looking up by uuid or slug
        try:
            return ServiceCategory.objects.get(id=lookup_value)
        except Exception:
            return super().get_object()

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.filter(is_active=True).select_related("category").order_by("name")
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminOrReadOnly]
    filterset_fields = ["category__slug", "category__id", "is_active"]
    search_fields = ["name", "description"]
