from rest_framework import permissions
from rest_framework.views import APIView
from common.utils import standard_response
from .serializers import AIIntakeRequestSerializer
from .services import get_ai_intake_provider

class AIIntakeAnalysisView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AIIntakeRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        text = serializer.validated_data["text"]
        context = serializer.validated_data.get("context", {})

        provider = get_ai_intake_provider()
        result = provider.analyze_intake(text=text, context=context)

        return standard_response(
            data=result,
            message="Muammo AI tomonidan tahlil qilindi va tavsiyalar tayyorlandi.",
        )
