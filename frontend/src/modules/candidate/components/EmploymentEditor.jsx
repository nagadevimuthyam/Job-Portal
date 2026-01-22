import Input from "../../../components/ui/Input";

export default function EmploymentEditor({ value, onChange }) {
  const updateField = (field) => (event) => {
    const nextValue =
      event.target.type === "checkbox" ? event.target.checked : event.target.value;
    onChange({ ...value, [field]: nextValue });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Input label="Company" value={value.company} onChange={updateField("company")} />
      <Input label="Title" value={value.title} onChange={updateField("title")} />
      <Input label="Start Date" type="date" value={value.start_date} onChange={updateField("start_date")} />
      <Input
        label="End Date"
        type="date"
        value={value.end_date}
        onChange={updateField("end_date")}
        disabled={value.is_current}
      />
      <label className="flex items-center gap-2 text-sm font-medium text-ink md:col-span-2">
        <input
          type="checkbox"
          checked={value.is_current}
          onChange={updateField("is_current")}
          className="h-4 w-4 rounded border-surface-3 text-brand-600 focus:ring-brand-300"
        />
        Currently working here
      </label>
      <label className="md:col-span-2">
        <span className="text-sm font-semibold text-ink-soft">Description</span>
        <textarea
          rows={4}
          value={value.description}
          onChange={updateField("description")}
          className="mt-1 w-full rounded-xl border border-surface-3 bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="Outline responsibilities, impact, and tools used."
        />
      </label>
    </div>
  );
}
