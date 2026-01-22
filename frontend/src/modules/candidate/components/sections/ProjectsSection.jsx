import ProfileSectionCard from "../ProfileSectionCard";
import SectionActions from "./SectionActions";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";

const blankProject = {
  title: "",
  description: "",
  link: "",
};

export default function ProjectsSection({
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
    setDraft([...draft, { ...blankProject, _status: "new", _key: Date.now() }]);
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
      title="Projects"
      description="Highlight impactful projects."
      actions={
        <SectionActions
          isEditing={isEditing}
          isLocked={isLocked}
          onEdit={onEdit}
          onCancel={onCancel}
          onSave={onSave}
          saveLabel="Save Projects"
        />
      }
    >
      <div className="space-y-3">
        {activeList.length === 0 && (
          <p className="text-sm text-ink-faint">Add your best project work.</p>
        )}
        {activeList.map((project, index) => (
          <div key={project.id || project._key || index} className="rounded-xl border border-surface-3 px-4 py-3">
            {isEditing ? (
              <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    label="Project Title"
                    value={project.title}
                    onChange={(event) => handleChange(index, "title", event.target.value)}
                  />
                  <Input
                    label="Project Link"
                    value={project.link}
                    onChange={(event) => handleChange(index, "link", event.target.value)}
                  />
                </div>
                <label className="block">
                  <span className="text-sm font-semibold text-ink-soft">Description</span>
                  <textarea
                    rows={3}
                    value={project.description}
                    onChange={(event) => handleChange(index, "description", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-surface-3 bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
                    placeholder="Problem solved, stack used, and outcomes."
                  />
                </label>
                <Button size="sm" variant="ghost" onClick={() => handleRemove(project, index)}>
                  Remove
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-ink">{project.title}</p>
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-brand-700 underline"
                      >
                        {project.link}
                      </a>
                    )}
                  </div>
                </div>
                {project.description && (
                  <p className="mt-2 text-xs text-ink-soft">{project.description}</p>
                )}
              </div>
            )}
          </div>
        ))}
        {isEditing && (
          <Button type="button" variant="outline" onClick={handleAdd}>
            Add Project
          </Button>
        )}
      </div>
    </ProfileSectionCard>
  );
}
