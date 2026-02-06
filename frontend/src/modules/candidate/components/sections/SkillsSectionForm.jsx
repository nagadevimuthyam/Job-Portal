import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import FieldError from "./FieldError";

export default function SkillsSectionForm({ value, onChange, onAdd, error }) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="min-w-[220px]">
        <Input
          label="Add skill"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="React, Django, SQL"
        />
        <FieldError message={error} />
      </div>
      <div className="self-end">
        <Button type="button" onClick={onAdd}>
          Add Skill
        </Button>
      </div>
    </div>
  );
}
