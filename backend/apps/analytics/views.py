from django.db.models import Sum
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from common.utils import standard_response
from common.permissions import IsAdmin
from apps.users.models import User
from apps.providers.models import ProviderProfile
from apps.bookings.models import Booking
from apps.disputes.models import Dispute
from apps.verification.models import ProviderVerification
from apps.catalog.models import ServiceCategory

class AdminStatsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        total_users = User.objects.count()
        total_providers = ProviderProfile.objects.count()
        total_orders = Booking.objects.count()
        completed_orders = Booking.objects.filter(status=Booking.Status.COMPLETED).count()
        gross_rev = Booking.objects.filter(status=Booking.Status.COMPLETED).aggregate(s=Sum("total_price"))["s"] or 0
        active_disputes = Dispute.objects.filter(status=Dispute.Status.OPEN).count()
        pending_verifications = ProviderVerification.objects.filter(status=ProviderVerification.Status.PENDING).count()

        return standard_response(
            data={
                "totalUsers": total_users,
                "totalProviders": total_providers,
                "totalOrders": total_orders,
                "completedOrders": completed_orders,
                "grossRevenue": int(gross_rev),
                "activeDisputes": active_disputes,
                "pendingVerifications": pending_verifications,
            }
        )

class PlatformOverviewView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        total_providers = ProviderProfile.objects.filter(status=ProviderProfile.Status.ACTIVE).count()
        completed_jobs = Booking.objects.filter(status=Booking.Status.COMPLETED).count()
        total_categories = ServiceCategory.objects.filter(is_active=True).count()

        return standard_response(
            data={
                "totalProviders": total_providers,
                "completedJobs": completed_jobs,
                "totalCategories": total_categories,
            }
        )
