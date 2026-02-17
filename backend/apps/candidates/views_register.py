from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import CandidateRegisterSerializer, CandidateProfileSerializer
from .views_common import error_response


class CandidateRegisterView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = CandidateRegisterSerializer(data=request.data)
        if serializer.is_valid():
            profile = serializer.save()
            return Response(CandidateProfileSerializer(profile).data, status=status.HTTP_201_CREATED)
        return error_response(
            "Invalid registration payload.",
            "REGISTER_INVALID_PAYLOAD",
            serializer.errors,
        )
