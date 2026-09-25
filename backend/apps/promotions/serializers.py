from rest_framework import serializers
from .models import Promotion

class PromotionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Promotion
        fields = ["id", "code", "description", "discount_type", "value", "max_discount", "min_order_amount", "is_active"]
