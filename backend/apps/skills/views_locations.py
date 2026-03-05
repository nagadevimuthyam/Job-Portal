from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .location_suggestions import suggest_location_names


class LocationSuggestionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        raw_q = (request.query_params.get("q") or "").strip()
        if len(raw_q) < 3:
            return Response({"results": []})

        limit_param = request.query_params.get("limit")
        try:
            limit = max(1, min(int(limit_param or 10), 20))
        except ValueError:
            limit = 10

        state = (request.query_params.get("state") or "").strip() or None
        results = suggest_location_names(raw_q=raw_q, state=state, limit=limit)
        return Response({"results": results})
