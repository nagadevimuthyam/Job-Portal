import Button from "../../../../../components/ui/Button";

export default function StickySearchBar({ onSearch, onClear }) {
  return (
    <div className="sticky bottom-0 z-30 px-4 pb-4 pt-2">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="rounded-full border border-surface-3 bg-white/95 px-4 py-3 shadow-soft backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <select
                  className="rounded-full border border-surface-3 bg-surface-2 px-4 py-2 text-xs font-semibold text-ink shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  defaultValue="ACTIVE_UPDATED"
                >
                  <option value="ACTIVE_UPDATED">Active/updated</option>
                  <option value="ACTIVE">Active</option>
                  <option value="CREATED">Created</option>
                </select>
                <select
                  className="rounded-full border border-surface-3 bg-white px-4 py-2 text-xs font-semibold text-ink shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  defaultValue="6_MONTHS"
                >
                  <option value="1_DAY">In last 1 day</option>
                  <option value="3_DAYS">In last 3 days</option>
                  <option value="7_DAYS">In last 7 days</option>
                  <option value="15_DAYS">In last 15 days</option>
                  <option value="1_MONTH">In last 1 month</option>
                  <option value="3_MONTHS">In last 3 months</option>
                  <option value="6_MONTHS">In last 6 months</option>
                </select>
              </div>
              <div className="flex items-center gap-3">
                <Button type="button" variant="outline" onClick={onClear}>
                  Clear all
                </Button>
                <Button type="button" onClick={onSearch}>
                  Search Candidates
                </Button>
              </div>
            </div>
          </div>
          <div className="hidden lg:block" />
        </div>
      </div>
    </div>
  );
}
