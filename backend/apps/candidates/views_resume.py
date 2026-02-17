import logging

from rest_framework import status, parsers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from apps.masteradmin.permissions import IsCandidate
from .models import CandidateProfile
from .views_common import build_profile_response, error_response

logger = logging.getLogger(__name__)


class CandidateResumeUploadView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def post(self, request):
        try:
            profile = get_object_or_404(CandidateProfile, user=request.user)
            file_obj = (
                request.FILES.get("resume")
                or request.FILES.get("resume_file")
                or request.FILES.get("file")
            )
            if not file_obj:
                return error_response(
                    "Resume file is required.",
                    "RESUME_FILE_REQUIRED",
                    status_code=status.HTTP_400_BAD_REQUEST,
                )
            profile.resume_file = file_obj
            profile.save(update_fields=["resume_file", "updated_at"])
            profile.refresh_from_db()
            return Response(build_profile_response(profile, request))
        except Exception:
            logger.exception("Resume upload failed for user %s", request.user.id)
            return error_response(
                "Unable to upload resume.",
                "RESUME_UPLOAD_ERROR",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request):
        try:
            profile = get_object_or_404(CandidateProfile, user=request.user)
            if profile.resume_file:
                profile.resume_file.delete(save=False)
            profile.resume_file = None
            profile.save(update_fields=["resume_file", "updated_at"])
            profile.refresh_from_db()
            return Response(build_profile_response(profile, request))
        except Exception:
            logger.exception("Resume delete failed for user %s", request.user.id)
            return error_response(
                "Unable to delete resume.",
                "RESUME_DELETE_ERROR",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
