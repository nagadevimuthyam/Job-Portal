import noticePeriodOptions from "../../../../../shared/constants/noticePeriodOptions";

export default function NoticePeriodPills({ value, onChange }) {
  return (
    <div>
      <p className="text-sm font-semibold text-ink-soft">Notice period</p>
      <div className="mt-3 flex flex-nowrap gap-2 overflow-x-auto no-scrollbar">
        {noticePeriodOptions.map((option) => {
          const isActive = value !== null && String(value) === option.value;
          return (
            <button
              key={option.label}
              type="button"
              className={`flex items-center gap-2 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold transition ${
                isActive
                  ? "border-brand-300 bg-brand-50 text-brand-700"
                  : "border-surface-3 bg-surface-inverse text-ink"
              }`}
              onClick={() => onChange(isActive ? null : option.value)}
            >
              <span>{option.label}</span>
              <span className="text-xs">{isActive ? "×" : "+"}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
