import SectionState from "./SectionState";
import { MONTH_OPTIONS } from "../../../../shared/constants/profileOptions";

const monthLabel = (value) => {
  if (!value) return "";
  const match = MONTH_OPTIONS.find((option) => Number(option.value) === Number(value));
  return match ? match.label : String(value);
};

const formatDuration = (project) => {
  const fromYear = project.worked_from_year;
  const fromMonth = monthLabel(project.worked_from_month);
  if (!fromYear || !fromMonth) return "";

  const fromText = `${fromMonth} ${fromYear}`;
  if (project.status === "FINISHED" && project.worked_till_year && project.worked_till_month) {
    const tillText = `${monthLabel(project.worked_till_month)} ${project.worked_till_year}`;
    return `${fromText} - ${tillText}`;
  }
  return `${fromText} - Present`;
};

const statusLabel = (status) => {
  if (status === "FINISHED") return "Finished";
  if (status === "IN_PROGRESS") return "In progress";
  return "";
};

export default function ProjectsSectionList({ items }) {
  if (items.length === 0) {
    return <SectionState message="Add your best project work." />;
  }

  return (
    <div className="space-y-3">
      {items.map((project, index) => (
        <div key={project.id || project._key || index} className="rounded-xl border border-surface-3 px-4 py-3">
          <div>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-ink">{project.title}</p>
                {(formatDuration(project) || statusLabel(project.status)) && (
                  <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-ink">
                    {formatDuration(project) && (
                      <span>Duration: {formatDuration(project)}</span>
                    )}
                    {statusLabel(project.status) && (
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-brand-700">
                        {statusLabel(project.status)}
                      </span>
                    )}
                  </div>
                )}
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-brand-700 underline"
                  >
                    {project.link}
                  </a>
                )}
              </div>
            </div>
            {project.description && <p className="mt-2 text-xs text-ink-soft">{project.description}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
