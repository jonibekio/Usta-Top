from django.urls import path
from .views import AIIntakeAnalysisView

urlpatterns = [
    path("ai/intake/", AIIntakeAnalysisView.as_view(), name="ai-intake"),
]
