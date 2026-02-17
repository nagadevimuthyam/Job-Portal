import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import FieldError from "./FieldError";
import {
  EDUCATION_OPTIONS,
  COURSE_TYPE_OPTIONS,
  getYearOptions,
  mapLegacyValue,
} from "../../../../shared/constants/profileOptions";

const yearOptions = getYearOptions(1970).map((option) => option.value);

export default function EducationSectionForm({ items, onChange, onRemove, onAdd, errors }) {
  return (
    <div className="space-y-3">
      {items.map((edu, index) => {
        const itemErrors = errors?.[index] || {};
        return (
          <div key={edu.id || edu._key || index} className="rounded-xl border border-surface-3 px-4 py-3">
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="block">
                    <span className="text-sm font-semibold text-ink-soft">Education</span>
                    <select
                      className={`mt-1 w-full rounded-xl border bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 ${
                        itemErrors.degree
                          ? "border-danger focus:border-danger focus:ring-danger/20"
                          : "border-surface-3 focus:border-brand-300 focus:ring-brand-200"
                      }`}
                      value={mapLegacyValue(edu.degree, EDUCATION_OPTIONS) || ""}
                      onChange={(event) => onChange(index, "degree", event.target.value)}
                    >
                      <option value="">Select education</option>
                      {EDUCATION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>
                  <FieldError message={itemErrors.degree} />
                </div>
                <div>
                  <Input
                    label="University/Institute"
                    value={edu.institution}
                    onChange={(event) => onChange(index, "institution", event.target.value)}
                  />
                  <FieldError message={itemErrors.institution} />
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-ink-soft">Course type</p>
                <div className="mt-2 flex flex-wrap gap-6">
                  {COURSE_TYPE_OPTIONS.map((option) => (
                    <label key={option.value} className="flex items-center gap-2 text-sm text-ink">
                      <input
                        type="radio"
                        name={`course_type_${index}`}
                        value={option.value}
                        checked={
                          mapLegacyValue(edu.course_type, COURSE_TYPE_OPTIONS) === option.value
                        }
                        onChange={() => onChange(index, "course_type", option.value)}
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                <FieldError message={itemErrors.course_type} />
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <label className="block">
                    <span className="text-sm font-semibold text-ink-soft">Starting year</span>
                    <select
                      className={`mt-1 w-full rounded-xl border bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 ${
                        itemErrors.start_year
                          ? "border-danger focus:border-danger focus:ring-danger/20"
                          : "border-surface-3 focus:border-brand-300 focus:ring-brand-200"
                      }`}
                      value={edu.start_year || ""}
                      onChange={(event) => onChange(index, "start_year", event.target.value)}
                    >
                      <option value="">Select year</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </label>
                  <FieldError message={itemErrors.start_year} />
                </div>
                <div>
                  <label className="block">
                    <span className="text-sm font-semibold text-ink-soft">Ending year</span>
                    <select
                      className={`mt-1 w-full rounded-xl border bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 ${
                        itemErrors.end_year
                          ? "border-danger focus:border-danger focus:ring-danger/20"
                          : "border-surface-3 focus:border-brand-300 focus:ring-brand-200"
                      }`}
                      value={edu.end_year || ""}
                      onChange={(event) => onChange(index, "end_year", event.target.value)}
                    >
                      <option value="">Select year</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </label>
                  <FieldError message={itemErrors.end_year} />
                </div>
              </div>

              <div>
                <Input
                  label="Marks/Percentage"
                  type="number"
                  step="0.01"
                  value={edu.marks_percentage ?? ""}
                  onChange={(event) => onChange(index, "marks_percentage", event.target.value)}
                />
                <FieldError message={itemErrors.marks_percentage} />
              </div>
              <Button size="sm" variant="ghost" onClick={() => onRemove(edu, index)}>
                Remove
              </Button>
            </div>
          </div>
        );
      })}
      <Button type="button" variant="outline" onClick={onAdd}>
        Add Education
      </Button>
    </div>
  );
}
