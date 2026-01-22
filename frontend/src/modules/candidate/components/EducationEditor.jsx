import Input from "../../../components/ui/Input";

export default function EducationEditor({ value, onChange }) {
  const updateField = (field) => (event) => {
    onChange({ ...value, [field]: event.target.value });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Input label="Degree" value={value.degree} onChange={updateField("degree")} />
      <Input label="Institution" value={value.institution} onChange={updateField("institution")} />
      <Input
        label="Start Year"
        type="number"
        value={value.start_year}
        onChange={updateField("start_year")}
        placeholder="2021"
      />
      <Input
        label="End Year"
        type="number"
        value={value.end_year}
        onChange={updateField("end_year")}
        placeholder="2025"
      />
    </div>
  );
}
