from rest_framework import permissions, status
from rest_framework.views import APIView
from common.utils import standard_response
from .models import Review
from .serializers import ReviewSerializer, CreateReviewSerializer
from .services import create_review_service

class CreateBookingReviewView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, booking_id):
        serializer = CreateReviewSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        review = create_review_service(booking_id, request.user, serializer.validated_data)
        return standard_response(
            data=ReviewSerializer(review).data,
            message="Sharhingiz muvaffaqiyatli qabul qilindi. Rahmat!",
            status_code=status.HTTP_201_CREATED,
        )

class ProviderReviewsListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, provider_id):
        reviews = Review.objects.filter(provider__id=provider_id).select_related("customer", "provider")
        serializer = ReviewSerializer(reviews, many=True)
        return standard_response(data=serializer.data)
