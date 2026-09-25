from django.urls import path
from .views import RequestMatchesView

urlpatterns = [
    path("requests/<str:pk>/matches/", RequestMatchesView.as_view(), name="request-matches"),
]
