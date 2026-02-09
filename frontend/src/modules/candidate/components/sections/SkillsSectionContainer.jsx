import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import SectionWrapper from "./SectionWrapper";
import SectionActions from "./SectionActions";
import SkillsSectionForm from "./SkillsSectionForm";
import FieldError from "./FieldError";
import parseApiErrors from "./parseApiErrors";
import {
  useCreateSkillMutation,
  useDeleteSkillMutation,
} from "../../../../features/candidate/candidateProfileApi";

function SkillsSectionContainer({ skills, isEditing, isLocked, onEdit, onClose }) {
  const [draft, setDraft] = useState([]);
  const [errors, setErrors] = useState({});
  const [createSkill] = useCreateSkillMutation();
  const [deleteSkill] = useDeleteSkillMutation();

  useEffect(() => {
    if (isEditing) {
      setDraft(skills.map((skill) => ({ ...skill })));
      setErrors({});
    }
  }, [isEditing, skills]);

  useEffect(() => {
    if (draft.length > 0 && errors.list) {
      setErrors((prev) => ({ ...prev, list: "" }));
    }
  }, [draft.length, errors.list]);

  const handleSave = async () => {
    if (draft.length === 0) {
      setErrors((prev) => ({
        ...prev,
        list: "Please add at least one skill before saving.",
      }));
      return;
    }
    const existingIds = new Set(skills.map((skill) => skill.id));
    const draftIds = new Set(draft.filter((skill) => skill.id).map((skill) => skill.id));
    const toCreate = draft.filter(
      (skill) => !skill.id || !existingIds.has(skill.id)
    );
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
    setErrors({});
    onClose();
  };

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
      {isEditing && (
        <SkillsSectionForm
          value={draft}
          onChange={(next) => {
            setDraft(next);
            if (errors.list) {
              setErrors((prev) => ({ ...prev, list: "" }));
            }
          }}
          error={errors.list}
        />
      )}
      {!isEditing && (
        <>
          {skills.length === 0 ? (
            <p className="text-sm text-ink-faint">Add at least 5 skills.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-3 py-1 text-xs font-semibold text-ink"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          )}
          {errors._error && <FieldError message={errors._error} />}
        </>
      )}
    </SectionWrapper>
  );
}

export default memo(SkillsSectionContainer);
