from rest_framework import serializers

from .models import EmployerSearchPreset


class EmployerSearchPresetSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()

    class Meta:
        model = EmployerSearchPreset
        fields = (
            "id",
            "name",
            "title",
            "filters",
            "is_saved",
            "run_count",
            "last_run_at",
            "created_at",
            "updated_at",
        )

    def get_name(self, obj):
        return obj.title or "Quick search"


class SaveSearchPresetSerializer(serializers.Serializer):
    title = serializers.CharField(required=False, allow_blank=True, max_length=160)
    preset_id = serializers.UUIDField(required=False)
    filters = serializers.JSONField(required=False)

    def validate(self, attrs):
        if not attrs.get("preset_id") and not attrs.get("filters"):
            raise serializers.ValidationError("Either preset_id or filters is required.")
        return attrs


class RenameSearchPresetSerializer(serializers.Serializer):
    title = serializers.CharField(required=True, allow_blank=False, max_length=160)
