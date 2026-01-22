from django.urls import path
from .views import CandidateSearchView, CandidateDetailView, EmployerCandidateProfileView

urlpatterns = [
    path("candidates/", CandidateSearchView.as_view(), name="employer-candidates"),
    path(
        "candidates/<uuid:candidate_id>/",
        CandidateDetailView.as_view(),
        name="employer-candidate-detail",
    ),
    path(
        "candidates/<uuid:candidate_id>/profile/",
        EmployerCandidateProfileView.as_view(),
        name="employer-candidate-profile",
    ),
]
