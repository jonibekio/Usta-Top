from django.urls import path
from .views import FavoriteProvidersListView, ManageFavoriteProviderView

urlpatterns = [
    path("favorites/", FavoriteProvidersListView.as_view(), name="favorites-list-alias"),
    path("favorites/<str:provider_id>/", ManageFavoriteProviderView.as_view(), name="favorite-manage-alias"),
    path("favorites/providers/", FavoriteProvidersListView.as_view(), name="favorites-list"),
    path("favorites/providers/<str:provider_id>/", ManageFavoriteProviderView.as_view(), name="favorite-manage"),
]
