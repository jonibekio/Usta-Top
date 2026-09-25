from rest_framework import serializers
from .models import ProviderVerification

class VerificationRequestItemSerializer(serializers.ModelSerializer):
    providerName = serializers.CharField(source="provider.display_name", read_only=True)
    phone = serializers.CharField(source="provider.user.phone", read_only=True)
    category = serializers.CharField(source="category_name")
    passportSerial = serializers.CharField(source="passport_serial")
    appliedDate = serializers.SerializerMethodField()
    documents = serializers.SerializerMethodField()

    class Meta:
        model = ProviderVerification
        fields = [
            "id",
            "providerName",
            "phone",
            "category",
            "passportSerial",
            "appliedDate",
            "status",
            "documents",
        ]

    def get_appliedDate(self, obj):
        return obj.created_at.strftime("%d-%B, %H:%M")

    def get_documents(self, obj):
        return {
            "passportPhoto": obj.passport_photo_url,
            "facePhoto": obj.face_photo_url,
            "certificates": obj.certificates,
        }
