from rest_framework.generics import RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from apps.masteradmin.permissions import IsEmployer
from apps.candidates.models import CandidateProfile
from apps.candidates.serializers import (
    CandidateSearchSerializer,
    CandidateProfileSerializer,
    CandidateSkillSerializer,
    CandidateEmploymentSerializer,
    CandidateEducationSerializer,
    CandidateProjectSerializer,
)


class CandidateDetailView(RetrieveAPIView):
    serializer_class = CandidateSearchSerializer
    permission_classes = [IsAuthenticated, IsEmployer]
    lookup_url_kwarg = "candidate_id"

    def get_queryset(self):
        return CandidateProfile.objects.all().prefetch_related(
            "skills",
            "employments",
            "educations",
            "projects",
        )


class EmployerCandidateProfileView(APIView):
    permission_classes = [IsAuthenticated, IsEmployer]

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

    def get(self, request, candidate_id):
        profile = get_object_or_404(
            CandidateProfile.objects.prefetch_related(
                "skills",
                "employments",
                "educations",
                "projects",
            ),
            id=candidate_id,
        )
        if (
            request.user.organization_id
            and profile.user.organization_id
            and request.user.organization_id != profile.user.organization_id
        ):
            return Response({"detail": "Not authorized."}, status=403)
        return Response(
            {
                "profile": CandidateProfileSerializer(profile, context={"request": request}).data,
                "skills": CandidateSkillSerializer(profile.skills.all(), many=True).data,
                "employments": CandidateEmploymentSerializer(profile.employments.all(), many=True).data,
                "educations": CandidateEducationSerializer(profile.educations.all(), many=True).data,
                "projects": CandidateProjectSerializer(profile.projects.all(), many=True).data,
                "profile_completion_percent": self._profile_completion(profile),
                "last_updated": profile.updated_at,
            }
        )
