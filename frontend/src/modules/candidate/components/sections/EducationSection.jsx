import ProfileSectionCard from "../ProfileSectionCard";
import SectionActions from "./SectionActions";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";

const blankEducation = {
  degree: "",
  institution: "",
  start_year: "",
  end_year: "",
};

export default function EducationSection({
  items,
  draft,
  setDraft,
  isEditing,
  isLocked,
  onEdit,
  onCancel,
  onSave,
  onRemoveExisting,
}) {
  const activeList = isEditing ? draft : items;

  const handleAdd = () => {
    setDraft([...draft, { ...blankEducation, _status: "new", _key: Date.now() }]);
  };

  const handleChange = (index, field, value) => {
    const next = draft.map((item, idx) => {
      if (idx !== index) return item;
      const updated = { ...item, [field]: value };
      if (item.id && item._status !== "new") {
        updated._status = "updated";
      }
      return updated;
    });
    setDraft(next);
  };

  const handleRemove = (item, index) => {
    if (item.id) {
      onRemoveExisting(item.id);
    }
    setDraft(draft.filter((_, idx) => idx !== index));
  };

  return (
    <ProfileSectionCard
      title="Education"
      description="Add your latest qualifications."
      actions={
        <SectionActions
          isEditing={isEditing}
          isLocked={isLocked}
          onEdit={onEdit}
          onCancel={onCancel}
          onSave={onSave}
          saveLabel="Save Education"
        />
      }
    >
      <div className="space-y-3">
        {activeList.length === 0 && (
          <p className="text-sm text-ink-faint">Add your highest qualification.</p>
        )}
        {activeList.map((edu, index) => (
          <div key={edu.id || edu._key || index} className="rounded-xl border border-surface-3 px-4 py-3">
            {isEditing ? (
              <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    label="Degree"
                    value={edu.degree}
                    onChange={(event) => handleChange(index, "degree", event.target.value)}
                  />
                  <Input
                    label="Institution"
                    value={edu.institution}
                    onChange={(event) => handleChange(index, "institution", event.target.value)}
                  />
                  <Input
                    label="Start Year"
                    type="number"
                    value={edu.start_year}
                    onChange={(event) => handleChange(index, "start_year", event.target.value)}
                  />
                  <Input
                    label="End Year"
                    type="number"
                    value={edu.end_year}
                    onChange={(event) => handleChange(index, "end_year", event.target.value)}
                  />
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleRemove(edu, index)}>
                  Remove
                </Button>
              </div>
            ) : (
              <div>
                <p className="text-sm font-semibold text-ink">{edu.degree}</p>
                <p className="text-xs text-ink-faint">{edu.institution}</p>
                <p className="text-xs text-ink-faint">
                  {edu.start_year} - {edu.end_year}
                </p>
              </div>
            )}
          </div>
        ))}
        {isEditing && (
          <Button type="button" variant="outline" onClick={handleAdd}>
            Add Education
          </Button>
        )}
      </div>
    </ProfileSectionCard>
  );
}
