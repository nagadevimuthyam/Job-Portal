from django.utils import timezone
from django.db.models import Q, F, ExpressionWrapper, IntegerField
from functools import reduce
from operator import or_
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from apps.masteradmin.permissions import IsEmployer
from apps.candidates.models import CandidateProfile
from apps.candidates.views_common import calculate_profile_completion
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

    def _has_value(self, value):
        if value is None:
            return False
        return str(value).strip() != ""

    def _has_search_inputs(self):
        params = self.request.query_params
        fields = [
            params.get("keywords"),
            params.get("location"),
            params.get("city"),
            params.get("state"),
            params.get("country"),
            params.get("exp_min"),
            params.get("exp_max"),
            params.get("skills"),
            params.get("skill_ids"),
            params.get("updated_within"),
            params.get("salary_min"),
            params.get("salary_max"),
            params.get("notice_period"),
            params.get("work_status"),
            params.get("availability_to_join"),
            params.get("education"),
        ]
        return any(self._has_value(value) for value in fields)

    def list(self, request, *args, **kwargs):
        if not self._has_search_inputs():
            return Response({"count": 0, "results": []})

        queryset = self.get_queryset()
        searchable_profiles = []
        for profile in queryset:
            completion_percent, _ = calculate_profile_completion(profile)
            if completion_percent >= 60:
                searchable_profiles.append(profile)

        page = self.paginate_queryset(searchable_profiles)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(searchable_profiles, many=True)
        return Response({"count": len(searchable_profiles), "results": serializer.data})

    def get_queryset(self):
        qs = CandidateProfile.objects.filter(
            is_searchable=True,
            user__is_active=True,
        ).prefetch_related(
            "skills",
            "employments",
            "educations",
            "projects",
        )

        keywords = self.request.query_params.get("keywords", "").strip()
        location = self.request.query_params.get("location", "").strip()
        city = self.request.query_params.get("city", "").strip()
        state = self.request.query_params.get("state", "").strip()
        country = self.request.query_params.get("country", "").strip()
        exp_min = self.request.query_params.get("exp_min")
        exp_max = self.request.query_params.get("exp_max")
        skills = self.request.query_params.get("skills", "").strip()
        skill_ids = self.request.query_params.get("skill_ids", "").strip()
        updated_within = self.request.query_params.get("updated_within")
        salary_min = self.request.query_params.get("salary_min")
        salary_max = self.request.query_params.get("salary_max")
        notice_period = self.request.query_params.get("notice_period")
        work_status = self.request.query_params.get("work_status", "").strip()
        availability = self.request.query_params.get("availability_to_join", "").strip()
        education_level = self.request.query_params.get("education", "").strip()

        total_months = ExpressionWrapper(
            F("total_experience_years") * 12 + F("total_experience_months"),
            output_field=IntegerField(),
        )
        qs = qs.annotate(total_experience_months_calc=total_months)

        or_filters = []

        if keywords:
            or_filters.append(
                Q(full_name__icontains=keywords)
                | Q(summary__icontains=keywords)
                | Q(skills__name__icontains=keywords)
            )
        if location:
            or_filters.append(
                Q(location__icontains=location)
                | Q(current_city__icontains=location)
                | Q(current_state__icontains=location)
                | Q(country__icontains=location)
            )
        if city:
            or_filters.append(Q(current_city__icontains=city))
        if state:
            or_filters.append(Q(current_state__icontains=state))
        if country:
            or_filters.append(Q(country__icontains=country))
        if exp_min:
            try:
                or_filters.append(
                    Q(total_experience_months_calc__gte=int(float(exp_min) * 12))
                )
            except ValueError:
                pass
        if exp_max:
            try:
                or_filters.append(
                    Q(total_experience_months_calc__lte=int(float(exp_max) * 12))
                )
            except ValueError:
                pass
        if skills:
            for skill in [s.strip() for s in skills.split(",") if s.strip()]:
                or_filters.append(Q(skills__name__icontains=skill))
        if skill_ids:
            try:
                ids = [int(value) for value in skill_ids.split(",") if value.strip().isdigit()]
                if ids:
                    or_filters.append(Q(skills__id__in=ids))
            except ValueError:
                pass
        if updated_within:
            try:
                days = int(updated_within)
                since = timezone.now() - timezone.timedelta(days=days)
                or_filters.append(Q(updated_at__gte=since))
            except ValueError:
                pass
        if salary_min:
            or_filters.append(Q(expected_salary__gte=salary_min))
        if salary_max:
            or_filters.append(Q(expected_salary__lte=salary_max))
        if notice_period:
            or_filters.append(Q(notice_period_days__lte=notice_period))
        if work_status:
            or_filters.append(Q(work_status=work_status))
        if availability:
            or_filters.append(Q(availability_to_join=availability))
        if education_level:
            or_filters.append(Q(educations__degree=education_level))

        if or_filters:
            qs = qs.filter(reduce(or_, or_filters))

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
