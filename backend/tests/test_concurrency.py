import pytest
from apps.users.models import User
from apps.catalog.models import ServiceCategory
from apps.providers.models import ProviderProfile
from apps.service_requests.models import ServiceRequest
from apps.quotes.models import Quote
from apps.quotes.services import accept_quote_service
from common.exceptions import BusinessLogicError

@pytest.mark.django_db
class TestConcurrencyAndSecurity:
    def setup_method(self):
        # Customers
        self.customer1 = User.objects.create_user(
            phone="+998901111111",
            password="password123",
            first_name="Customer 1",
            role=User.Role.CUSTOMER,
        )
        self.customer2 = User.objects.create_user(
            phone="+998902222222",
            password="password123",
            first_name="Customer 2",
            role=User.Role.CUSTOMER,
        )

        # Provider
        self.provider_user = User.objects.create_user(
            phone="+998903333333",
            password="password123",
            first_name="Provider 1",
            role=User.Role.PROVIDER,
        )
        self.provider = ProviderProfile.objects.create(
            user=self.provider_user,
            slug="busy-usta",
            display_name="Busy Usta",
            status=ProviderProfile.Status.ACTIVE,
        )

        # Category
        self.category = ServiceCategory.objects.create(
            name="Santexnika",
            slug="santexnika",
        )

    def test_bouncing_unauthorized_user_on_quote_accept(self):
        req = ServiceRequest.objects.create(
            customer=self.customer1,
            category=self.category,
            problem_description="Kran oqmoqda",
            address_text="Chilonzor",
            status=ServiceRequest.Status.OPEN,
        )
        quote = Quote.objects.create(
            request=req,
            provider=self.provider,
            labor_amount=100000,
            total_amount=100000,
            arrival_time="18:00",
            status=Quote.Status.PENDING,
        )

        # Customer 2 tries to accept Customer 1's quote (IDOR / BOLA attack)
        with pytest.raises(BusinessLogicError) as exc_info:
            accept_quote_service(quote.id, self.customer2)
        assert "Faqat buyurtma egasi" in str(exc_info.value)

    def test_double_quote_accept_prevention(self):
        req = ServiceRequest.objects.create(
            customer=self.customer1,
            category=self.category,
            problem_description="Kran oqmoqda",
            address_text="Chilonzor",
            status=ServiceRequest.Status.OPEN,
        )
        quote = Quote.objects.create(
            request=req,
            provider=self.provider,
            labor_amount=100000,
            total_amount=100000,
            arrival_time="18:00",
            status=Quote.Status.PENDING,
        )

        # First accept succeeds
        accept_quote_service(quote.id, self.customer1)
        quote.refresh_from_db()
        assert quote.status == Quote.Status.ACCEPTED

        # Second accept attempt fails immediately
        with pytest.raises(BusinessLogicError) as exc_info:
            accept_quote_service(quote.id, self.customer1)
        assert "Faqat kutilayotgan taklifni qabul qilish mumkin" in str(exc_info.value)
