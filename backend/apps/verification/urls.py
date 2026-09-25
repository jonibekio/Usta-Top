from django.urls import path
from .views import AdminVerificationListView, AdminApproveVerificationView, AdminRejectVerificationView

urlpatterns = [
    path("admin/verifications/", AdminVerificationListView.as_view(), name="admin-verifications-list"),
    path("admin/verifications/<str:pk>/approve/", AdminApproveVerificationView.as_view(), name="admin-verification-approve"),
    path("admin/verifications/<str:pk>/reject/", AdminRejectVerificationView.as_view(), name="admin-verification-reject"),
]
