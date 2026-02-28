export default function AvatarBlock({
  progress,
  radius,
  circumference,
  offset,
  displayPhoto,
  isUploadingPhoto,
  onFileChange,
  readonly = false,
  size = 192,
  innerSize = 144,
  ringWidth = 16,
  showBadge = true,
  fallbackInitial = "",
  showTrack = true,
}) {
  const safeProgress = Number.isFinite(progress) ? Math.max(0, Math.min(100, progress)) : 0;
  const computedRadius = radius ?? (size - ringWidth) / 2;
  const computedCircumference = circumference ?? 2 * Math.PI * computedRadius;
  const computedOffset =
    offset ?? computedCircumference - (safeProgress / 100) * computedCircumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {showTrack && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={computedRadius}
              strokeWidth={ringWidth}
              className="text-surface-3"
              stroke="currentColor"
              fill="transparent"
            />
          )}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={computedRadius}
            strokeWidth={ringWidth}
            strokeLinecap="round"
            strokeDasharray={computedCircumference}
            strokeDashoffset={computedOffset}
            className={safeProgress >= 100 ? "text-success" : "text-brand-600"}
            stroke="currentColor"
            fill="transparent"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`relative overflow-hidden rounded-full border border-surface-3 bg-surface-2 shadow-sm ${readonly ? "" : "group"}`}
            style={{ width: innerSize, height: innerSize }}
          >
            {displayPhoto ? (
              <img src={displayPhoto} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink-faint">
                {fallbackInitial ? (
                  <span className="text-2xl font-semibold text-ink">
                    {fallbackInitial}
                  </span>
                ) : (
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21a8 8 0 0 0-16 0" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                )}
              </div>
            )}
            {!readonly && (
              <>
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
              </>
            )}
          </div>
        </div>
        {showBadge && (
          <span
            className={`absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full border border-surface-3 bg-white px-3 py-1 text-xs font-semibold shadow-soft ${
              safeProgress >= 100 ? "text-success" : "text-brand-600"
            }`}
          >
            {safeProgress}%
          </span>
        )}
      </div>
    </div>
  );
}
