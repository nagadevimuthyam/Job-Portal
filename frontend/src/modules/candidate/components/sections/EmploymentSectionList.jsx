import SectionState from "./SectionState";

const formatDateRange = (start, end, isCurrent) => {
  if (!start) return "Dates not set";
  const startLabel = new Date(start).toLocaleDateString();
  if (isCurrent) return `${startLabel} - Present`;
  if (!end) return `${startLabel} -`;
  return `${startLabel} - ${new Date(end).toLocaleDateString()}`;
};

export default function EmploymentSectionList({ items }) {
  if (items.length === 0) {
    return <SectionState message="Add your most recent role." />;
  }

  return (
    <div className="space-y-3">
      {items.map((job, index) => (
        <div key={job.id || job._key || index} className="rounded-xl border border-surface-3 px-4 py-3">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-ink">{job.title}</p>
                <p className="text-xs text-ink-faint">{job.company}</p>
                <p className="text-xs text-ink-faint">
                  {formatDateRange(job.start_date, job.end_date, job.is_current)}
                </p>
              </div>
            </div>
            {job.description && <p className="mt-2 text-xs text-ink-soft">{job.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
