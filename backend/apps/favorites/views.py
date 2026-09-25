from rest_framework import permissions, status
from rest_framework.views import APIView
from common.utils import standard_response
from apps.providers.models import ProviderProfile
from .models import FavoriteProvider
from .serializers import FavoriteProviderSerializer

class FavoriteProvidersListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        favs = FavoriteProvider.objects.filter(customer=request.user).select_related("provider", "provider__user")
        serializer = FavoriteProviderSerializer(favs, many=True)
        return standard_response(data=serializer.data)

class ManageFavoriteProviderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, provider_id):
        provider = ProviderProfile.objects.get(id=provider_id)
        fav, created = FavoriteProvider.objects.get_or_create(customer=request.user, provider=provider)
        return standard_response(
            data={"isFavorited": True},
            message="Usta sevimlilarga qo‘shildi.",
            status_code=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

    def delete(self, request, provider_id):
        FavoriteProvider.objects.filter(customer=request.user, provider_id=provider_id).delete()
        return standard_response(
            data={"isFavorited": False},
            message="Usta sevimlilardan o‘chirildi.",
        )
