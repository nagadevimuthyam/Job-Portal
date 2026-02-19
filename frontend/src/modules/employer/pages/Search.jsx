import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import Input from "../../../components/ui/Input";
import Skeleton from "../../../components/ui/Skeleton";
import Badge from "../../../components/ui/Badge";
import { useSearchCandidatesQuery } from "../../../features/employer/employerApi";
import {
  WORK_STATUS_OPTIONS,
  AVAILABILITY_OPTIONS,
  EDUCATION_OPTIONS,
} from "../../../shared/constants/profileOptions";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export default function CandidateSearch() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    keywords: "",
    location: "",
    exp_min: "",
    exp_max: "",
    skills: "",
    updated_within: "",
    salary_min: "",
    salary_max: "",
    notice_period: "",
    work_status: "",
    availability_to_join: "",
    education: "",
  });
  const [savedSearches, setSavedSearches] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [saveName, setSaveName] = useState("");
  const [shouldFetch, setShouldFetch] = useState(false);
  const [searchParams, setSearchParams] = useState(null);

  const isSearchEmpty = (values) => {
    const rawValues = [
      values.keywords,
      values.location,
      values.exp_min,
      values.exp_max,
      values.skills,
      values.updated_within,
      values.salary_min,
      values.salary_max,
      values.notice_period,
      values.work_status,
      values.availability_to_join,
      values.education,
    ];
    return rawValues.every((value) => {
      if (value === null || value === undefined) return true;
      return String(value).trim() === "";
    });
  };

  const params = useMemo(
    () => ({
      keywords: filters.keywords,
      location: filters.location,
      exp_min: filters.exp_min,
      exp_max: filters.exp_max,
      skills: filters.skills,
      updated_within: filters.updated_within,
      salary_min: filters.salary_min,
      salary_max: filters.salary_max,
      notice_period: filters.notice_period,
      work_status: filters.work_status,
      availability_to_join: filters.availability_to_join,
      education: filters.education,
    }),
    [filters]
  );

  const queryArg = shouldFetch && searchParams ? searchParams : skipToken;
  const { data, isLoading } = useSearchCandidatesQuery(queryArg);
  const results = shouldFetch ? data?.results || [] : [];
  const resultCount = shouldFetch ? data?.count ?? 0 : 0;

  useEffect(() => {
    if (isSearchEmpty(filters)) {
      setShouldFetch(false);
      setSearchParams(null);
    }
  }, [filters]);

  const handleSaveSearch = () => {
    if (!saveName.trim()) {
      toast.error("Enter a name to save this search.");
      return;
    }
    setSavedSearches((prev) => [...prev, { name: saveName.trim(), params: { ...filters } }]);
    setSaveName("");
    toast.success("Search saved.");
  };

  const handleSaveRecent = () => {
    setRecentSearches((prev) => [
      { name: filters.keywords || "Quick search", params: { ...filters } },
      ...prev,
    ].slice(0, 5));
  };

  const handleRunSearch = () => {
    if (isSearchEmpty(filters)) {
      setShouldFetch(false);
      setSearchParams(null);
      return;
    }
    setSearchParams({ ...params });
    setShouldFetch(true);
    handleSaveRecent();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr_280px]">
      <Card className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-ink">Filters</h2>
          <p className="text-xs text-ink-faint">Refine candidates by key attributes.</p>
        </div>
        <Input
          label="Keywords"
          placeholder="React, Python, UX"
          value={filters.keywords}
          onChange={(event) => setFilters({ ...filters, keywords: event.target.value })}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleRunSearch();
            }
          }}
        />
        <Input
          label="Location"
          placeholder="Bengaluru"
          value={filters.location}
          onChange={(event) => setFilters({ ...filters, location: event.target.value })}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Experience Min"
            type="number"
            placeholder="2"
            value={filters.exp_min}
            onChange={(event) => setFilters({ ...filters, exp_min: event.target.value })}
          />
          <Input
            label="Experience Max"
            type="number"
            placeholder="8"
            value={filters.exp_max}
            onChange={(event) => setFilters({ ...filters, exp_max: event.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Salary Min"
            type="number"
            placeholder="500000"
            value={filters.salary_min}
            onChange={(event) => setFilters({ ...filters, salary_min: event.target.value })}
          />
          <Input
            label="Salary Max"
            type="number"
            placeholder="1200000"
            value={filters.salary_max}
            onChange={(event) => setFilters({ ...filters, salary_max: event.target.value })}
          />
        </div>
        <Input
          label="Skills"
          placeholder="Comma separated"
          helperText="Example: React, Django"
          value={filters.skills}
          onChange={(event) => setFilters({ ...filters, skills: event.target.value })}
        />
        <label className="block">
          <span className="text-sm font-semibold text-ink-soft">Work Status</span>
          <select
            className="mt-1 w-full rounded-xl border border-surface-3 bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
            value={filters.work_status}
            onChange={(event) => setFilters({ ...filters, work_status: event.target.value })}
          >
            <option value="">Any</option>
            {WORK_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink-soft">Availability to Join</span>
          <select
            className="mt-1 w-full rounded-xl border border-surface-3 bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
            value={filters.availability_to_join}
            onChange={(event) =>
              setFilters({ ...filters, availability_to_join: event.target.value })
            }
          >
            <option value="">Any</option>
            {AVAILABILITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-ink-soft">Education Level</span>
          <select
            className="mt-1 w-full rounded-xl border border-surface-3 bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
            value={filters.education}
            onChange={(event) => setFilters({ ...filters, education: event.target.value })}
          >
            <option value="">Any</option>
            {EDUCATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <Input
          label="Notice Period (days)"
          type="number"
          placeholder="30"
          value={filters.notice_period}
          onChange={(event) => setFilters({ ...filters, notice_period: event.target.value })}
        />
        <Input
          label="Updated Within (days)"
          type="number"
          placeholder="30"
          value={filters.updated_within}
          onChange={(event) => setFilters({ ...filters, updated_within: event.target.value })}
        />
        <Input
          label="Save Search Name"
          placeholder="Frontend in Bengaluru"
          value={saveName}
          onChange={(event) => setSaveName(event.target.value)}
        />
        <div className="flex gap-3">
          <Button type="button" onClick={handleRunSearch}>
            Search
          </Button>
          <Button type="button" variant="outline" onClick={handleSaveRecent}>
            Save to Recent
          </Button>
          <Button type="button" variant="outline" onClick={handleSaveSearch}>
            Save Search
          </Button>
        </div>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-ink">Candidate Search</h1>
            <p className="text-sm text-ink-faint">Search across the candidate database.</p>
          </div>
          <p className="text-sm text-ink-faint">Results: {resultCount}</p>
        </div>
        {isLoading ? (
          <Skeleton className="h-64 w-full" />
        ) : !shouldFetch ? (
          <Card>
            <p className="text-sm text-ink-faint">
              Start typing or apply filters to search candidates.
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {results.map((candidate) => (
              <Card key={candidate.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-ink">{candidate.full_name}</h3>
                    <p className="text-sm text-ink-faint">{candidate.location || "Location not provided"}</p>
                  </div>
                  <Badge label={`Exp: ${candidate.total_experience}y`} tone="neutral" />
                </div>
                <div className="flex flex-wrap gap-2">
                  {(candidate.skills || []).slice(0, 6).map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-ink-soft">{candidate.summary || "No summary yet."}</p>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-ink-faint">Last updated {formatDate(candidate.last_updated)}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/employer/candidates/${candidate.id}`)}
                    >
                      View Profile
                    </Button>
                    <Button variant="ghost" size="sm">Shortlist</Button>
                    <Button variant="ghost" size="sm">Add Note</Button>
                    <Button variant="ghost" size="sm">Save to Folder</Button>
                  </div>
                </div>
              </Card>
            ))}
            {results.length === 0 && (
              <Card>
                <p className="text-sm text-ink-faint">No candidates match these filters yet.</p>
              </Card>
            )}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <Card>
          <h3 className="text-sm font-semibold text-ink">Recent Searches</h3>
          <div className="mt-3 space-y-2 text-xs text-ink-faint">
            {recentSearches.length === 0 && <p>No recent searches.</p>}
            {recentSearches.map((item, index) => (
              <button
                key={`${item.name}-${index}`}
                type="button"
                className="block w-full rounded-lg border border-surface-3 px-3 py-2 text-left text-ink"
                onClick={() => setFilters(item.params)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </Card>
        <Card>
          <h3 className="text-sm font-semibold text-ink">Saved Searches</h3>
          <div className="mt-3 space-y-2 text-xs text-ink-faint">
            {savedSearches.length === 0 && <p>No saved searches.</p>}
            {savedSearches.map((item, index) => (
              <button
                key={`${item.name}-${index}`}
                type="button"
                className="block w-full rounded-lg border border-surface-3 px-3 py-2 text-left text-ink"
                onClick={() => setFilters(item.params)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
