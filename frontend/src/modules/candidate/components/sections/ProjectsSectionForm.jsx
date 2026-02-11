import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import FieldError from "./FieldError";
import {
  PROJECT_STATUS_OPTIONS,
  MONTH_OPTIONS,
  getYearOptions,
} from "../../../../shared/constants/profileOptions";

const yearOptions = getYearOptions(1970);

export default function ProjectsSectionForm({ items, onChange, onRemove, onAdd, errors }) {
  return (
    <div className="space-y-3">
      {items.map((project, index) => {
        const itemErrors = errors?.[index] || {};
        return (
          <div key={project.id || project._key || index} className="rounded-xl border border-surface-3 px-4 py-3">
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Input
                    label="Project Title"
                    value={project.title}
                    onChange={(event) => onChange(index, "title", event.target.value)}
                  />
                  <FieldError message={itemErrors.title} />
                </div>
                <div>
                  <Input
                    label="Project Link"
                    value={project.link}
                    onChange={(event) => onChange(index, "link", event.target.value)}
                  />
                  <FieldError message={itemErrors.link} />
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-soft">Project status</p>
                <div className="mt-2 flex flex-wrap gap-6">
                  {PROJECT_STATUS_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 text-sm text-ink">
                      <input
                        type="radio"
                        name={`project_status_${index}`}
                        value={option.value}
                        checked={project.status === option.value}
                        onChange={() => onChange(index, "status", option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                <FieldError message={itemErrors.status} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-soft">Worked from</p>
                <div className="mt-2 grid gap-3 md:grid-cols-2">
                  <label className="block">
                    <span className="text-xs font-semibold text-ink-faint">Year</span>
                    <select
                      className={`mt-1 w-full rounded-xl border bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 ${
                        itemErrors.worked_from_year
                          ? "border-danger focus:border-danger focus:ring-danger/20"
                          : "border-surface-3 focus:border-brand-300 focus:ring-brand-200"
                      }`}
                      value={project.worked_from_year || ""}
                      onChange={(event) => onChange(index, "worked_from_year", event.target.value)}
                    >
                      <option value="">Select year</option>
                      {yearOptions.map((year) => (
                        <option key={year.value} value={year.value}>
                          {year.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="block">
                    <span className="text-xs font-semibold text-ink-faint">Month</span>
                    <select
                      className={`mt-1 w-full rounded-xl border bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 ${
                        itemErrors.worked_from_month
                          ? "border-danger focus:border-danger focus:ring-danger/20"
                          : "border-surface-3 focus:border-brand-300 focus:ring-brand-200"
                      }`}
                      value={project.worked_from_month || ""}
                      onChange={(event) => onChange(index, "worked_from_month", event.target.value)}
                    >
                      <option value="">Select month</option>
                      {MONTH_OPTIONS.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="mt-1">
                  <FieldError message={itemErrors.worked_from_year} />
                  <FieldError message={itemErrors.worked_from_month} />
                </div>
              </div>
              {project.status === "FINISHED" && (
                <div>
                  <p className="text-sm font-semibold text-ink-soft">Worked till</p>
                  <div className="mt-2 grid gap-3 md:grid-cols-2">
                    <label className="block">
                      <span className="text-xs font-semibold text-ink-faint">Year</span>
                      <select
                        className={`mt-1 w-full rounded-xl border bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 ${
                          itemErrors.worked_till_year
                            ? "border-danger focus:border-danger focus:ring-danger/20"
                            : "border-surface-3 focus:border-brand-300 focus:ring-brand-200"
                        }`}
                        value={project.worked_till_year || ""}
                        onChange={(event) => onChange(index, "worked_till_year", event.target.value)}
                      >
                        <option value="">Select year</option>
                        {yearOptions.map((year) => (
                          <option key={year.value} value={year.value}>
                            {year.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold text-ink-faint">Month</span>
                      <select
                        className={`mt-1 w-full rounded-xl border bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 ${
                          itemErrors.worked_till_month
                            ? "border-danger focus:border-danger focus:ring-danger/20"
                            : "border-surface-3 focus:border-brand-300 focus:ring-brand-200"
                        }`}
                        value={project.worked_till_month || ""}
                        onChange={(event) => onChange(index, "worked_till_month", event.target.value)}
                      >
                        <option value="">Select month</option>
                        {MONTH_OPTIONS.map((month) => (
                          <option key={month.value} value={month.value}>
                            {month.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <div className="mt-1">
                    <FieldError message={itemErrors.worked_till_year} />
                    <FieldError message={itemErrors.worked_till_month} />
                  </div>
                </div>
              )}
              <label className="block">
                <span className="text-sm font-semibold text-ink-soft">Description</span>
                <textarea
                  rows={3}
                  value={project.description}
                  onChange={(event) => onChange(index, "description", event.target.value)}
                  className="mt-1 w-full rounded-xl border border-surface-3 bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  placeholder="Problem solved, stack used, and outcomes."
                />
                <FieldError message={itemErrors.description} />
              </label>
              <Button size="sm" variant="ghost" onClick={() => onRemove(project, index)}>
                Remove
              </Button>
            </div>
          </div>
        );
      })}
      <Button type="button" variant="outline" onClick={onAdd}>
        Add Project
      </Button>
    </div>
  );
}
