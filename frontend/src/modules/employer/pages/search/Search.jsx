import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import Input from "../../../../components/ui/Input";
import { useSearchCandidatesQuery } from "../../../../features/employer/employerApi";
import {
  buildSearchLabel,
  buildSearchPayload,
  emptyFilters,
} from "./utils/searchPayload";
import SearchFormCard from "./components/SearchFormCard";
import ExperienceDropdown from "./components/ExperienceDropdown";
import NoticePeriodPills from "./components/NoticePeriodPills";
import EducationDetails from "./components/EducationDetails";
import EmploymentDetails from "./components/EmploymentDetails";
import AdditionalDetails from "./components/AdditionalDetails";
import ResultsList from "./components/ResultsList";
import RecentSavedSidebar from "./components/RecentSavedSidebar";
import StickySearchBar from "./components/StickySearchBar";

export default function CandidateSearch() {
  const navigate = useNavigate();

  const [draftFilters, setDraftFilters] = useState(emptyFilters);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [appliedFilters, setAppliedFilters] = useState(null);
  const [saveName, setSaveName] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [activeTab, setActiveTab] = useState("recent");
  const [genderFilters, setGenderFilters] = useState([]);

  const queryArg = appliedFilters ? appliedFilters : skipToken;
  const { data, isLoading } = useSearchCandidatesQuery(queryArg);
  const results = appliedFilters ? data?.results || [] : [];
  const resultCount = appliedFilters ? data?.count ?? 0 : 0;

  const handleSearch = (nextFilters = draftFilters, nextSkills = selectedSkills) => {
    const payload = buildSearchPayload(nextFilters, nextSkills);
    if (Object.keys(payload).length === 0) {
      setAppliedFilters(null);
      return;
    }
    setAppliedFilters(payload);
    const recentEntry = {
      name: buildSearchLabel(nextFilters, nextSkills),
      params: nextFilters,
      skills: nextSkills,
      createdAt: new Date().toISOString(),
    };
    setRecentSearches((prev) => [recentEntry, ...prev].slice(0, 5));
  };

  const handleSaveSearch = () => {
    if (!saveName.trim()) {
      toast.error("Enter a name to save this search.");
      return;
    }
    const payload = buildSearchPayload(draftFilters, selectedSkills);
    if (Object.keys(payload).length === 0) {
      toast.error("Add filters before saving a search.");
      return;
    }
    const entry = {
      name: saveName.trim(),
      params: draftFilters,
      skills: selectedSkills,
      createdAt: new Date().toISOString(),
    };
    setSavedSearches((prev) => [entry, ...prev].slice(0, 20));
    setSaveName("");
    toast.success("Search saved.");
  };

  const handleApplyStored = (item) => {
    setDraftFilters(item.params);
    setSelectedSkills(item.skills || []);
    handleSearch(item.params, item.skills || []);
  };

  const handleClearFilters = () => {
    setDraftFilters(emptyFilters);
    setSelectedSkills([]);
    setAppliedFilters(null);
  };

  const recentFallback = [
    { name: "java developer, Female", createdAt: "2026-02-17" },
    { name: "frontend developer", createdAt: "2026-02-16" },
    { name: "Business Development Executive", createdAt: "2026-02-15" },
  ];
  const savedFallback = [
    { name: "Bengaluru · React", createdAt: "2026-02-10" },
    { name: "Backend · Python", createdAt: "2026-02-08" },
  ];
  const displayedRecent = recentSearches.length ? recentSearches : recentFallback;
  const displayedSaved = savedSearches.length ? savedSearches : savedFallback;

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

  return (
    <div className="h-[calc(100vh-64px)] -mx-6 -my-8 px-6 py-6 flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="mx-auto max-w-7xl grid gap-4 lg:grid-cols-[1fr_360px] h-full">
          <main className="min-h-0 overflow-y-auto soft-scrollbar pr-2 pb-36 space-y-6">
            <SearchFormCard
              resultCount={resultCount}
              saveName={saveName}
              onSaveNameChange={setSaveName}
              onSaveSearch={handleSaveSearch}
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Keywords"
                  placeholder="Enter Keywords like job title, skills, etc."
                  value={draftFilters.keywords}
                  onChange={(event) =>
                    setDraftFilters({ ...draftFilters, keywords: event.target.value })
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      handleSearch();
                    }
                  }}
                />
                <Input
                  label="Location"
                  placeholder="Enter current location"
                  value={draftFilters.location}
                  onChange={(event) =>
                    setDraftFilters({ ...draftFilters, location: event.target.value })
                  }
                />
                <ExperienceDropdown
                  label="Experience Min"
                  value={draftFilters.exp_min}
                  onChange={(value) =>
                    setDraftFilters({ ...draftFilters, exp_min: value })
                  }
                />
                <ExperienceDropdown
                  label="Experience Max"
                  value={draftFilters.exp_max}
                  onChange={(value) =>
                    setDraftFilters({ ...draftFilters, exp_max: value })
                  }
                />
                <Input
                  label="Salary Min"
                  type="number"
                  placeholder="Lacs"
                  value={draftFilters.salary_min}
                  onChange={(event) =>
                    setDraftFilters({ ...draftFilters, salary_min: event.target.value })
                  }
                />
                <Input
                  label="Salary Max"
                  type="number"
                  placeholder="Lacs"
                  value={draftFilters.salary_max}
                  onChange={(event) =>
                    setDraftFilters({ ...draftFilters, salary_max: event.target.value })
                  }
                />
                <NoticePeriodPills
                  value={draftFilters.notice_period_code}
                  onChange={(value) =>
                    setDraftFilters({ ...draftFilters, notice_period_code: value })
                  }
                />
              </div>

              <EducationDetails
                value={draftFilters.education}
                onChange={(value) =>
                  setDraftFilters({ ...draftFilters, education: value })
                }
              />
              <EmploymentDetails
                value={draftFilters.work_status}
                onChange={(value) =>
                  setDraftFilters({ ...draftFilters, work_status: value })
                }
              />
              <AdditionalDetails
                value={genderFilters}
                onChange={setGenderFilters}
              />
            </SearchFormCard>

            <ResultsList
              appliedFilters={appliedFilters}
              isLoading={isLoading}
              results={results}
              onViewProfile={(id) => navigate(`/employer/candidates/${id}`)}
            />

            <div className="h-24" />
          </main>

          <RecentSavedSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            displayedRecent={displayedRecent}
            displayedSaved={displayedSaved}
            onApplyStored={handleApplyStored}
          />
        </div>
      </div>

      <StickySearchBar onSearch={() => handleSearch()} onClear={handleClearFilters} />
    </div>
  );
}
