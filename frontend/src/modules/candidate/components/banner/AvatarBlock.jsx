export default function AvatarBlock({
  progress,
  radius,
  circumference,
  offset,
  displayPhoto,
  isUploadingPhoto,
  onFileChange,
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-48 w-48">
        <svg width="192" height="192" className="-rotate-90">
          <circle
            cx="96"
            cy="96"
            r={radius}
            strokeWidth="16"
            className="text-surface-3"
            stroke="currentColor"
            fill="transparent"
          />
          <circle
            cx="96"
            cy="96"
            r={radius}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={progress >= 100 ? "text-success" : "text-brand-600"}
            stroke="currentColor"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="group relative h-36 w-36 overflow-hidden rounded-full border border-surface-3 bg-surface-2 shadow-sm">
            {displayPhoto ? (
              <img src={displayPhoto} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink-faint">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
            )}
            <label
              htmlFor="profile-photo"
              className="absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 bg-slate-900/65 text-[11px] font-semibold text-white opacity-0 transition group-hover:opacity-100"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 5v14" />
                  <path d="M5 12h14" />
                </svg>
              </span>
              {isUploadingPhoto ? "Uploading..." : displayPhoto ? "Replace photo" : "Add photo"}
            </label>
            <input
              id="profile-photo"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
        </div>
        <span
          className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full border border-surface-3 bg-white px-3 py-1 text-xs font-semibold shadow-soft ${
            progress >= 100 ? "text-success" : "text-brand-600"
          }`}
        >
          {progress}%
        </span>
      </div>
    </div>
  );
}
