import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, helperText, className = "", rightElement, ...props },
  ref
) {
  return (
    <label className="block">
      {label && <span className="text-sm font-semibold text-ink-soft">{label}</span>}
      <div className="relative mt-1">
        <input
          ref={ref}
          className={`w-full rounded-xl border border-surface-3 bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200 ${className}`}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</div>
        )}
      </div>
      {helperText && !error && <p className="mt-1 text-xs text-ink-faint">{helperText}</p>}
      {error && <p className="mt-1 text-xs text-danger">{error}</p>}
    </label>
  );
});

export default Input;
