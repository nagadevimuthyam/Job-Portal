import Button from "../../../../components/ui/Button";

export default function SectionActions({
  isEditing,
  isLocked,
  onEdit,
  onCancel,
  onSave,
  saveLabel = "Save",
}) {
  if (isEditing) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button size="sm" onClick={onSave}>
          {saveLabel}
        </Button>
      </div>
    );
  }

  return (
    <Button size="sm" variant="outline" onClick={onEdit} disabled={isLocked}>
      Edit
    </Button>
  );
}
