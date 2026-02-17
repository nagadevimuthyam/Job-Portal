from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from apps.masteradmin.permissions import IsCandidate
from .models import CandidateProfile, CandidateEmployment
from .serializers import CandidateEmploymentSerializer
from .views_common import error_response, touch_profile


class CandidateEmploymentCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        serializer = CandidateEmploymentSerializer(data=request.data)
        if serializer.is_valid():
            employment = CandidateEmployment.objects.create(
                profile=profile, **serializer.validated_data
            )
            touch_profile(profile)
            return Response(
                CandidateEmploymentSerializer(employment).data, status=status.HTTP_201_CREATED
            )
        return error_response(
            "Invalid employment payload.",
            "EMPLOYMENT_INVALID_PAYLOAD",
            serializer.errors,
        )


class CandidateEmploymentUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def patch(self, request, employment_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        employment = get_object_or_404(CandidateEmployment, id=employment_id, profile=profile)
        serializer = CandidateEmploymentSerializer(employment, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            touch_profile(profile)
            return Response(serializer.data)
        return error_response(
            "Invalid employment payload.",
            "EMPLOYMENT_INVALID_PAYLOAD",
            serializer.errors,
        )

    def delete(self, request, employment_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        employment = get_object_or_404(CandidateEmployment, id=employment_id, profile=profile)
        employment.delete()
        touch_profile(profile)
        return Response(status=status.HTTP_204_NO_CONTENT)
