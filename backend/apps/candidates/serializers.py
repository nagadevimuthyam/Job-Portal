from rest_framework import serializers
from apps.accounts.models import User
from .models import (
    CandidateProfile,
    CandidateSkill,
    CandidateEmployment,
    CandidateEducation,
    CandidateProject,
)


class CandidateRegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    phone = serializers.CharField(max_length=30, required=False, allow_blank=True)
    location = serializers.CharField(max_length=200, required=False, allow_blank=True)

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("Email already exists.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data["email"],
            password=validated_data["password"],
            full_name=validated_data["full_name"],
            role=User.Role.CANDIDATE,
            phone=validated_data.get("phone", ""),
        )
        profile = CandidateProfile.objects.create(
            user=user,
            full_name=validated_data["full_name"],
            email=validated_data["email"],
            phone=validated_data.get("phone", ""),
            location=validated_data.get("location", ""),
            summary="",
        )
        return profile


class CandidateProfileSerializer(serializers.ModelSerializer):
    resume_url = serializers.SerializerMethodField()
    resume_filename = serializers.SerializerMethodField()
    last_updated = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = CandidateProfile
        fields = (
            "id",
            "full_name",
            "email",
            "phone",
            "location",
            "summary",
            "total_experience_years",
            "total_experience_months",
            "notice_period_days",
            "expected_salary",
            "resume_file",
            "resume_url",
            "resume_filename",
            "last_updated",
        )

    def get_resume_url(self, obj):
        request = self.context.get("request")
        if obj.resume_file and request:
            return request.build_absolute_uri(obj.resume_file.url)
        if obj.resume_file:
            return obj.resume_file.url
        return ""

    def get_resume_filename(self, obj):
        if not obj.resume_file:
            return ""
        return obj.resume_file.name.split("/")[-1]


class CandidateProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = (
            "full_name",
            "email",
            "phone",
            "location",
            "summary",
            "total_experience_years",
            "total_experience_months",
            "notice_period_days",
            "expected_salary",
        )


class CandidateSkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateSkill
        fields = ("id", "name")


class CandidateEmploymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateEmployment
        fields = (
            "id",
            "company",
            "title",
            "start_date",
            "end_date",
            "is_current",
            "description",
        )


class CandidateEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateEducation
        fields = ("id", "degree", "institution", "start_year", "end_year")


class CandidateProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProject
        fields = ("id", "title", "description", "link")


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

    class Meta:
        model = CandidateProfile
        fields = (
            "id",
            "full_name",
            "email",
            "phone",
            "location",
            "skills",
            "summary",
            "last_updated",
            "total_experience",
        )

    def get_skills(self, obj):
        return [skill.name for skill in obj.skills.all()]

    def get_total_experience(self, obj):
        years = obj.total_experience_years or 0
        months = obj.total_experience_months or 0
        return round(years + months / 12, 1)
