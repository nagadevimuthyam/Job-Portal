import { useMemo } from "react";
import SkillMultiSelect from "../SkillMultiSelect/SkillMultiSelect";
import useLocationSuggestions from "./useLocationSuggestions";

export default function LocationMultiSelect({
  value = [],
  onChange,
  error,
  stateFilter = "",
  limit = 10,
}) {
  const selectedItems = useMemo(
    () =>
      (Array.isArray(value) ? value : [])
        .filter((item) => typeof item === "string")
        .map((name) => ({ name })),
    [value]
  );

  const handleChange = (nextItems) => {
    const seen = new Set();
    const next = [];
    nextItems.forEach((item) => {
      if (!item || typeof item.name !== "string") return;
      const cleaned = item.name.replace(/\s+/g, " ").trim();
      if (!cleaned) return;
      const key = cleaned.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      next.push(cleaned);
    });
    onChange(next);
  };

  return (
    <SkillMultiSelect
      value={selectedItems}
      onChange={handleChange}
      placeholder="Type city names (min 3 chars)"
      error={Boolean(error)}
      minItems={0}
      useSuggestions={useLocationSuggestions}
      minQueryLength={3}
      debounceMs={300}
      inputLabel="Preferred Locations"
      suggestionContext={{ state: stateFilter, limit }}
    />
  );
}
