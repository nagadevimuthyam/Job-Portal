import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import SectionWrapper from "./SectionWrapper";
import SectionActions from "./SectionActions";
import SectionState from "./SectionState";
import FieldError from "./FieldError";
import parseApiErrors from "./parseApiErrors";
import { useUpdateProfileMutation } from "../../../../features/candidate/candidateProfileApi";

function SummarySection({ summary, isEditing, isLocked, onEdit, onClose }) {
  const [draft, setDraft] = useState("");
  const [errors, setErrors] = useState({});
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    if (isEditing) {
      setDraft(summary || "");
      setErrors({});
    }
  }, [isEditing, summary]);

  const handleSave = async () => {
    if (!draft.trim()) {
      setErrors((prev) => ({ ...prev, summary: "Please add a summary before saving." }));
      return;
    }
    try {
      await updateProfile({ summary: draft }).unwrap();
      toast.success("Summary updated.");
      onClose();
    } catch (err) {
      const parsed = parseApiErrors(err);
      setErrors(parsed);
      toast.error(parsed._error || "Unable to update summary.");
    }
  };

  const handleCancel = () => {
    setDraft(summary || "");
    setErrors({});
    onClose();
  };

  return (
    <SectionWrapper
      title="Summary"
      description="Give recruiters a strong first impression."
      actions={
        <SectionActions
          isEditing={isEditing}
          isLocked={isLocked}
          onEdit={onEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          saveLabel={isLoading ? "Saving..." : "Save Summary"}
        />
      }
    >
      {isEditing ? (
        <label className="block">
          <span className="text-sm font-semibold text-ink-soft">Summary</span>
          <textarea
            rows={4}
            value={draft}
            onChange={(event) => {
              const nextValue = event.target.value;
              setDraft(nextValue);
              if (errors.summary && nextValue.trim()) {
                setErrors((prev) => ({ ...prev, summary: "" }));
              }
            }}
            className={`mt-1 w-full rounded-xl border bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 ${
              errors.summary
                ? "border-danger focus:border-danger focus:ring-danger/20"
                : "border-surface-3 focus:border-brand-300 focus:ring-brand-200"
            }`}
            placeholder="Write 2-3 lines about your strengths and achievements."
          />
          <FieldError message={errors.summary || errors._error} />
        </label>
      ) : (
        <SectionState message={summary || "Add a short summary highlighting your impact."} />
      )}
    </SectionWrapper>
  );
}

export default memo(SummarySection);
