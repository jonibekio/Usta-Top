import pytest
from rest_framework.test import APIClient
from apps.users.models import User
from apps.catalog.models import ServiceCategory
from apps.providers.models import ProviderProfile, ProviderService
from apps.service_requests.models import ServiceRequest
from apps.quotes.models import Quote
from apps.quotes.services import accept_quote_service
from apps.bookings.models import Booking
from apps.bookings.services import advance_booking_status
from apps.reviews.services import create_review_service
from apps.matching.services.matcher import calculate_provider_score
from common.exceptions import BusinessLogicError

@pytest.mark.django_db
class TestBusinessFlows:
    def setup_method(self):
        self.client = APIClient()

        # Customer
        self.customer = User.objects.create_user(
            phone="+998905554433",
            password="customerPassword123",
            first_name="Sardor",
            role=User.Role.CUSTOMER,
        )

        # Provider user & profile
        self.provider_user = User.objects.create_user(
            phone="+998907778899",
            password="providerPassword123",
            first_name="Ali",
            role=User.Role.PROVIDER,
        )
        self.provider = ProviderProfile.objects.create(
            user=self.provider_user,
            slug="ali-usta",
            display_name="Ali Usta",
            title="Konditsioner ustasi",
            district_text="Chilonzor",
            city="Toshkent",
            experience_years=8,
            completed_jobs=127,
            rating_avg=4.90,
            verification_status=ProviderProfile.VerificationStatus.VERIFIED,
            status=ProviderProfile.Status.ACTIVE,
        )

        # Category
        self.category = ServiceCategory.objects.create(
            name="Konditsioner",
            slug="konditsioner",
            icon="Snowflake",
        )

        ProviderService.objects.create(
            provider=self.provider,
            custom_name="Konditsioner ta'miri",
            price=150000,
        )

    def test_provider_listing_and_filtering(self):
        resp = self.client.get("/api/v1/providers/", {"category": "konditsioner"})
        assert resp.status_code == 200
        assert resp.data["success"] is True
        results = resp.data["data"]["results"]
        assert len(results) >= 1
        assert results[0]["name"] == "Ali Usta"

    def test_matching_score_calculation(self):
        req = ServiceRequest.objects.create(
            customer=self.customer,
            category=self.category,
            problem_description="Konditsioner sovuq bermayapti",
            city="Toshkent",
            district="Chilonzor",
            address_text="9-mavze",
            urgency=ServiceRequest.Urgency.URGENT,
        )
        score, breakdown, reason = calculate_provider_score(req, self.provider)
        assert score >= 85.0
        assert "Chilonzor" in reason
        assert breakdown["service_score"] == 100.0

    def test_quote_acceptance_creates_booking_atomically(self):
        req = ServiceRequest.objects.create(
            customer=self.customer,
            category=self.category,
            problem_description="Konditsioner nosoz",
            city="Toshkent",
            district="Chilonzor",
            address_text="9-mavze",
            urgency=ServiceRequest.Urgency.URGENT,
            status=ServiceRequest.Status.OPEN,
        )
        quote = Quote.objects.create(
            request=req,
            provider=self.provider,
            labor_amount=150000,
            parts_amount=80000,
            total_amount=230000,
            arrival_time="17:30",
            status=Quote.Status.PENDING,
        )

        # Accept quote
        accepted_quote, booking = accept_quote_service(quote.id, self.customer)
        assert accepted_quote.status == Quote.Status.ACCEPTED
        assert booking is not None
        assert booking.total_price == 230000
        assert booking.status == Booking.Status.IN_TRANSIT
        assert booking.timeline_steps.count() == 5

        # Check request status updated to ASSIGNED
        req.refresh_from_db()
        assert req.status == ServiceRequest.Status.ASSIGNED

    def test_booking_status_progression_and_review(self):
        req = ServiceRequest.objects.create(
            customer=self.customer,
            category=self.category,
            problem_description="Test problem",
            address_text="Chilonzor",
            status=ServiceRequest.Status.ASSIGNED,
        )
        booking = Booking.objects.create(
            order_number="#UT-TEST",
            request=req,
            customer=self.customer,
            provider=self.provider,
            service_name="Konditsioner ta'miri",
            total_price=200000,
            status=Booking.Status.IN_TRANSIT,
        )

        # 1. Advance to IN_PROGRESS
        advance_booking_status(booking, Booking.Status.IN_PROGRESS, self.provider_user)
        booking.refresh_from_db()
        assert booking.status == Booking.Status.IN_PROGRESS

        # 2. Cannot review before COMPLETED
        with pytest.raises(BusinessLogicError):
            create_review_service(booking.id, self.customer, {"rating": 5, "comment": "Ajoyib!"})

        # 3. Complete job
        advance_booking_status(booking, Booking.Status.COMPLETED, self.provider_user)
        booking.refresh_from_db()
        assert booking.status == Booking.Status.COMPLETED

        # 4. Review now succeeds
        review = create_review_service(booking.id, self.customer, {"rating": 5, "comment": "Ajoyib xizmat!"})
        assert review.rating == 5

        # 5. Duplicate review is prevented
        with pytest.raises(BusinessLogicError):
            create_review_service(booking.id, self.customer, {"rating": 4, "comment": "Ikkinchi marta"})

    def test_provider_and_booking_404(self):
        # Provider 404
        resp = self.client.get("/api/v1/providers/non-existent-slug/")
        assert resp.status_code == 404

        # Booking 404 when not authenticated
        resp = self.client.get("/api/v1/bookings/non-existent-booking/")
        assert resp.status_code in (401, 403)

        # Booking 404 when authenticated as customer
        self.client.force_authenticate(user=self.customer)
        resp = self.client.get("/api/v1/bookings/non-existent-booking/")
        assert resp.status_code == 404
