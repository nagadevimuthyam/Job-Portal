import { useEffect, useRef } from "react";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import SkillMultiSelect from "../../../../components/inputs/SkillMultiSelect/SkillMultiSelect";
import { formatINR } from "../../../../shared/utils/formatINR";
import { useSearchCandidatesQuery } from "../../../../features/employer/employerApi";
import SearchFormCard from "./components/SearchFormCard";
import ExperienceDropdown from "./components/ExperienceDropdown";
import NoticePeriodPills from "./components/NoticePeriodPills";
import EducationDetails from "./components/EducationDetails";
import EmploymentDetails from "./components/EmploymentDetails";
import AdditionalDetails from "./components/AdditionalDetails";
import ResultsList from "./components/ResultsList";
import EditSectionModal from "../../../candidate/components/EditSectionModal";
import StickySearchBar from "./components/StickySearchBar";
import { handleSalaryInputChange } from "./services/salaryInput";
import { useCandidateSearchFilters } from "./hooks/useCandidateSearchFilters";
import { buildSearchSummary } from "./utils/searchSummary";

export default function CandidateSearch() {
  const resultsRef = useRef(null);
  const {
    salaryMinRef,
    salaryMaxRef,
    safeDraftFilters,
    handleSearch,
    handleSaveSearch,
    handleApplyStored,
    handleClearFilters,
    handleDeleteSaved,
    handleRenameSaved,
    openSaveFromRecentModal,
    closeSaveFromRecentModal,
    confirmSaveFromRecent,
    setSaveFromRecentTitle,
    saveRecentModal,
    searchModal,
    modalItems,
    modalTitle,
    selectedSkills,
    setSelectedSkills,
    setDraftFilters,
    saveName,
    setSaveName,
    setSearchModal,
    appliedFilters,
    queryArg,
    modalLoading,
    isSavingPreset,
  } = useCandidateSearchFilters();

  const { data, isLoading } = useSearchCandidatesQuery(queryArg);
  const results = appliedFilters ? data?.results || [] : [];
  const resultCount = appliedFilters ? data?.count ?? 0 : 0;

  useEffect(() => {
    if (!saveRecentModal.open) return;
    const onEscape = (event) => {
      if (event.key === "Escape") {
        closeSaveFromRecentModal();
      }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, [closeSaveFromRecentModal, saveRecentModal.open]);

  return (
    <div className="h-[calc(100vh-64px)] -mx-6 -my-8 px-0 py-6 flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="mx-auto max-w-full grid gap-3 lg:grid-cols-[360px_1fr] h-full">
          <section className="min-h-0 flex flex-col">
            <div className="min-h-0 overflow-y-auto soft-scrollbar pr-1 pb-28">
              <div className="space-y-6">
                <SearchFormCard
                  saveName={saveName}
                  isSaving={isSavingPreset}
                  onSaveNameChange={setSaveName}
                  onSaveSearch={handleSaveSearch}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <Input
                      label="Keywords"
                      placeholder="Enter Keywords like job title, skills, etc."
                      value={safeDraftFilters.keywords}
                      onChange={(event) =>
                        setDraftFilters({ ...safeDraftFilters, keywords: event.target.value })
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
                      value={safeDraftFilters.location}
                      onChange={(event) =>
                        setDraftFilters({ ...safeDraftFilters, location: event.target.value })
                      }
                    />
                    <ExperienceDropdown
                      label="Experience Min"
                      value={safeDraftFilters.exp_min}
                      onChange={(value) =>
                        setDraftFilters({ ...safeDraftFilters, exp_min: value })
                      }
                    />
                    <ExperienceDropdown
                      label="Experience Max"
                      value={safeDraftFilters.exp_max}
                      onChange={(value) =>
                        setDraftFilters({ ...safeDraftFilters, exp_max: value })
                      }
                    />
                    <div className="md:col-span-2 space-y-2">
                      <p className="text-sm font-semibold text-ink-soft">Skills</p>
                      <SkillMultiSelect
                        value={selectedSkills}
                        onChange={setSelectedSkills}
                        placeholder="Search skills"
                        minItems={0}
                      />
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-ink-soft">Salary Min</span>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex h-11 w-16 items-center justify-center rounded-xl border border-surface-3 bg-surface-inverse text-sm text-ink">Rs</div>
                        <Input
                          className="flex-1"
                          type="text"
                          inputMode="numeric"
                          placeholder="Lacs"
                          ref={salaryMinRef}
                          value={formatINR(safeDraftFilters.salary_min)}
                          onChange={(event) =>
                            handleSalaryInputChange({
                              event,
                              field: "salary_min",
                              ref: salaryMinRef,
                              safeFilters: safeDraftFilters,
                              setFilters: setDraftFilters,
                            })
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-semibold text-ink-soft">Salary Max</span>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="flex h-11 w-16 items-center justify-center rounded-xl border border-surface-3 bg-surface-inverse text-sm text-ink">Rs</div>
                        <Input
                          className="flex-1"
                          type="text"
                          inputMode="numeric"
                          placeholder="Lacs"
                          ref={salaryMaxRef}
                          value={formatINR(safeDraftFilters.salary_max)}
                          onChange={(event) =>
                            handleSalaryInputChange({
                              event,
                              field: "salary_max",
                              ref: salaryMaxRef,
                              safeFilters: safeDraftFilters,
                              setFilters: setDraftFilters,
                            })
                          }
                        />
                      </div>
                    </div>
                    <NoticePeriodPills
                      value={safeDraftFilters.notice_period_code}
                      onChange={(value) =>
                        setDraftFilters({ ...safeDraftFilters, notice_period_code: value })
                      }
                    />
                  </div>

                  <EducationDetails
                    value={safeDraftFilters.education}
                    onChange={(value) =>
                      setDraftFilters({ ...safeDraftFilters, education: value })
                    }
                  />
                  <EmploymentDetails
                    value={safeDraftFilters.work_status}
                    onChange={(value) =>
                      setDraftFilters({ ...safeDraftFilters, work_status: value })
                    }
                  />
                  <AdditionalDetails
                    value={safeDraftFilters.gender}
                    onChange={(next) =>
                      setDraftFilters({ ...safeDraftFilters, gender: next })
                    }
                  />
                </SearchFormCard>
              </div>
            </div>
            <StickySearchBar
              updatedType={safeDraftFilters.updated_type}
              updatedWithin={safeDraftFilters.updated_within}
              onUpdatedTypeChange={(value) =>
                setDraftFilters({ ...safeDraftFilters, updated_type: value })
              }
              onUpdatedWithinChange={(value) =>
                setDraftFilters({ ...safeDraftFilters, updated_within: value })
              }
              onSearch={() => {
                handleSearch();
                resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
              onClear={handleClearFilters}
            />
          </section>

          <section ref={resultsRef} className="min-h-0 overflow-y-auto soft-scrollbar pr-2">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-ink">Results: {resultCount}</h2>
                <div className="flex items-center gap-2 text-sm font-semibold text-ink-faint">
                  <button
                    type="button"
                    className="rounded px-1 py-0.5 transition hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-300"
                    onClick={() => setSearchModal("recent")}
                  >
                    Recent searches
                  </button>
                  <span className="text-ink-faint">|</span>
                  <button
                    type="button"
                    className="rounded px-1 py-0.5 transition hover:text-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-300"
                    onClick={() => setSearchModal("saved")}
                  >
                    Saved searches
                  </button>
                </div>
              </div>
              <ResultsList
                appliedFilters={appliedFilters}
                isLoading={isLoading}
                results={results}
                onViewProfile={(id) =>
                  window.open(`/employer/candidates/${id}`, "_blank", "noopener,noreferrer")
                }
                onViewResume={(url) =>
                  window.open(url, "_blank", "noopener,noreferrer")
                }
              />
              <div className="h-24" />
            </div>
          </section>
        </div>
      </div>
      <EditSectionModal
        open={Boolean(searchModal)}
        title={modalTitle}
        description=""
        onClose={() => setSearchModal(null)}
        secondaryLabel="Close"
        showFooter={false}
      >
        {modalLoading ? (
          <div className="rounded-xl border border-surface-2 bg-surface-1 px-4 py-6 text-sm text-ink-faint">
            Loading searches...
          </div>
        ) : modalItems.length ? (
          <div className="space-y-3">
            {modalItems.map((item) => {
              const dateValue = item.last_run_at || item.created_at;
              const itemDate = dateValue ? new Date(dateValue).toLocaleDateString() : "";
              const isRecent = searchModal === "recent";
              const summaryText = buildSearchSummary(item.filters || {});
              const displayTitle = isRecent ? summaryText : (item.title || summaryText);
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-surface-2 px-4 py-3 transition hover:border-brand-300"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    className="group flex items-start justify-between gap-3 cursor-pointer"
                    onClick={() => {
                      handleApplyStored(item);
                      setSearchModal(null);
                      resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        handleApplyStored(item);
                        setSearchModal(null);
                        resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }
                    }}
                  >
                    <div className="flex min-w-0 gap-3">
                      <span className="mt-0.5 flex h-8 w-8 items-center justify-center text-ink-faint group-hover:text-brand-700">
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="11" cy="11" r="7" />
                          <path d="M21 21l-4.35-4.35" />
                        </svg>
                      </span>
                      <span className="min-w-0 flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-ink group-hover:text-brand-700 line-clamp-1 truncate">
                          {displayTitle}
                        </span>
                        <span className="text-xs text-gray-500">{itemDate}</span>
                      </span>
                    </div>
                    {isRecent ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="ml-auto self-start"
                        onClick={(event) => {
                          event.stopPropagation();
                          openSaveFromRecentModal(item);
                        }}
                      >
                        Save
                      </Button>
                    ) : (
                      <div className="ml-auto self-start flex gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleRenameSaved(item);
                          }}
                        >
                          Rename
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="danger"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteSaved(item);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-surface-3 bg-surface-1 px-4 py-6 text-center text-sm text-ink-faint">
            {searchModal === "recent" ? "No recent searches yet." : "No saved searches yet."}
          </div>
        )}
        {saveRecentModal.open ? (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={closeSaveFromRecentModal}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="save-recent-title"
              className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-3">
                <h3 id="save-recent-title" className="text-lg font-semibold text-ink">
                  Name this saved search
                </h3>
                <button
                  type="button"
                  className="rounded p-1 text-ink-faint hover:text-ink focus:outline-none focus:ring-2 focus:ring-brand-300"
                  onClick={closeSaveFromRecentModal}
                  aria-label="Close"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="space-y-2">
                <Input
                  label="Saved search name"
                  value={saveRecentModal.title}
                  autoFocus
                  onChange={(event) => setSaveFromRecentTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      confirmSaveFromRecent();
                    }
                  }}
                />
                {saveRecentModal.error ? (
                  <p className="text-xs text-danger">{saveRecentModal.error}</p>
                ) : null}
              </div>
              <div className="mt-5 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={closeSaveFromRecentModal}>
                  Cancel
                </Button>
                <Button type="button" onClick={confirmSaveFromRecent} disabled={isSavingPreset}>
                  {isSavingPreset ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </EditSectionModal>
    </div>
  );
}
