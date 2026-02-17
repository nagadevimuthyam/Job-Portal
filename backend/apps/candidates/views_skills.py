from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import F
from django.shortcuts import get_object_or_404

from apps.masteradmin.permissions import IsCandidate
from apps.skills.models import Skill, normalize_skill_name
from .models import CandidateProfile, CandidateSkill
from .serializers import CandidateSkillSerializer
from .views_common import error_response, touch_profile


class CandidateSkillCreateView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def post(self, request):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        serializer = CandidateSkillSerializer(data=request.data)
        if serializer.is_valid():
            skill = CandidateSkill.objects.create(profile=profile, **serializer.validated_data)
            normalized = normalize_skill_name(skill.name)
            if normalized:
                skill_obj, created = Skill.objects.get_or_create(
                    normalized_name=normalized,
                    defaults={"name": skill.name, "popularity": 1},
                )
                if not created:
                    Skill.objects.filter(id=skill_obj.id).update(popularity=F("popularity") + 1)
            touch_profile(profile)
            return Response(CandidateSkillSerializer(skill).data, status=status.HTTP_201_CREATED)
        return error_response(
            "Invalid skill payload.",
            "SKILL_INVALID_PAYLOAD",
            serializer.errors,
        )


class CandidateSkillDeleteView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def delete(self, request, skill_id):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        skill = get_object_or_404(CandidateSkill, id=skill_id, profile=profile)
        skill.delete()
        touch_profile(profile)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CandidateSkillBulkUpsertView(APIView):
    permission_classes = [IsAuthenticated, IsCandidate]

    def put(self, request):
        profile = get_object_or_404(CandidateProfile, user=request.user)
        payload = request.data.get("skills", [])
        if not isinstance(payload, list):
            return error_response(
                "Skills must be a list.",
                "SKILL_INVALID_PAYLOAD",
                {"skills": "Must be a list."},
            )

        desired = []
        seen = set()
        for item in payload:
            name = ""
            if isinstance(item, dict):
                name = (item.get("name") or "").strip()
            elif isinstance(item, str):
                name = item.strip()
            if not name:
                continue
            normalized = normalize_skill_name(name)
            if not normalized or normalized in seen:
                continue
            seen.add(normalized)
            desired.append({"name": name, "normalized": normalized})

        existing = list(CandidateSkill.objects.filter(profile=profile))
        existing_map = {normalize_skill_name(skill.name): skill for skill in existing}

        desired_norms = {item["normalized"] for item in desired}
        to_delete = [skill.id for key, skill in existing_map.items() if key not in desired_norms]
        to_create = [item for item in desired if item["normalized"] not in existing_map]

        if to_delete:
            CandidateSkill.objects.filter(id__in=to_delete, profile=profile).delete()

        created_skills = []
        for item in to_create:
            created_skills.append(CandidateSkill(profile=profile, name=item["name"]))

        if created_skills:
            CandidateSkill.objects.bulk_create(created_skills)

        for item in to_create:
            skill_obj, created = Skill.objects.get_or_create(
                normalized_name=item["normalized"],
                defaults={"name": item["name"], "popularity": 1},
            )
            if not created:
                Skill.objects.filter(id=skill_obj.id).update(popularity=F("popularity") + 1)

        touch_profile(profile)
        updated = CandidateSkill.objects.filter(profile=profile)
        return Response(CandidateSkillSerializer(updated, many=True).data, status=status.HTTP_200_OK)
