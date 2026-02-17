import Button from "../../../../components/ui/Button";

export default function EditButton({ onClick, disabled, label = "Edit" }) {
  return (
    <Button size="sm" variant="outline" onClick={onClick} disabled={disabled}>
      {label}
    </Button>
  );
}
