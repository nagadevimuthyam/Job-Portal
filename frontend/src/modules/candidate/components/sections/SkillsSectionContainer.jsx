import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import SectionWrapper from "./SectionWrapper";
import SkillsSectionForm from "./SkillsSectionForm";
import FieldError from "./FieldError";
import parseApiErrors from "./parseApiErrors";
import {
  useCreateSkillMutation,
  useDeleteSkillMutation,
} from "../../../../features/candidate/candidateProfileApi";
import EditButton from "../shared/EditButton";
import FormModal from "../shared/FormModal";

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
    <>
      <SectionWrapper
        title="Key Skills"
        description="Top skills recruiters search for."
        actions={<EditButton onClick={onEdit} disabled={isLocked} />}
      >
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
      </SectionWrapper>
      <FormModal
        open={isEditing}
        title="Key Skills"
        onClose={handleCancel}
        onSubmit={handleSave}
        primaryLabel="Save Skills"
        secondaryLabel="Cancel"
      >
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
        {errors._error && <FieldError message={errors._error} />}
      </FormModal>
    </>
  );
}

export default memo(SkillsSectionContainer);
