from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from apps.masteradmin.permissions import IsCandidate
from .models import CandidateProfile, CandidateEducation
from .serializers import CandidateEducationSerializer
from .views_common import error_response, touch_profile


class CandidateEducationCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        serializer = CandidateEducationSerializer(data=request.data)
        if serializer.is_valid():
            education = CandidateEducation.objects.create(profile=profile, **serializer.validated_data)
            touch_profile(profile)
            return Response(
                CandidateEducationSerializer(education).data, status=status.HTTP_201_CREATED
            )
        return error_response(
            "Invalid education payload.",
            "EDUCATION_INVALID_PAYLOAD",
            serializer.errors,
        )


class CandidateEducationUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def patch(self, request, education_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        education = get_object_or_404(CandidateEducation, id=education_id, profile=profile)
        serializer = CandidateEducationSerializer(education, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            touch_profile(profile)
            return Response(serializer.data)
        return error_response(
            "Invalid education payload.",
            "EDUCATION_INVALID_PAYLOAD",
            serializer.errors,
        )

    def delete(self, request, education_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        education = get_object_or_404(CandidateEducation, id=education_id, profile=profile)
        education.delete()
        touch_profile(profile)
        return Response(status=status.HTTP_204_NO_CONTENT)
