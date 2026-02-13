from rest_framework import serializers
from django.utils import timezone
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
            location_country="India",
            work_status="",
            availability_to_join="",
        )
        return profile


class CandidateProfileSerializer(serializers.ModelSerializer):
    resume_url = serializers.SerializerMethodField()
    resume_filename = serializers.SerializerMethodField()
    photo_url = serializers.SerializerMethodField()
    last_updated = serializers.DateTimeField(source="updated_at", read_only=True)

    class Meta:
        model = CandidateProfile
        fields = (
            "id",
            "full_name",
            "email",
            "phone",
            "location",
            "location_country",
            "gender",
            "dob",
            "current_city",
            "current_state",
            "country",
            "nationality",
            "marital_status",
            "work_authorization_country",
            "summary",
            "work_status",
            "availability_to_join",
            "total_experience_years",
            "total_experience_months",
            "notice_period_days",
            "expected_salary",
            "salary_currency",
            "resume_file",
            "resume_url",
            "resume_filename",
            "photo_file",
            "photo_url",
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

    def get_photo_url(self, obj):
        request = self.context.get("request")
        if obj.photo_file and request:
            return request.build_absolute_uri(obj.photo_file.url)
        if obj.photo_file:
            return obj.photo_file.url
        return ""


class CandidateProfileUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = (
            "full_name",
            "email",
            "phone",
            "location",
            "location_country",
            "gender",
            "dob",
            "current_city",
            "current_state",
            "country",
            "nationality",
            "marital_status",
            "work_authorization_country",
            "summary",
            "work_status",
            "availability_to_join",
            "total_experience_years",
            "total_experience_months",
            "notice_period_days",
            "expected_salary",
            "salary_currency",
        )

    def validate(self, attrs):
        data = {**attrs}
        instance = getattr(self, "instance", None)
        if instance:
            data.setdefault("work_status", instance.work_status)
            data.setdefault("availability_to_join", instance.availability_to_join)

        work_status_allowed = {"FRESHER", "EXPERIENCED", ""}
        availability_allowed = {
            "15_DAYS_OR_LESS",
            "1_MONTH",
            "2_MONTHS",
            "3_MONTHS",
            "MORE_THAN_3_MONTHS",
            "",
        }
        errors = {}
        if data.get("work_status") not in work_status_allowed:
            errors["work_status"] = "Invalid work status."
        if data.get("availability_to_join") not in availability_allowed:
            errors["availability_to_join"] = "Invalid availability option."
        if errors:
            raise serializers.ValidationError(errors)
        return attrs


class CandidatePersonalDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = (
            "full_name",
            "email",
            "phone",
            "gender",
            "dob",
            "current_city",
            "current_state",
            "country",
            "nationality",
            "marital_status",
            "work_authorization_country",
            "availability_to_join",
            "location",
            "total_experience_years",
            "total_experience_months",
            "notice_period_days",
            "expected_salary",
            "salary_currency",
        )

    def validate(self, attrs):
        data = {**attrs}
        instance = getattr(self, "instance", None)
        if instance:
            data.setdefault("gender", instance.gender)
            data.setdefault("marital_status", instance.marital_status)
            data.setdefault("dob", instance.dob)

        errors = {}
        currency_allowed = {"INR", "USD", "", None}
        gender_allowed = {"MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY", "", None}
        marital_allowed = {
            "SINGLE",
            "MARRIED",
            "DIVORCED",
            "WIDOWED",
            "PREFER_NOT_TO_SAY",
            "",
            None,
        }

        if data.get("gender") not in gender_allowed:
            errors["gender"] = "Invalid gender."
        if data.get("marital_status") not in marital_allowed:
            errors["marital_status"] = "Invalid marital status."
        if data.get("salary_currency") not in currency_allowed:
            errors["salary_currency"] = "Invalid salary currency."

        dob = data.get("dob")
        if dob:
            today = timezone.now().date()
            if dob > today:
                errors["dob"] = "Date of birth cannot be in the future."

        if errors:
            raise serializers.ValidationError(errors)
        return attrs


class CandidateBasicDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProfile
        fields = (
            "work_status",
            "availability_to_join",
            "location_country",
            "location",
            "current_city",
            "current_state",
            "country",
            "phone",
            "email",
            "total_experience_years",
            "total_experience_months",
            "notice_period_days",
        )

    def validate(self, attrs):
        data = {**attrs}
        instance = getattr(self, "instance", None)
        if instance:
            data.setdefault("work_status", instance.work_status)
            data.setdefault("total_experience_years", instance.total_experience_years)
            data.setdefault("availability_to_join", instance.availability_to_join)

        errors = {}
        work_status_allowed = {"FRESHER", "EXPERIENCED"}
        if not data.get("work_status"):
            errors["work_status"] = "Select work status."
        elif data.get("work_status") not in work_status_allowed:
            errors["work_status"] = "Invalid work status."

        availability_allowed = {
            "15_DAYS_OR_LESS",
            "1_MONTH",
            "2_MONTHS",
            "3_MONTHS",
            "MORE_THAN_3_MONTHS",
            "",
            None,
        }
        if data.get("availability_to_join") not in availability_allowed:
            errors["availability_to_join"] = "Invalid availability option."

        if data.get("work_status") == "EXPERIENCED":
            years = data.get("total_experience_years")
            if years is None or years < 1:
                errors["total_experience_years"] = "Select your total experience."
        if data.get("work_status") == "FRESHER":
            data["total_experience_years"] = 0
            data["total_experience_months"] = 0

        if errors:
            raise serializers.ValidationError(errors)
        attrs.update(
            {
                "total_experience_years": data.get(
                    "total_experience_years", attrs.get("total_experience_years")
                ),
                "total_experience_months": data.get(
                    "total_experience_months", attrs.get("total_experience_months")
                ),
            }
        )
        return attrs


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
        fields = (
            "id",
            "degree",
            "institution",
            "course_type",
            "start_year",
            "end_year",
            "marks_percentage",
        )

    def validate(self, attrs):
        data = {**attrs}
        instance = getattr(self, "instance", None)
        if instance:
            data.setdefault("degree", instance.degree)
            data.setdefault("institution", instance.institution)
            data.setdefault("course_type", instance.course_type)
            data.setdefault("start_year", instance.start_year)
            data.setdefault("end_year", instance.end_year)
            data.setdefault("marks_percentage", instance.marks_percentage)

        errors = {}
        if self.instance is None:
            if not data.get("degree"):
                errors["degree"] = "Education is required."
            if not data.get("institution"):
                errors["institution"] = "University/Institute is required."
            if not data.get("course_type"):
                errors["course_type"] = "Course type is required."
            if not data.get("start_year"):
                errors["start_year"] = "Start year is required."
            if not data.get("end_year"):
                errors["end_year"] = "End year is required."


        start_year = data.get("start_year")
        end_year = data.get("end_year")
        if start_year and end_year and start_year > end_year:
            errors["end_year"] = "End year must be after start year."

        marks = data.get("marks_percentage")
        if marks is not None and (marks < 0 or marks > 100):
            errors["marks_percentage"] = "Marks/Percentage must be between 0 and 100."

        if errors:
            raise serializers.ValidationError(errors)

        return attrs


class CandidateProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = CandidateProject
        fields = (
            "id",
            "title",
            "description",
            "link",
            "status",
            "worked_from_year",
            "worked_from_month",
            "worked_till_year",
            "worked_till_month",
        )

    def validate(self, attrs):
        data = {**attrs}
        instance = getattr(self, "instance", None)
        if instance:
            data.setdefault("title", instance.title)
            data.setdefault("status", instance.status)
            data.setdefault("worked_from_year", instance.worked_from_year)
            data.setdefault("worked_from_month", instance.worked_from_month)
            data.setdefault("worked_till_year", instance.worked_till_year)
            data.setdefault("worked_till_month", instance.worked_till_month)

        errors = {}
        status = data.get("status")
        if self.instance is None and not status:
            errors["status"] = "Project status is required."

        allowed_status = {"IN_PROGRESS", "FINISHED", "", None}
        if status not in allowed_status:
            errors["status"] = "Invalid project status."

        from_year = data.get("worked_from_year")
        from_month = data.get("worked_from_month")
        if status and (from_year is None or from_month is None):
            errors["worked_from_year"] = "Worked from is required."

        if status == "FINISHED":
            till_year = data.get("worked_till_year")
            till_month = data.get("worked_till_month")
            if till_year is None or till_month is None:
                errors["worked_till_year"] = "Worked till is required."
            elif from_year is not None and from_month is not None:
                from_key = int(from_year) * 12 + int(from_month)
                till_key = int(till_year) * 12 + int(till_month)
                if till_key < from_key:
                    errors["worked_till_year"] = "Worked till must be after worked from."

        if errors:
            raise serializers.ValidationError(errors)

        return attrs


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
