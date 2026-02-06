import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";
import SectionHeader from "./sections/SectionHeader";

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
        <SectionHeader title={title} description={description} />
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
