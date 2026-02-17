from datetime import timedelta

from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APITestCase

from apps.accounts.models import User
from apps.candidates.models import CandidateProfile


class CandidateProfileFlowTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            email="flowtest@example.com",
            password="StrongPass123!",
            full_name="Flow Test",
            role=User.Role.CANDIDATE,
        )
        self.profile = CandidateProfile.objects.create(
            user=self.user,
            full_name="Flow Test",
            email="flowtest@example.com",
            phone="9999999999",
            location="Bangalore",
            location_country="India",
        )
        self.client.force_authenticate(user=self.user)

    def test_profile_overview_structure(self):
        url = reverse("candidate-profile-overview")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        data = response.json()
        for key in (
            "profile",
            "skills",
            "employments",
            "educations",
            "projects",
            "profile_completion_percent",
            "missing_details",
            "missing_count",
            "last_updated",
        ):
            self.assertIn(key, data)

    def test_basic_details_requires_experience_years(self):
        url = reverse("candidate-profile-basic")
        response = self.client.patch(
            url,
            {"work_status": "EXPERIENCED", "total_experience_years": 0},
            format="json",
        )
        self.assertEqual(response.status_code, 400)
        payload = response.json()
        self.assertIn("errors", payload)
        self.assertIn("total_experience_years", payload["errors"])

    def test_personal_details_rejects_future_dob(self):
        url = reverse("candidate-profile-personal")
        future_date = (timezone.now().date() + timedelta(days=1)).isoformat()
        response = self.client.patch(url, {"dob": future_date}, format="json")
        self.assertEqual(response.status_code, 400)
        payload = response.json()
        self.assertIn("errors", payload)
        self.assertIn("dob", payload["errors"])

    def test_resume_upload_success(self):
        url = reverse("candidate-resume-upload")
        file_obj = SimpleUploadedFile(
            "resume.pdf",
            b"%PDF-1.4 test file",
            content_type="application/pdf",
        )
        response = self.client.post(url, {"resume": file_obj}, format="multipart")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("profile", payload)
        self.assertTrue(payload["profile"].get("resume_url"))
