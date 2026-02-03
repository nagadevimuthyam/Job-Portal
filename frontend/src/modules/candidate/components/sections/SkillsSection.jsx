import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import ProfileSectionCard from "../ProfileSectionCard";
import SectionActions from "./SectionActions";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import {
  useCreateSkillMutation,
  useDeleteSkillMutation,
} from "../../../../features/candidate/candidateProfileApi";

function SkillsSection({ skills, isEditing, isLocked, onEdit, onClose }) {
  const [draft, setDraft] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [createSkill] = useCreateSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();

  useEffect(() => {
    if (isEditing) {
      setDraft(skills.map((skill) => ({ ...skill })));
    }
  }, [isEditing, skills]);

  const handleAdd = () => {
    const value = newSkill.trim();
    if (!value) return;
    const exists = draft.some((skill) => skill.name.toLowerCase() === value.toLowerCase());
    if (!exists) {
      setDraft([...draft, { name: value }]);
    }
    setNewSkill("");
  };

  const handleRemoveDraft = (index) => {
    setDraft(draft.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    const draftIds = new Set(draft.filter((skill) => skill.id).map((skill) => skill.id));
    const toCreate = draft.filter((skill) => !skill.id);
    const toDelete = skills.filter((skill) => !draftIds.has(skill.id));

    try {
      await Promise.all([
        ...toCreate.map((skill) => createSkill({ name: skill.name }).unwrap()),
        ...toDelete.map((skill) => deleteSkill(skill.id).unwrap()),
      ]);
      toast.success("Skills updated.");
      onClose();
    } catch (err) {
      toast.error("Unable to update skills.");
    }
  };

  const handleCancel = () => {
    setDraft(skills.map((skill) => ({ ...skill })));
    setNewSkill("");
    onClose();
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
          onCancel={handleCancel}
          onSave={handleSave}
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
                  onClick={() => handleRemoveDraft(index)}
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

export default memo(SkillsSection);
