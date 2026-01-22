import ProfileSectionCard from "../ProfileSectionCard";
import SectionActions from "./SectionActions";

export default function SummarySection({
  summary,
  draft,
  onChange,
  isEditing,
  isLocked,
  onEdit,
  onCancel,
  onSave,
}) {
  return (
    <ProfileSectionCard
      title="Summary"
      description="Give recruiters a strong first impression."
      actions={
        <SectionActions
          isEditing={isEditing}
          isLocked={isLocked}
          onEdit={onEdit}
          onCancel={onCancel}
          onSave={onSave}
          saveLabel="Save Summary"
        />
      }
    >
      {isEditing ? (
        <label className="block">
          <span className="text-sm font-semibold text-ink-soft">Summary</span>
          <textarea
            rows={4}
            value={draft}
            onChange={(event) => onChange(event.target.value)}
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
