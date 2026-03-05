from django.urls import reverse
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.skills.location_suggestions import load_locations_json


class LocationSuggestionTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="locations@example.com",
            password="StrongPass123!",
            full_name="Locations Tester",
            role=User.Role.CANDIDATE,
        )
        self.client.force_authenticate(user=self.user)

    def test_returns_empty_results_for_short_query(self):
        url = reverse("locations-suggest")
        response = self.client.get(url, {"q": "be"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"results": []})

    def test_returns_state_scoped_matches_with_limit(self):
        url = reverse("locations-suggest")
        response = self.client.get(url, {"q": "ben", "state": "karnataka", "limit": 5})
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("results", payload)
        self.assertLessEqual(len(payload["results"]), 5)
        for city in payload["results"]:
            self.assertIn("ben", city.lower())

    def test_location_json_loader_uses_process_cache(self):
        load_locations_json.cache_clear()
        first = load_locations_json()
        second = load_locations_json()
        self.assertIs(first, second)
