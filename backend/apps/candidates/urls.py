from django.urls import path
from .views import (
    CandidateRegisterView,
    CandidateProfileView,
    CandidateProfileOverviewView,
    CandidateBasicDetailsView,
    CandidatePersonalDetailsView,
    CandidatePhotoUploadView,
    CandidateSkillCreateView,
    CandidateSkillDeleteView,
    CandidateSkillBulkUpsertView,
    CandidateEmploymentCreateView,
    CandidateEmploymentUpdateDeleteView,
    CandidateEducationCreateView,
    CandidateEducationUpdateDeleteView,
    CandidateProjectCreateView,
    CandidateProjectUpdateDeleteView,
    CandidateResumeUploadView,
)

urlpatterns = [
    path("register/", CandidateRegisterView.as_view(), name="candidate-register"),
    path("profile/", CandidateProfileView.as_view(), name="candidate-profile"),
    path("profile/overview/", CandidateProfileOverviewView.as_view(), name="candidate-profile-overview"),
    path("profile/basic-details/", CandidateBasicDetailsView.as_view(), name="candidate-profile-basic"),
    path("profile/personal-details/", CandidatePersonalDetailsView.as_view(), name="candidate-profile-personal"),
    path("profile/photo/", CandidatePhotoUploadView.as_view(), name="candidate-profile-photo"),
    path("profile/skills/", CandidateSkillCreateView.as_view(), name="candidate-skill-create"),
    path(
        "profile/skills/bulk/",
        CandidateSkillBulkUpsertView.as_view(),
        name="candidate-skill-bulk",
    ),
    path(
        "profile/skills/<uuid:skill_id>/",
        CandidateSkillDeleteView.as_view(),
        name="candidate-skill-delete",
    ),
    path(
        "profile/employments/",
        CandidateEmploymentCreateView.as_view(),
        name="candidate-employment-create",
    ),
    path(
        "profile/employments/<uuid:employment_id>/",
        CandidateEmploymentUpdateDeleteView.as_view(),
        name="candidate-employment-update-delete",
    ),
    path(
        "profile/educations/",
        CandidateEducationCreateView.as_view(),
        name="candidate-education-create",
    ),
    path(
        "profile/educations/<uuid:education_id>/",
        CandidateEducationUpdateDeleteView.as_view(),
        name="candidate-education-update-delete",
    ),
    path(
        "profile/projects/",
        CandidateProjectCreateView.as_view(),
        name="candidate-project-create",
    ),
    path(
        "profile/projects/<uuid:project_id>/",
        CandidateProjectUpdateDeleteView.as_view(),
        name="candidate-project-update-delete",
    ),
    path("profile/resume/", CandidateResumeUploadView.as_view(), name="candidate-resume-upload"),
]
