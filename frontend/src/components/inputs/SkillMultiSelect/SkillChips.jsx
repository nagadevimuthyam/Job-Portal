export default function SkillChips({ items, onRemove }) {
  const formatLabel = (label) => {
    if (!label || label !== label.toLowerCase()) return label;
    return label.replace(/\b\w/g, (char) => char.toUpperCase());
  };

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
          {formatLabel(skill.name)}
          <button
            type="button"
            className="text-ink-faint hover:text-ink"
            onClick={() => onRemove(index)}
            aria-label={`Remove ${skill.name}`}
          >
            x
          </button>
        </span>
      ))}
    </div>
  );
}
