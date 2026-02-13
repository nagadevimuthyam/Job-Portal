import logging
from rest_framework import status
from rest_framework import parsers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.db.models import F
from django.utils import timezone

from apps.masteradmin.permissions import IsCandidate
from .models import (
    CandidateProfile,
    CandidateSkill,
    CandidateEmployment,
    CandidateEducation,
    CandidateProject,
)
from apps.skills.models import Skill, normalize_skill_name
from .serializers import (
    CandidateRegisterSerializer,
    CandidateProfileSerializer,
    CandidateProfileUpdateSerializer,
    CandidateBasicDetailsSerializer,
    CandidatePersonalDetailsSerializer,
    CandidateSkillSerializer,
    CandidateEmploymentSerializer,
    CandidateEducationSerializer,
    CandidateProjectSerializer,
)

logger = logging.getLogger(__name__)


def touch_profile(profile):
    profile.updated_at = timezone.now()
    profile.save(update_fields=["updated_at"])


class CandidateRegisterView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = CandidateRegisterSerializer(data=request.data)
        if serializer.is_valid():
            profile = serializer.save()
            return Response(CandidateProfileSerializer(profile).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


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
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        try:
            return Response(build_profile_response(profile, request))
        except Exception:
            logger.exception("Profile fetch failed for user %s", request.user.id)
            return Response(
                {"detail": "Unable to load profile.", "code": "PROFILE_FETCH_ERROR"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def patch(self, request):
        try:
            profile = self._get_profile(request.user)
        except CandidateProfile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = CandidateProfileUpdateSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            profile.refresh_from_db()
            try:
                return Response(build_profile_response(profile, request))
            except Exception:
                logger.exception("Profile update response failed for user %s", request.user.id)
                return Response(
                    {"detail": "Profile saved but response failed.", "code": "PROFILE_RESPONSE_ERROR"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CandidateSkillCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        serializer = CandidateSkillSerializer(data=request.data)
        if serializer.is_valid():
            skill = CandidateSkill.objects.create(profile=profile, **serializer.validated_data)
            normalized = normalize_skill_name(skill.name)
            if normalized:
                skill_obj, created = Skill.objects.get_or_create(
                    normalized_name=normalized,
                    defaults={"name": skill.name, "popularity": 1},
                )
                if not created:
                    Skill.objects.filter(id=skill_obj.id).update(popularity=F("popularity") + 1)
            touch_profile(profile)
            return Response(CandidateSkillSerializer(skill).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CandidateSkillDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def delete(self, request, skill_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        skill = get_object_or_404(CandidateSkill, id=skill_id, profile=profile)
        skill.delete()
        touch_profile(profile)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CandidateSkillBulkUpsertView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def put(self, request):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        payload = request.data.get("skills", [])
        if not isinstance(payload, list):
            return Response({"detail": "skills must be a list."}, status=status.HTTP_400_BAD_REQUEST)

        desired = []
        seen = set()
        for item in payload:
            name = ""
            if isinstance(item, dict):
                name = (item.get("name") or "").strip()
            elif isinstance(item, str):
                name = item.strip()
            if not name:
                continue
            normalized = normalize_skill_name(name)
            if not normalized or normalized in seen:
                continue
            seen.add(normalized)
            desired.append({"name": name, "normalized": normalized})

        existing = list(CandidateSkill.objects.filter(profile=profile))
        existing_map = {normalize_skill_name(skill.name): skill for skill in existing}

        desired_norms = {item["normalized"] for item in desired}
        to_delete = [skill.id for key, skill in existing_map.items() if key not in desired_norms]
        to_create = [item for item in desired if item["normalized"] not in existing_map]

        if to_delete:
            CandidateSkill.objects.filter(id__in=to_delete, profile=profile).delete()

        created_skills = []
        for item in to_create:
            created_skills.append(CandidateSkill(profile=profile, name=item["name"]))

        if created_skills:
            CandidateSkill.objects.bulk_create(created_skills)

        # popularity tracking for newly added skills
        for item in to_create:
            skill_obj, created = Skill.objects.get_or_create(
                normalized_name=item["normalized"],
                defaults={"name": item["name"], "popularity": 1},
            )
            if not created:
                Skill.objects.filter(id=skill_obj.id).update(popularity=F("popularity") + 1)

        touch_profile(profile)
        updated = CandidateSkill.objects.filter(profile=profile)
        return Response(CandidateSkillSerializer(updated, many=True).data, status=status.HTTP_200_OK)




class CandidateEmploymentCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        serializer = CandidateEmploymentSerializer(data=request.data)
        if serializer.is_valid():
            employment = CandidateEmployment.objects.create(
                profile=profile, **serializer.validated_data
            )
            touch_profile(profile)
            return Response(
                CandidateEmploymentSerializer(employment).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CandidateEmploymentUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def patch(self, request, employment_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        employment = get_object_or_404(CandidateEmployment, id=employment_id, profile=profile)
        serializer = CandidateEmploymentSerializer(employment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            touch_profile(profile)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, employment_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        employment = get_object_or_404(CandidateEmployment, id=employment_id, profile=profile)
        employment.delete()
        touch_profile(profile)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CandidateEducationCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        serializer = CandidateEducationSerializer(data=request.data)
        if serializer.is_valid():
            education = CandidateEducation.objects.create(profile=profile, **serializer.validated_data)
            touch_profile(profile)
            return Response(
                CandidateEducationSerializer(education).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CandidateEducationUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def patch(self, request, education_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        education = get_object_or_404(CandidateEducation, id=education_id, profile=profile)
        serializer = CandidateEducationSerializer(education, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            touch_profile(profile)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, education_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        education = get_object_or_404(CandidateEducation, id=education_id, profile=profile)
        education.delete()
        touch_profile(profile)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CandidateProjectCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        serializer = CandidateProjectSerializer(data=request.data)
        if serializer.is_valid():
            project = CandidateProject.objects.create(profile=profile, **serializer.validated_data)
            touch_profile(profile)
            return Response(
                CandidateProjectSerializer(project).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CandidateProjectUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def patch(self, request, project_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        project = get_object_or_404(CandidateProject, id=project_id, profile=profile)
        serializer = CandidateProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            touch_profile(profile)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, project_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        project = get_object_or_404(CandidateProject, id=project_id, profile=profile)
        project.delete()
        touch_profile(profile)
        return Response(status=status.HTTP_204_NO_CONTENT)


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
                return Response(
                    {"detail": "Resume file is required.", "code": "RESUME_FILE_REQUIRED"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            profile.resume_file = file_obj
            profile.save(update_fields=["resume_file", "updated_at"])
            profile.refresh_from_db()
            return Response(build_profile_response(profile, request))
        except Exception:
            logger.exception("Resume upload failed for user %s", request.user.id)
            return Response(
                {"detail": "Unable to upload resume.", "code": "RESUME_UPLOAD_ERROR"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
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
            return Response(
                {"detail": "Unable to delete resume.", "code": "RESUME_DELETE_ERROR"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
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
            return Response(
                {"detail": "Profile not found.", "code": "PROFILE_NOT_FOUND"},
                status=status.HTTP_404_NOT_FOUND,
            )
        try:
            return Response(build_profile_response(profile, request))
        except Exception:
            logger.exception("Profile overview fetch failed for user %s", request.user.id)
            return Response(
                {"detail": "Unable to load profile overview.", "code": "PROFILE_OVERVIEW_ERROR"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class CandidateBasicDetailsView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def patch(self, request):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
        except CandidateProfile.DoesNotExist:
            return Response(
                {"detail": "Profile not found.", "code": "PROFILE_NOT_FOUND"},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = CandidateBasicDetailsSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                serializer.save()
                profile.refresh_from_db()
                return Response(build_profile_response(profile, request))
            except Exception:
                logger.exception("Basic details update failed for user %s", request.user.id)
                return Response(
                    {"detail": "Unable to update basic details.", "code": "BASIC_DETAILS_ERROR"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        return Response(
            {"detail": serializer.errors, "code": "BASIC_DETAILS_INVALID_PAYLOAD"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class CandidatePersonalDetailsView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def get(self, request):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
        except CandidateProfile.DoesNotExist:
            return Response(
                {"detail": "Profile not found.", "code": "PROFILE_NOT_FOUND"},
                status=status.HTTP_404_NOT_FOUND,
            )
        serializer = CandidatePersonalDetailsSerializer(profile)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
        except CandidateProfile.DoesNotExist:
            return Response(
                {"detail": "Profile not found.", "code": "PROFILE_NOT_FOUND"},
                status=status.HTTP_404_NOT_FOUND,
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
                return Response(
                    {"detail": "Unable to update personal details.", "code": "PERSONAL_DETAILS_ERROR"},
                    status=status.HTTP_500_INTERNAL_SERVER_ERROR,
                )
        return Response(
            {"detail": serializer.errors, "code": "PERSONAL_DETAILS_INVALID_PAYLOAD"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class CandidatePhotoUploadView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def post(self, request):
        try:
            profile = CandidateProfile.objects.get(user=request.user)
        except CandidateProfile.DoesNotExist:
            return Response(
                {"detail": "Profile not found.", "code": "PROFILE_NOT_FOUND"},
                status=status.HTTP_404_NOT_FOUND,
            )
        file_obj = (
            request.FILES.get("photo")
            or request.FILES.get("photo_file")
            or request.FILES.get("file")
        )
        if not file_obj:
            return Response(
                {"detail": "Photo file is required.", "code": "PHOTO_FILE_REQUIRED"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        try:
            profile.photo_file = file_obj
            profile.save(update_fields=["photo_file", "updated_at"])
            profile.refresh_from_db()
            return Response(
                {"photo_url": CandidateProfileSerializer(profile, context={"request": request}).data.get("photo_url")},
                status=status.HTTP_200_OK,
            )
        except Exception:
            logger.exception("Photo upload failed for user %s", request.user.id)
            return Response(
                {"detail": "Unable to upload photo.", "code": "PHOTO_UPLOAD_ERROR"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
