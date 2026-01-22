import Button from "../../../components/ui/Button";

export default function EditSectionModal({
  open,
  title,
  onClose,
  onSubmit,
  primaryLabel = "Save",
  secondaryLabel = "Cancel",
  children,
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-slate-900/40"
        aria-label="Close modal"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl rounded-t-2xl bg-white p-6 shadow-2xl sm:max-h-[85vh] sm:rounded-2xl sm:overflow-y-auto">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-ink">{title}</h3>
            <p className="text-xs text-ink-faint">Make quick edits and save.</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-surface-3 p-2 text-ink-faint hover:text-ink"
            onClick={onClose}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
        <div className="mt-5 space-y-4">{children}</div>
        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <Button type="button" variant="ghost" onClick={onClose}>
            {secondaryLabel}
          </Button>
          {onSubmit && (
            <Button type="button" onClick={onSubmit}>
              {primaryLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
