import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import SectionWrapper from "./SectionWrapper";
import SectionActions from "./SectionActions";
import ProjectsSectionForm from "./ProjectsSectionForm";
import ProjectsSectionList from "./ProjectsSectionList";
import FieldError from "./FieldError";
import parseApiErrors from "./parseApiErrors";
import { PROJECT_STATUS_OPTIONS, mapLegacyValue } from "../../../../shared/constants/profileOptions";
import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "../../../../features/candidate/candidateProfileApi";

const blankProject = {
  title: "",
  description: "",
  link: "",
  status: "IN_PROGRESS",
  worked_from_year: "",
  worked_from_month: "",
  worked_till_year: "",
  worked_till_month: "",
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
      setDraft(
        items.map((project) => ({
          ...project,
          status:
            mapLegacyValue(project.status, PROJECT_STATUS_OPTIONS) || "IN_PROGRESS",
          worked_from_year:
            project.worked_from_year !== null && project.worked_from_year !== undefined
              ? String(project.worked_from_year)
              : "",
          worked_from_month:
            project.worked_from_month !== null && project.worked_from_month !== undefined
              ? String(project.worked_from_month)
              : "",
          worked_till_year:
            project.worked_till_year !== null && project.worked_till_year !== undefined
              ? String(project.worked_till_year)
              : "",
          worked_till_month:
            project.worked_till_month !== null && project.worked_till_month !== undefined
              ? String(project.worked_till_month)
              : "",
        }))
      );
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
    setDraft([...draft, { ...blankProject, _status: "new", _key: Date.now() }]);
  };

  const handleChange = (index, field, value) => {
    const next = draft.map((item, idx) => {
      if (idx !== index) return item;
      const updated = { ...item, [field]: value };
      if (field === "status" && value === "IN_PROGRESS") {
        updated.worked_till_year = "";
        updated.worked_till_month = "";
      }
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
      setFormError("Please add at least one project before saving.");
      return;
    }
    const validationErrors = {};
    draft.forEach((item, index) => {
      const itemErrors = {};
      if (!item.title?.trim()) itemErrors.title = "Project title is required.";
      if (!item.status) itemErrors.status = "Project status is required.";
      if (!item.worked_from_year) itemErrors.worked_from_year = "Start year is required.";
      if (!item.worked_from_month) itemErrors.worked_from_month = "Start month is required.";

      if (item.status === "FINISHED") {
        if (!item.worked_till_year)
          itemErrors.worked_till_year = "End year is required.";
        if (!item.worked_till_month)
          itemErrors.worked_till_month = "End month is required.";
        if (
          item.worked_from_year &&
          item.worked_from_month &&
          item.worked_till_year &&
          item.worked_till_month
        ) {
          const fromKey =
            Number(item.worked_from_year) * 12 + Number(item.worked_from_month);
          const tillKey =
            Number(item.worked_till_year) * 12 + Number(item.worked_till_month);
          if (tillKey < fromKey) {
            itemErrors.worked_till_year = "Worked till must be after worked from.";
          }
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
          createProject({
            ...stripUiFields(item),
            worked_from_year: item.worked_from_year ? Number(item.worked_from_year) : null,
            worked_from_month: item.worked_from_month ? Number(item.worked_from_month) : null,
            worked_till_year:
              item.status === "FINISHED" && item.worked_till_year
                ? Number(item.worked_till_year)
                : null,
            worked_till_month:
              item.status === "FINISHED" && item.worked_till_month
                ? Number(item.worked_till_month)
                : null,
          }).unwrap()
        ),
        ...updatePayloads.map((item) =>
          updateProject({
            id: item.id,
            ...stripUiFields(item),
            worked_from_year: item.worked_from_year ? Number(item.worked_from_year) : null,
            worked_from_month: item.worked_from_month ? Number(item.worked_from_month) : null,
            worked_till_year:
              item.status === "FINISHED" && item.worked_till_year
                ? Number(item.worked_till_year)
                : null,
            worked_till_month:
              item.status === "FINISHED" && item.worked_till_month
                ? Number(item.worked_till_month)
                : null,
          }).unwrap()
        ),
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
