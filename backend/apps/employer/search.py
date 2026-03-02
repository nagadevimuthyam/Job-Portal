from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from apps.masteradmin.permissions import IsEmployer
from apps.candidates.models import CandidateProfile
from apps.candidates.views_common import calculate_profile_completion
from apps.candidates.serializers import CandidateSearchSerializer
from .pagination import CandidateSearchPagination
from .services.search_filters import (
    has_search_inputs,
    apply_search_filters,
    build_candidate_search_queryset,
)


class CandidateSearchView(ListAPIView):
    serializer_class = CandidateSearchSerializer
    permission_classes = [IsAuthenticated, IsEmployer]
    pagination_class = CandidateSearchPagination

    def list(self, request, *args, **kwargs):
        if not has_search_inputs(self.request.query_params):
            return Response({"count": 0, "results": []})

        queryset = self.get_queryset()
        searchable_profiles = []
        for profile in queryset:
            completion_percent = profile.profile_completion_percent
            if completion_percent in (None, 0):
                completion_percent, _ = calculate_profile_completion(profile)
            if completion_percent >= 60:
                searchable_profiles.append(profile)

        page = self.paginate_queryset(searchable_profiles)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(searchable_profiles, many=True)
        return Response({"count": len(searchable_profiles), "results": serializer.data})

    def get_queryset(self):
        base_qs = build_candidate_search_queryset()
        return apply_search_filters(base_qs, self.request.query_params)
