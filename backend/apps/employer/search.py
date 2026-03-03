import logging

from django.db import DatabaseError, OperationalError, ProgrammingError
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.masteradmin.permissions import IsEmployer
from apps.candidates.views_common import calculate_profile_completion
from apps.candidates.serializers import CandidateSearchSerializer
from .pagination import CandidateSearchPagination
from .models import EmployerSearchPreset
from .serializers import (
    EmployerSearchPresetSerializer,
    RenameSearchPresetSerializer,
    SaveSearchPresetSerializer,
)
from .services.search_filters import (
    has_search_inputs,
    apply_search_filters,
    build_candidate_search_queryset,
)
from .services.search_presets import canonicalize_effective_filters, upsert_recent_search

logger = logging.getLogger(__name__)


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
            response = self.get_paginated_response(serializer.data)
            self._log_recent_search(request)
            return response

        serializer = self.get_serializer(searchable_profiles, many=True)
        response = Response({"count": len(searchable_profiles), "results": serializer.data})
        self._log_recent_search(request)
        return response

    def get_queryset(self):
        base_qs = build_candidate_search_queryset()
        return apply_search_filters(base_qs, self.request.query_params)

    def _log_recent_search(self, request):
        raw_filters = {key: value for key, value in request.query_params.items()}
        effective_filters = canonicalize_effective_filters(raw_filters)
        if not effective_filters:
            return
        try:
            upsert_recent_search(employer=request.user, effective_filters=effective_filters)
        except (OperationalError, ProgrammingError, DatabaseError):
            # Fail open: candidate search must not break if preset storage is unavailable.
            logger.exception("Recent search logging failed for employer %s", request.user.id)


class RecentSearchListView(ListAPIView):
    serializer_class = EmployerSearchPresetSerializer
    permission_classes = [IsAuthenticated, IsEmployer]
    pagination_class = None

    def get_queryset(self):
        return EmployerSearchPreset.objects.filter(
            employer=self.request.user,
            is_saved=False,
        ).order_by("-last_run_at", "-created_at")[:10]

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except (OperationalError, ProgrammingError, DatabaseError):
            logger.exception("Recent search list failed for employer %s", request.user.id)
            return Response([])


class SavedSearchListView(ListAPIView):
    serializer_class = EmployerSearchPresetSerializer
    permission_classes = [IsAuthenticated, IsEmployer]
    pagination_class = None

    def get_queryset(self):
        return EmployerSearchPreset.objects.filter(
            employer=self.request.user,
            is_saved=True,
        ).order_by("-updated_at", "-last_run_at")

    def list(self, request, *args, **kwargs):
        try:
            return super().list(request, *args, **kwargs)
        except (OperationalError, ProgrammingError, DatabaseError):
            logger.exception("Saved search list failed for employer %s", request.user.id)
            return Response([])


class SaveSearchPresetView(APIView):
    permission_classes = [IsAuthenticated, IsEmployer]

    def post(self, request):
        try:
            serializer = SaveSearchPresetSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            payload = serializer.validated_data
            title = (payload.get("title") or "").strip()
            preset_id = payload.get("preset_id")

            if preset_id:
                preset = get_object_or_404(
                    EmployerSearchPreset,
                    id=preset_id,
                    employer=request.user,
                )
                preset.is_saved = True
                if title:
                    preset.title = title
                preset.save(update_fields=["is_saved", "title", "updated_at"])
            else:
                effective_filters = canonicalize_effective_filters(payload.get("filters", {}))
                if not effective_filters:
                    return Response(
                        {"detail": "Add filters before saving."},
                        status=status.HTTP_400_BAD_REQUEST,
                    )
                preset = upsert_recent_search(
                    employer=request.user,
                    effective_filters=effective_filters,
                )
                preset.is_saved = True
                preset.title = title or preset.title
                preset.save(update_fields=["is_saved", "title", "updated_at"])

            return Response(EmployerSearchPresetSerializer(preset).data, status=status.HTTP_200_OK)
        except (OperationalError, ProgrammingError, DatabaseError):
            logger.exception("Save search preset failed for employer %s", request.user.id)
            return Response(
                {"detail": "Search presets are temporarily unavailable."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )


class SavedSearchDetailView(APIView):
    permission_classes = [IsAuthenticated, IsEmployer]

    def patch(self, request, preset_id):
        try:
            preset = get_object_or_404(
                EmployerSearchPreset,
                id=preset_id,
                employer=request.user,
                is_saved=True,
            )
            serializer = RenameSearchPresetSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            preset.title = serializer.validated_data["title"].strip()
            preset.save(update_fields=["title", "updated_at"])
            return Response(EmployerSearchPresetSerializer(preset).data, status=status.HTTP_200_OK)
        except (OperationalError, ProgrammingError, DatabaseError):
            logger.exception("Rename search preset failed for employer %s", request.user.id)
            return Response(
                {"detail": "Search presets are temporarily unavailable."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

    def delete(self, request, preset_id):
        try:
            preset = get_object_or_404(
                EmployerSearchPreset,
                id=preset_id,
                employer=request.user,
                is_saved=True,
            )
            preset.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except (OperationalError, ProgrammingError, DatabaseError):
            logger.exception("Delete search preset failed for employer %s", request.user.id)
            return Response(
                {"detail": "Search presets are temporarily unavailable."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )
