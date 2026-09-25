from django.contrib import admin
from .models import Dispute, DisputeEvidence

class EvidenceInline(admin.TabularInline):
    model = DisputeEvidence
    extra = 0

@admin.register(Dispute)
class DisputeAdmin(admin.ModelAdmin):
    list_display = ("booking", "opened_by", "reason", "status", "resolution", "created_at")
    list_filter = ("status", "resolution")
    search_fields = ("booking__order_number", "opened_by__phone", "reason", "description")
    inlines = [EvidenceInline]
