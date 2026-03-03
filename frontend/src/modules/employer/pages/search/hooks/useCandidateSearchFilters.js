import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { skipToken } from "@reduxjs/toolkit/query";

import {
  useDeleteSavedSearchMutation,
  useGetRecentSearchesQuery,
  useGetSavedSearchesQuery,
  useRenameSavedSearchMutation,
  useSaveSearchPresetMutation,
} from "../../../../../features/employer/employerApi";
import {
  resetSearchState,
  setAppliedFilters as setAppliedFiltersAction,
  setDraftFilters as setDraftFiltersAction,
  setSelectedSkills as setSelectedSkillsAction,
} from "../../../../../features/employer/searchSlice";
import {
  buildSearchPayload,
  emptyFilters,
} from "../utils/searchPayload";
import { buildSearchSummary } from "../utils/searchSummary";

const FILTER_KEYS = Object.keys(emptyFilters);

const mapFiltersToDraft = (filters = {}) => {
  const draft = { ...emptyFilters };
  FILTER_KEYS.forEach((key) => {
    if (key === "gender") return;
    if (filters[key] !== undefined) {
      draft[key] = filters[key];
    }
  });
  draft.gender = filters.gender
    ? String(filters.gender)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
    : [];
  return draft;
};

const mapFiltersToSkills = (filters = {}) => {
  const names = filters.skills
    ? String(filters.skills).split(",").map((item) => item.trim()).filter(Boolean)
    : [];
  const ids = filters.skill_ids
    ? String(filters.skill_ids).split(",").map((item) => item.trim()).filter(Boolean)
    : [];
  return names.map((name, index) => ({
    id: ids[index] || undefined,
    name,
  }));
};

export function useCandidateSearchFilters() {
  const dispatch = useDispatch();
  const salaryMinRef = useRef(null);
  const salaryMaxRef = useRef(null);

  const draftFilters = useSelector((state) => state.employerSearch.draftFilters);
  const selectedSkills = useSelector((state) => state.employerSearch.selectedSkills);
  const appliedFilters = useSelector((state) => state.employerSearch.appliedFilters);

  const [saveName, setSaveName] = useState("");
  const [searchModal, setSearchModal] = useState(null);
  const [saveRecentModal, setSaveRecentModal] = useState({
    open: false,
    item: null,
    title: "",
    error: "",
  });

  const { data: recentSearches = [], isLoading: isRecentLoading } = useGetRecentSearchesQuery();
  const { data: savedSearches = [], isLoading: isSavedLoading } = useGetSavedSearchesQuery();
  const [saveSearchPreset, { isLoading: isSavingPreset }] = useSaveSearchPresetMutation();
  const [renameSavedSearch] = useRenameSavedSearchMutation();
  const [deleteSavedSearch] = useDeleteSavedSearchMutation();

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
        dispatch(setAppliedFiltersAction(null));
        return;
      }
      dispatch(setAppliedFiltersAction(payload));
    },
    [dispatch, draftFilters, normalizeFilters]
  );

  const applyPresetAndSearch = useCallback(
    (filters = {}) => {
      const nextDraft = mapFiltersToDraft(filters);
      const nextSkills = mapFiltersToSkills(filters);
      dispatch(setDraftFiltersAction(nextDraft));
      dispatch(setSelectedSkillsAction(nextSkills));
      handleSearch(nextDraft, nextSkills);
    },
    [dispatch, handleSearch]
  );

  const handleApplyStored = useCallback(
    (item) => {
      applyPresetAndSearch(item.filters || {});
    },
    [applyPresetAndSearch]
  );

  const handleSaveSearch = useCallback(async () => {
    const normalizedFilters = normalizeFilters(draftFilters);
    const payload = buildSearchPayload(normalizedFilters, selectedSkills);
    if (Object.keys(payload).length === 0) {
      toast.error("Add filters before saving a search.");
      return;
    }
    try {
      await saveSearchPreset({
        title: saveName.trim(),
        filters: payload,
      }).unwrap();
      setSaveName("");
      toast.success("Search saved.");
    } catch {
      toast.error("Unable to save search.");
    }
  }, [draftFilters, normalizeFilters, saveName, saveSearchPreset, selectedSkills]);

  const openSaveFromRecentModal = useCallback((item) => {
    const defaultTitle = buildSearchSummary(item?.filters || {});
    setSaveRecentModal({
      open: true,
      item,
      title: defaultTitle,
      error: "",
    });
  }, []);

  const closeSaveFromRecentModal = useCallback(() => {
    setSaveRecentModal({
      open: false,
      item: null,
      title: "",
      error: "",
    });
  }, []);

  const setSaveFromRecentTitle = useCallback((title) => {
    setSaveRecentModal((prev) => ({
      ...prev,
      title,
      error: "",
    }));
  }, []);

  const confirmSaveFromRecent = useCallback(async () => {
    const title = (saveRecentModal.title || "").trim();
    if (!title) {
      setSaveRecentModal((prev) => ({ ...prev, error: "Title is required." }));
      return;
    }
    if (title.length < 3) {
      setSaveRecentModal((prev) => ({ ...prev, error: "Title should be at least 3 characters." }));
      return;
    }
    try {
      await saveSearchPreset({ preset_id: saveRecentModal.item.id, title }).unwrap();
      toast.success("Saved to Saved Searches.");
      closeSaveFromRecentModal();
    } catch {
      toast.error("Unable to save this recent search.");
    }
  }, [closeSaveFromRecentModal, saveRecentModal.item, saveRecentModal.title, saveSearchPreset]);

  const handleRenameSaved = useCallback(
    async (item) => {
      const typed = window.prompt("Rename saved search", item.title || item.name || "");
      if (!typed || !typed.trim()) return;
      try {
        await renameSavedSearch({ presetId: item.id, title: typed.trim() }).unwrap();
        toast.success("Saved search renamed.");
      } catch {
        toast.error("Unable to rename saved search.");
      }
    },
    [renameSavedSearch]
  );

  const handleDeleteSaved = useCallback(
    async (item) => {
      const shouldDelete = window.confirm("Delete this saved search?");
      if (!shouldDelete) return;
      try {
        await deleteSavedSearch(item.id).unwrap();
        toast.success("Saved search deleted.");
      } catch {
        toast.error("Unable to delete saved search.");
      }
    },
    [deleteSavedSearch]
  );

  const handleClearFilters = useCallback(() => {
    dispatch(resetSearchState());
    latestSkillsRef.current = [];
  }, [dispatch]);

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

  const modalItems = searchModal === "recent" ? recentSearches : savedSearches;
  const modalTitle = searchModal === "recent" ? "Recent searches" : "Saved searches";
  const modalLoading = searchModal === "recent" ? isRecentLoading : isSavedLoading;

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
    recentSearches,
    savedSearches,
    isSavingPreset,
    modalLoading,
    selectedSkills,
    setSelectedSkills: (value) => dispatch(setSelectedSkillsAction(value)),
    setDraftFilters: (value) => dispatch(setDraftFiltersAction(value)),
    handleApplyStored,
    handleDeleteSaved,
    handleClearFilters,
    handleRenameSaved,
    openSaveFromRecentModal,
    closeSaveFromRecentModal,
    confirmSaveFromRecent,
    setSaveFromRecentTitle,
    saveRecentModal,
    handleSaveSearch,
    handleSearch,
    modalItems,
    modalTitle,
    applyPresetAndSearch,
    setAppliedFilters: (value) => dispatch(setAppliedFiltersAction(value)),
  };
}
