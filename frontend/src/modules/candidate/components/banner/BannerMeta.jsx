export default function BannerMeta({ updated }) {
  return (
    <p className="text-xs text-ink-faint">
      Profile last updated - <span className="font-medium text-ink">{updated}</span>
    </p>
  );
}
