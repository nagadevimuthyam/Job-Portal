import logging

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.masteradmin.permissions import IsCandidate
from .models import CandidateProfile
from .serializers import CandidateProfileUpdateSerializer
from .views_common import build_profile_response, error_response

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
            serializer.save()
            profile.refresh_from_db()
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
