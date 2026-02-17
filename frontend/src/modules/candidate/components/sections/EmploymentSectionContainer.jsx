import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import SectionWrapper from "./SectionWrapper";
import EmploymentSectionForm from "./EmploymentSectionForm";
import EmploymentSectionList from "./EmploymentSectionList";
import FieldError from "./FieldError";
import parseApiErrors from "./parseApiErrors";
import {
  useCreateEmploymentMutation,
  useUpdateEmploymentMutation,
  useDeleteEmploymentMutation,
} from "../../../../features/candidate/candidateProfileApi";
import EditButton from "../shared/EditButton";
import FormModal from "../shared/FormModal";

const blankEmployment = {
  company: "",
  title: "",
  start_date: "",
  end_date: "",
  is_current: false,
  description: "",
};

const stripUiFields = (item) => {
  const { _status, _key, ...rest } = item;
  return rest;
};

const validateEmployment = (items) => {
  const errors = {};
  items.forEach((item, index) => {
    const itemErrors = {};
    if (!item.company?.trim()) itemErrors.company = "Company is required.";
    if (!item.title?.trim()) itemErrors.title = "Title is required.";
    if (!item.start_date) itemErrors.start_date = "Start date is required.";
    if (!item.is_current && item.end_date === "") itemErrors.end_date = "End date is required.";
    if (Object.keys(itemErrors).length) errors[index] = itemErrors;
  });
  return errors;
};

function EmploymentSectionContainer({ items, isEditing, isLocked, onEdit, onClose }) {
  const [draft, setDraft] = useState([]);
  const [removedIds, setRemovedIds] = useState([]);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [createEmployment] = useCreateEmploymentMutation();
  const [updateEmployment] = useUpdateEmploymentMutation();
  const [deleteEmployment] = useDeleteEmploymentMutation();

  useEffect(() => {
    if (isEditing) {
      setDraft(items.map((job) => ({ ...job })));
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
    setDraft([...draft, { ...blankEmployment, _status: "new", _key: Date.now() }]);
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
      setFormError("Please add at least one employment entry before saving.");
      return;
    }
    const validationErrors = validateEmployment(draft);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      toast.error("Fix the highlighted fields.");
      return;
    }

    try {
      const createPayloads = draft.filter((item) => !item.id);
      const updatePayloads = draft.filter((item) => item.id && item._status === "updated");

      for (const item of createPayloads) {
        await createEmployment({
          ...stripUiFields(item),
          end_date: item.is_current ? null : item.end_date || null,
        }).unwrap();
      }

      for (const item of updatePayloads) {
        await updateEmployment({
          id: item.id,
          ...stripUiFields(item),
          end_date: item.is_current ? null : item.end_date || null,
        }).unwrap();
      }

      for (const id of removedIds) {
        await deleteEmployment(id).unwrap();
      }

      toast.success("Employment updated.");
      onClose();
    } catch (err) {
      const parsed = parseApiErrors(err);
      if (parsed._error) setFormError(parsed._error);
      if (!parsed._error && Object.keys(parsed).length) {
        setErrors({ 0: parsed });
      }
      toast.error(parsed._error || "Unable to save employment.");
    }
  };

  const handleCancel = () => {
    setDraft(items.map((job) => ({ ...job })));
    setRemovedIds([]);
    setErrors({});
    setFormError("");
    onClose();
  };

  const viewList = items;

  return (
    <>
      <SectionWrapper
        title="Employment"
        description="Showcase your recent roles."
        actions={<EditButton onClick={onEdit} disabled={isLocked} />}
      >
        <EmploymentSectionList items={viewList} />
      </SectionWrapper>
      <FormModal
        open={isEditing}
        title="Employment"
        onClose={handleCancel}
        onSubmit={handleSave}
        primaryLabel="Save Employment"
        secondaryLabel="Cancel"
      >
        {formError && <FieldError message={formError} />}
        <EmploymentSectionForm
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

export default memo(EmploymentSectionContainer);
