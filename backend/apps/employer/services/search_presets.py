import hashlib
import json

from django.db import transaction
from django.utils import timezone

from ..models import EmployerSearchPreset


DEFAULT_FILTER_VALUES = {
    "updated_within": "6_MONTHS",
    "updated_type": "active",
    "notice_period_code": "IMMEDIATE_JOINER",
}

COMMA_SORT_FIELDS = {"skills", "skill_ids", "gender"}
NUMERIC_FILTER_KEYS = {"exp_min", "exp_max", "salary_min", "salary_max"}
VALID_UPDATED_WITHIN = {"1_DAY", "3_DAYS", "7_DAYS", "15_DAYS", "1_MONTH", "3_MONTHS", "6_MONTHS"}
VALID_UPDATED_TYPE = {"active", "created"}


def _normalize_scalar(value):
    if isinstance(value, str):
        value = value.strip()
        if not value:
            return None
        return value
    if value in (None, "", [], {}):
        return None
    return value


def canonicalize_effective_filters(filters):
    cleaned = {}
    for key in sorted(filters.keys()):
        value = filters.get(key)
        normalized = _normalize_scalar(value)
        if normalized is None:
            continue
        if isinstance(normalized, list):
            normalized = sorted(str(item).strip() for item in normalized if str(item).strip())
            if not normalized:
                continue
        elif key in COMMA_SORT_FIELDS and isinstance(normalized, str):
            tokens = [token.strip() for token in normalized.split(",") if token.strip()]
            normalized = ",".join(sorted(tokens))
            if not normalized:
                continue
        elif key in NUMERIC_FILTER_KEYS:
            numeric_value = str(normalized).replace(",", "").strip()
            try:
                float(numeric_value)
                normalized = numeric_value
            except ValueError:
                continue
        elif key == "updated_within":
            if str(normalized).upper() not in VALID_UPDATED_WITHIN:
                continue
            normalized = str(normalized).upper()
        elif key == "updated_type":
            normalized = str(normalized).strip().lower()
            if normalized == "active_updated":
                normalized = "active"
            if normalized not in VALID_UPDATED_TYPE:
                continue
        if str(normalized) == str(DEFAULT_FILTER_VALUES.get(key)):
            continue
        cleaned[key] = normalized
    return cleaned


def build_filters_hash(effective_filters):
    payload = json.dumps(
        effective_filters,
        sort_keys=True,
        separators=(",", ":"),
        ensure_ascii=True,
    )
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


@transaction.atomic
def upsert_recent_search(*, employer, effective_filters):
    if not effective_filters:
        return None

    now = timezone.now()
    filters_hash = build_filters_hash(effective_filters)
    preset, created = EmployerSearchPreset.objects.select_for_update().get_or_create(
        employer=employer,
        filters_hash=filters_hash,
        defaults={
            "filters": effective_filters,
            "is_saved": False,
            "run_count": 1,
            "last_run_at": now,
        },
    )
    if not created:
        preset.filters = effective_filters
        preset.last_run_at = now
        preset.run_count = (preset.run_count or 0) + 1
        preset.save(update_fields=["filters", "last_run_at", "run_count", "updated_at"])

    stale_recent_ids = list(
        EmployerSearchPreset.objects.filter(employer=employer, is_saved=False)
        .order_by("-last_run_at", "-created_at")
        .values_list("id", flat=True)[10:]
    )
    if stale_recent_ids:
        EmployerSearchPreset.objects.filter(id__in=stale_recent_ids).delete()

    return preset
