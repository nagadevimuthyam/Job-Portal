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
  onViewResume,
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
      {results.map((candidate) => {
        const fullName = candidate.full_name || "Candidate";
        const title = candidate.current_title || candidate.role || candidate.title;
        const location =
          candidate.current_location || candidate.location || "Location not provided";
        const experience =
          candidate.total_experience_years ?? candidate.total_experience ?? 0;
        const lastActive =
          candidate.last_active_at || candidate.updated_at || candidate.last_updated;
        const profileImage =
          candidate.profile_image_url || candidate.profile_image || candidate.avatar_url;
        const resumeUrl =
          candidate.resume_url || candidate.resume_link || candidate.resume;

        return (
          <Card key={candidate.id} className="space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={fullName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-lg font-semibold text-ink">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-ink">{fullName}</h3>
                  <p className="text-sm text-ink-faint">
                    {title ? `${title} • ${location}` : location}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge label={`Exp: ${experience}y`} tone="neutral" />
                <Button
                  size="sm"
                  onClick={() => onViewProfile(candidate.id)}
                >
                  View Profile
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {(candidate.skills || []).slice(0, 6).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
                >
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-ink-faint">
              <div className="flex flex-wrap items-center gap-4">
                <span>{experience} Years</span>
                <span>
                  Last active {lastActive ? formatDate(lastActive) : "N/A"}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {resumeUrl ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewResume?.(resumeUrl)}
                  >
                    Resume
                  </Button>
                ) : null}
                <Button variant="ghost" size="sm">Shortlist</Button>
                <Button variant="ghost" size="sm">Add Note</Button>
                <Button variant="ghost" size="sm">Save to Folder</Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
