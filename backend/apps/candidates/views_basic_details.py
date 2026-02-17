import logging

from rest_framework import status, parsers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.masteradmin.permissions import IsCandidate
from .models import CandidateProfile
from .serializers import CandidateBasicDetailsSerializer, CandidatePersonalDetailsSerializer, CandidateProfileSerializer
from .views_common import build_profile_response, error_response

logger = logging.getLogger(__name__)


class CandidateBasicDetailsView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def patch(self, request):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
        except CandidateProfile.DoesNotExist:
            return error_response(
                "Profile not found.",
                "PROFILE_NOT_FOUND",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        serializer = CandidateBasicDetailsSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                serializer.save()
                profile.refresh_from_db()
                return Response(build_profile_response(profile, request))
            except Exception:
                logger.exception("Basic details update failed for user %s", request.user.id)
                return error_response(
                    "Unable to update basic details.",
                    "BASIC_DETAILS_ERROR",
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        return error_response(
            "Invalid basic details payload.",
            "BASIC_DETAILS_INVALID_PAYLOAD",
            serializer.errors,
        )


class CandidatePersonalDetailsView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def get(self, request):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
        except CandidateProfile.DoesNotExist:
            return error_response(
                "Profile not found.",
                "PROFILE_NOT_FOUND",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        serializer = CandidatePersonalDetailsSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
        except CandidateProfile.DoesNotExist:
            return error_response(
                "Profile not found.",
                "PROFILE_NOT_FOUND",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        serializer = CandidatePersonalDetailsSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                serializer.save()
                profile.refresh_from_db()
                return Response(
                    CandidatePersonalDetailsSerializer(profile).data,
                    status=status.HTTP_200_OK,
                )
            except Exception:
                logger.exception("Personal details update failed for user %s", request.user.id)
                return error_response(
                    "Unable to update personal details.",
                    "PERSONAL_DETAILS_ERROR",
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        return error_response(
            "Invalid personal details payload.",
            "PERSONAL_DETAILS_INVALID_PAYLOAD",
            serializer.errors,
        )


class CandidatePhotoUploadView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def post(self, request):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
        except CandidateProfile.DoesNotExist:
            return error_response(
                "Profile not found.",
                "PROFILE_NOT_FOUND",
                status_code=status.HTTP_404_NOT_FOUND,
            )
        file_obj = (
            request.FILES.get("photo")
            or request.FILES.get("photo_file")
            or request.FILES.get("file")
        )
        if not file_obj:
            return error_response(
                "Photo file is required.",
                "PHOTO_FILE_REQUIRED",
                status_code=status.HTTP_400_BAD_REQUEST,
            )
        try:
            profile.photo_file = file_obj
            profile.save(update_fields=["photo_file", "updated_at"])
            profile.refresh_from_db()
            return Response(
                {
                    "photo_url": CandidateProfileSerializer(profile, context={"request": request}).data.get(
                        "photo_url"
                    )
                },
                status=status.HTTP_200_OK,
            )
        except Exception:
            logger.exception("Photo upload failed for user %s", request.user.id)
            return error_response(
                "Unable to upload photo.",
                "PHOTO_UPLOAD_ERROR",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
