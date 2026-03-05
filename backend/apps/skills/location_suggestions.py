import json
from functools import lru_cache
from pathlib import Path

from django.conf import settings

from .models import normalize_skill_name


@lru_cache(maxsize=1)
def load_locations_json():
    path = Path(settings.BASE_DIR) / "seed" / "esco" / "Indian_Cities_In_States.json"
    if not path.exists():
        return {}, []

    with path.open("r", encoding="utf-8") as jsonfile:
        raw = json.load(jsonfile)

    state_to_cities = {}
    all_city_rows = []
    for state, cities in raw.items():
        if not isinstance(state, str) or not isinstance(cities, list):
            continue

        cleaned_cities = []
        for city in cities:
            if not isinstance(city, str):
                continue
            cleaned = " ".join(city.split()).strip()
            if not cleaned:
                continue
            cleaned_cities.append(cleaned)
            all_city_rows.append((state, cleaned))
        state_to_cities[state] = cleaned_cities

    return state_to_cities, all_city_rows


def suggest_location_names(raw_q, state=None, limit=10):
    query = normalize_skill_name(raw_q or "")
    if len(query) < 3:
        return []

    state_to_cities, all_city_rows = load_locations_json()
    if not state_to_cities:
        return []

    rows = all_city_rows
    if state:
        normalized_state = normalize_skill_name(state)
        selected_state = next(
            (
                state_name
                for state_name in state_to_cities.keys()
                if normalize_skill_name(state_name) == normalized_state
            ),
            None,
        )
        if not selected_state:
            return []
        rows = [(selected_state, city) for city in state_to_cities.get(selected_state, [])]

    prefix = []
    contains = []
    for city_state, city_name in rows:
        normalized_city = normalize_skill_name(city_name)
        row = (city_state, city_name, normalized_city)
        if normalized_city.startswith(query):
            prefix.append(row)
        elif query in normalized_city:
            contains.append(row)

    merged = prefix + contains
    seen = set()
    results = []
    for _, city_name, normalized_city in merged:
        if normalized_city in seen:
            continue
        seen.add(normalized_city)
        results.append(city_name)
        if len(results) >= limit:
            break

    return results
