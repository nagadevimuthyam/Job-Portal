import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import SectionWrapper from "./SectionWrapper";
import SectionActions from "./SectionActions";
import EducationSectionForm from "./EducationSectionForm";
import EducationSectionList from "./EducationSectionList";
import FieldError from "./FieldError";
import parseApiErrors from "./parseApiErrors";
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

function EducationSectionContainer({ items, isEditing, isLocked, onEdit, onClose }) {
  const [draft, setDraft] = useState([]);
  const [removedIds, setRemovedIds] = useState([]);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [createEducation] = useCreateEducationMutation();
  const [updateEducation] = useUpdateEducationMutation();
  const [deleteEducation] = useDeleteEducationMutation();

  useEffect(() => {
    if (isEditing) {
      setDraft(items.map((edu) => ({ ...edu })));
      setRemovedIds([]);
      setErrors({});
      setFormError("");
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
    if (errors[index]?.[field]) {
      setErrors((prev) => ({
        ...prev,
        [index]: { ...prev[index], [field]: "" },
      }));
    }
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
      const parsed = parseApiErrors(err);
      setFormError(parsed._error || "");
      if (!parsed._error && Object.keys(parsed).length) {
        setErrors({ 0: parsed });
      }
      toast.error(parsed._error || "Unable to save education.");
    }
  };

  const handleCancel = () => {
    setDraft(items.map((edu) => ({ ...edu })));
    setRemovedIds([]);
    setErrors({});
    setFormError("");
    onClose();
  };

  const activeList = isEditing ? draft : items;

  return (
    <SectionWrapper
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
      {isEditing ? (
        <>
          {formError && <FieldError message={formError} />}
          <EducationSectionForm
            items={activeList}
            onChange={handleChange}
            onRemove={handleRemove}
            onAdd={handleAdd}
            errors={errors}
          />
        </>
      ) : (
        <EducationSectionList items={activeList} />
      )}
    </SectionWrapper>
  );
}

export default memo(EducationSectionContainer);
