import { useMemo, useState } from "react";
import ProfileSectionCard from "../ProfileSectionCard";
import SectionActions from "./SectionActions";

export default function ResumeSection({
  resumeUrl,
  resumeFilename,
  lastUpdated,
  selectedFile,
  onFileChange,
  onDelete,
  isEditing,
  isLocked,
  onEdit,
  onCancel,
  onSave,
  isUploading = false,
  isDeleting = false,
}) {
  const [dragActive, setDragActive] = useState(false);

  const displayName = useMemo(() => {
    if (resumeFilename) return resumeFilename;
    if (!resumeUrl) return "";
    return resumeUrl.split("/").pop() || "";
  }, [resumeFilename, resumeUrl]);

  const formattedDate = lastUpdated ? new Date(lastUpdated).toLocaleDateString() : "";

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => setDragActive(false);

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
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-surface-3 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-ink">Resume</p>
            {resumeUrl ? (
              <div className="space-y-1">
                <p className="text-sm font-semibold text-ink">{displayName}</p>
                <p className="text-xs text-ink-faint">
                  {formattedDate ? `Uploaded on ${formattedDate}` : "Resume available for download."}
                </p>
              </div>
            ) : (
              <p className="text-xs text-ink-faint">Resume not uploaded yet.</p>
            )}
          </div>
          {resumeUrl && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-3 text-ink hover:bg-surface-2"
                aria-label="Download resume"
                onClick={() => window.open(resumeUrl, "_blank")}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v12" />
                  <path d="M7 10l5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
              </button>
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-surface-3 text-danger hover:bg-danger/10"
                aria-label="Delete resume"
                onClick={onDelete}
                disabled={isDeleting}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18" />
                  <path d="M8 6V4h8v2" />
                  <path d="M6 6l1 14h10l1-14" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {isEditing && (
          <div
            className={`rounded-2xl border-2 border-dashed px-6 py-6 text-center transition ${
              dragActive ? "border-brand-400 bg-brand-50/60" : "border-surface-3 bg-white/70"
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              id="resume-upload"
              onChange={(event) => onFileChange(event.target.files?.[0] || null)}
            />
            <label htmlFor="resume-upload" className="mx-auto flex max-w-xs flex-col items-center gap-3">
              <span className="rounded-full border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700">
                {isUploading ? "Uploading..." : "Update resume"}
              </span>
              <span className="text-xs text-ink-faint">
                Drag and drop your file here or click to upload.
              </span>
              <span className="text-xs text-ink-faint">
                {selectedFile
                  ? `Selected: ${selectedFile.name}`
                  : "Supported formats: PDF, DOC, DOCX (up to 2MB)"}
              </span>
            </label>
          </div>
        )}
      </div>
    </ProfileSectionCard>
  );
}
