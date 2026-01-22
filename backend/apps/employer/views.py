from django.utils import timezone
from django.db.models import Q, F, ExpressionWrapper, IntegerField
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
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
from .pagination import CandidateSearchPagination


class CandidateSearchView(ListAPIView):
    serializer_class = CandidateSearchSerializer
    permission_classes = [IsAuthenticated, IsEmployer]
    pagination_class = CandidateSearchPagination

    def get_queryset(self):
        qs = CandidateProfile.objects.all().prefetch_related(
            "skills",
            "employments",
            "educations",
            "projects",
        )

        keywords = self.request.query_params.get("keywords", "").strip()
        location = self.request.query_params.get("location", "").strip()
        exp_min = self.request.query_params.get("exp_min")
        exp_max = self.request.query_params.get("exp_max")
        skills = self.request.query_params.get("skills", "").strip()
        updated_within = self.request.query_params.get("updated_within")
        salary_min = self.request.query_params.get("salary_min")
        salary_max = self.request.query_params.get("salary_max")
        notice_period = self.request.query_params.get("notice_period")

        total_months = ExpressionWrapper(
            F("total_experience_years") * 12 + F("total_experience_months"),
            output_field=IntegerField(),
        )
        qs = qs.annotate(total_experience_months=total_months)

        if keywords:
            qs = qs.filter(
                Q(full_name__icontains=keywords)
                | Q(summary__icontains=keywords)
                | Q(skills__name__icontains=keywords)
            )
        if location:
            qs = qs.filter(location__icontains=location)
        if exp_min:
            try:
                qs = qs.filter(total_experience_months__gte=int(float(exp_min) * 12))
            except ValueError:
                pass
        if exp_max:
            try:
                qs = qs.filter(total_experience_months__lte=int(float(exp_max) * 12))
            except ValueError:
                pass
        if skills:
            for skill in [s.strip() for s in skills.split(",") if s.strip()]:
                qs = qs.filter(skills__name__icontains=skill)
        if updated_within:
            try:
                days = int(updated_within)
                since = timezone.now() - timezone.timedelta(days=days)
                qs = qs.filter(updated_at__gte=since)
            except ValueError:
                pass
        if salary_min:
            qs = qs.filter(expected_salary__gte=salary_min)
        if salary_max:
            qs = qs.filter(expected_salary__lte=salary_max)
        if notice_period:
            qs = qs.filter(notice_period_days__lte=notice_period)
        return qs.distinct()


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
