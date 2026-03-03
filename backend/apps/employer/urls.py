from django.urls import path
from .views import (
    CandidateSearchView,
    CandidateDetailView,
    EmployerCandidateProfileView,
    RecentSearchListView,
    SaveSearchPresetView,
    SavedSearchDetailView,
    SavedSearchListView,
)

urlpatterns = [
    path("candidates/", CandidateSearchView.as_view(), name="employer-candidates"),
    path("search-presets/recent/", RecentSearchListView.as_view(), name="employer-search-recent"),
    path("search-presets/saved/", SavedSearchListView.as_view(), name="employer-search-saved"),
    path("search-presets/save/", SaveSearchPresetView.as_view(), name="employer-search-save"),
    path(
        "search-presets/saved/<uuid:preset_id>/",
        SavedSearchDetailView.as_view(),
        name="employer-search-saved-detail",
    ),
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
