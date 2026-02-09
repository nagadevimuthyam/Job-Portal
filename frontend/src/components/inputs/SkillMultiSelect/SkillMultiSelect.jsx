import { useEffect, useMemo, useRef, useState } from "react";
import SkillInput from "./SkillInput";
import SkillDropdown from "./SkillDropdown";
import SkillChips from "./SkillChips";
import useDebouncedValue from "./useDebouncedValue";
import useSkillSuggestions from "./useSkillSuggestions";
import { dedupeSkills, formatSkill, normalizeSkill } from "./utils";

export default function SkillMultiSelect({
  value,
  onChange,
  placeholder = "React, Django, SQL",
  error,
  minItems = 1,
  useSuggestions = useSkillSuggestions,
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const anchorRef = useRef(null);
  const [anchorRect, setAnchorRect] = useState(null);
  const rawQuery = query.trim();
  const debouncedQuery = useDebouncedValue(rawQuery, 200);
  const suggestionsEnabled = isOpen && debouncedQuery.length >= 1;

  const { suggestions, isLoading } = useSuggestions(debouncedQuery, suggestionsEnabled);

  const normalizedSelected = useMemo(
    () => new Set(value.map((item) => normalizeSkill(item.name))),
    [value]
  );

  const cleanedSuggestions = useMemo(() => {
    return suggestions.filter((item) => !normalizedSelected.has(normalizeSkill(item.name)));
  }, [suggestions, normalizedSelected]);

  const addLabel = formatSkill(rawQuery) || rawQuery;
  const canAddCustom =
    addLabel.length > 0 &&
    !normalizedSelected.has(normalizeSkill(addLabel)) &&
    !cleanedSuggestions.some(
      (item) => normalizeSkill(item.name) === normalizeSkill(addLabel)
    );

  const dropdownItems = useMemo(() => {
    const items = cleanedSuggestions.map((item) => ({
      type: "suggestion",
      label: item.name,
      value: item,
    }));
    if (canAddCustom) {
      items.unshift({
        type: "custom",
        label: `Add "${addLabel}"`,
        value: { name: addLabel, is_custom: true },
        badge: "New",
      });
    }
    return items.slice(0, 10);
  }, [cleanedSuggestions, canAddCustom, addLabel]);

  const handleSelect = (item) => {
    const next = dedupeSkills([...value, item.value]);
    onChange(next);
    setQuery("");
    setHighlightIndex(0);
    setIsOpen(false);
  };

  const addFromQuery = () => {
    if (!addLabel) return;
    const normalized = normalizeSkill(addLabel);
    if (!normalized || normalizedSelected.has(normalized)) return;
    const exactSuggestion = cleanedSuggestions.find(
      (item) => normalizeSkill(item.name) === normalized
    );
    const toAdd = exactSuggestion || { name: addLabel, is_custom: true };
    onChange(dedupeSkills([...value, toAdd]));
    setQuery("");
    setHighlightIndex(0);
    setIsOpen(false);
  };

  const handleRemove = (index) => {
    const next = value.filter((_, idx) => idx !== index);
    onChange(next);
  };

  const handleKeyDown = (event) => {
    if (!isOpen && event.key === "ArrowDown") {
      setIsOpen(true);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (dropdownItems.length) {
        setHighlightIndex((prev) => (prev + 1) % dropdownItems.length);
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (dropdownItems.length) {
        setHighlightIndex((prev) => (prev - 1 + dropdownItems.length) % dropdownItems.length);
      }
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (dropdownItems.length) {
        handleSelect(dropdownItems[highlightIndex]);
      } else {
        addFromQuery();
      }
    } else if (event.key === "Escape") {
      setIsOpen(false);
    }
  };

  const showDropdown =
    isOpen && rawQuery.length > 0 && (dropdownItems.length > 0 || isLoading);

  useEffect(() => {
    if (!showDropdown || !anchorRef.current) return;
    const updateRect = () => {
      const rect = anchorRef.current.getBoundingClientRect();
      setAnchorRect(rect);
    };
    updateRect();
    window.addEventListener("scroll", updateRect, true);
    window.addEventListener("resize", updateRect);
    return () => {
      window.removeEventListener("scroll", updateRect, true);
      window.removeEventListener("resize", updateRect);
    };
  }, [showDropdown]);

  useEffect(() => {
    if (highlightIndex >= dropdownItems.length) {
      setHighlightIndex(0);
    }
  }, [dropdownItems.length, highlightIndex]);

  return (
    <div className="space-y-3">
      <div className={`rounded-xl border ${error ? "border-danger" : "border-surface-3"} p-3`}>
        <SkillChips items={value} onRemove={handleRemove} />
      </div>
      <div className="relative z-30" ref={anchorRef}>
        <SkillInput
          value={query}
          onChange={(next) => {
            setQuery(next);
            if (!isOpen) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setTimeout(() => setIsOpen(false), 120);
          }}
          placeholder={placeholder}
          error={error}
        />
        <SkillDropdown
          items={dropdownItems}
          highlightIndex={highlightIndex}
          onSelect={handleSelect}
          onHover={setHighlightIndex}
          isOpen={showDropdown}
          anchorRect={anchorRect}
        />
      </div>
      {minItems > 0 && (
        <p className="text-xs text-ink-faint">Add at least {minItems} skills.</p>
      )}
    </div>
  );
}
