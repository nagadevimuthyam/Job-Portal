import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import {
  WORK_STATUS_OPTIONS,
  AVAILABILITY_OPTIONS,
  mapLegacyValue,
} from "../../../shared/constants/profileOptions";

export default function BasicDetailsModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  initialValues,
}) {
  const [form, setForm] = useState({
    location_country: "India",
    current_city: "",
    current_state: "",
    country: "",
    phone: "",
    email: "",
    work_status: "",
    total_experience_years: "",
    availability_to_join: "",
    notice_period_days: "",
  });
  const [errors, setErrors] = useState({});

  const noticePeriodOptions = useMemo(
    () => [
      { label: "15 Days or less", days: 15, code: "15_DAYS_OR_LESS" },
      { label: "1 Month", days: 30, code: "1_MONTH" },
      { label: "2 Months", days: 60, code: "2_MONTHS" },
      { label: "3 Months", days: 90, code: "3_MONTHS" },
      { label: "More than 3 Months", days: 120, code: "MORE_THAN_3_MONTHS" },
    ],
    []
  );

  const experienceOptions = useMemo(() => {
    const options = [];
    for (let year = 0; year <= 40; year += 1) {
      options.push({
        value: String(year),
        label: year === 1 ? "1 Year" : `${year} Years`,
      });
    }
    return options;
  }, []);

  useEffect(() => {
    if (isOpen) {
      setForm({
        location_country: initialValues?.location_country || "India",
        current_city: initialValues?.current_city || "",
        current_state: initialValues?.current_state || "",
        country: initialValues?.country || initialValues?.location_country || "India",
        phone: initialValues?.phone || "",
        email: initialValues?.email || "",
        work_status: mapLegacyValue(initialValues?.work_status, WORK_STATUS_OPTIONS),
        total_experience_years: initialValues?.total_experience_years ?? "",
        availability_to_join: mapLegacyValue(
          initialValues?.availability_to_join,
          AVAILABILITY_OPTIONS
        ),
        notice_period_days: initialValues?.notice_period_days ?? "",
      });
      if (
        !initialValues?.availability_to_join &&
        (initialValues?.notice_period_days || initialValues?.notice_period_days === 0)
      ) {
        const match = noticePeriodOptions.find(
          (option) => option.days === Number(initialValues.notice_period_days)
        );
        if (match) {
          setForm((prev) => ({
            ...prev,
            availability_to_join: match.code,
          }));
        }
      }
      setErrors({});
    }
  }, [isOpen, initialValues, noticePeriodOptions]);

  if (!isOpen) return null;

  const validate = () => {
    const nextErrors = {};
    if (!form.current_city.trim()) nextErrors.current_city = "City is required";
    if (!form.phone.trim()) nextErrors.phone = "Mobile number is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    if (!form.work_status) nextErrors.work_status = "Select work status";
    if (form.work_status === "EXPERIENCED") {
      const years = Number(form.total_experience_years);
      if (!years || years < 1) {
        nextErrors.total_experience_years = "Select your total experience";
      }
    }
    if (form.notice_period_days === "" || form.notice_period_days === null || form.notice_period_days === undefined) {
      nextErrors.notice_period_days = "Notice period is required";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      location_country: form.country || form.location_country,
      location: form.current_city,
      current_city: form.current_city,
      current_state: form.current_state,
      country: form.country,
      phone: form.phone,
      email: form.email,
      work_status: form.work_status,
      total_experience_years:
        form.work_status === "FRESHER"
          ? 0
          : Number(form.total_experience_years || 0),
      total_experience_months: 0,
      availability_to_join: form.availability_to_join,
      notice_period_days: form.notice_period_days === "" ? null : Number(form.notice_period_days),
    });
  };

  const modalContent = (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-[2px]">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl lg:max-w-3xl">
        <div className="modal-scrollbar max-h-[85vh] overflow-y-auto rounded-2xl">
          <div className="sticky top-0 z-10 flex items-start justify-between border-b border-surface-3 bg-white px-6 py-4">
            <h3 className="text-lg font-semibold text-ink">Basic details</h3>
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
            <p className="text-sm font-semibold text-ink-soft">Work status *</p>
            <p className="text-xs text-ink-faint">
              We will personalise your experience based on this
            </p>
            <div className="mt-3 flex flex-wrap gap-6">
              {WORK_STATUS_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 text-sm text-ink"
                >
                  <input
                    type="radio"
                    name="work_status"
                    value={option.value}
                    checked={form.work_status === option.value}
                    onChange={(event) => {
                      const nextStatus = event.target.value;
                      setForm((prev) => ({
                        ...prev,
                        work_status: nextStatus,
                        total_experience_years:
                          nextStatus === "FRESHER"
                            ? 0
                            : prev.total_experience_years === 0
                              ? ""
                              : prev.total_experience_years,
                      }));
                    }}
                    className="h-4 w-4 text-brand-600 focus:ring-brand-300"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {errors.work_status && (
              <p className="mt-1 text-xs text-danger">{errors.work_status}</p>
            )}
          </div>

          {form.work_status === "EXPERIENCED" && (
            <div>
              <label className="block">
                <span className="text-sm font-semibold text-ink-soft">
                  Total experience *
                </span>
                <span className="mt-1 block text-xs text-ink-faint">
                  This helps recruiters know your years of experience
                </span>
                <select
                  className={`mt-2 w-full rounded-xl border bg-surface-inverse px-3 py-2.5 text-sm text-ink shadow-sm focus:outline-none focus:ring-2 ${
                    errors.total_experience_years
                      ? "border-danger focus:border-danger focus:ring-danger/20"
                      : "border-surface-3 focus:border-brand-300 focus:ring-brand-200"
                  }`}
                  value={form.total_experience_years}
                  onChange={(event) =>
                    setForm({ ...form, total_experience_years: event.target.value })
                  }
                >
                  <option value="">Select year</option>
                  {experienceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              {errors.total_experience_years && (
                <p className="mt-1 text-xs text-danger">
                  {errors.total_experience_years}
                </p>
              )}
            </div>
          )}

          <div>
            <p className="text-sm font-semibold text-ink-soft">Current location *</p>
            <p className="text-xs text-ink-faint">This helps us match you to relevant jobs</p>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <Input
                label="City"
                value={form.current_city}
                onChange={(event) => setForm({ ...form, current_city: event.target.value })}
                error={errors.current_city}
              />
              <Input
                label="State"
                value={form.current_state}
                onChange={(event) => setForm({ ...form, current_state: event.target.value })}
                error={errors.current_state}
              />
            </div>
            <div className="mt-3">
              <Input
                label="Country"
                value={form.country}
                onChange={(event) => setForm({ ...form, country: event.target.value })}
                error={errors.country}
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-soft">Mobile number *</p>
            <p className="text-xs text-ink-faint">Recruiters will contact you on this number</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Input
                className="max-w-xs"
                value={form.phone}
                onChange={(event) => setForm({ ...form, phone: event.target.value })}
                error={errors.phone}
              />
              <button type="button" className="text-xs font-semibold text-brand-700">
                Change Mobile Number
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-soft">Email address *</p>
            <p className="text-xs text-ink-faint">We will send relevant jobs and updates to this email</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <Input
                className="max-w-xs"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                error={errors.email}
              />
              <button type="button" className="text-xs font-semibold text-brand-700">
                Change Email
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-soft">Notice period *</p>
            <p className="text-xs text-ink-faint">
              Let recruiters know your availability
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {noticePeriodOptions.map((option) => (
                <button
                  key={option.days}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      notice_period_days: option.days,
                      availability_to_join: option.code,
                    })
                  }
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition ${
                    Number(form.notice_period_days) === option.days
                      ? "border-brand-300 bg-brand-50 text-brand-700"
                    : "border-surface-3 bg-white text-ink-faint hover:border-brand-200 hover:text-ink"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.notice_period_days && (
              <p className="mt-1 text-xs text-danger">{errors.notice_period_days}</p>
            )}
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
