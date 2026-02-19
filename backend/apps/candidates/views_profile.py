import logging

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.masteradmin.permissions import IsCandidate
from .models import CandidateProfile
from .serializers import CandidateProfileUpdateSerializer
from .views_common import build_profile_response, calculate_profile_completion, error_response

logger = logging.getLogger(__name__)


class CandidateProfileView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def _get_profile(self, user):
        return (
            CandidateProfile.objects.select_related("user")
            .prefetch_related("skills", "employments", "educations", "projects")
            .get(user=user)
        )

    def get(self, request):
        try:
            profile = self._get_profile(request.user)
        except CandidateProfile.DoesNotExist:
            return error_response(
                "Profile not found.",
                "PROFILE_NOT_FOUND",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        try:
            return Response(build_profile_response(profile, request))
        except Exception:
            logger.exception("Profile fetch failed for user %s", request.user.id)
            return error_response(
                "Unable to load profile.",
                "PROFILE_FETCH_ERROR",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def patch(self, request):
        try:
            profile = self._get_profile(request.user)
        except CandidateProfile.DoesNotExist:
            return error_response(
                "Profile not found.",
                "PROFILE_NOT_FOUND",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        serializer = CandidateProfileUpdateSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            requested_visibility = serializer.validated_data.get("is_searchable", None)
            serializer.save()
            profile.refresh_from_db()
            completion_percent, _ = calculate_profile_completion(profile)
            if completion_percent < 60 and profile.is_searchable:
                profile.is_searchable = False
                profile.save(update_fields=["is_searchable"])
                if requested_visibility is True:
                    return error_response(
                        "Complete at least 60% of your profile to enable visibility.",
                        "PROFILE_VISIBILITY_MIN_COMPLETION",
                        status_code=status.HTTP_400_BAD_REQUEST,
                    )
            try:
                return Response(build_profile_response(profile, request))
            except Exception:
                logger.exception("Profile update response failed for user %s", request.user.id)
                return error_response(
                    "Profile saved but response failed.",
                    "PROFILE_RESPONSE_ERROR",
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        return error_response(
            "Invalid profile payload.",
            "PROFILE_INVALID_PAYLOAD",
            serializer.errors,
        )


class CandidateProfileOverviewView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def get(self, request):
        try:
            profile = (
                CandidateProfile.objects.select_related("user")
                .prefetch_related("skills", "employments", "educations", "projects")
                .get(user=request.user)
            )
        except CandidateProfile.DoesNotExist:
            return error_response(
                "Profile not found.",
                "PROFILE_NOT_FOUND",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        try:
            return Response(build_profile_response(profile, request))
        except Exception:
            logger.exception("Profile overview fetch failed for user %s", request.user.id)
            return error_response(
                "Unable to load profile overview.",
                "PROFILE_OVERVIEW_ERROR",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
