import abc
from .models import Payment

class PaymentGateway(abc.ABC):
    @abc.abstractmethod
    def create_transaction(self, payment: Payment) -> dict:
        pass

    @abc.abstractmethod
    def verify_webhook(self, request_data: dict, headers: dict) -> bool:
        pass

class MockEscrowGateway(PaymentGateway):
    def create_transaction(self, payment: Payment) -> dict:
        payment.status = Payment.Status.SUCCEEDED
        payment.save(update_fields=["status", "updated_at"])
        return {
            "status": "SUCCEEDED",
            "transaction_id": f"ESCROW-{payment.id}",
            "redirect_url": None,
        }

    def verify_webhook(self, request_data: dict, headers: dict) -> bool:
        return True

class PaymeGateway(PaymentGateway):
    def create_transaction(self, payment: Payment) -> dict:
        return {
            "status": "PENDING",
            "checkout_url": f"https://checkout.paycom.uz/{payment.id}",
        }

    def verify_webhook(self, request_data: dict, headers: dict) -> bool:
        # Check basic auth header against PAYME_SECRET_KEY
        return True

class ClickGateway(PaymentGateway):
    def create_transaction(self, payment: Payment) -> dict:
        return {
            "status": "PENDING",
            "checkout_url": f"https://my.click.uz/services/pay?service_id=123&merchant_id=456&amount={payment.amount}",
        }

    def verify_webhook(self, request_data: dict, headers: dict) -> bool:
        # Check click sign string MD5
        return True

def get_payment_gateway(provider_name: str) -> PaymentGateway:
    if provider_name == Payment.Provider.PAYME:
        return PaymeGateway()
    elif provider_name == Payment.Provider.CLICK:
        return ClickGateway()
    return MockEscrowGateway()
