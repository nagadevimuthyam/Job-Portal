from django.urls import reverse
from rest_framework.test import APITestCase
from apps.accounts.models import User


class CandidateRegisterTests(APITestCase):
    def test_candidate_register(self):
        url = reverse("candidate-register")
        payload = {
            "full_name": "Test Candidate",
            "email": "candidate@example.com",
            "password": "StrongPass123!",
            "phone": "9999999999",
        }
        response = self.client.post(url, payload, format="json")
        self.assertEqual(response.status_code, 201)
        self.assertTrue(User.objects.filter(email="candidate@example.com").exists())
