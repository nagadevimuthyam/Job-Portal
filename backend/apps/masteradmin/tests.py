from django.urls import reverse
from rest_framework.test import APITestCase
from apps.accounts.models import User


class MasterDashboardTests(APITestCase):
    def test_master_dashboard(self):
        master = User.objects.create_user(
            email="master@example.com",
            password="StrongPass123!",
            full_name="Master",
            role=User.Role.MASTER_ADMIN,
        )
        self.client.force_authenticate(user=master)
        url = reverse("master-dashboard")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertIn("total_organizations", response.data)
