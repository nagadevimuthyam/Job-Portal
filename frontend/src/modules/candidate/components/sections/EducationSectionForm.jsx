import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import FieldError from "./FieldError";

export default function EducationSectionForm({ items, onChange, onRemove, onAdd, errors }) {
  return (
    <div className="space-y-3">
      {items.map((edu, index) => {
        const itemErrors = errors?.[index] || {};
        return (
          <div key={edu.id || edu._key || index} className="rounded-xl border border-surface-3 px-4 py-3">
            <div className="space-y-3">
              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <Input
                    label="Degree"
                    value={edu.degree}
                    onChange={(event) => onChange(index, "degree", event.target.value)}
                  />
                  <FieldError message={itemErrors.degree} />
                </div>
                <div>
                  <Input
                    label="Institution"
                    value={edu.institution}
                    onChange={(event) => onChange(index, "institution", event.target.value)}
                  />
                  <FieldError message={itemErrors.institution} />
                </div>
                <div>
                  <Input
                    label="Start Year"
                    type="number"
                    value={edu.start_year}
                    onChange={(event) => onChange(index, "start_year", event.target.value)}
                  />
                  <FieldError message={itemErrors.start_year} />
                </div>
                <div>
                  <Input
                    label="End Year"
                    type="number"
                    value={edu.end_year}
                    onChange={(event) => onChange(index, "end_year", event.target.value)}
                  />
                  <FieldError message={itemErrors.end_year} />
                </div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => onRemove(edu, index)}>
                Remove
              </Button>
            </div>
          </div>
        );
      })}
      <Button type="button" variant="outline" onClick={onAdd}>
        Add Education
      </Button>
    </div>
  );
}
