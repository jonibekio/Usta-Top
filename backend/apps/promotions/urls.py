from django.urls import path
from .views import ValidatePromotionView

urlpatterns = [
    path("promotions/validate/", ValidatePromotionView.as_view(), name="promotion-validate"),
]
