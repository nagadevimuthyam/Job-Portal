from django.urls import path
from .views import SkillSuggestionView

urlpatterns = [
    path("suggest/", SkillSuggestionView.as_view(), name="skills-suggest"),
]
