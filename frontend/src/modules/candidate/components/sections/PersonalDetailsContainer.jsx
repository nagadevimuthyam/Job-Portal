import { memo, useEffect, useState } from "react";
import { toast } from "sonner";
import SectionWrapper from "./SectionWrapper";
import SectionActions from "./SectionActions";
import PersonalDetailsForm from "./PersonalDetailsForm";
import PersonalDetailsList from "./PersonalDetailsList";
import FieldError from "./FieldError";
import parseApiErrors from "./parseApiErrors";
import { useUpdateProfileMutation } from "../../../../features/candidate/candidateProfileApi";

const parseOptionalInt = (value) => (value === "" || value === null ? null : Number(value));

function PersonalDetailsContainer({
  fullName,
  email,
  phone,
  location,
  totalExperienceYears,
  totalExperienceMonths,
  noticePeriodCode,
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
    notice_period_code: null,
    expected_salary: "",
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
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
        notice_period_code: noticePeriodCode ?? null,
        expected_salary: expectedSalary ?? "",
      });
      setErrors({});
      setFormError("");
    }
  }, [
    isEditing,
    fullName,
    email,
    phone,
    location,
    totalExperienceYears,
    totalExperienceMonths,
    noticePeriodCode,
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
        notice_period_code: draft.notice_period_code || null,
        expected_salary: parseOptionalInt(draft.expected_salary),
      }).unwrap();
      toast.success("Personal details updated.");
      onClose();
    } catch (err) {
      const parsed = parseApiErrors(err);
      setErrors(parsed);
      setFormError(parsed._error || "");
      toast.error(parsed._error || "Unable to update personal details.");
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
        notice_period_code: noticePeriodCode ?? null,
        expected_salary: expectedSalary ?? "",
      });
    setErrors({});
    setFormError("");
    onClose();
  };

  return (
    <SectionWrapper
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
        <>
          {formError && <FieldError message={formError} />}
          <PersonalDetailsForm
            draft={draft}
            onChange={(next) => {
              setDraft(next);
              if (formError) setFormError("");
            }}
            errors={errors}
          />
        </>
      ) : (
        <PersonalDetailsList
          fullName={fullName}
          email={email}
          phone={phone}
          location={location}
          totalExperienceYears={totalExperienceYears}
          totalExperienceMonths={totalExperienceMonths}
          noticePeriodCode={noticePeriodCode}
          expectedSalary={expectedSalary}
        />
      )}
    </SectionWrapper>
  );
}

export default memo(PersonalDetailsContainer);
