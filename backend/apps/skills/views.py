from django.core.cache import cache
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Skill, normalize_skill_name
from .serializers import SkillSuggestionSerializer


class SkillSuggestionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        raw_q = (request.query_params.get("q") or "").strip()
        if not raw_q:
            return Response([])

        limit_param = request.query_params.get("limit")
        try:
            limit = min(int(limit_param or 10), 20)
        except ValueError:
            limit = 10

        q = normalize_skill_name(raw_q)
        cache_key = f"skills:suggest:{q}:{limit}"
        cached = cache.get(cache_key)
        if cached is not None:
            return Response(cached)

        if len(q) == 1:
            queryset = Skill.objects.filter(normalized_name__startswith=q)
        else:
            queryset = Skill.objects.filter(normalized_name__icontains=q)

        queryset = queryset.order_by("-popularity", "name")[:limit]
        data = SkillSuggestionSerializer(queryset, many=True).data
        cache.set(cache_key, data, 3600)
        return Response(data)
