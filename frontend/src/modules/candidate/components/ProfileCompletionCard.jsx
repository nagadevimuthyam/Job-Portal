import { useState } from "react";
import Card from "../../../components/ui/Card";

const iconMap = {
  personal_full_name: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
  personal_email: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h16v16H4z" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  ),
  personal_phone: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2A19.8 19.8 0 0 1 3 5.18 2 2 0 0 1 5 3h3a2 2 0 0 1 2 1.72c.12.9.35 1.77.68 2.6a2 2 0 0 1-.45 2.11L9.1 10.9a16 16 0 0 0 4 4l1.47-1.13a2 2 0 0 1 2.11-.45c.83.33 1.7.56 2.6.68A2 2 0 0 1 22 16.92z" />
    </svg>
  ),
  personal_location: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 21s-6-5.33-6-10a6 6 0 0 1 12 0c0 4.67-6 10-6 10z" />
      <circle cx="12" cy="11" r="2" />
    </svg>
  ),
  summary: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h10" />
    </svg>
  ),
  skills: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 4h6v6H4z" />
      <path d="M14 4h6v6h-6z" />
      <path d="M4 14h6v6H4z" />
      <path d="M14 14h6v6h-6z" />
    </svg>
  ),
  employment: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M9 7V5a3 3 0 0 1 6 0v2" />
      <path d="M3 13h18" />
    </svg>
  ),
  education: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 10L12 4 2 10l10 6 10-6z" />
      <path d="M6 12v5c2 2 10 2 12 0v-5" />
    </svg>
  ),
  projects: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 7h18" />
      <path d="M3 12h18" />
      <path d="M3 17h18" />
    </svg>
  ),
  resume: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  ),
};

export default function ProfileCompletionCard({
  percent = 0,
  lastUpdated,
  subtitle,
  missingDetails = [],
  missingCount = 0,
  onJumpToSection,
}) {
  const [expanded, setExpanded] = useState(false);
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(100, Math.max(0, percent));
  const offset = circumference - (progress / 100) * circumference;
  const isComplete = progress >= 100;

  const visibleItems = expanded ? missingDetails : missingDetails.slice(0, 3);
  const hasMore = missingDetails.length >= 4;

  return (
    <Card className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">Profile strength</p>
          <h3 className={`text-lg font-semibold ${isComplete ? "text-success" : "text-ink"}`}>
            Completion {progress}%
          </h3>
          {subtitle && <p className="mt-1 text-xs text-ink-faint">{subtitle}</p>}
        </div>
        <div className="relative h-20 w-20">
          <svg width="80" height="80" className="-rotate-90">
            <circle
              cx="40"
              cy="40"
              r={radius}
              strokeWidth="6"
              className="text-surface-3"
              stroke="currentColor"
              fill="transparent"
            />
            <circle
              cx="40"
              cy="40"
              r={radius}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={isComplete ? "text-success" : "text-brand-600"}
              stroke="currentColor"
              fill="transparent"
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-xs font-semibold text-ink">
            {progress}%
          </span>
        </div>
      </div>

      {isComplete ? (
        <div className="rounded-xl border border-success/30 bg-success/10 px-3 py-2 text-xs font-semibold text-success">
          100% Complete
        </div>
      ) : (
        <div className="space-y-3 rounded-xl border border-surface-3 bg-white/70 px-3 py-3">
          <div className="flex items-center justify-between text-xs font-semibold text-ink">
            <span>Add {missingCount || missingDetails.length} missing details</span>
            <span className="rounded-full bg-brand-50 px-2 py-1 text-[11px] text-brand-700">
              +{Math.max(1, missingDetails[0]?.percent || 0)}%
            </span>
          </div>
          <div className="space-y-2 text-xs text-ink-faint">
            {visibleItems.map((item) => (
              <button
                key={item.key}
                type="button"
                className="flex w-full items-center justify-between text-left text-ink-faint hover:text-ink"
                onClick={() => {
                  if (!onJumpToSection) return;
                  const mapping = {
                    personal_full_name: "personal",
                    personal_email: "personal",
                    personal_phone: "personal",
                    personal_location: "personal",
                    summary: "summary",
                    skills: "skills",
                    employment: "employment",
                    education: "education",
                    projects: "projects",
                    resume: "resume",
                  };
                  onJumpToSection(mapping[item.key] || "personal");
                }}
              >
                <span className="flex items-center gap-2">
                  <span className="text-ink">{iconMap[item.key] || iconMap.summary}</span>
                  <span>{item.label}</span>
                </span>
                <span className="text-ink">+{item.percent}%</span>
              </button>
            ))}
          </div>
          {hasMore && (
            <div className="space-y-3">
              <div className="mt-3 h-px w-full bg-slate-200/60" />
              <div className="flex justify-center pt-3">
                <button
                  type="button"
                  className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-semibold text-brand-700 hover:bg-brand-100"
                  onClick={() => setExpanded((prev) => !prev)}
                >
                  {expanded ? "Show fewer" : "Show more"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {lastUpdated && (
        <p className="text-xs text-ink-faint">
          Last updated {new Date(lastUpdated).toLocaleDateString()}
        </p>
      )}
    </Card>
  );
}
