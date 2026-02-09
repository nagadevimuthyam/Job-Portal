import { useMemo } from "react";
import { useGetSkillSuggestionsQuery } from "../../../features/candidate/candidateProfileApi";

export default function useSkillSuggestions(query, enabled) {
  const trimmed = (query || "").trim();
  const shouldFetch = Boolean(enabled && trimmed.length >= 1);

  const { data, isFetching } = useGetSkillSuggestionsQuery(trimmed, {
    skip: !shouldFetch,
  });

  const suggestions = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      id: item.id,
      name: item.name,
    }));
  }, [data]);

  if (!shouldFetch) {
    return { suggestions: [], isLoading: false };
  }

  return { suggestions, isLoading: isFetching };
}
