from typing import List, Tuple


WEIGHTS = {
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

LABELS = {
    "personal_full_name": "Add full name",
    "personal_email": "Add email address",
    "personal_phone": "Add phone number",
    "personal_location": "Add location",
    "work_status": "Add work status",
    "availability": "Add availability",
    "summary": "Add summary",
    "skills": "Add key skills",
    "employment": "Add employment history",
    "education": "Add education details",
    "projects": "Add project details",
    "resume": "Upload resume",
}


def _build_missing_entry(key: str) -> dict:
    label = LABELS.get(key, "Add missing details")
    percent = WEIGHTS.get(key, 0)
    return {
        "key": key,
        "label": label,
        "percent": percent,
        "missing_field_label": label,
        "missing_percent": percent,
    }


def _has_availability(profile) -> bool:
    """
    Keep completion logic aligned with UI notice-period display:
    null/blank notice_period_code is treated as Immediate Joiner.
    """
    notice_code = profile.notice_period_code
    if notice_code in (None, "", 0, "0"):
        return True
    if isinstance(notice_code, str) and notice_code.strip():
        return True
    return bool(profile.availability_to_join)


def calculate_profile_completion(profile) -> Tuple[int, List[dict]]:
    total = 0
    missing = []

    if profile.full_name:
        total += WEIGHTS["personal_full_name"]
    else:
        missing.append(_build_missing_entry("personal_full_name"))

    if profile.email:
        total += WEIGHTS["personal_email"]
    else:
        missing.append(_build_missing_entry("personal_email"))

    if profile.phone:
        total += WEIGHTS["personal_phone"]
    else:
        missing.append(_build_missing_entry("personal_phone"))

    if profile.location:
        total += WEIGHTS["personal_location"]
    else:
        missing.append(_build_missing_entry("personal_location"))

    if profile.work_status:
        total += WEIGHTS["work_status"]
    else:
        missing.append(_build_missing_entry("work_status"))

    if _has_availability(profile):
        total += WEIGHTS["availability"]
    else:
        missing.append(_build_missing_entry("availability"))

    if profile.summary:
        total += WEIGHTS["summary"]
    else:
        missing.append(_build_missing_entry("summary"))

    if list(profile.skills.all()):
        total += WEIGHTS["skills"]
    else:
        missing.append(_build_missing_entry("skills"))

    if list(profile.employments.all()):
        total += WEIGHTS["employment"]
    else:
        missing.append(_build_missing_entry("employment"))

    if list(profile.educations.all()):
        total += WEIGHTS["education"]
    else:
        missing.append(_build_missing_entry("education"))

    if list(profile.projects.all()):
        total += WEIGHTS["projects"]
    else:
        missing.append(_build_missing_entry("projects"))

    if profile.resume_file:
        total += WEIGHTS["resume"]
    else:
        missing.append(_build_missing_entry("resume"))

    return min(total, 100), missing


def update_profile_completion(profile) -> Tuple[int, List[dict]]:
    percent, missing = calculate_profile_completion(profile)
    profile.profile_completion_percent = percent
    profile.save(update_fields=["profile_completion_percent"])
    return percent, missing
