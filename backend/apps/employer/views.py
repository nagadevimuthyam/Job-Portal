from django.utils import timezone
from django.db.models import Q, F, ExpressionWrapper, IntegerField
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from apps.masteradmin.permissions import IsEmployer
from apps.candidates.models import CandidateProfile
from apps.skills.models import normalize_skill_name
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
            params.get("updated_type"),
            params.get("salary_min"),
            params.get("salary_max"),
            params.get("notice_period_code"),
            params.get("gender"),
            params.get("work_status"),
            params.get("availability_to_join"),
            params.get("education"),
        ]
        return any(self._has_value(value) for value in fields)

    def _parse_updated_within(self, value):
        if value is None:
            return None
        value = str(value).strip()
        if not value:
            return None
        upper = value.upper()
        token_map = {
            "1_DAY": 1,
            "3_DAYS": 3,
            "7_DAYS": 7,
            "15_DAYS": 15,
            "1_MONTH": 30,
            "3_MONTHS": 90,
            "6_MONTHS": 180,
            "6M": 180,
            "1M": 30,
        }
        if upper in token_map:
            return timezone.now() - timezone.timedelta(days=token_map[upper])
        try:
            days = int(value)
            return timezone.now() - timezone.timedelta(days=days)
        except ValueError:
            return None

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
        updated_type = self.request.query_params.get("updated_type", "").strip().lower()
        salary_min = self.request.query_params.get("salary_min")
        salary_max = self.request.query_params.get("salary_max")
        notice_period_code = self.request.query_params.get("notice_period_code")
        gender = self.request.query_params.get("gender", "").strip()
        work_status = self.request.query_params.get("work_status", "").strip()
        availability = self.request.query_params.get("availability_to_join", "").strip()
        education_level = self.request.query_params.get("education", "").strip()

        total_months = ExpressionWrapper(
            F("total_experience_years") * 12 + F("total_experience_months"),
            output_field=IntegerField(),
        )
        qs = qs.annotate(total_experience_months_calc=total_months)

        if keywords:
            keyword_q = (
                Q(full_name__icontains=keywords)
                | Q(summary__icontains=keywords)
                | Q(skills__name__icontains=keywords)
            )
            qs = qs.filter(keyword_q)
        if location:
            location_q = (
                Q(location__iexact=location)
                | Q(current_city__iexact=location)
                | Q(current_state__iexact=location)
                | Q(country__iexact=location)
            )
            qs = qs.filter(location_q)
        if city:
            qs = qs.filter(current_city__iexact=city)
        if state:
            qs = qs.filter(current_state__iexact=state)
        if country:
            qs = qs.filter(country__iexact=country)
        if exp_min:
            try:
                qs = qs.filter(
                    total_experience_months_calc__gte=int(float(exp_min) * 12)
                )
            except ValueError:
                pass
        if exp_max:
            try:
                qs = qs.filter(
                    total_experience_months_calc__lte=int(float(exp_max) * 12)
                )
            except ValueError:
                pass
        skill_q = None
        if skills:
            tokens = [
                normalize_skill_name(s)
                for s in skills.split(",")
                if normalize_skill_name(s)
            ]
            for token in tokens:
                token_q = (
                    Q(skills__normalized_name__icontains=token)
                    | Q(skills__skill__normalized_name__icontains=token)
                )
                skill_q = token_q if skill_q is None else skill_q | token_q
        if skill_ids:
            ids = [value for value in skill_ids.split(",") if value.strip()]
            if ids:
                ids_q = Q(skills__skill_id__in=ids)
                skill_q = ids_q if skill_q is None else skill_q | ids_q
        if skill_q is not None:
            qs = qs.filter(skill_q)
        normalized_type = (updated_type or "").lower()
        if normalized_type in {"active_updated", "active/updated"}:
            normalized_type = "active"
        if not normalized_type:
            normalized_type = "active"
        cutoff = self._parse_updated_within(updated_within)
        if cutoff:
            if normalized_type == "created":
                qs = qs.filter(created_at__gte=cutoff).order_by("-created_at")
            else:
                qs = qs.filter(last_active_at__gte=cutoff).order_by("-last_active_at")
        if salary_min:
            try:
                qs = qs.filter(expected_salary__gte=int(str(salary_min).replace(",", "")))
            except ValueError:
                pass
        if salary_max:
            try:
                qs = qs.filter(expected_salary__lte=int(str(salary_max).replace(",", "")))
            except ValueError:
                pass
        if notice_period_code is not None:
            normalized_notice = str(notice_period_code).strip()
            immediate_tokens = {
                "",
                "0",
                "ANY",
                "IMMEDIATE_JOINER",
                "IMMEDIATE",
            }
            if normalized_notice.upper() in immediate_tokens:
                qs = qs.filter(
                    Q(notice_period_code__isnull=True)
                    | Q(notice_period_code="")
                    | Q(notice_period_code="0")
                    | Q(notice_period_code__in=["IMMEDIATE_JOINER", "IMMEDIATE", "ANY"])
                )
            elif normalized_notice:
                qs = qs.filter(notice_period_code=normalized_notice)
        if gender:
            gender_values = [value.strip().upper() for value in gender.split(",") if value.strip()]
            if gender_values:
                qs = qs.filter(gender__in=gender_values)
        if work_status:
            normalized_status = work_status.strip().upper()
            if normalized_status == "FRESHER":
                qs = qs.filter(total_experience_months_calc=0)
            elif normalized_status == "EXPERIENCED":
                qs = qs.filter(total_experience_months_calc__gt=0)
            else:
                qs = qs.filter(work_status=work_status)
        if availability:
            qs = qs.filter(availability_to_join=availability)
        if education_level:
            qs = qs.filter(educations__degree=education_level)

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
