const genderOptions = [
  { label: "Male candidates", value: "MALE" },
  { label: "Female candidates", value: "FEMALE" },
];

export default function AdditionalDetails({ value, onChange }) {
  const safeValue = Array.isArray(value) ? value : [];
  return (
    <details className="rounded-xl border border-surface-3/60 bg-surface-inverse p-4">
      <summary className="cursor-pointer text-sm font-semibold text-ink">
        Additional details
      </summary>
      <div className="mt-4 space-y-3">
        <p className="text-sm font-semibold text-ink-soft">Gender</p>
        <div className="flex flex-wrap gap-2">
          {genderOptions.map((option) => {
            const isActive = safeValue.includes(option.value);
            return (
              <button
                key={option.value}
                type="button"
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  isActive
                    ? "border-brand-300 bg-brand-50 text-brand-700"
                    : "border-surface-3 bg-surface-inverse text-ink"
                }`}
                onClick={() => {
                  const next = isActive
                    ? safeValue.filter((item) => item !== option.value)
                    : [...safeValue, option.value];
                  onChange(next);
                }}
              >
                <span>{option.label}</span>
                <span className="text-xs">{isActive ? "×" : "+"}</span>
              </button>
            );
          })}
        </div>
      </div>
    </details>
  );
}
