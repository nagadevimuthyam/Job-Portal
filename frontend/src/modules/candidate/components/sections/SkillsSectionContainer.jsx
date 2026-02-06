import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import SectionWrapper from "./SectionWrapper";
import SectionActions from "./SectionActions";
import SkillsSectionList from "./SkillsSectionList";
import SkillsSectionForm from "./SkillsSectionForm";
import FieldError from "./FieldError";
import parseApiErrors from "./parseApiErrors";
import {
  useCreateSkillMutation,
  useDeleteSkillMutation,
} from "../../../../features/candidate/candidateProfileApi";

function SkillsSectionContainer({ skills, isEditing, isLocked, onEdit, onClose }) {
  const [draft, setDraft] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [errors, setErrors] = useState({});
  const [createSkill] = useCreateSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();

  useEffect(() => {
    if (isEditing) {
      setDraft(skills.map((skill) => ({ ...skill })));
      setErrors({});
    }
  }, [isEditing, skills]);

  const handleAdd = () => {
    const value = newSkill.trim();
    if (!value) {
      setErrors((prev) => ({ ...prev, name: "Skill is required." }));
      return;
    }
    const exists = draft.some((skill) => skill.name.toLowerCase() === value.toLowerCase());
    if (!exists) {
      setDraft([...draft, { name: value }]);
    }
    setNewSkill("");
    setErrors((prev) => ({ ...prev, name: "" }));
  };

  const handleRemoveDraft = (index) => {
    setDraft(draft.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    const draftIds = new Set(draft.filter((skill) => skill.id).map((skill) => skill.id));
    const toCreate = draft.filter((skill) => !skill.id);
    const toDelete = skills.filter((skill) => !draftIds.has(skill.id));

    try {
      for (const skill of toCreate) {
        await createSkill({ name: skill.name }).unwrap();
      }
      for (const skill of toDelete) {
        await deleteSkill(skill.id).unwrap();
      }
      toast.success("Skills updated.");
      onClose();
    } catch (err) {
      const parsed = parseApiErrors(err);
      setErrors((prev) => ({ ...prev, ...parsed }));
      toast.error(parsed._error || "Unable to update skills.");
    }
  };

  const handleCancel = () => {
    setDraft(skills.map((skill) => ({ ...skill })));
    setNewSkill("");
    setErrors({});
    onClose();
  };

  const activeList = isEditing ? draft : skills;

  return (
    <SectionWrapper
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
      <SkillsSectionList items={activeList} isEditing={isEditing} onRemove={handleRemoveDraft} />
      {errors._error && <FieldError message={errors._error} />}
      {isEditing && (
        <SkillsSectionForm
          value={newSkill}
          onChange={(value) => {
            setNewSkill(value);
            if (errors.name) {
              setErrors((prev) => ({ ...prev, name: "" }));
            }
          }}
          onAdd={handleAdd}
          error={errors.name}
        />
      )}
    </SectionWrapper>
  );
}

export default memo(SkillsSectionContainer);
