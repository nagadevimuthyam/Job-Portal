from django.urls import path

from .views_locations import LocationSuggestionView


urlpatterns = [
    path("suggest/", LocationSuggestionView.as_view(), name="locations-suggest"),
]
