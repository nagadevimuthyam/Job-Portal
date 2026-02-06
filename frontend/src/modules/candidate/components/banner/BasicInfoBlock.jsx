import InfoRow from "./InfoRow";

export default function BasicInfoBlock({ leftRows, rightRows }) {
  return (
    <div className="grid gap-6 text-sm text-ink md:grid-cols-2">
      <div className="space-y-3">
        {leftRows.map((row) => (
          <InfoRow key={row.key} icon={row.icon} value={row.value} />
        ))}
      </div>
      <div className="space-y-3 md:border-l md:border-surface-3 md:pl-6">
        {rightRows.map((row) => (
          <InfoRow key={row.key} icon={row.icon} value={row.value} />
        ))}
      </div>
    </div>
  );
}
