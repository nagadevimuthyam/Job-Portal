import { experienceOptions, formatExperience } from "../utils/formatters";

export default function ExperienceDropdown({ label, value, onChange }) {
  return (
    <label className="block">
      <span className="text-sm font-semibold text-ink-soft">{label}</span>
      <details className="dropdown-popover relative mt-1">
        <summary className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-surface-3 bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-200">
          <span>{formatExperience(value)}</span>
          <span className="text-ink-faint">▾</span>
        </summary>
        <div className="absolute left-0 right-0 z-20 mt-2 max-h-36 overflow-y-auto soft-scrollbar rounded-xl border border-surface-3 bg-white shadow-soft">
          <button
            type="button"
            className="w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface-2"
            onClick={(event) => {
              onChange("");
              event.currentTarget.closest("details")?.removeAttribute("open");
            }}
          >
            Years
          </button>
          {experienceOptions.map((option) => (
            <button
              key={option}
              type="button"
              className="w-full px-3 py-2 text-left text-sm text-ink hover:bg-surface-2"
              onClick={(event) => {
                onChange(String(option));
                event.currentTarget.closest("details")?.removeAttribute("open");
              }}
            >
              {option} Year{option === 1 ? "" : "s"}
            </button>
          ))}
        </div>
      </details>
    </label>
  );
}
