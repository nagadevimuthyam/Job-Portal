from rest_framework import status
from rest_framework.response import Response
from django.utils import timezone

from .serializers import (
    CandidateProfileSerializer,
    CandidateSkillSerializer,
    CandidateEmploymentSerializer,
    CandidateEducationSerializer,
    CandidateProjectSerializer,
)


def touch_profile(profile):
    profile.updated_at = timezone.now()
    profile.save(update_fields=["updated_at"])


def error_response(detail, code, errors=None, status_code=status.HTTP_400_BAD_REQUEST):
    payload = {"detail": detail, "code": code}
    if errors:
        payload["errors"] = errors
    return Response(payload, status=status_code)


def calculate_profile_completion(profile):
    weights = {
        "personal_full_name": 5,
        "personal_email": 5,
        "personal_phone": 5,
        "personal_location": 5,
        "work_status": 5,
        "availability": 5,
        "summary": 15,
        "skills": 15,
        "employment": 15,
        "education": 15,
        "projects": 5,
        "resume": 10,
    }

    completion_map = {
        "personal_full_name": bool(profile.full_name),
        "personal_email": bool(profile.email),
        "personal_phone": bool(profile.phone),
        "personal_location": bool(profile.location),
        "work_status": bool(profile.work_status),
        "availability": bool(profile.availability_to_join),
        "summary": bool(profile.summary),
        "skills": profile.skills.exists(),
        "employment": profile.employments.exists(),
        "education": profile.educations.exists(),
        "projects": profile.projects.exists(),
        "resume": bool(profile.resume_file),
    }

    total = 0
    missing_details = []
    labels = {
        "personal_full_name": "Add full name",
        "personal_email": "Add email",
        "personal_phone": "Add phone number",
        "personal_location": "Add location",
        "work_status": "Add work status",
        "availability": "Add availability to join",
        "summary": "Add profile summary",
        "skills": "Add key skills",
        "employment": "Add employment history",
        "education": "Add education details",
        "projects": "Add projects",
        "resume": "Upload resume",
    }

    for key, weight in weights.items():
        if completion_map.get(key):
            total += weight
        else:
            missing_details.append(
                {
                    "key": key,
                    "label": labels.get(key, key),
                    "percent": weight,
                }
            )

    return min(total, 100), missing_details


def build_profile_response(profile, request):
    completion_percent, missing_details = calculate_profile_completion(profile)
    return {
        "profile": CandidateProfileSerializer(profile, context={"request": request}).data,
        "skills": CandidateSkillSerializer(profile.skills.all(), many=True).data,
        "employments": CandidateEmploymentSerializer(profile.employments.all(), many=True).data,
        "educations": CandidateEducationSerializer(profile.educations.all(), many=True).data,
        "projects": CandidateProjectSerializer(profile.projects.all(), many=True).data,
        "profile_completion_percent": completion_percent,
        "missing_details": missing_details,
        "missing_count": len(missing_details),
        "last_updated": profile.updated_at,
    }
