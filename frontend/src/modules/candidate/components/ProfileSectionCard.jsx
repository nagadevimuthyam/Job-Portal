import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";

export default function ProfileSectionCard({
  title,
  description,
  actionLabel,
  onAction,
  children,
  readonly = false,
  actions,
}) {
  return (
    <Card className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-ink">{title}</h3>
          {description && <p className="text-xs text-ink-faint">{description}</p>}
        </div>
        {actions}
        {!actions && !readonly && actionLabel && (
          <Button size="sm" variant="outline" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
      <div>{children}</div>
    </Card>
  );
}
