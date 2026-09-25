from django.urls import path
from .views import RequestQuotesView, AcceptQuoteView, RejectQuoteView

urlpatterns = [
    path("requests/<str:request_id>/quotes/", RequestQuotesView.as_view(), name="request-quotes"),
    path("quotes/<str:pk>/accept/", AcceptQuoteView.as_view(), name="quote-accept"),
    path("quotes/<str:pk>/reject/", RejectQuoteView.as_view(), name="quote-reject"),
]
