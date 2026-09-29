from rest_framework import serializers
from .models import Region, District, Neighborhood, Address

class NeighborhoodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Neighborhood
        fields = ["id", "name", "slug"]

class DistrictSerializer(serializers.ModelSerializer):
    neighborhoods = NeighborhoodSerializer(many=True, read_only=True)

    class Meta:
        model = District
        fields = ["id", "name", "slug", "neighborhoods"]

class RegionSerializer(serializers.ModelSerializer):
    districts = DistrictSerializer(many=True, read_only=True)

    class Meta:
        model = Region
        fields = ["id", "name", "slug", "districts"]

class AddressSerializer(serializers.ModelSerializer):
    regionName = serializers.CharField(source="region.name", read_only=True)
    districtName = serializers.CharField(source="district.name", read_only=True)
    neighborhoodName = serializers.CharField(source="neighborhood.name", read_only=True)

    class Meta:
        model = Address
        fields = [
            "id",
            "region",
            "district",
            "neighborhood",
            "regionName",
            "districtName",
            "neighborhoodName",
            "address_text",
            "landmark",
            "latitude",
            "longitude",
            "is_default",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
