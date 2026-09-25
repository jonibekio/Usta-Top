from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from common.utils import standard_response
from apps.service_requests.models import ServiceRequest
from apps.providers.serializers import ProviderSerializer
from .services.matcher import match_providers_for_request
from .models import MatchingScore

class RequestMatchesView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, pk=None):
        try:
            req_obj = ServiceRequest.objects.get(id=pk)
        except Exception:
            try:
                req_obj = ServiceRequest.objects.get(code=pk)
            except ServiceRequest.DoesNotExist:
                req_obj = ServiceRequest.objects.first()

        if not req_obj:
            return standard_response(data=[], message="Hozircha buyurtma topilmadi.")

        scores = MatchingScore.objects.filter(request=req_obj).select_related("provider", "provider__user").order_by("-total_score")
        if not scores.exists():
            match_providers_for_request(req_obj)
            scores = MatchingScore.objects.filter(request=req_obj).select_related("provider", "provider__user").order_by("-total_score")

        results = []
        for s in scores:
            p_data = ProviderSerializer(s.provider).data
            p_data["matchScore"] = s.total_score
            p_data["matchReason"] = s.match_reason
            results.append(p_data)

        return standard_response(data=results)
