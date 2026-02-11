import SectionState from "./SectionState";

export default function EducationSectionList({ items }) {
  if (items.length === 0) {
    return <SectionState message="Add your highest qualification." />;
  }

  return (
    <div className="space-y-3">
      {items.map((edu, index) => (
        <div key={edu.id || edu._key || index} className="rounded-xl border border-surface-3 px-4 py-3">
          <p className="text-sm font-semibold text-ink">{edu.degree}</p>
          <p className="text-xs text-ink-faint">{edu.institution}</p>
          {edu.course_type && <p className="text-xs text-ink-faint">{edu.course_type}</p>}
          <p className="text-xs text-ink-faint">
            {edu.start_year} - {edu.end_year}
          </p>
          {edu.marks_percentage !== null && edu.marks_percentage !== "" && (
            <p className="text-xs text-ink-faint">Marks/Percentage: {edu.marks_percentage}</p>
          )}
        </div>
      ))}
    </div>
  );
}
