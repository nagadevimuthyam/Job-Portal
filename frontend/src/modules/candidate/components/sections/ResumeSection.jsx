import ProfileSectionCard from "../ProfileSectionCard";
import SectionActions from "./SectionActions";
import Button from "../../../../components/ui/Button";

export default function ResumeSection({
  resumeUrl,
  selectedFile,
  onFileChange,
  isEditing,
  isLocked,
  onEdit,
  onCancel,
  onSave,
}) {
  return (
    <ProfileSectionCard
      title="Resume"
      description="Upload a recruiter-ready PDF or DOCX."
      actions={
        <SectionActions
          isEditing={isEditing}
          isLocked={isLocked}
          onEdit={onEdit}
          onCancel={onCancel}
          onSave={onSave}
          saveLabel="Save Resume"
        />
      }
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-surface-3 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-ink">Resume</p>
            <p className="text-xs text-ink-faint">
              {resumeUrl ? "Resume available for download." : "Resume not uploaded yet."}
            </p>
          </div>
          {resumeUrl && (
            <Button size="sm" variant="outline" onClick={() => window.open(resumeUrl, "_blank")}>
              Download
            </Button>
          )}
        </div>

        {isEditing && (
          <div className="space-y-2">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(event) => onFileChange(event.target.files?.[0] || null)}
            />
            <p className="text-xs text-ink-faint">
              {selectedFile ? `Selected: ${selectedFile.name}` : "Choose a file to upload."}
            </p>
          </div>
        )}
      </div>
    </ProfileSectionCard>
  );
}
