from rest_framework import serializers

class AIIntakeRequestSerializer(serializers.Serializer):
    text = serializers.CharField(required=True)
    context = serializers.DictField(required=False, default=dict)
