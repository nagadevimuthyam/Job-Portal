from django.urls import reverse
from rest_framework.test import APITestCase
from apps.accounts.models import User
from apps.candidates.models import CandidateProfile, CandidateSkill
from apps.organizations.models import Organization


class EmployerSearchTests(APITestCase):
    def test_empty_search_returns_no_results(self):
        org = Organization.objects.create(
            name="Test Org",
            code="TEST02",
            address="Address",
            contact_number="123456",
        )
        employer = User.objects.create_user(
            email="employer2@example.com",
            password="StrongPass123!",
            full_name="Employer User 2",
            role=User.Role.EMPLOYER,
            organization=org,
        )
        candidate_user = User.objects.create_user(
            email="cand2@example.com",
            password="StrongPass123!",
            full_name="Cand 2",
            role=User.Role.CANDIDATE,
        )
        CandidateProfile.objects.create(
            user=candidate_user,
            full_name="Cand 2",
            email="cand2@example.com",
            phone="9999999999",
            location="Remote",
            summary="Backend engineer with Python experience.",
            work_status="EXPERIENCED",
            availability_to_join="1_MONTH",
            is_searchable=True,
        )

        self.client.force_authenticate(user=employer)
        url = reverse("employer-candidates")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 0)
        self.assertEqual(response.data["results"], [])

    def test_employer_can_search_candidates(self):
        org = Organization.objects.create(
            name="Test Org",
            code="TEST01",
            address="Address",
            contact_number="123456",
        )
        employer = User.objects.create_user(
            email="employer@example.com",
            password="StrongPass123!",
            full_name="Employer User",
            role=User.Role.EMPLOYER,
            organization=org,
        )
        candidate_user = User.objects.create_user(
            email="cand@example.com",
            password="StrongPass123!",
            full_name="Cand",
            role=User.Role.CANDIDATE,
        )
        profile = CandidateProfile.objects.create(
            user=candidate_user,
            full_name="Cand",
            email="cand@example.com",
            phone="9999999999",
            location="Remote",
            summary="Backend engineer with Python experience.",
            work_status="EXPERIENCED",
            availability_to_join="1_MONTH",
            is_searchable=True,
        )
        profile.profile_completion_percent = 80
        profile.save(update_fields=["profile_completion_percent"])
        CandidateSkill.objects.create(
            profile=profile,
            name="Python",
        )

        self.client.force_authenticate(user=employer)
        url = reverse("employer-candidates")
        response = self.client.get(f"{url}?keywords=Python")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)
        result = response.data["results"][0]
        self.assertIn("profile_image_url", result)
        self.assertIn("profile_completion_percent", result)

    def test_notice_period_immediate_joiner_filter(self):
        org = Organization.objects.create(
            name="Test Org",
            code="TEST03",
            address="Address",
            contact_number="123456",
        )
        employer = User.objects.create_user(
            email="employer3@example.com",
            password="StrongPass123!",
            full_name="Employer User 3",
            role=User.Role.EMPLOYER,
            organization=org,
        )
        immediate_user = User.objects.create_user(
            email="cand_immediate@example.com",
            password="StrongPass123!",
            full_name="Cand Immediate",
            role=User.Role.CANDIDATE,
        )
        immediate_profile = CandidateProfile.objects.create(
            user=immediate_user,
            full_name="Cand Immediate",
            email="cand_immediate@example.com",
            phone="9999999999",
            location="Remote",
            summary="Immediate joiner.",
            work_status="EXPERIENCED",
            notice_period_code=None,
            is_searchable=True,
        )
        immediate_profile.profile_completion_percent = 80
        immediate_profile.save(update_fields=["profile_completion_percent"])

        delayed_user = User.objects.create_user(
            email="cand_delayed@example.com",
            password="StrongPass123!",
            full_name="Cand Delayed",
            role=User.Role.CANDIDATE,
        )
        delayed_profile = CandidateProfile.objects.create(
            user=delayed_user,
            full_name="Cand Delayed",
            email="cand_delayed@example.com",
            phone="9999999999",
            location="Remote",
            summary="Has notice period.",
            work_status="EXPERIENCED",
            notice_period_code="15_DAYS_OR_LESS",
            is_searchable=True,
        )
        delayed_profile.profile_completion_percent = 80
        delayed_profile.save(update_fields=["profile_completion_percent"])

        self.client.force_authenticate(user=employer)
        url = reverse("employer-candidates")
        response = self.client.get(f"{url}?notice_period_code=IMMEDIATE_JOINER")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["id"], str(immediate_profile.id))
