import SectionState from "./SectionState";

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
              <div>
                <p className="text-sm font-semibold text-ink">{project.title}</p>
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
