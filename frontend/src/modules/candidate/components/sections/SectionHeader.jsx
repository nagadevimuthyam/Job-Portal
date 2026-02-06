export default function SectionHeader({ title, description }) {
  return (
    <div>
      <h3 className="text-base font-semibold text-ink">{title}</h3>
      {description && <p className="text-xs text-ink-faint">{description}</p>}
    </div>
  );
}
