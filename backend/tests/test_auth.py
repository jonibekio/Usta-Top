import pytest
from rest_framework.test import APIClient
from apps.users.models import User

@pytest.mark.django_db
class TestAuthentication:
    def setup_method(self):
        self.client = APIClient()

    def test_register_customer(self):
        data = {
            "name": "Nodir Bekov",
            "phone": "+998931234567",
            "password": "strongPassword123",
            "role": "CUSTOMER",
        }
        resp = self.client.post("/api/v1/auth/register/", data, format="json")
        assert resp.status_code == 201
        assert resp.data["success"] is True
        assert "tokens" in resp.data["data"]
        assert resp.data["data"]["user"]["phone"] == "+998931234567"
        assert User.objects.filter(phone="+998931234567").exists()

    def test_login_and_me(self):
        user = User.objects.create_user(
            phone="+998901112233",
            password="testPassword123",
            first_name="Anvar",
            role=User.Role.CUSTOMER,
        )
        resp = self.client.post("/api/v1/auth/login/", {"phone": "+998901112233", "password": "testPassword123"}, format="json")
        assert resp.status_code == 200
        assert resp.data["success"] is True
        token = resp.data["data"]["tokens"]["access"]

        # /auth/me/
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {token}")
        me_resp = self.client.get("/api/v1/auth/me/")
        assert me_resp.status_code == 200
        assert me_resp.data["data"]["phone"] == "+998901112233"
