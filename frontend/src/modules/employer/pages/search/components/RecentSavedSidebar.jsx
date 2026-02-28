import Card from "../../../../../components/ui/Card";

export default function RecentSavedSidebar({
  activeTab,
  onTabChange,
  displayedRecent,
  displayedSaved,
  onApplyStored,
}) {
  const items = activeTab === "recent" ? displayedRecent : displayedSaved;
  const recentItems = displayedRecent;
  const savedItems = displayedSaved;

  return (
    <aside className="hidden lg:block">
      <div className="sticky top-6">
        <Card className="h-[calc(100vh-var(--topbar-h)-24px-88px)] flex flex-col p-0">
          <div className="border-b border-surface-3 px-5 pt-5">
            <button
              type="button"
              className="pb-3 text-sm font-semibold text-ink border-b-2 border-brand-500"
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
          </div>

          <div className="max-h-[520px] overflow-y-scroll soft-scrollbar pb-5 pt-4 pr-2">
            <div className="px-5 space-y-3">
              {items.map((item, index) => (
                <button
                  key={`${item.name}-${index}`}
                  type="button"
                  className="flex w-full items-start gap-3 px-1 py-2 text-left"
                  onClick={() => onApplyStored(item)}
                >
                  <span className="mt-0.5 flex h-8 w-8 items-center justify-center text-ink-faint">
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
                  <span className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-ink">{item.name}</span>
                    <span className="text-xs text-ink-faint">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-surface-3 px-5 py-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
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
            </p>
            <div className="mt-3 max-h-56 overflow-y-scroll soft-scrollbar pr-2">
              <div className="px-5 space-y-3">
                {savedItems.map((item, index) => (
                  <button
                    key={`${item.name}-saved-${index}`}
                    type="button"
                    className="flex w-full items-start gap-3 px-1 py-2 text-left"
                    onClick={() => onApplyStored(item)}
                  >
                    <span className="mt-0.5 flex h-8 w-8 items-center justify-center text-ink-faint">
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
                    <span className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-ink">{item.name}</span>
                      <span className="text-xs text-ink-faint">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </aside>
  );
}
