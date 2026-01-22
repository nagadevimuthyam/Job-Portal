import Card from "../../../components/ui/Card";

export default function ProfileCompletionCard({ percent = 0, lastUpdated, subtitle }) {
  const segments = Array.from({ length: 10 });
  const filledSegments = Math.min(10, Math.round(percent / 10));
  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Profile strength</p>
          <h3 className="text-lg font-semibold text-ink">Completion {percent}%</h3>
          {subtitle && <p className="mt-1 text-xs text-ink-faint">{subtitle}</p>}
        </div>
        <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
          Premium
        </span>
      </div>
      <div className="grid grid-cols-10 gap-1">
        {segments.map((_, index) => (
          <div
            key={`segment-${index}`}
            className={`h-2 rounded-full ${index < filledSegments ? "bg-brand-600" : "bg-surface-3"}`}
          />
        ))}
      </div>
      {lastUpdated && (
        <p className="text-xs text-ink-faint">
          Last updated {new Date(lastUpdated).toLocaleDateString()}
        </p>
      )}
    </Card>
  );
}
