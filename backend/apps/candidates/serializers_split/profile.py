from rest_framework import serializers
from django.utils import timezone

from ..models import CandidateProfile


def _clean_preferred_locations(value):
    if value is None:
        return None, None
    if not isinstance(value, list):
        return None, "Preferred locations must be a list."

    cleaned = []
    seen = set()
    for item in value:
        if not isinstance(item, str):
            return None, "Preferred locations must contain only text values."
        normalized = " ".join(item.split()).strip()
        if not normalized:
            continue
        key = normalized.lower()
        if key in seen:
            continue
        seen.add(key)
        cleaned.append(normalized)
    return cleaned, None


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
            "preferred_locations",
            "work_authorization_country",
            "summary",
            "work_status",
            "availability_to_join",
            "total_experience_years",
            "total_experience_months",
            "notice_period_code",
            "expected_salary",
            "salary_currency",
            "resume_file",
            "resume_url",
            "resume_filename",
            "photo_file",
            "photo_url",
            "is_searchable",
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
            "preferred_locations",
            "work_authorization_country",
            "summary",
            "work_status",
            "availability_to_join",
            "total_experience_years",
            "total_experience_months",
            "notice_period_code",
            "expected_salary",
            "salary_currency",
            "is_searchable",
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
        notice_period_allowed = {
            "15_DAYS_OR_LESS",
            "1_MONTH",
            "2_MONTHS",
            "3_MONTHS",
            "MORE_THAN_3_MONTHS",
            "",
            None,
        }
        errors = {}
        if data.get("work_status") not in work_status_allowed:
            errors["work_status"] = "Invalid work status."
        if data.get("availability_to_join") not in availability_allowed:
            errors["availability_to_join"] = "Invalid availability option."
        if data.get("notice_period_code") not in notice_period_allowed:
            errors["notice_period_code"] = "Invalid notice period."

        cleaned_locations, locations_error = _clean_preferred_locations(
            data.get("preferred_locations")
        )
        if locations_error:
            errors["preferred_locations"] = locations_error
        elif cleaned_locations is not None:
            attrs["preferred_locations"] = cleaned_locations

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
            "preferred_locations",
            "work_authorization_country",
            "availability_to_join",
            "location",
            "total_experience_years",
            "total_experience_months",
            "notice_period_code",
            "expected_salary",
            "salary_currency",
        )

    def validate(self, attrs):
        data = {**attrs}
        instance = getattr(self, "instance", None)
        if instance:
            data.setdefault("gender", instance.gender)
            data.setdefault("dob", instance.dob)
            data.setdefault("preferred_locations", instance.preferred_locations)

        errors = {}
        currency_allowed = {"INR", "USD", "", None}
        gender_allowed = {"MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY", "", None}

        if data.get("gender") not in gender_allowed:
            errors["gender"] = "Invalid gender."
        if data.get("salary_currency") not in currency_allowed:
            errors["salary_currency"] = "Invalid salary currency."

        cleaned_locations, locations_error = _clean_preferred_locations(
            data.get("preferred_locations")
        )
        if locations_error:
            errors["preferred_locations"] = locations_error
        elif cleaned_locations is not None:
            attrs["preferred_locations"] = cleaned_locations

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
            "notice_period_code",
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
        notice_period_allowed = {
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
        if data.get("notice_period_code") not in notice_period_allowed:
            errors["notice_period_code"] = "Invalid notice period."

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
