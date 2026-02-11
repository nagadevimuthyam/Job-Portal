import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import {
  WORK_STATUS_OPTIONS,
  AVAILABILITY_OPTIONS,
  mapLegacyValue,
} from "../../../shared/constants/profileOptions";

const locationCountryOptions = ["India", "Outside India"];

export default function BasicDetailsModal({
  isOpen,
  onClose,
  onSave,
  isSaving,
  initialValues,
}) {
  const [form, setForm] = useState({
    full_name: "",
    work_status: "",
    location_country: "India",
    location: "",
    phone: "",
    email: "",
    availability_to_join: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setForm({
        full_name: initialValues?.full_name || "",
        work_status: mapLegacyValue(
          initialValues?.work_status,
          WORK_STATUS_OPTIONS
        ),
        location_country: initialValues?.location_country || "India",
        location: initialValues?.location || "",
        phone: initialValues?.phone || "",
        email: initialValues?.email || "",
        availability_to_join: mapLegacyValue(
          initialValues?.availability_to_join,
          AVAILABILITY_OPTIONS
        ),
      });
      setErrors({});
    }
  }, [isOpen, initialValues]);

  if (!isOpen) return null;

  const validate = () => {
    const nextErrors = {};
    if (!form.full_name.trim()) nextErrors.full_name = "Name is required";
    if (!form.location.trim()) nextErrors.location = "Location is required";
    if (!form.phone.trim()) nextErrors.phone = "Mobile number is required";
    if (!form.email.trim()) nextErrors.email = "Email is required";
    if (!form.work_status) nextErrors.work_status = "Work status is required";
    if (!form.availability_to_join) nextErrors.availability_to_join = "Select availability";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      full_name: form.full_name,
      work_status: form.work_status,
      location_country: form.location_country,
      location: form.location,
      phone: form.phone,
      email: form.email,
      availability_to_join: form.availability_to_join,
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
          <Input
            label="Name *"
            value={form.full_name}
            onChange={(event) => setForm({ ...form, full_name: event.target.value })}
            error={errors.full_name}
          />

          <div>
            <p className="text-sm font-semibold text-ink-soft">Work status</p>
            <p className="text-xs text-ink-faint">We will personalise your experience based on this</p>
            <div className="mt-2 flex gap-6">
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
                    onChange={() =>
                      setForm({ ...form, work_status: option.value })
                    }
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {errors.work_status && <p className="mt-1 text-xs text-danger">{errors.work_status}</p>}
          </div>

          <div>
            <p className="text-sm font-semibold text-ink-soft">Current location *</p>
            <p className="text-xs text-ink-faint">This helps us match you to relevant jobs</p>
            <div className="mt-2 flex gap-6">
              {locationCountryOptions.map((option) => (
                <label key={option} className="flex items-center gap-2 text-sm text-ink">
                  <input
                    type="radio"
                    name="location_country"
                    value={option}
                    checked={form.location_country === option}
                    onChange={() => setForm({ ...form, location_country: option })}
                  />
                  {option}
                </label>
              ))}
            </div>
            <div className="mt-3">
              <Input
                label="City"
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
                error={errors.location}
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
            <p className="text-sm font-semibold text-ink-soft">Availability to join</p>
            <p className="text-xs text-ink-faint">Let recruiters know your availability to join</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {AVAILABILITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                    form.availability_to_join === option.value
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-surface-3 text-ink-faint"
                  }`}
                  onClick={() =>
                    setForm({ ...form, availability_to_join: option.value })
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.availability_to_join && (
              <p className="mt-1 text-xs text-danger">{errors.availability_to_join}</p>
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
