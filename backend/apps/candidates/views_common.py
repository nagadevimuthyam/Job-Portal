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
from .utils.profile_completion import calculate_profile_completion


def touch_profile(profile):
    now = timezone.now()
    profile.updated_at = now
    profile.profile_updated_at = now
    profile.freshness_at = max(
        filter(None, [profile.last_active_at, profile.profile_updated_at])
    )
    profile.save(update_fields=["updated_at", "profile_updated_at", "freshness_at"])


def error_response(detail, code, errors=None, status_code=status.HTTP_400_BAD_REQUEST):
    payload = {"detail": detail, "code": code}
    if errors:
        payload["errors"] = errors
    return Response(payload, status=status_code)




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
