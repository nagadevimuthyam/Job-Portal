import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import PersonalDetailsCard from "./PersonalDetailsCard";
import PersonalDetailsModal from "./PersonalDetailsModal";
import parseApiErrors from "./parseApiErrors";
import {
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  getLabelForValue,
  AVAILABILITY_OPTIONS,
} from "../../../../shared/constants/profileOptions";
import {
  useGetPersonalDetailsQuery,
  useUpdatePersonalDetailsMutation,
} from "../../../../features/candidate/candidateProfileApi";

const isFutureDate = (value) => {
  if (!value) return false;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date > today;
};

export default function PersonalDetailsSection({ isEditing, isLocked, onEdit, onClose }) {
  const { data, isLoading } = useGetPersonalDetailsQuery();
  const [updatePersonalDetails, { isLoading: isSaving }] = useUpdatePersonalDetailsMutation();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      setErrors({});
    }
  }, [isEditing]);

  const enrichedData = useMemo(() => {
    if (!data) return null;
    return {
      ...data,
      gender_label: getLabelForValue(data.gender, GENDER_OPTIONS),
      marital_status_label: getLabelForValue(data.marital_status, MARITAL_STATUS_OPTIONS),
      availability_label: getLabelForValue(data.availability_to_join, AVAILABILITY_OPTIONS),
    };
  }, [data]);

  const handleSave = async (payload) => {
    const nextErrors = {};
    if (payload.gender && !GENDER_OPTIONS.some((opt) => opt.value === payload.gender)) {
      nextErrors.gender = "Please select a valid gender.";
    }
    if (
      payload.marital_status &&
      !MARITAL_STATUS_OPTIONS.some((opt) => opt.value === payload.marital_status)
    ) {
      nextErrors.marital_status = "Please select a valid marital status.";
    }
    if (payload.dob && isFutureDate(payload.dob)) {
      nextErrors.dob = "Date of birth cannot be in the future.";
    }

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    try {
      await updatePersonalDetails(payload).unwrap();
      toast.success("Personal details updated.");
      onClose();
    } catch (err) {
      const parsed = parseApiErrors(err);
      setErrors(parsed);
      toast.error(parsed._error || "Unable to update personal details.");
    }
  };

  if (isLoading && !data) {
    return (
      <PersonalDetailsCard
        data={{}}
        onEdit={onEdit}
        isLocked={isLocked}
      />
    );
  }

  return (
    <>
      <PersonalDetailsCard data={enrichedData || {}} onEdit={onEdit} isLocked={isLocked} />
      <PersonalDetailsModal
        isOpen={isEditing}
        onClose={onClose}
        onSave={handleSave}
        isSaving={isSaving}
        initialValues={data}
        errors={errors}
      />
    </>
  );
}
