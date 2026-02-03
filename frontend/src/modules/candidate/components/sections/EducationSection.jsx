import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import ProfileSectionCard from "../ProfileSectionCard";
import SectionActions from "./SectionActions";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import {
  useCreateEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} from "../../../../features/candidate/candidateProfileApi";

const blankEducation = {
  degree: "",
  institution: "",
  start_year: "",
  end_year: "",
};

const stripUiFields = (item) => {
  const { _status, _key, ...rest } = item;
  return rest;
};

function EducationSection({ items, isEditing, isLocked, onEdit, onClose }) {
  const [draft, setDraft] = useState([]);
  const [removedIds, setRemovedIds] = useState([]);
  const [createEducation] = useCreateEducationMutation();
  const [updateEducation] = useUpdateEducationMutation();
  const [deleteEducation] = useDeleteEducationMutation();

  useEffect(() => {
    if (isEditing) {
      setDraft(items.map((edu) => ({ ...edu })));
      setRemovedIds([]);
    }
  }, [isEditing, items]);

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
      setRemovedIds((prev) => (prev.includes(item.id) ? prev : [...prev, item.id]));
    }
    setDraft(draft.filter((_, idx) => idx !== index));
  };

  const handleSave = async () => {
    try {
      const createPayloads = draft.filter((item) => !item.id);
      const updatePayloads = draft.filter((item) => item.id && item._status === "updated");
      await Promise.all([
        ...createPayloads.map((item) =>
          createEducation({
            ...stripUiFields(item),
            start_year: Number(item.start_year || 0),
            end_year: Number(item.end_year || 0),
          }).unwrap()
        ),
        ...updatePayloads.map((item) =>
          updateEducation({
            id: item.id,
            ...stripUiFields(item),
            start_year: Number(item.start_year || 0),
            end_year: Number(item.end_year || 0),
          }).unwrap()
        ),
        ...removedIds.map((id) => deleteEducation(id).unwrap()),
      ]);
      toast.success("Education updated.");
      onClose();
    } catch (err) {
      toast.error("Unable to save education.");
    }
  };

  const handleCancel = () => {
    setDraft(items.map((edu) => ({ ...edu })));
    setRemovedIds([]);
    onClose();
  };

  const activeList = isEditing ? draft : items;

  return (
    <ProfileSectionCard
      title="Education"
      description="Add your latest qualifications."
      actions={
        <SectionActions
          isEditing={isEditing}
          isLocked={isLocked}
          onEdit={onEdit}
          onCancel={handleCancel}
          onSave={handleSave}
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

export default memo(EducationSection);
