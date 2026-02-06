import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import FieldError from "./FieldError";

export default function ProjectsSectionForm({ items, onChange, onRemove, onAdd, errors }) {
  return (
    <div className="space-y-3">
      {items.map((project, index) => {
        const itemErrors = errors?.[index] || {};
        return (
          <div key={project.id || project._key || index} className="rounded-xl border border-surface-3 px-4 py-3">
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Input
                    label="Project Title"
                    value={project.title}
                    onChange={(event) => onChange(index, "title", event.target.value)}
                  />
                  <FieldError message={itemErrors.title} />
                </div>
                <div>
                  <Input
                    label="Project Link"
                    value={project.link}
                    onChange={(event) => onChange(index, "link", event.target.value)}
                  />
                  <FieldError message={itemErrors.link} />
                </div>
              </div>
              <label className="block">
                <span className="text-sm font-semibold text-ink-soft">Description</span>
                <textarea
                  rows={3}
                  value={project.description}
                  onChange={(event) => onChange(index, "description", event.target.value)}
                  className="mt-1 w-full rounded-xl border border-surface-3 bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  placeholder="Problem solved, stack used, and outcomes."
                />
                <FieldError message={itemErrors.description} />
              </label>
              <Button size="sm" variant="ghost" onClick={() => onRemove(project, index)}>
                Remove
              </Button>
            </div>
          </div>
        );
      })}
      <Button type="button" variant="outline" onClick={onAdd}>
        Add Project
      </Button>
    </div>
  );
}
