import SkillMultiSelect from "../../../../components/inputs/SkillMultiSelect/SkillMultiSelect";
import FieldError from "./FieldError";

export default function SkillsSectionForm({ value, onChange, error }) {
  return (
    <div>
      <SkillMultiSelect value={value} onChange={onChange} error={Boolean(error)} />
      <FieldError message={error} />
    </div>
  );
}
