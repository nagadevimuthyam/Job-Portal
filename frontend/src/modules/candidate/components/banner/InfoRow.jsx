export default function InfoRow({ icon, value }) {
  return (
    <div className="flex items-center gap-2 text-ink-faint">
      <span className="text-ink">{icon}</span>
      <span className="font-medium text-ink">{value}</span>
    </div>
  );
}
