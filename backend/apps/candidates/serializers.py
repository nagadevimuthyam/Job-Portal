from .serializers_split.register import CandidateRegisterSerializer
from .serializers_split.profile import (
    CandidateProfileSerializer,
    CandidateProfileUpdateSerializer,
    CandidatePersonalDetailsSerializer,
    CandidateBasicDetailsSerializer,
)
from .serializers_split.entities import (
    CandidateSkillSerializer,
    CandidateEmploymentSerializer,
    CandidateEducationSerializer,
    CandidateProjectSerializer,
)
from .serializers_split.responses import (
    CandidateProfileResponseSerializer,
    CandidateSearchSerializer,
)

__all__ = [
    "CandidateRegisterSerializer",
    "CandidateProfileSerializer",
    "CandidateProfileUpdateSerializer",
    "CandidatePersonalDetailsSerializer",
    "CandidateBasicDetailsSerializer",
    "CandidateSkillSerializer",
    "CandidateEmploymentSerializer",
    "CandidateEducationSerializer",
    "CandidateProjectSerializer",
    "CandidateProfileResponseSerializer",
    "CandidateSearchSerializer",
]
