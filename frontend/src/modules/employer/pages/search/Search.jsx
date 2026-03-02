import Input from "../../../../components/ui/Input";
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

export default function CandidateSearch() {
  const {
    salaryMinRef,
    salaryMaxRef,
    safeDraftFilters,
    handleSearch,
    handleSaveSearch,
    handleApplyStored,
    handleClearFilters,
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
  } = useCandidateSearchFilters();

  const { data, isLoading } = useSearchCandidatesQuery(queryArg);
  const results = appliedFilters ? data?.results || [] : [];
  const resultCount = appliedFilters ? data?.count ?? 0 : 0;

  return (
    <div className="h-[calc(100vh-64px)] -mx-6 -my-8 px-0 py-6 flex flex-col overflow-hidden">
      <div className="flex-1 min-h-0 overflow-hidden">
        <div className="mx-auto max-w-full grid gap-3 lg:grid-cols-[360px_1fr] h-full">
          <section className="min-h-0 flex flex-col">
            <div className="min-h-0 overflow-y-auto soft-scrollbar pr-1 pb-28">
              <div className="space-y-6">
                <SearchFormCard
                  saveName={saveName}
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
                        <div className="flex h-11 w-16 items-center justify-center rounded-xl border border-surface-3 bg-surface-inverse text-sm text-ink">₹</div>
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
                        <div className="flex h-11 w-16 items-center justify-center rounded-xl border border-surface-3 bg-surface-inverse text-sm text-ink">₹</div>
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
              onSearch={() => handleSearch()}
              onClear={handleClearFilters}
            />
          </section>

          <section className="min-h-0 overflow-y-auto soft-scrollbar pr-2">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-ink">Results: {resultCount}</h2>
                <div className="flex items-center gap-2 text-sm font-semibold text-ink-faint">
                  <button
                    type="button"
                    className="transition text-ink hover:text-ink"
                    onClick={() => setSearchModal("recent")}
                  >
                    Recent searches
                  </button>
                  <span className="text-ink-faint">|</span>
                  <button
                    type="button"
                    className="transition text-ink hover:text-ink"
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
        {modalItems.length ? (
          <div className="space-y-3">
            {modalItems.map((item, index) => (
              <button
                key={`${item.name}-${index}`}
                type="button"
                className="flex w-full items-start gap-3 rounded-xl border border-surface-2 px-4 py-3 text-left hover:border-brand-200"
                onClick={() => {
                  handleApplyStored(item);
                  setSearchModal(null);
                }}
              >
                <span className="mt-0.5 flex h-8 w-8 items-center justify-center text-ink-faint">
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
                <span className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-ink">{item.name}</span>
                  <span className="text-xs text-ink-faint">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-surface-3 bg-surface-1 px-4 py-6 text-center text-sm text-ink-faint">
            No searches yet.
          </div>
        )}
      </EditSectionModal>
    </div>
  );
}
