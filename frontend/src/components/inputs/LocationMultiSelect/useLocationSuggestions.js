import { useMemo } from "react";
import { useGetLocationSuggestionsQuery } from "../../../features/candidate/candidateProfileApi";

export default function useLocationSuggestions(query, enabled, context) {
  const trimmed = (query || "").trim();
  const shouldFetch = Boolean(enabled && trimmed.length >= 3);
  const state = (context?.state || "").trim();
  const limit = context?.limit || 10;

  const { data, isFetching } = useGetLocationSuggestionsQuery(
    {
      q: trimmed,
      state: state || undefined,
      limit,
    },
    {
      skip: !shouldFetch,
    }
  );

  const suggestions = useMemo(() => {
    const results = data?.results;
    if (!Array.isArray(results)) return [];
    return results.map((name) => ({ name }));
  }, [data]);

  if (!shouldFetch) {
    return { suggestions: [], isLoading: false };
  }

  return { suggestions, isLoading: isFetching };
}
