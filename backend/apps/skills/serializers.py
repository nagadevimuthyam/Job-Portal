from rest_framework import serializers
from .models import Skill


class SkillSuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = ["id", "name"]
