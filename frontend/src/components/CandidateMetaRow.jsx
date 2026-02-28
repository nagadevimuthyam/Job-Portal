export default function CandidateMetaRow({ items = [], className = "" }) {
  return (
    <div
      className={`flex flex-nowrap items-center gap-2 overflow-hidden whitespace-nowrap text-ellipsis text-xs text-ink-faint ${className}`}
    >
      {items.map((item, index) => {
        const value =
          item?.value === null || item?.value === undefined || item?.value === ""
            ? "--"
            : item.value;

        return (
          <span key={`${item?.id || "meta"}-${index}`} className="inline-flex min-w-0 items-center gap-1">
            {item?.icon ? <span className="text-ink-faint">{item.icon}</span> : null}
            <span className="min-w-0 truncate">{value}</span>
            {index < items.length - 1 ? (
              <span className="px-1 text-ink-faint">|</span>
            ) : null}
          </span>
        );
      })}
    </div>
  );
}
