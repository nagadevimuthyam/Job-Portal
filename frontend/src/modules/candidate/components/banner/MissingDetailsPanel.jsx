import Button from "../../../../components/ui/Button";
import { missingIconMap } from "./bannerConfig";

export default function MissingDetailsPanel({
  missingCount,
  topMissing,
  onJump,
  ctaLabel,
}) {
  return (
    <div className="rounded-2xl bg-amber-50/70 p-4 lg:border-l lg:border-surface-3 lg:pl-6">
      {missingCount === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            100% Complete
          </span>
          <p className="mt-2 text-xs text-ink-faint">Great job! Your profile is ready for recruiters.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {topMissing.map((item) => (
              <button
                key={item.key}
                type="button"
                className="flex w-full items-center justify-between gap-2 rounded-xl bg-white/90 px-3 py-2 text-xs font-semibold text-ink shadow-sm hover:bg-white"
                onClick={() => onJump(item.key)}
              >
                <span className="flex items-center gap-2 text-ink">
                  <span className="text-ink-faint">{missingIconMap[item.key] || missingIconMap.summary}</span>
                  {item.label}
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold text-emerald-700">
                  +{item.percent}%
                </span>
              </button>
            ))}
          </div>
          <Button className="mt-4 w-full" onClick={ctaLabel.onClick}>
            {ctaLabel.text}
          </Button>
        </>
      )}
    </div>
  );
}
