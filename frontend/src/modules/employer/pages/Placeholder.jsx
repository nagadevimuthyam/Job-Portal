export default function EmployerPlaceholder({ title }) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-bold text-ink">{title}</h1>
      <p className="text-sm text-ink-faint">This module will be available in the next release.</p>
    </div>
  );
}
