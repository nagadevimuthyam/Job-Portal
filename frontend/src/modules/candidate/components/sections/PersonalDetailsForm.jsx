import Input from "../../../../components/ui/Input";
import FieldError from "./FieldError";
import noticePeriodOptions from "../../../../shared/constants/noticePeriodOptions";

export default function PersonalDetailsForm({ draft, onChange, errors }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <Input
          label="Full Name"
          value={draft.full_name}
          onChange={(event) => onChange({ ...draft, full_name: event.target.value })}
        />
        <FieldError message={errors.full_name} />
      </div>
      <div>
        <Input
          label="Email"
          type="email"
          value={draft.email}
          onChange={(event) => onChange({ ...draft, email: event.target.value })}
        />
        <FieldError message={errors.email} />
      </div>
      <div>
        <Input
          label="Phone"
          value={draft.phone}
          onChange={(event) => onChange({ ...draft, phone: event.target.value })}
        />
        <FieldError message={errors.phone} />
      </div>
      <div>
        <Input
          label="Location"
          value={draft.location}
          onChange={(event) => onChange({ ...draft, location: event.target.value })}
        />
        <FieldError message={errors.location} />
      </div>
      <div>
        <Input
          label="Experience Years"
          type="number"
          value={draft.total_experience_years}
          onChange={(event) =>
            onChange({ ...draft, total_experience_years: event.target.value })
          }
        />
        <FieldError message={errors.total_experience_years} />
      </div>
      <div>
        <Input
          label="Experience Months"
          type="number"
          value={draft.total_experience_months}
          onChange={(event) =>
            onChange({ ...draft, total_experience_months: event.target.value })
          }
        />
        <FieldError message={errors.total_experience_months} />
      </div>
      <div className="md:col-span-2">
        <p className="text-sm font-semibold text-ink-soft">Notice period</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {noticePeriodOptions.map((option) => (
            <button
              key={option.value || "any"}
              type="button"
              onClick={() =>
                onChange({
                  ...draft,
                  notice_period_code:
                    String(draft.notice_period_code || "") === option.value
                      ? null
                      : option.value === ""
                        ? null
                        : option.value,
                })
              }
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                String(draft.notice_period_code || "") === option.value
                  ? "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-surface-3 bg-white text-ink-faint hover:border-brand-200 hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <FieldError message={errors.notice_period_code} />
      </div>
      <div>
        <Input
          label="Expected Salary"
          type="number"
          value={draft.expected_salary}
          onChange={(event) => onChange({ ...draft, expected_salary: event.target.value })}
        />
        <FieldError message={errors.expected_salary} />
      </div>
    </div>
  );
}
