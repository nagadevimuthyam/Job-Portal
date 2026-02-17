from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from apps.masteradmin.permissions import IsCandidate
from .models import CandidateProfile, CandidateProject
from .serializers import CandidateProjectSerializer
from .views_common import error_response, touch_profile


class CandidateProjectCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        serializer = CandidateProjectSerializer(data=request.data)
        if serializer.is_valid():
            project = CandidateProject.objects.create(profile=profile, **serializer.validated_data)
            touch_profile(profile)
            return Response(
                CandidateProjectSerializer(project).data, status=status.HTTP_201_CREATED
            )
        return error_response(
            "Invalid project payload.",
            "PROJECT_INVALID_PAYLOAD",
            serializer.errors,
        )


class CandidateProjectUpdateDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def patch(self, request, project_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        project = get_object_or_404(CandidateProject, id=project_id, profile=profile)
        serializer = CandidateProjectSerializer(project, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            touch_profile(profile)
            return Response(serializer.data)
        return error_response(
            "Invalid project payload.",
            "PROJECT_INVALID_PAYLOAD",
            serializer.errors,
        )

    def delete(self, request, project_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        project = get_object_or_404(CandidateProject, id=project_id, profile=profile)
        project.delete()
        touch_profile(profile)
        return Response(status=status.HTTP_204_NO_CONTENT)
