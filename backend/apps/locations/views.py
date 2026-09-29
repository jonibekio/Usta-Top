from rest_framework import viewsets, permissions
from rest_framework.views import APIView
from common.utils import standard_response
from .models import Region, District, Neighborhood, Address
from .serializers import RegionSerializer, DistrictSerializer, NeighborhoodSerializer, AddressSerializer

class RegionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Region.objects.prefetch_related("districts__neighborhoods").all()
    serializer_class = RegionSerializer
    permission_classes = [permissions.AllowAny]

class DistrictViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = District.objects.select_related("region").prefetch_related("neighborhoods").all()
    serializer_class = DistrictSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ["region__slug", "region__id"]

class NeighborhoodViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Neighborhood.objects.select_related("district", "district__region").all()
    serializer_class = NeighborhoodSerializer
    permission_classes = [permissions.AllowAny]
    filterset_fields = ["district__slug", "district__id"]

class LocationHierarchyView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        regions = Region.objects.prefetch_related("districts__neighborhoods").all()
        data = []
        for r in regions:
            data.append({
                "id": str(r.id),
                "name": r.name,
                "slug": r.slug,
                "districts": [
                    {
                        "id": str(d.id),
                        "name": d.name,
                        "slug": d.slug,
                        "neighborhoods": [
                            {"id": str(n.id), "name": n.name, "slug": n.slug}
                            for n in d.neighborhoods.all()
                        ]
                    }
                    for d in r.districts.all()
                ]
            })
        return standard_response(data=data)

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
