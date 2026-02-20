import Card from "../../../../../components/ui/Card";
import Skeleton from "../../../../../components/ui/Skeleton";
import Badge from "../../../../../components/ui/Badge";
import Button from "../../../../../components/ui/Button";
import { formatDate } from "../utils/formatters";

export default function ResultsList({
  appliedFilters,
  isLoading,
  results,
  onViewProfile,
}) {
  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!appliedFilters) {
    return (
      <Card>
        <p className="text-sm text-ink-faint">Results will appear here</p>
      </Card>
    );
  }

  if (!results.length) {
    return (
      <Card>
        <p className="text-sm text-ink-faint">No candidates match these filters yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((candidate) => (
        <Card key={candidate.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-ink">{candidate.full_name}</h3>
              <p className="text-sm text-ink-faint">
                {candidate.location || "Location not provided"}
              </p>
            </div>
            <Badge label={`Exp: ${candidate.total_experience}y`} tone="neutral" />
          </div>
          <div className="flex flex-wrap gap-2">
            {(candidate.skills || []).slice(0, 6).map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink"
              >
                {skill}
              </span>
            ))}
          </div>
          <p className="text-sm text-ink-soft">
            {candidate.summary || "No summary yet."}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-ink-faint">
              Last updated {formatDate(candidate.last_updated)}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewProfile(candidate.id)}
              >
                View Profile
              </Button>
              <Button variant="ghost" size="sm">Shortlist</Button>
              <Button variant="ghost" size="sm">Add Note</Button>
              <Button variant="ghost" size="sm">Save to Folder</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
