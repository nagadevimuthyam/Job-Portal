import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { skipToken } from "@reduxjs/toolkit/query";

import {
  buildSearchLabel,
  buildSearchPayload,
  emptyFilters,
} from "../utils/searchPayload";

const recentFallback = [
  { name: "java developer, Female", createdAt: "2026-02-17" },
  { name: "frontend developer", createdAt: "2026-02-16" },
  { name: "Business Development Executive", createdAt: "2026-02-15" },
];

const savedFallback = [
  { name: "Bengaluru · React", createdAt: "2026-02-10" },
  { name: "Backend · Python", createdAt: "2026-02-08" },
];

export function useCandidateSearchFilters() {
  const salaryMinRef = useRef(null);
  const salaryMaxRef = useRef(null);

  const [draftFilters, setDraftFilters] = useState(emptyFilters);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [saveName, setSaveName] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [searchModal, setSearchModal] = useState(null);

  const safeDraftFilters = useMemo(
    () => ({
      ...draftFilters,
      gender: Array.isArray(draftFilters.gender) ? draftFilters.gender : [],
    }),
    [draftFilters]
  );

  const latestSkillsRef = useRef(selectedSkills);
  useEffect(() => {
    latestSkillsRef.current = selectedSkills;
  }, [selectedSkills]);

  const normalizeFilters = useCallback((filters) => {
    const normalized = { ...filters };
    if (normalized?.updated_type?.toLowerCase() === "active_updated") {
      normalized.updated_type = "active";
    }
    return normalized;
  }, []);

  const handleSearch = useCallback(
    (nextFilters = draftFilters, nextSkills = latestSkillsRef.current) => {
      const normalizedFilters = normalizeFilters(nextFilters);
      const payload = buildSearchPayload(
        {
          ...normalizedFilters,
          gender: Array.isArray(normalizedFilters.gender)
            ? normalizedFilters.gender
            : [],
        },
        nextSkills
      );
      if (Object.keys(payload).length === 0) {
        setAppliedFilters(null);
        return;
      }
      setAppliedFilters(payload);
      const recentEntry = {
        name: buildSearchLabel(nextFilters, nextSkills),
        params: normalizedFilters,
        skills: nextSkills,
        createdAt: new Date().toISOString(),
      };
      setRecentSearches((prev) => [recentEntry, ...prev].slice(0, 5));
    },
    [draftFilters, normalizeFilters]
  );

  const handleSaveSearch = useCallback(() => {
    if (!saveName.trim()) {
      toast.error("Enter a name to save this search.");
      return;
    }
    const normalizedFilters = normalizeFilters(draftFilters);
    const payload = buildSearchPayload(normalizedFilters, selectedSkills);
    if (Object.keys(payload).length === 0) {
      toast.error("Add filters before saving a search.");
      return;
    }
    const entry = {
      name: saveName.trim(),
      params: normalizedFilters,
      skills: selectedSkills,
      createdAt: new Date().toISOString(),
    };
    setSavedSearches((prev) => [entry, ...prev].slice(0, 20));
    setSaveName("");
    toast.success("Search saved.");
  }, [draftFilters, selectedSkills, saveName, normalizeFilters]);

  const handleApplyStored = useCallback(
    (item) => {
      const nextParams =
        item.params?.updated_type?.toLowerCase() === "active_updated"
          ? { ...item.params, updated_type: "active" }
          : item.params;
      setDraftFilters(nextParams);
      setSelectedSkills(item.skills || []);
      handleSearch(nextParams, item.skills || []);
    },
    [handleSearch]
  );

  const handleClearFilters = useCallback(() => {
    setDraftFilters(emptyFilters);
    setSelectedSkills([]);
    latestSkillsRef.current = [];
    setAppliedFilters(null);
  }, []);

  useEffect(() => {
    const handleClickAway = (event) => {
      const openDetails = document.querySelectorAll("details.dropdown-popover[open]");
      openDetails.forEach((detail) => {
        if (!detail.contains(event.target)) {
          detail.removeAttribute("open");
        }
      });
    };
    const handleEscape = (event) => {
      if (event.key !== "Escape") return;
      const openDetails = document.querySelectorAll("details.dropdown-popover[open]");
      openDetails.forEach((detail) => detail.removeAttribute("open"));
    };
    document.addEventListener("mousedown", handleClickAway);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickAway);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const displayedRecent = recentSearches.length ? recentSearches : recentFallback;
  const displayedSaved = savedSearches.length ? savedSearches : savedFallback;
  const modalItems = searchModal === "recent" ? displayedRecent : displayedSaved;
  const modalTitle = searchModal === "recent" ? "Recent searches" : "Saved searches";

  const queryArg = appliedFilters ? appliedFilters : skipToken;

  return {
    appliedFilters,
    draftFilters,
    safeDraftFilters,
    queryArg,
    salaryMaxRef,
    salaryMinRef,
    searchModal,
    setSearchModal,
    saveName,
    setSaveName,
    selectedSkills,
    setSelectedSkills,
    setDraftFilters,
    handleApplyStored,
    handleClearFilters,
    handleSaveSearch,
    handleSearch,
    modalItems,
    modalTitle,
    setAppliedFilters,
  };
}
