from .views_basic_details import (
    CandidateBasicDetailsView,
    CandidatePersonalDetailsView,
    CandidatePhotoUploadView,
)
from .views_education import CandidateEducationCreateView, CandidateEducationUpdateDeleteView
from .views_employment import CandidateEmploymentCreateView, CandidateEmploymentUpdateDeleteView
from .views_profile import CandidateProfileOverviewView, CandidateProfileView
from .views_projects import CandidateProjectCreateView, CandidateProjectUpdateDeleteView
from .views_register import CandidateRegisterView
from .views_resume import CandidateResumeUploadView
from .views_skills import CandidateSkillBulkUpsertView, CandidateSkillCreateView, CandidateSkillDeleteView

__all__ = [
    "CandidateRegisterView",
    "CandidateProfileView",
    "CandidateProfileOverviewView",
    "CandidateBasicDetailsView",
    "CandidatePersonalDetailsView",
    "CandidatePhotoUploadView",
    "CandidateSkillCreateView",
    "CandidateSkillDeleteView",
    "CandidateSkillBulkUpsertView",
    "CandidateEmploymentCreateView",
    "CandidateEmploymentUpdateDeleteView",
    "CandidateEducationCreateView",
    "CandidateEducationUpdateDeleteView",
    "CandidateProjectCreateView",
    "CandidateProjectUpdateDeleteView",
    "CandidateResumeUploadView",
]
