import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../../../../components/ui/Button";
import Input from "../../../../components/ui/Input";
import FieldError from "./FieldError";
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  mapLegacyValue,
} from "../../../../shared/constants/profileOptions";

export default function PersonalDetailsModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  initialValues,
  errors,
}) {
  const [form, setForm] = useState({
    gender: "",
    dob: "",
    nationality: "",
    marital_status: "",
    work_authorization_country: "",
    expected_salary: "",
  });
  const [salaryCurrency, setSalaryCurrency] = useState("INR");
  const salaryInputRef = useRef(null);

  const formatINR = (value) => {
    if (!value) return "";
    const digits = String(value).replace(/[^\d]/g, "");
    if (digits.length <= 3) return digits;
    const last3 = digits.slice(-3);
    const rest = digits.slice(0, -3);
    const restGrouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return `${restGrouped},${last3}`;
  };

  useEffect(() => {
    if (isOpen) {
      setForm({
        gender: mapLegacyValue(initialValues?.gender, GENDER_OPTIONS),
        dob: initialValues?.dob || "",
        nationality: initialValues?.nationality || "",
        marital_status: mapLegacyValue(
          initialValues?.marital_status,
          MARITAL_STATUS_OPTIONS
        ),
        work_authorization_country: initialValues?.work_authorization_country || "",
        expected_salary:
          initialValues?.expected_salary === null || initialValues?.expected_salary === undefined
            ? ""
            : String(initialValues.expected_salary),
      });
      setSalaryCurrency(initialValues?.salary_currency || "INR");
    }
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSave({
      gender: form.gender,
      dob: form.dob || null,
      nationality: form.nationality,
      marital_status: form.marital_status,
      work_authorization_country: form.work_authorization_country,
      expected_salary: form.expected_salary === "" ? null : Number(form.expected_salary),
      salary_currency: salaryCurrency,
    });
  };

  const modalContent = (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl lg:max-w-3xl">
        <div className="modal-scrollbar max-h-[85vh] overflow-y-auto rounded-2xl">
          <div className="sticky top-0 z-10 flex items-start justify-between border-b border-surface-3 bg-white px-6 py-4">
            <h3 className="text-lg font-semibold text-ink">Personal details</h3>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-ink-faint hover:text-ink"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
          </div>

          <div className="space-y-6 px-6 py-6">
            <div>
              <label className="block">
                <span className="text-sm font-semibold text-ink-soft">Gender</span>
                <select
                  className={`mt-1 w-full rounded-xl border bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 ${
                    errors?.gender
                      ? "border-danger focus:border-danger focus:ring-danger/20"
                      : "border-surface-3 focus:border-brand-300 focus:ring-brand-200"
                  }`}
                  value={form.gender}
                  onChange={(event) => setForm({ ...form, gender: event.target.value })}
                >
                  <option value="">Select gender</option>
                  {GENDER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <FieldError message={errors?.gender} />
            </div>

            <div>
              <Input
                label="Date of Birth"
                type="date"
                value={form.dob || ""}
                onChange={(event) => setForm({ ...form, dob: event.target.value })}
                error={errors?.dob}
              />
              <FieldError message={errors?.dob} />
            </div>

            <div>
              <Input
                label="Nationality"
                value={form.nationality}
                onChange={(event) => setForm({ ...form, nationality: event.target.value })}
                error={errors?.nationality}
              />
              <FieldError message={errors?.nationality} />
            </div>

            <div>
              <label className="block">
                <span className="text-sm font-semibold text-ink-soft">Marital Status</span>
                <select
                  className={`mt-1 w-full rounded-xl border bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 ${
                    errors?.marital_status
                      ? "border-danger focus:border-danger focus:ring-danger/20"
                      : "border-surface-3 focus:border-brand-300 focus:ring-brand-200"
                  }`}
                  value={form.marital_status}
                  onChange={(event) => setForm({ ...form, marital_status: event.target.value })}
                >
                  <option value="">Select marital status</option>
                  {MARITAL_STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <FieldError message={errors?.marital_status} />
            </div>

            <div>
              <Input
                label="Work Authorization Country"
                value={form.work_authorization_country}
                onChange={(event) =>
                  setForm({ ...form, work_authorization_country: event.target.value })
                }
                error={errors?.work_authorization_country}
              />
              <FieldError message={errors?.work_authorization_country} />
            </div>

            <div>
              <label className="block">
                <span className="text-sm font-semibold text-ink-soft">Expected Salary</span>
                <div className="mt-1 flex items-center gap-2">
                  <select
                    value={salaryCurrency}
                    onChange={(event) => setSalaryCurrency(event.target.value)}
                    className="h-11 w-16 rounded-xl border border-surface-3 bg-surface-inverse px-3 text-sm text-ink shadow-sm focus:border-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-200"
                  >
                    <option value="INR">₹</option>
                    <option value="USD">$</option>
                  </select>
                  <Input
                    className="flex-1"
                    ref={salaryInputRef}
                    type="text"
                    inputMode="numeric"
                    value={formatINR(form.expected_salary)}
                    onChange={(event) => {
                      const input = event.target;
                      const prevValue = input.value;
                      const prevPos = input.selectionStart ?? prevValue.length;
                      const prevCommas = (prevValue.match(/,/g) || []).length;
                      const rawDigits = prevValue.replace(/[^\d]/g, "");
                      const nextRaw = rawDigits.slice(0, 9);
                      const nextDisplay = formatINR(nextRaw);
                      const nextCommas = (nextDisplay.match(/,/g) || []).length;
                      setForm({ ...form, expected_salary: nextRaw });
                      requestAnimationFrame(() => {
                        const el = salaryInputRef.current;
                        if (!el) return;
                        const delta = nextCommas - prevCommas;
                        const nextPos = Math.max(0, prevPos + delta);
                        el.setSelectionRange(nextPos, nextPos);
                      });
                    }}
                    error={errors?.expected_salary}
                  />
                </div>
              </label>
              <FieldError message={errors?.expected_salary} />
            </div>
          </div>

          <div className="sticky bottom-0 z-10 border-t border-surface-3 bg-white px-6 py-4">
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(modalContent, document.body);
}
