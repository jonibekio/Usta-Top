from django.utils import timezone
from django.db import transaction
from rest_framework.views import APIView
from common.utils import standard_response
from common.permissions import IsAdmin
from common.audit import record_audit_log
from apps.providers.models import ProviderProfile
from .models import ProviderVerification
from .serializers import VerificationRequestItemSerializer

class AdminVerificationListView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        verifs = ProviderVerification.objects.select_related("provider", "provider__user").all()
        serializer = VerificationRequestItemSerializer(verifs, many=True)
        return standard_response(data=serializer.data)

class AdminApproveVerificationView(APIView):
    permission_classes = [IsAdmin]

    @transaction.atomic
    def post(self, request, pk):
        verif = ProviderVerification.objects.select_related("provider", "provider__user").get(id=pk)
        verif.status = ProviderVerification.Status.APPROVED
        verif.reviewed_by = request.user
        verif.reviewed_at = timezone.now()
        verif.save()

        # Update provider verification status
        provider = verif.provider
        provider.verification_status = ProviderProfile.VerificationStatus.VERIFIED
        provider.save(update_fields=["verification_status", "updated_at"])

        record_audit_log(
            actor=request.user,
            action="VERIFICATION_APPROVED",
            entity="ProviderProfile",
            entity_id=str(provider.id),
            metadata={"verification_id": str(verif.id)},
            request=request,
        )

        return standard_response(
            data=VerificationRequestItemSerializer(verif).data,
            message="Usta profili muvaffaqiyatli tasdiqlandi va kafolat nishoni berildi.",
        )

class AdminRejectVerificationView(APIView):
    permission_classes = [IsAdmin]

    @transaction.atomic
    def post(self, request, pk):
        verif = ProviderVerification.objects.select_related("provider", "provider__user").get(id=pk)
        reason = request.data.get("reason", "Hujjatlar sifati talabga javob bermadi.")
        verif.status = ProviderVerification.Status.REJECTED
        verif.rejection_reason = reason
        verif.reviewed_by = request.user
        verif.reviewed_at = timezone.now()
        verif.save()

        provider = verif.provider
        provider.verification_status = ProviderProfile.VerificationStatus.REJECTED
        provider.save(update_fields=["verification_status", "updated_at"])

        record_audit_log(
            actor=request.user,
            action="VERIFICATION_REJECTED",
            entity="ProviderProfile",
            entity_id=str(provider.id),
            metadata={"reason": reason},
            request=request,
        )

        return standard_response(
            data=VerificationRequestItemSerializer(verif).data,
            message="Usta arizasi rad etildi.",
        )
