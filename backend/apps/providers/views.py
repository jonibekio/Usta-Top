from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.decorators import action
from common.utils import standard_response
from common.permissions import IsProvider
from .serializers import ProviderSerializer, ProviderServiceItemSerializer, ProviderPortfolioItemSerializer
from .selectors import list_providers, get_provider_by_id_or_slug
from .services import toggle_online_status

class ProviderViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ProviderSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        params = self.request.query_params
        category = params.get("category")
        search = params.get("search")
        region = params.get("region")
        district = params.get("district")
        min_price = params.get("minPrice")
        max_price = params.get("maxPrice")
        min_rating = params.get("minRating")
        experience_years = params.get("experienceYears")
        is_online = params.get("isOnline", "").lower() in ("true", "1")
        verified_only = params.get("verifiedOnly", "").lower() in ("true", "1")
        ordering = params.get("ordering")

        return list_providers(
            search=search,
            category=category,
            region=region,
            district=district,
            min_price=min_price,
            max_price=max_price,
            min_rating=min_rating,
            experience_years=experience_years,
            is_online=is_online if is_online else None,
            verified_only=verified_only,
            ordering=ordering,
        )

    def get_object(self):
        lookup_val = self.kwargs.get("pk")
        return get_provider_by_id_or_slug(lookup_val)

    @action(detail=True, methods=["get"])
    def services(self, request, pk=None):
        provider = self.get_object()
        services = provider.services.filter(is_active=True)
        serializer = ProviderServiceItemSerializer(services, many=True)
        return standard_response(data=serializer.data)

    @action(detail=True, methods=["get"])
    def portfolio(self, request, pk=None):
        provider = self.get_object()
        portfolio = provider.portfolio.all()
        serializer = ProviderPortfolioItemSerializer(portfolio, many=True)
        return standard_response(data=serializer.data)

class ProviderToggleOnlineView(APIView):
    permission_classes = [IsProvider]

    def post(self, request):
        provider = request.user.provider_profile
        new_status = toggle_online_status(provider)
        return standard_response(
            data={"isOnline": new_status},
            message=f"Ish holati {'onlayn' if new_status else 'oflayn'} rejimiga o‘tkazildi."
        )

class ProviderDashboardStatsView(APIView):
    permission_classes = [IsProvider]

    def get(self, request):
        provider = getattr(request.user, "provider_profile", None)
        if not provider:
            return standard_response(
                data={"error": "Usta profili topilmadi"},
                status_code=status.HTTP_404_NOT_FOUND,
            )

        from django.db.models import Sum
        from apps.bookings.models import Booking
        from apps.quotes.models import Quote

        completed_bookings = Booking.objects.filter(
            provider=provider,
            status=Booking.Status.COMPLETED
        )
        total_earnings = completed_bookings.aggregate(s=Sum("total_price"))["s"] or 0
        completed_count = completed_bookings.count()

        active_jobs = Booking.objects.filter(
            provider=provider,
            status__in=[Booking.Status.IN_TRANSIT, Booking.Status.IN_PROGRESS]
        ).count()

        pending_quotes = Quote.objects.filter(
            provider=provider,
            status=Quote.Status.PENDING
        ).count()

        return standard_response(
            data={
                "weeklyEarnings": int(total_earnings),
                "weeklyJobs": completed_count,
                "completedJobs": provider.completed_jobs or completed_count,
                "rating": float(provider.rating_avg),
                "reviewCount": provider.review_count,
                "activeJobsCount": active_jobs,
                "pendingQuotesCount": pending_quotes,
                "isOnline": provider.is_online,
                "verificationStatus": provider.verification_status,
            }
        )

class ProviderMeView(APIView):
    permission_classes = [IsProvider]

    def get(self, request):
        provider = getattr(request.user, "provider_profile", None)
        if not provider:
            return standard_response(
                message="Usta profili topilmadi",
                success=False,
                status_code=status.HTTP_404_NOT_FOUND,
            )
        serializer = ProviderSerializer(provider)
        return standard_response(data=serializer.data)

    def patch(self, request):
        provider = getattr(request.user, "provider_profile", None)
        if not provider:
            return standard_response(
                message="Usta profili topilmadi",
                success=False,
                status_code=status.HTTP_404_NOT_FOUND,
            )

        for field in [
            "title", "short_title", "display_name", "about_text",
            "experience_years", "city", "district_text", "address_full",
            "price_min", "price_max", "available_time", "warranty_months"
        ]:
            if field in request.data:
                setattr(provider, field, request.data[field])
        provider.save()
        serializer = ProviderSerializer(provider)
        return standard_response(data=serializer.data, message="Profil ma'lumotlari muvaffaqiyatli saqlandi.")
