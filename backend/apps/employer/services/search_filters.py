from django.db.models import Q, F, ExpressionWrapper, IntegerField
from apps.skills.models import normalize_skill_name
from apps.candidates.models import CandidateProfile
from apps.candidates.services.search import has_search_inputs, parse_updated_within


# Fields we want prefetch on every search query.
SEARCH_PREFETCH = (
    "skills",
    "employments",
    "educations",
    "projects",
)


def build_candidate_search_queryset():
    return CandidateProfile.objects.filter(
        is_searchable=True,
        user__is_active=True,
    ).select_related("user", "user__organization").prefetch_related(*SEARCH_PREFETCH)


def annotate_total_experience(queryset):
    total_months = ExpressionWrapper(
        F("total_experience_years") * 12 + F("total_experience_months"),
        output_field=IntegerField(),
    )
    return queryset.annotate(total_experience_months_calc=total_months)


def apply_search_filters(queryset, params):
    qs = annotate_total_experience(queryset)

    keywords = params.get("keywords", "").strip()
    location = params.get("location", "").strip()
    city = params.get("city", "").strip()
    state = params.get("state", "").strip()
    country = params.get("country", "").strip()
    exp_min = params.get("exp_min")
    exp_max = params.get("exp_max")
    skills = params.get("skills", "").strip()
    skill_ids = params.get("skill_ids", "").strip()
    updated_within = params.get("updated_within")
    updated_type = params.get("updated_type", "").strip().lower()
    salary_min = params.get("salary_min")
    salary_max = params.get("salary_max")
    notice_period_code = params.get("notice_period_code")
    gender = params.get("gender", "").strip()
    work_status = params.get("work_status", "").strip()
    availability = params.get("availability_to_join", "").strip()
    education_level = params.get("education", "").strip()

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
            qs = qs.filter(total_experience_months_calc__gte=int(float(exp_min) * 12))
        except ValueError:
            pass
    if exp_max:
        try:
            qs = qs.filter(total_experience_months_calc__lte=int(float(exp_max) * 12))
        except ValueError:
            pass

    skill_q = None
    if skills:
        tokens = [normalize_skill_name(s) for s in skills.split(",") if normalize_skill_name(s)]
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
    cutoff = parse_updated_within(updated_within)
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
        immediate_tokens = {"", "0", "ANY", "IMMEDIATE_JOINER", "IMMEDIATE"}
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


__all__ = ["has_search_inputs", "apply_search_filters"]
