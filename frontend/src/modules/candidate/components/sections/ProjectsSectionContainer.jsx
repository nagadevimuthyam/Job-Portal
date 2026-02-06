import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import SectionWrapper from "./SectionWrapper";
import SectionActions from "./SectionActions";
import ProjectsSectionForm from "./ProjectsSectionForm";
import ProjectsSectionList from "./ProjectsSectionList";
import FieldError from "./FieldError";
import parseApiErrors from "./parseApiErrors";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "../../../../features/candidate/candidateProfileApi";

const blankProject = {
  title: "",
  description: "",
  link: "",
};

const stripUiFields = (item) => {
  const { _status, _key, ...rest } = item;
  return rest;
};

function ProjectsSectionContainer({ items, isEditing, isLocked, onEdit, onClose }) {
  const [draft, setDraft] = useState([]);
  const [removedIds, setRemovedIds] = useState([]);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [createProject] = useCreateProjectMutation();
  const [updateProject] = useUpdateProjectMutation();
  const [deleteProject] = useDeleteProjectMutation();

  useEffect(() => {
    if (isEditing) {
      setDraft(items.map((project) => ({ ...project })));
      setRemovedIds([]);
      setErrors({});
      setFormError("");
    }
  }, [isEditing, items]);

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
        ...createPayloads.map((item) => createProject(stripUiFields(item)).unwrap()),
        ...updatePayloads.map((item) => updateProject({ id: item.id, ...stripUiFields(item) }).unwrap()),
        ...removedIds.map((id) => deleteProject(id).unwrap()),
      ]);
      toast.success("Projects updated.");
      onClose();
    } catch (err) {
      const parsed = parseApiErrors(err);
      setFormError(parsed._error || "");
      if (!parsed._error && Object.keys(parsed).length) {
        setErrors({ 0: parsed });
      }
      toast.error(parsed._error || "Unable to save projects.");
    }
  };

  const handleCancel = () => {
    setDraft(items.map((project) => ({ ...project })));
    setRemovedIds([]);
    setErrors({});
    setFormError("");
    onClose();
  };

  const activeList = isEditing ? draft : items;

  return (
    <SectionWrapper
      title="Projects"
      description="Highlight impactful projects."
      actions={
        <SectionActions
          isEditing={isEditing}
          isLocked={isLocked}
          onEdit={onEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          saveLabel="Save Projects"
        />
      }
    >
      {isEditing ? (
        <>
          {formError && <FieldError message={formError} />}
          <ProjectsSectionForm
            items={activeList}
            onChange={handleChange}
            onRemove={handleRemove}
            onAdd={handleAdd}
            errors={errors}
          />
        </>
      ) : (
        <ProjectsSectionList items={activeList} />
      )}
    </SectionWrapper>
  );
}

export default memo(ProjectsSectionContainer);
