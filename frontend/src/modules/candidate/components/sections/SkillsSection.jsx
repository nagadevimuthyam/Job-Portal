import { useState } from "react";
import ProfileSectionCard from "../ProfileSectionCard";
import SectionActions from "./SectionActions";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";

export default function SkillsSection({
  skills,
  draft,
  setDraft,
  isEditing,
  isLocked,
  onEdit,
  onCancel,
  onSave,
}) {
  const [newSkill, setNewSkill] = useState("");

  const handleAdd = () => {
    const value = newSkill.trim();
    if (!value) return;
    const exists = draft.some((skill) => skill.name.toLowerCase() === value.toLowerCase());
    if (!exists) {
      setDraft([...draft, { name: value }]);
    }
    setNewSkill("");
  };

  const handleRemove = (index) => {
    setDraft(draft.filter((_, idx) => idx !== index));
  };

  const activeList = isEditing ? draft : skills;

  return (
    <ProfileSectionCard
      title="Key Skills"
      description="Top skills recruiters search for."
      actions={
        <SectionActions
          isEditing={isEditing}
          isLocked={isLocked}
          onEdit={onEdit}
          onCancel={onCancel}
          onSave={onSave}
          saveLabel="Save Skills"
        />
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {activeList.length === 0 && (
            <span className="text-sm text-ink-faint">Add at least 5 skills.</span>
          )}
          {activeList.map((skill, index) => (
            <span
              key={skill.id || `${skill.name}-${index}`}
              className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink"
            >
              {skill.name}
              {isEditing && (
                <button
                  type="button"
                  className="text-ink-faint hover:text-ink"
                  onClick={() => handleRemove(index)}
                >
                  ×
                </button>
              )}
            </span>
          ))}
        </div>

        {isEditing && (
          <div className="flex flex-wrap gap-3">
            <Input
              label="Add skill"
              value={newSkill}
              onChange={(event) => setNewSkill(event.target.value)}
              placeholder="React, Django, SQL"
            />
            <div className="self-end">
              <Button type="button" onClick={handleAdd}>
                Add Skill
              </Button>
            </div>
          </div>
        )}
      </div>
    </ProfileSectionCard>
  );
}
