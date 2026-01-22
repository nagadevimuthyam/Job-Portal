from django.urls import path
from .views import DashboardView, OrganizationListCreateView, EmployerListCreateView

urlpatterns = [
    path("dashboard/", DashboardView.as_view(), name="master-dashboard"),
    path("organizations/", OrganizationListCreateView.as_view(), name="master-organizations"),
    path("employers/", EmployerListCreateView.as_view(), name="master-employers"),
]
