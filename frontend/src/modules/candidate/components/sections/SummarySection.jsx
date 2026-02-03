import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import ProfileSectionCard from "../ProfileSectionCard";
import SectionActions from "./SectionActions";
import { useUpdateProfileMutation } from "../../../../features/candidate/candidateProfileApi";

function SummarySection({ summary, isEditing, isLocked, onEdit, onClose }) {
  const [draft, setDraft] = useState("");
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    if (isEditing) {
      setDraft(summary || "");
    }
  }, [isEditing, summary]);

  const handleSave = async () => {
    try {
      await updateProfile({ summary: draft }).unwrap();
      toast.success("Summary updated.");
      onClose();
    } catch (err) {
      toast.error("Unable to update summary.");
    }
  };

  const handleCancel = () => {
    setDraft(summary || "");
    onClose();
  };

  return (
    <ProfileSectionCard
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
            onChange={(event) => setDraft(event.target.value)}
            className="mt-1 w-full rounded-xl border border-surface-3 bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
            placeholder="Write 2-3 lines about your strengths and achievements."
          />
        </label>
      ) : (
        <p className="text-sm text-ink-soft">
          {summary || "Add a short summary highlighting your impact."}
        </p>
      )}
    </ProfileSectionCard>
  );
}

export default memo(SummarySection);
