from rest_framework import serializers

from .profile import CandidateProfileSerializer
from .entities import (
    CandidateSkillSerializer,
    CandidateEmploymentSerializer,
    CandidateEducationSerializer,
    CandidateProjectSerializer,
)
from ..models import CandidateProfile


class CandidateProfileResponseSerializer(serializers.Serializer):
    profile = CandidateProfileSerializer()
    skills = CandidateSkillSerializer(many=True)
    employments = CandidateEmploymentSerializer(many=True)
    educations = CandidateEducationSerializer(many=True)
    projects = CandidateProjectSerializer(many=True)
    profile_completion_percent = serializers.IntegerField()
    last_updated = serializers.DateTimeField()


class CandidateSearchSerializer(serializers.ModelSerializer):
    skills = serializers.SerializerMethodField()
    total_experience = serializers.SerializerMethodField()
    last_updated = serializers.DateTimeField(source="updated_at", read_only=True)
    profile_image_url = serializers.SerializerMethodField()
    resume_url = serializers.SerializerMethodField()
    current_title = serializers.SerializerMethodField()
    current_company = serializers.SerializerMethodField()
    current_start_date = serializers.SerializerMethodField()
    current_end_date = serializers.SerializerMethodField()
    current_is_current = serializers.SerializerMethodField()
    profile_completion_percent = serializers.IntegerField(read_only=True)

    class Meta:
        model = CandidateProfile
        fields = (
            "id",
            "full_name",
            "email",
            "phone",
            "location",
            "current_city",
            "country",
            "skills",
            "summary",
            "profile_image_url",
            "resume_url",
            "current_title",
            "current_company",
            "current_start_date",
            "current_end_date",
            "current_is_current",
        "last_active_at",
        "last_updated",
        "total_experience",
        "total_experience_years",
        "total_experience_months",
        "notice_period_code",
        "expected_salary",
        "salary_currency",
        "profile_completion_percent",
    )

    def get_skills(self, obj):
        return [skill.name for skill in obj.skills.all()]

    def get_total_experience(self, obj):
        years = obj.total_experience_years or 0
        months = obj.total_experience_months or 0
        return round(years + months / 12, 1)

    def get_profile_image_url(self, obj):
        request = self.context.get("request")
        if obj.photo_file and request:
            return request.build_absolute_uri(obj.photo_file.url)
        if obj.photo_file:
            return obj.photo_file.url
        return ""

    def get_resume_url(self, obj):
        request = self.context.get("request")
        if obj.resume_file and request:
            return request.build_absolute_uri(obj.resume_file.url)
        if obj.resume_file:
            return obj.resume_file.url
        return ""

    def _get_current_employment(self, obj):
        current = obj.employments.filter(is_current=True).order_by("-start_date").first()
        if current:
            return current
        return obj.employments.order_by("-start_date").first()

    def get_current_title(self, obj):
        employment = self._get_current_employment(obj)
        return employment.title if employment else ""

    def get_current_company(self, obj):
        employment = self._get_current_employment(obj)
        return employment.company if employment else ""

    def get_current_start_date(self, obj):
        employment = self._get_current_employment(obj)
        return employment.start_date if employment else None

    def get_current_end_date(self, obj):
        employment = self._get_current_employment(obj)
        return employment.end_date if employment else None

    def get_current_is_current(self, obj):
        employment = self._get_current_employment(obj)
        return bool(employment.is_current) if employment else False
