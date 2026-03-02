import EditButton from "../shared/EditButton";
import SectionCard from "../shared/SectionCard";
import {
  formatCandidateLocationForCard,
  formatCandidateExperienceLabel,
} from "../../../../shared/selectors/candidateSelectors";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatValue = (value) => (value ? value : "-");
const currencySymbol = (code) => {
  if (code === "USD") return "$";
  return "₹";
};

const formatINR = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const digits = String(value).replace(/[^\d]/g, "");
  if (digits.length <= 3) return digits;
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3);
  const restGrouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${restGrouped},${last3}`;
};

export default function PersonalDetailsCard({ data, onEdit, isLocked }) {
  const locationText = formatCandidateLocationForCard(data || {});
  const experienceText = formatCandidateExperienceLabel(data || {});
  return (
    <SectionCard
      title="Personal Details"
      description="Basic information recruiters need."
      actions={<EditButton onClick={onEdit} disabled={isLocked} />}
    >
      <div className="grid gap-4 text-sm md:grid-cols-2">
        <div>
          <p className="text-xs text-ink-faint">Name</p>
          <p className="font-semibold text-ink">{formatValue(data?.full_name)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">Email</p>
          <p className="font-semibold text-ink">{formatValue(data?.email)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">Phone</p>
          <p className="font-semibold text-ink">{formatValue(data?.phone)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">Location</p>
          <p className="font-semibold text-ink">{locationText}</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">Experience</p>
          <p className="font-semibold text-ink">{experienceText || "Add experience"}</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">Availability to join</p>
          <p className="font-semibold text-ink">{data?.availability_label || "-"}</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">Expected Salary</p>
          <p className="font-semibold text-ink">
            {data?.expected_salary
              ? `${currencySymbol(data?.salary_currency)}${formatINR(data.expected_salary)}`
              : "-"}
          </p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">Marital Status</p>
          <p className="font-semibold text-ink">
            {formatValue(data?.marital_status_label)}
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 text-sm md:grid-cols-2">
        <div>
          <p className="text-xs text-ink-faint">Gender</p>
          <p className="font-semibold text-ink">{formatValue(data?.gender_label)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">Date of Birth</p>
          <p className="font-semibold text-ink">{formatDate(data?.dob)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">Nationality</p>
          <p className="font-semibold text-ink">{formatValue(data?.nationality)}</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">Work Authorization Country</p>
          <p className="font-semibold text-ink">
            {formatValue(data?.work_authorization_country)}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
