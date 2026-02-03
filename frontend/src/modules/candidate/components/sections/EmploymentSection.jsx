import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import ProfileSectionCard from "../ProfileSectionCard";
import SectionActions from "./SectionActions";
import Input from "../../../../components/ui/Input";
import Button from "../../../../components/ui/Button";
import {
  useCreateEmploymentMutation,
  useUpdateEmploymentMutation,
  useDeleteEmploymentMutation,
} from "../../../../features/candidate/candidateProfileApi";

const blankEmployment = {
  company: "",
  title: "",
  start_date: "",
  end_date: "",
  is_current: false,
  description: "",
};

const formatDateRange = (start, end, isCurrent) => {
  if (!start) return "Dates not set";
  const startLabel = new Date(start).toLocaleDateString();
  if (isCurrent) return `${startLabel} - Present`;
  if (!end) return `${startLabel} -`;
  return `${startLabel} - ${new Date(end).toLocaleDateString()}`;
};

const stripUiFields = (item) => {
  const { _status, _key, ...rest } = item;
  return rest;
};

function EmploymentSection({ items, isEditing, isLocked, onEdit, onClose }) {
  const [draft, setDraft] = useState([]);
  const [removedIds, setRemovedIds] = useState([]);
  const [createEmployment] = useCreateEmploymentMutation();
  const [updateEmployment] = useUpdateEmploymentMutation();
  const [deleteEmployment] = useDeleteEmploymentMutation();

  useEffect(() => {
    if (isEditing) {
      setDraft(items.map((job) => ({ ...job })));
      setRemovedIds([]);
    }
  }, [isEditing, items]);

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
          createEmployment({
            ...stripUiFields(item),
            end_date: item.is_current ? null : item.end_date || null,
          }).unwrap()
        ),
        ...updatePayloads.map((item) =>
          updateEmployment({
            id: item.id,
            ...stripUiFields(item),
            end_date: item.is_current ? null : item.end_date || null,
          }).unwrap()
        ),
        ...removedIds.map((id) => deleteEmployment(id).unwrap()),
      ]);
      toast.success("Employment updated.");
      onClose();
    } catch (err) {
      toast.error("Unable to save employment.");
    }
  };

  const handleCancel = () => {
    setDraft(items.map((job) => ({ ...job })));
    setRemovedIds([]);
    onClose();
  };

  const activeList = isEditing ? draft : items;

  return (
    <ProfileSectionCard
      title="Employment"
      description="Showcase your recent roles."
      actions={
        <SectionActions
          isEditing={isEditing}
          isLocked={isLocked}
          onEdit={onEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          saveLabel="Save Employment"
        />
      }
    >
      <div className="space-y-3">
        {activeList.length === 0 && (
          <p className="text-sm text-ink-faint">Add your most recent role.</p>
        )}
        {activeList.map((job, index) => (
          <div key={job.id || job._key || index} className="rounded-xl border border-surface-3 px-4 py-3">
            {isEditing ? (
              <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    label="Company"
                    value={job.company}
                    onChange={(event) => handleChange(index, "company", event.target.value)}
                  />
                  <Input
                    label="Title"
                    value={job.title}
                    onChange={(event) => handleChange(index, "title", event.target.value)}
                  />
                  <Input
                    label="Start Date"
                    type="date"
                    value={job.start_date}
                    onChange={(event) => handleChange(index, "start_date", event.target.value)}
                  />
                  <Input
                    label="End Date"
                    type="date"
                    value={job.end_date}
                    onChange={(event) => handleChange(index, "end_date", event.target.value)}
                    disabled={job.is_current}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm font-medium text-ink">
                  <input
                    type="checkbox"
                    checked={job.is_current}
                    onChange={(event) => handleChange(index, "is_current", event.target.checked)}
                    className="h-4 w-4 rounded border-surface-3 text-brand-600 focus:ring-brand-300"
                  />
                  Currently working here
                </label>
                <label className="block">
                  <span className="text-sm font-semibold text-ink-soft">Description</span>
                  <textarea
                    rows={3}
                    value={job.description}
                    onChange={(event) => handleChange(index, "description", event.target.value)}
                    className="mt-1 w-full rounded-xl border border-surface-3 bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
                    placeholder="Outline responsibilities, impact, and tools used."
                  />
                </label>
                <Button size="sm" variant="ghost" onClick={() => handleRemove(job, index)}>
                  Remove
                </Button>
              </div>
            ) : (
              <div>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-ink">{job.title}</p>
                    <p className="text-xs text-ink-faint">{job.company}</p>
                    <p className="text-xs text-ink-faint">
                      {formatDateRange(job.start_date, job.end_date, job.is_current)}
                    </p>
                  </div>
                </div>
                {job.description && <p className="mt-2 text-xs text-ink-soft">{job.description}</p>}
              </div>
            )}
          </div>
        ))}
        {isEditing && (
          <Button type="button" variant="outline" onClick={handleAdd}>
            Add Employment
          </Button>
        )}
      </div>
    </ProfileSectionCard>
  );
}

export default memo(EmploymentSection);
