import { EDUCATION_OPTIONS } from "../../../../../shared/constants/profileOptions";

export default function EducationDetails({ value, onChange }) {
  return (
    <details className="rounded-xl border border-surface-3/60 bg-surface-inverse p-4">
      <summary className="cursor-pointer text-sm font-semibold text-ink">
        Education details
      </summary>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-ink-soft">Education Level</span>
          <select
            className="mt-1 w-full rounded-xl border border-surface-3 bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
            value={value}
            onChange={(event) => onChange(event.target.value)}
          >
            <option value="">Any</option>
            {EDUCATION_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
    </details>
  );
}
