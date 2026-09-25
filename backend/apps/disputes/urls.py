from django.urls import path
from .views import CreateBookingDisputeView, DisputeListView, ResolveDisputeView

urlpatterns = [
    path("bookings/<str:booking_id>/disputes/", CreateBookingDisputeView.as_view(), name="booking-dispute-create"),
    path("disputes/", DisputeListView.as_view(), name="disputes-list"),
    path("disputes/<str:pk>/resolve/", ResolveDisputeView.as_view(), name="dispute-resolve"),
]
