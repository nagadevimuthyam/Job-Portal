import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import ProfileSectionCard from "../ProfileSectionCard";
import SectionActions from "./SectionActions";
import Input from "../../../../components/ui/Input";
import { useUpdateProfileMutation } from "../../../../features/candidate/candidateProfileApi";

const parseOptionalInt = (value) => (value === "" || value === null ? null : Number(value));

function PersonalDetailsSection({
  fullName,
  email,
  phone,
  location,
  totalExperienceYears,
  totalExperienceMonths,
  noticePeriodDays,
  expectedSalary,
  isEditing,
  isLocked,
  onEdit,
  onClose,
}) {
  const [draft, setDraft] = useState({
    full_name: "",
    email: "",
    phone: "",
    location: "",
    total_experience_years: 0,
    total_experience_months: 0,
    notice_period_days: "",
    expected_salary: "",
  });
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  useEffect(() => {
    if (isEditing) {
      setDraft({
        full_name: fullName || "",
        email: email || "",
        phone: phone || "",
        location: location || "",
        total_experience_years: totalExperienceYears ?? 0,
        total_experience_months: totalExperienceMonths ?? 0,
        notice_period_days: noticePeriodDays ?? "",
        expected_salary: expectedSalary ?? "",
      });
    }
  }, [
    isEditing,
    fullName,
    email,
    phone,
    location,
    totalExperienceYears,
    totalExperienceMonths,
    noticePeriodDays,
    expectedSalary,
  ]);

  const handleSave = async () => {
    try {
      await updateProfile({
        full_name: draft.full_name,
        email: draft.email,
        phone: draft.phone,
        location: draft.location,
        total_experience_years: Number(draft.total_experience_years || 0),
        total_experience_months: Number(draft.total_experience_months || 0),
        notice_period_days: parseOptionalInt(draft.notice_period_days),
        expected_salary: parseOptionalInt(draft.expected_salary),
      }).unwrap();
      toast.success("Personal details updated.");
      onClose();
    } catch (err) {
      toast.error("Unable to update personal details.");
    }
  };

  const handleCancel = () => {
    setDraft({
      full_name: fullName || "",
      email: email || "",
      phone: phone || "",
      location: location || "",
      total_experience_years: totalExperienceYears ?? 0,
      total_experience_months: totalExperienceMonths ?? 0,
      notice_period_days: noticePeriodDays ?? "",
      expected_salary: expectedSalary ?? "",
    });
    onClose();
  };

  return (
    <ProfileSectionCard
      title="Personal Details"
      description="Basic information recruiters need."
      actions={
        <SectionActions
          isEditing={isEditing}
          isLocked={isLocked}
          onEdit={onEdit}
          onCancel={handleCancel}
          onSave={handleSave}
          saveLabel={isLoading ? "Saving..." : "Save Details"}
        />
      }
    >
      {isEditing ? (
        <div className="grid gap-4 md:grid-cols-2">
          <Input
            label="Full Name"
            value={draft.full_name}
            onChange={(event) => setDraft({ ...draft, full_name: event.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={draft.email}
            onChange={(event) => setDraft({ ...draft, email: event.target.value })}
          />
          <Input
            label="Phone"
            value={draft.phone}
            onChange={(event) => setDraft({ ...draft, phone: event.target.value })}
          />
          <Input
            label="Location"
            value={draft.location}
            onChange={(event) => setDraft({ ...draft, location: event.target.value })}
          />
          <Input
            label="Experience Years"
            type="number"
            value={draft.total_experience_years}
            onChange={(event) =>
              setDraft({ ...draft, total_experience_years: event.target.value })
            }
          />
          <Input
            label="Experience Months"
            type="number"
            value={draft.total_experience_months}
            onChange={(event) =>
              setDraft({ ...draft, total_experience_months: event.target.value })
            }
          />
          <Input
            label="Notice Period (days)"
            type="number"
            value={draft.notice_period_days}
            onChange={(event) => setDraft({ ...draft, notice_period_days: event.target.value })}
          />
          <Input
            label="Expected Salary"
            type="number"
            value={draft.expected_salary}
            onChange={(event) => setDraft({ ...draft, expected_salary: event.target.value })}
          />
        </div>
      ) : (
        <div className="grid gap-3 text-sm md:grid-cols-2">
          <div>
            <p className="text-xs text-ink-faint">Name</p>
            <p className="font-semibold text-ink">{fullName || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Email</p>
            <p className="font-semibold text-ink">{email || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Phone</p>
            <p className="font-semibold text-ink">{phone || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Location</p>
            <p className="font-semibold text-ink">{location || "-"}</p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Experience</p>
            <p className="font-semibold text-ink">
              {totalExperienceYears || 0}y {totalExperienceMonths || 0}m
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Notice Period</p>
            <p className="font-semibold text-ink">
              {noticePeriodDays ? `${noticePeriodDays} days` : "-"}
            </p>
          </div>
          <div>
            <p className="text-xs text-ink-faint">Expected Salary</p>
            <p className="font-semibold text-ink">
              {expectedSalary ? `₹${expectedSalary}` : "-"}
            </p>
          </div>
        </div>
      )}
    </ProfileSectionCard>
  );
}

export default memo(PersonalDetailsSection);
