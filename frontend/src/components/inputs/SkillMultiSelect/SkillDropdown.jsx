import { createPortal } from "react-dom";

export default function SkillDropdown({
  items,
  highlightIndex,
  onSelect,
  onHover,
  isOpen,
  anchorRect,
}) {
  if (!isOpen || items.length === 0 || !anchorRect) return null;

  return createPortal(
    <div
      className="fixed z-[9999] rounded-xl border border-surface-3 bg-white shadow-lg"
      style={{
        top: `${anchorRect.bottom + 8}px`,
        left: `${anchorRect.left}px`,
        width: `${anchorRect.width}px`,
      }}
    >
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
    </div>,
    document.body
  );
}
