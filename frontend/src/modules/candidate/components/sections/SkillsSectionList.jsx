import SectionState from "./SectionState";

export default function SkillsSectionList({ items, isEditing, onRemove }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.length === 0 && <SectionState message="Add at least 5 skills." />}
      {items.map((skill, index) => (
        <span
          key={skill.id || `${skill.name}-${index}`}
          className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink"
        >
          {skill.name}
          {isEditing && (
            <button
              type="button"
              className="text-ink-faint hover:text-ink"
              onClick={() => onRemove(index)}
            >
              ×
            </button>
          )}
        </span>
      ))}
    </div>
  );
}
