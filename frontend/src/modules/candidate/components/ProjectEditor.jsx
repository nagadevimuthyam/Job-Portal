import Input from "../../../components/ui/Input";

export default function ProjectEditor({ value, onChange }) {
  const updateField = (field) => (event) => {
    onChange({ ...value, [field]: event.target.value });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Input label="Project Title" value={value.title} onChange={updateField("title")} />
      <Input label="Project Link" value={value.link} onChange={updateField("link")} placeholder="https://..." />
      <label className="md:col-span-2">
        <span className="text-sm font-semibold text-ink-soft">Description</span>
        <textarea
          rows={4}
          value={value.description}
          onChange={updateField("description")}
          className="mt-1 w-full rounded-xl border border-surface-3 bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
          placeholder="Problem solved, stack used, and outcomes."
        />
      </label>
    </div>
  );
}
