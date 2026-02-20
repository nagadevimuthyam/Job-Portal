import Card from "../../../../../components/ui/Card";

export default function RecentSavedSidebar({
  activeTab,
  onTabChange,
  displayedRecent,
  displayedSaved,
  onApplyStored,
}) {
  const items = activeTab === "recent" ? displayedRecent : displayedSaved;

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-6">
        <Card className="h-[calc(100vh-var(--topbar-h)-24px-88px)] flex flex-col p-0">
          <div className="flex items-center gap-6 border-b border-surface-3 px-5 pt-5">
            <button
              type="button"
              className={`pb-3 text-sm font-semibold ${
                activeTab === "recent"
                  ? "text-ink border-b-2 border-brand-500"
                  : "text-ink-faint"
              }`}
              onClick={() => onTabChange("recent")}
            >
              <span className="flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 8v5l3 3" />
                  <circle cx="12" cy="12" r="8" />
                </svg>
                Recent searches
              </span>
            </button>
            <button
              type="button"
              className={`pb-3 text-sm font-semibold ${
                activeTab === "saved"
                  ? "text-ink border-b-2 border-brand-500"
                  : "text-ink-faint"
              }`}
              onClick={() => onTabChange("saved")}
            >
              <span className="flex items-center gap-2">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 3h14a2 2 0 0 1 2 2v16l-9-5-9 5V5a2 2 0 0 1 2-2z" />
                </svg>
                Saved searches
              </span>
            </button>
          </div>
          <div className="flex-1 min-h-0 overflow-y-scroll soft-scrollbar px-5 pb-5 pt-4 space-y-3">
            {items.map((item, index) => (
              <button
                key={`${item.name}-${index}`}
                type="button"
                className="flex w-full items-start gap-3 rounded-xl border border-surface-3 px-4 py-3 text-left"
                onClick={() => onApplyStored(item)}
              >
                <span className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-surface-2 text-ink-faint">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                </span>
                <span className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-ink">{item.name}</span>
                  <span className="text-xs text-ink-faint">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </aside>
  );
}
