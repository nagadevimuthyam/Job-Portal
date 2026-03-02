from typing import Any

from django.utils import timezone


def has_value(value: Any) -> bool:
    if value is None:
        return False
    return str(value).strip() != ""


def has_search_inputs(params: dict) -> bool:
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
    return any(has_value(value) for value in fields)


def parse_updated_within(value: Any):
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
