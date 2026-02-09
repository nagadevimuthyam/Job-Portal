export default function SkillDropdown({
  items,
  highlightIndex,
  onSelect,
  onHover,
  isOpen,
}) {
  if (!isOpen || items.length === 0) return null;

  return (
    <div className="absolute z-20 mt-2 w-full rounded-xl border border-surface-3 bg-white shadow-lg">
      <ul className="max-h-56 overflow-auto py-1 text-sm">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`}>
            <button
              type="button"
              className={`flex w-full items-center justify-between px-3 py-2 text-left ${
                highlightIndex === index ? "bg-brand-50 text-brand-700" : "text-ink"
              }`}
              onMouseEnter={() => onHover(index)}
              onMouseDown={(event) => {
                event.preventDefault();
                onSelect(item);
              }}
            >
              <span>{item.label}</span>
              {item.badge && (
                <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                  {item.badge}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
