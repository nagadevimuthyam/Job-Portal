import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import FieldError from "./FieldError";

export default function EmploymentSectionForm({ items, onChange, onRemove, onAdd, errors }) {
  return (
    <div className="space-y-3">
      {items.map((job, index) => {
        const itemErrors = errors?.[index] || {};
        return (
          <div key={job.id || job._key || index} className="rounded-xl border border-surface-3 px-4 py-3">
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Input
                    label="Company"
                    value={job.company}
                    onChange={(event) => onChange(index, "company", event.target.value)}
                  />
                  <FieldError message={itemErrors.company} />
                </div>
                <div>
                  <Input
                    label="Title"
                    value={job.title}
                    onChange={(event) => onChange(index, "title", event.target.value)}
                  />
                  <FieldError message={itemErrors.title} />
                </div>
                <div>
                  <Input
                    label="Start Date"
                    type="date"
                    value={job.start_date}
                    onChange={(event) => onChange(index, "start_date", event.target.value)}
                  />
                  <FieldError message={itemErrors.start_date} />
                </div>
                <div>
                  <Input
                    label="End Date"
                    type="date"
                    value={job.end_date}
                    onChange={(event) => onChange(index, "end_date", event.target.value)}
                    disabled={job.is_current}
                  />
                  <FieldError message={itemErrors.end_date} />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm font-medium text-ink">
                <input
                  type="checkbox"
                  checked={job.is_current}
                  onChange={(event) => onChange(index, "is_current", event.target.checked)}
                  className="h-4 w-4 rounded border-surface-3 text-brand-600 focus:ring-brand-300"
                />
                Currently working here
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-ink-soft">Description</span>
                <textarea
                  rows={3}
                  value={job.description}
                  onChange={(event) => onChange(index, "description", event.target.value)}
                  className="mt-1 w-full rounded-xl border border-surface-3 bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  placeholder="Outline responsibilities, impact, and tools used."
                />
              </label>
              <Button size="sm" variant="ghost" onClick={() => onRemove(job, index)}>
                Remove
              </Button>
            </div>
          </div>
        );
      })}
      <Button type="button" variant="outline" onClick={onAdd}>
        Add Employment
      </Button>
    </div>
  );
}
