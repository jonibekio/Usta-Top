from rest_framework import serializers
from apps.catalog.models import ServiceCategory
from .models import ServiceRequest, RequestAttachment

class RequestAttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = RequestAttachment
        fields = ["id", "file_url", "file_type", "original_name", "size_bytes", "created_at"]

class ServiceRequestSerializer(serializers.ModelSerializer):
    categoryId = serializers.SlugRelatedField(source="category", slug_field="slug", queryset=ServiceCategory.objects.all())
    categoryName = serializers.CharField(source="category.name", read_only=True)
    problemDescription = serializers.CharField(source="problem_description")
    detectedIssues = serializers.ListField(source="detected_issues", required=False)
    urgencyText = serializers.CharField(source="urgency_text", required=False)
    hasAudio = serializers.BooleanField(source="has_audio", required=False)
    audioDuration = serializers.CharField(source="audio_duration", required=False, allow_blank=True)
    createdAt = serializers.DateTimeField(source="created_at", read_only=True)
    location = serializers.SerializerMethodField()
    photos = serializers.SerializerMethodField()
    matchedMasterIds = serializers.SerializerMethodField()

    class Meta:
        model = ServiceRequest
        fields = [
            "id",
            "code",
            "categoryId",
            "categoryName",
            "problemDescription",
            "detectedIssues",
            "answers",
            "location",
            "urgency",
            "urgencyText",
            "status",
            "hasAudio",
            "audioDuration",
            "photos",
            "matchedMasterIds",
            "createdAt",
        ]
        read_only_fields = ["id", "code", "status", "createdAt"]

    def get_location(self, obj):
        coords = None
        if obj.latitude and obj.longitude:
            coords = [float(obj.latitude), float(obj.longitude)]
        return {
            "city": obj.city,
            "district": obj.district,
            "address": obj.address_text,
            "coordinates": coords,
        }

    def get_photos(self, obj):
        return [att.file_url for att in obj.attachments.all()]

    def get_matchedMasterIds(self, obj):
        # Return matched providers
        from apps.matching.models import MatchingScore
        scores = MatchingScore.objects.filter(request=obj).values_list("provider__slug", flat=True)[:5]
        return list(scores)

class CreateServiceRequestSerializer(serializers.Serializer):
    categoryId = serializers.CharField()
    categoryName = serializers.CharField(required=False, allow_blank=True)
    problemDescription = serializers.CharField()
    detectedIssues = serializers.ListField(child=serializers.CharField(), required=False, default=list)
    answers = serializers.DictField(required=False, default=dict)
    location = serializers.DictField(required=False, default=dict)
    urgency = serializers.ChoiceField(choices=ServiceRequest.Urgency.choices, default=ServiceRequest.Urgency.URGENT)
    urgencyText = serializers.CharField(required=False, allow_blank=True)
    hasAudio = serializers.BooleanField(required=False, default=False)
    audioDuration = serializers.CharField(required=False, allow_blank=True, default="")
    photos = serializers.ListField(child=serializers.CharField(), required=False, default=list)

    def create(self, validated_data):
        from .services import create_request_service
        customer = self.context["request"].user
        return create_request_service(customer=customer, data=validated_data)
