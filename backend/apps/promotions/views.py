from rest_framework import permissions, status
from rest_framework.views import APIView
from common.utils import standard_response
from .models import Promotion

class ValidatePromotionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        code = request.data.get("code", "").strip().upper()
        amount = float(request.data.get("amount", 0))

        promo = Promotion.objects.filter(code=code).first()
        if not promo:
            return standard_response(message="Promokod topilmadi.", success=False, status_code=status.HTTP_404_NOT_FOUND)

        is_valid, msg = promo.is_valid(order_amount=amount)
        if not is_valid:
            return standard_response(message=msg, success=False, status_code=status.HTTP_400_BAD_REQUEST)

        discount = promo.calculate_discount(order_amount=amount)
        return standard_response(
            data={
                "code": promo.code,
                "discount": discount,
                "finalAmount": max(0.0, amount - discount),
            },
            message="Promokod muvaffaqiyatli qo‘llanildi.",
        )
