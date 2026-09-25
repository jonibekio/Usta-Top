from django.urls import path
from .views import CreateBookingReviewView, ProviderReviewsListView

urlpatterns = [
    path("bookings/<str:booking_id>/review/", CreateBookingReviewView.as_view(), name="booking-review"),
    path("providers/<str:provider_id>/reviews/", ProviderReviewsListView.as_view(), name="provider-reviews"),
]
