from django.db import models
from django.db.models import Count, Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListCreateAPIView

from apps.accounts.models import User
from apps.organizations.models import Organization
from apps.candidates.models import CandidateProfile
from .permissions import IsMasterAdmin
from .serializers import (
    OrganizationSerializer,
    OrganizationCreateSerializer,
    EmployerListSerializer,
    EmployerCreateSerializer,
)


class DashboardView(APIView):
    permission_classes = [IsMasterAdmin]

    def get(self, request):
        total_organizations = Organization.objects.count()
        total_employers = User.objects.filter(role=User.Role.EMPLOYER).count()
        total_candidates = CandidateProfile.objects.count()
        active_organizations = Organization.objects.filter(is_active=True).count()
        inactive_organizations = Organization.objects.filter(is_active=False).count()

        recent_organizations = (
            Organization.objects.annotate(
                employer_count=Count(
                    "employers",
                    filter=Q(employers__role=User.Role.EMPLOYER),
                )
            )
            .order_by("-created_at")
            .values("name", "code", "created_at", "is_active", "employer_count")[:5]
        )

        recent_employers = (
            User.objects.filter(role=User.Role.EMPLOYER)
            .select_related("organization")
            .order_by("-created_at")
            .values(
                "full_name",
                "email",
                "created_at",
                "is_active",
                org_name=models.F("organization__name"),
            )[:5]
        )

        recent_candidates = (
            CandidateProfile.objects.order_by("-created_at")
            .values("full_name", "email", "location", "created_at")[:5]
        )

        return Response(
            {
                "total_organizations": total_organizations,
                "total_employers": total_employers,
                "total_candidates": total_candidates,
                "active_organizations": active_organizations,
                "inactive_organizations": inactive_organizations,
                "recent_organizations": list(recent_organizations),
                "recent_employers": list(recent_employers),
                "recent_candidates": list(recent_candidates),
            }
        )


class OrganizationListCreateView(ListCreateAPIView):
    permission_classes = [IsMasterAdmin]

    def get_queryset(self):
        search = self.request.query_params.get("search", "").strip()
        qs = Organization.objects.all().annotate(
            employer_count=Count(
                "employers",
                filter=Q(employers__role=User.Role.EMPLOYER),
            )
        )
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(code__icontains=search))
        return qs.order_by("-created_at")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return OrganizationCreateSerializer
        return OrganizationSerializer


class EmployerListCreateView(ListCreateAPIView):
    permission_classes = [IsMasterAdmin]

    def get_queryset(self):
        search = self.request.query_params.get("search", "").strip()
        qs = User.objects.filter(role=User.Role.EMPLOYER).select_related("organization")
        if search:
            qs = qs.filter(
                Q(full_name__icontains=search)
                | Q(email__icontains=search)
                | Q(organization__name__icontains=search)
            )
        return qs.order_by("-created_at")

    def get_serializer_class(self):
        if self.request.method == "POST":
            return EmployerCreateSerializer
        return EmployerListSerializer

    def create(self, request, *args, **kwargs):
        serializer = EmployerCreateSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(
                EmployerListSerializer(user).data, status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
