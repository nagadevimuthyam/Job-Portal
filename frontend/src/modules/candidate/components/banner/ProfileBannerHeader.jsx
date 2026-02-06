export default function ProfileBannerHeader({ name, onEdit }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <h2 className="text-xl font-semibold text-ink">{name}</h2>
      <button
        type="button"
        onClick={onEdit}
        className="rounded-full border border-surface-3 p-1 text-ink-faint hover:text-ink"
        aria-label="Edit basic details"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 20h9" />
          <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
        </svg>
      </button>
    </div>
  );
}
