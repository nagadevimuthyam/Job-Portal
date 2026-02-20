import noticePeriodOptions from "../../../../shared/constants/noticePeriodOptions";

export default function PersonalDetailsList({
  fullName,
  email,
  phone,
  location,
  totalExperienceYears,
  totalExperienceMonths,
  noticePeriodCode,
  expectedSalary,
}) {
  const noticeLabel =
    noticePeriodOptions.find((option) => option.value === noticePeriodCode)?.label || "-";
  return (
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
        <p className="font-semibold text-ink">{noticeLabel || "-"}</p>
      </div>
      <div>
        <p className="text-xs text-ink-faint">Expected Salary</p>
        <p className="font-semibold text-ink">
          {expectedSalary ? `?${expectedSalary}` : "-"}
        </p>
      </div>
    </div>
  );
}
