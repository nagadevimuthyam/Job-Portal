import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import SectionWrapper from "./SectionWrapper";
import EducationSectionForm from "./EducationSectionForm";
import EducationSectionList from "./EducationSectionList";
import FieldError from "./FieldError";
import parseApiErrors from "./parseApiErrors";
import {
  useCreateEducationMutation,
  useUpdateEducationMutation,
  useDeleteEducationMutation,
} from "../../../../features/candidate/candidateProfileApi";
import EditButton from "../shared/EditButton";
import FormModal from "../shared/FormModal";

const blankEducation = {
  degree: "",
  institution: "",
  course_type: "",
  start_year: "",
  end_year: "",
  marks_percentage: "",
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

  useEffect(() => {
    if (draft.length > 0 && formError) {
      setFormError("");
    }
  }, [draft.length, formError]);

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
    if (draft.length === 0) {
      setFormError("Please add at least one education entry before saving.");
      return;
    }
    const validationErrors = {};
    draft.forEach((item, index) => {
      const itemErrors = {};
      if (!item.degree) itemErrors.degree = "Education is required.";
      if (!item.institution?.trim())
        itemErrors.institution = "University/Institute is required.";
      if (!item.course_type) itemErrors.course_type = "Course type is required.";
      if (!item.start_year) itemErrors.start_year = "Start year is required.";
      if (!item.end_year) itemErrors.end_year = "End year is required.";
      if (item.start_year && item.end_year && Number(item.start_year) > Number(item.end_year)) {
        itemErrors.end_year = "End year must be after start year.";
      }
      if (item.marks_percentage !== "" && item.marks_percentage !== null) {
        const marks = Number(item.marks_percentage);
        if (Number.isNaN(marks) || marks < 0 || marks > 100) {
          itemErrors.marks_percentage = "Marks/Percentage must be between 0 and 100.";
        }
      }
      if (Object.keys(itemErrors).length) validationErrors[index] = itemErrors;
    });
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      toast.error("Fix the highlighted fields.");
      return;
    }
    try {
      const createPayloads = draft.filter((item) => !item.id);
      const updatePayloads = draft.filter((item) => item.id && item._status === "updated");
      await Promise.all([
        ...createPayloads.map((item) =>
          createEducation({
            ...stripUiFields(item),
            start_year: Number(item.start_year || 0),
            end_year: Number(item.end_year || 0),
            marks_percentage:
              item.marks_percentage === "" || item.marks_percentage === null
                ? null
                : Number(item.marks_percentage),
          }).unwrap()
        ),
        ...updatePayloads.map((item) =>
          updateEducation({
            id: item.id,
            ...stripUiFields(item),
            start_year: Number(item.start_year || 0),
            end_year: Number(item.end_year || 0),
            marks_percentage:
              item.marks_percentage === "" || item.marks_percentage === null
                ? null
                : Number(item.marks_percentage),
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

  const viewList = items;

  return (
    <>
      <SectionWrapper
        title="Education"
        description="Add your latest qualifications."
        actions={<EditButton onClick={onEdit} disabled={isLocked} />}
      >
        <EducationSectionList items={viewList} />
      </SectionWrapper>
      <FormModal
        open={isEditing}
        title="Education"
        onClose={handleCancel}
        onSubmit={handleSave}
        primaryLabel="Save Education"
        secondaryLabel="Cancel"
      >
        {formError && <FieldError message={formError} />}
        <EducationSectionForm
          items={draft}
          onChange={handleChange}
          onRemove={handleRemove}
          onAdd={handleAdd}
          errors={errors}
        />
      </FormModal>
    </>
  );
}

export default memo(EducationSectionContainer);
