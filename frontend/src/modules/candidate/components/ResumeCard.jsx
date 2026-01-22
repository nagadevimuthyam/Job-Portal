import { useRef } from "react";
import Button from "../../../components/ui/Button";
import Card from "../../../components/ui/Card";

export default function ResumeCard({ resumeUrl, onUpload, readonly = false }) {
  const inputRef = useRef(null);

  const handlePick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <Card className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-ink">Resume</h3>
          <p className="text-xs text-ink-faint">Keep a PDF or DOCX for recruiters.</p>
        </div>
        {resumeUrl && (
          <Button size="sm" variant="outline" onClick={() => window.open(resumeUrl, "_blank")}>
            Download
          </Button>
        )}
      </div>
      {!readonly && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={handlePick}>
              {resumeUrl ? "Update Resume" : "Upload Resume"}
            </Button>
            <p className="text-xs text-ink-faint">Supported: PDF, DOC, DOCX</p>
          </div>
        </>
      )}
      {!resumeUrl && readonly && (
        <p className="text-xs text-ink-faint">Resume not uploaded yet.</p>
      )}
    </Card>
  );
}
