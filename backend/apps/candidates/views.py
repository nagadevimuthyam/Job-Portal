from rest_framework import status
from rest_framework import parsers
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from apps.masteradmin.permissions import IsCandidate
from .models import (
    CandidateProfile,
    CandidateSkill,
    CandidateEmployment,
    CandidateEducation,
    CandidateProject,
)
from .serializers import (
    CandidateRegisterSerializer,
    CandidateProfileSerializer,
    CandidateProfileUpdateSerializer,
    CandidateSkillSerializer,
    CandidateEmploymentSerializer,
    CandidateEducationSerializer,
    CandidateProjectSerializer,
)


class CandidateRegisterView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = CandidateRegisterSerializer(data=request.data)
        if serializer.is_valid():
            profile = serializer.save()
            return Response(CandidateProfileSerializer(profile).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CandidateProfileView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def _get_profile(self, user):
        return (
            CandidateProfile.objects.select_related("user")
            .prefetch_related("skills", "employments", "educations", "projects")
            .get(user=user)
        )

    def _profile_completion(self, profile):
        sections = [
            all([profile.full_name, profile.email, profile.phone, profile.location]),
            bool(profile.summary),
            profile.skills.exists(),
            profile.employments.exists(),
            profile.educations.exists(),
            profile.projects.exists(),
            bool(profile.resume_file),
        ]
        completed = sum(1 for section in sections if section)
        return round((completed / len(sections)) * 100)

    def _build_response(self, profile, request):
        return {
            "profile": CandidateProfileSerializer(profile, context={"request": request}).data,
            "skills": CandidateSkillSerializer(profile.skills.all(), many=True).data,
            "employments": CandidateEmploymentSerializer(profile.employments.all(), many=True).data,
            "educations": CandidateEducationSerializer(profile.educations.all(), many=True).data,
            "projects": CandidateProjectSerializer(profile.projects.all(), many=True).data,
            "profile_completion_percent": self._profile_completion(profile),
            "last_updated": profile.updated_at,
        }

    def get(self, request):
        try:
            profile = self._get_profile(request.user)
        except CandidateProfile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(self._build_response(profile, request))

    def patch(self, request):
        try:
            profile = self._get_profile(request.user)
        except CandidateProfile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
        serializer = CandidateProfileUpdateSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            profile.refresh_from_db()
            return Response(self._build_response(profile, request))
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CandidateSkillCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        serializer = CandidateSkillSerializer(data=request.data)
        if serializer.is_valid():
            skill = CandidateSkill.objects.create(profile=profile, **serializer.validated_data)
            return Response(CandidateSkillSerializer(skill).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CandidateSkillDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def delete(self, request, skill_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        skill = get_object_or_404(CandidateSkill, id=skill_id, profile=profile)
        skill.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CandidateEmploymentCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        serializer = CandidateEmploymentSerializer(data=request.data)
        if serializer.is_valid():
            employment = CandidateEmployment.objects.create(
                profile=profile, **serializer.validated_data
            )
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
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, employment_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        employment = get_object_or_404(CandidateEmployment, id=employment_id, profile=profile)
        employment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CandidateEducationCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        serializer = CandidateEducationSerializer(data=request.data)
        if serializer.is_valid():
            education = CandidateEducation.objects.create(profile=profile, **serializer.validated_data)
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
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, education_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        education = get_object_or_404(CandidateEducation, id=education_id, profile=profile)
        education.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CandidateProjectCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        serializer = CandidateProjectSerializer(data=request.data)
        if serializer.is_valid():
            project = CandidateProject.objects.create(profile=profile, **serializer.validated_data)
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
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, project_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        project = get_object_or_404(CandidateProject, id=project_id, profile=profile)
        project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CandidateResumeUploadView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    def post(self, request):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        file_obj = (
            request.FILES.get("resume")
            or request.FILES.get("resume_file")
            or request.FILES.get("file")
        )
        if not file_obj:
            return Response({"detail": "Resume file is required."}, status=status.HTTP_400_BAD_REQUEST)
        profile.resume_file = file_obj
        profile.save(update_fields=["resume_file", "updated_at"])
        return Response(CandidateProfileSerializer(profile, context={"request": request}).data)
