export default function SectionState({ message }) {
  if (!message) return null;
  return <p className="text-sm text-ink-faint">{message}</p>;
}
