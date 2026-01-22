export default function Badge({ label, tone = "neutral" }) {
  const tones = {
    neutral: "bg-surface-2 text-ink-soft",
    success: "bg-success/10 text-success",
    danger: "bg-danger/10 text-danger",
  };
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}>{label}</span>
  );
}
