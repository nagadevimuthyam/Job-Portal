export default function SkillChips({ items, onRemove }) {
  if (!items.length) {
    return <p className="text-sm text-ink-faint">No skills yet. Add your strengths.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((skill, index) => (
        <span
          key={skill.id || `${skill.name}-${index}`}
          className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink"
        >
          {skill.name}
          <button
            type="button"
            className="text-ink-faint hover:text-ink"
            onClick={() => onRemove(index)}
            aria-label={`Remove ${skill.name}`}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
