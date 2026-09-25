from rest_framework import viewsets, permissions
from .models import Region, District, Address
from .serializers import RegionSerializer, DistrictSerializer, AddressSerializer

class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Region.objects.prefetch_related("districts").all()
    serializer_class = RegionSerializer
    permission_classes = [permissions.AllowAny]

class DistrictViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = District.objects.select_related("region").all()
    serializer_class = DistrictSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ["region__slug", "region__id"]

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
