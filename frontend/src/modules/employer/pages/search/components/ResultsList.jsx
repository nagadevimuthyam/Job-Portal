import Card from "../../../../../components/ui/Card";
import Skeleton from "../../../../../components/ui/Skeleton";
import Button from "../../../../../components/ui/Button";
import CandidateMetaRow from "../../../../../components/CandidateMetaRow";
import { formatRelativeDays } from "../utils/formatters";
import { getEducationLabel } from "../../../../../shared/constants/profileOptions";

const NOTICE_PERIOD_LABELS = {
  "15_DAYS_OR_LESS": "15 Days",
  "1_MONTH": "1 Month",
  "2_MONTHS": "2 Months",
  "3_MONTHS": "3 Months",
  "MORE_THAN_3_MONTHS": "More than 3 Months",
};

const iconProps = {
  width: 14,
  height: 14,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "2",
};

const ExperienceIcon = (
  <svg {...iconProps}>
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
  </svg>
);

const NoticePeriodIcon = (
  <svg {...iconProps}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 3" />
  </svg>
);

const SalaryIcon = (
  <svg {...iconProps}>
    <path d="M3 7a2 2 0 0 1 2-2h3l2 2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" />
    <path d="M9 12h6" />
    <path d="M12 10v4" />
  </svg>
);

const LocationIcon = (
  <svg {...iconProps}>
    <path d="M12 22s8-6 8-12a8 8 0 1 0-16 0c0 6 8 12 8 12z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const formatExperienceValue = (candidate) => {
  const hasYears = candidate.total_experience_years !== null && candidate.total_experience_years !== undefined;
  const hasMonths = candidate.total_experience_months !== null && candidate.total_experience_months !== undefined;
  let totalMonths = null;

  if (hasYears || hasMonths) {
    const years = Number(candidate.total_experience_years || 0);
    const months = Number(candidate.total_experience_months || 0);
    if (!Number.isNaN(years) && !Number.isNaN(months)) {
      totalMonths = years * 12 + months;
    }
  } else if (candidate.total_experience !== null && candidate.total_experience !== undefined) {
    const total = Number(candidate.total_experience);
    if (!Number.isNaN(total)) {
      totalMonths = Math.round(total * 12);
    }
  }

  if (totalMonths === null) return "--";
  if (totalMonths === 0) return "0y";

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  if (years && months) return `${years}y ${months}m`;
  if (years) return `${years}y`;
  return `${months}m`;
};

const formatNoticePeriodValue = (candidate) => {
  const code = candidate.notice_period_code;
  if (code === null || code === undefined || code === "" || code === 0 || code === "0") {
    return "Immediate Joiner";
  }
  return NOTICE_PERIOD_LABELS[code] || "--";
};

const formatSalaryValue = (candidate) => {
  const rawValue = candidate.expected_salary;
  if (rawValue === null || rawValue === undefined || rawValue === "") return "--";
  const numberValue = Number(String(rawValue).replace(/,/g, ""));
  if (Number.isNaN(numberValue)) return "--";
  const lacValue = numberValue < 1000 ? numberValue : numberValue / 100000;
  const normalized = Number.isInteger(lacValue) ? `${lacValue}` : `${lacValue.toFixed(1)}`.replace(/\.0$/, "");
  return `${normalized} Lac`;
};

const formatLocationValue = (candidate) => {
  const city = (candidate.current_city || "").trim();
  const country = (candidate.country || "").trim();
  const fallback = (candidate.location || "").trim();
  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  if (fallback) return fallback;
  return "--";
};

const buildTitleLine = (candidate) => {
  const title = (candidate.current_title || candidate.role || candidate.title || "").trim();
  const company = (candidate.current_company || candidate.company || "").trim();
  if (title && company) return `${title} at ${company}`;
  return title || company || "";
};

const formatMonthYear = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const toText = (value) => (typeof value === "string" ? value.trim() : "");

const formatEmploymentDuration = (startDate, endDate, isCurrent) => {
  const startLabel = formatMonthYear(startDate);
  const endLabel = formatMonthYear(endDate);
  if (isCurrent && startLabel) return `${startLabel} to Present`;
  if (startLabel && endLabel) return `${startLabel} to ${endLabel}`;
  return startLabel || endLabel || "";
};

const formatEmploymentLine = ({ title, company, startDate, endDate, isCurrent } = {}) => {
  const safeTitle = toText(title);
  const safeCompany = toText(company);
  const duration = formatEmploymentDuration(startDate, endDate, isCurrent);
  if (!safeTitle && !safeCompany && !duration) return "";
  return [safeTitle || "--", safeCompany || "--", duration || "--"].join(" | ");
};

const formatEducationLine = (education) => {
  if (!education || typeof education !== "object") return "";
  const degree = toText(getEducationLabel(education.degree) || education.degree);
  const institution = toText(education.institution);
  const year = education.end_year || education.start_year;
  const values = [degree, institution, year].filter(Boolean);
  return values.join(" | ");
};

export default function ResultsList({
  appliedFilters,
  isLoading,
  results,
  onViewProfile,
  onViewResume,
}) {
  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  if (!appliedFilters) {
    return (
      <Card>
        <p className="text-sm text-ink-faint">Results will appear here</p>
      </Card>
    );
  }

  if (!results.length) {
    return (
      <Card>
        <p className="text-sm text-ink-faint">No candidates match these filters yet.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((candidate) => {
        const fullName = candidate.full_name || "Candidate";
        const titleLine = buildTitleLine(candidate);
        const experienceValue = formatExperienceValue(candidate);
        const noticePeriodValue = formatNoticePeriodValue(candidate);
        const salaryValue = formatSalaryValue(candidate);
        const locationValue = formatLocationValue(candidate);
        const profileImage =
          candidate.profile_image_url || candidate.profile_image || candidate.avatar_url;
        const resumeUrl =
          candidate.resume_url || candidate.resume_link || candidate.resume;
        const hasResume = Boolean(resumeUrl);
        const activitySource =
          candidate.last_active_at || candidate.last_updated || candidate.updated_at;
        const activityLabel = formatRelativeDays(activitySource);
        const employments = Array.isArray(candidate.employments) ? candidate.employments : [];
        const hasCurrentEmployment = employments.some((item) => item?.is_current);
        const currentEmployment = hasCurrentEmployment
          ? employments.find((item) => item?.is_current) || null
          : employments[0] || null;
        const pastEmployment = hasCurrentEmployment
          ? employments.find((item) => !item?.is_current) || null
          : employments.length > 1
            ? employments[1]
            : null;
        const currentSectionValue = formatEmploymentLine({
          title: candidate.current_title || currentEmployment?.title,
          company: candidate.current_company || currentEmployment?.company,
          startDate: candidate.current_start_date || currentEmployment?.start_date,
          endDate: candidate.current_end_date || currentEmployment?.end_date,
          isCurrent: candidate.current_is_current ?? currentEmployment?.is_current,
        });
        const pastSectionValue = pastEmployment
          ? formatEmploymentLine({
            title: pastEmployment.title,
            company: pastEmployment.company,
            startDate: pastEmployment.start_date,
            endDate: pastEmployment.end_date,
            isCurrent: pastEmployment.is_current,
          })
          : "";
        const skillList = Array.isArray(candidate.skills)
          ? candidate.skills.filter((skill) => typeof skill === "string" && skill.trim())
          : [];
        const skillLimit = 6;
        const visibleSkills = skillList.slice(0, skillLimit);
        const hiddenSkillCount = Math.max(skillList.length - visibleSkills.length, 0);
        const skillsSectionValue = visibleSkills.length
          ? `${visibleSkills.join(", ")}${hiddenSkillCount ? ` +${hiddenSkillCount} more` : ""}`
          : "";
        const preferredLocations = Array.isArray(candidate.preferred_locations)
          ? candidate.preferred_locations
            .filter((location) => typeof location === "string" && location.trim())
            .map((location) => location.trim())
          : [];
        const preferredLocationValue = preferredLocations.join(", ");
        const educationList = Array.isArray(candidate.educations) ? candidate.educations : [];
        const educationSectionValue = formatEducationLine(educationList[0]);
        const sectionRows = [
          { key: "current", label: "Current:", value: currentSectionValue },
          { key: "past", label: "Past:", value: pastSectionValue },
          { key: "skills", label: "Skills:", value: skillsSectionValue },
          { key: "prefLocation", label: "Pref. location:", value: preferredLocationValue },
          { key: "education", label: "Education:", value: educationSectionValue },
        ].filter((item) => item.value);

        return (
          <Card key={candidate.id} className="space-y-4 p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={fullName}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-2 text-lg font-semibold text-ink">
                    {fullName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-ink">{fullName}</h3>
                  <p className="text-sm text-ink-faint">
                    {titleLine || "--"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {activityLabel ? (
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Active {activityLabel}
                  </span>
                ) : null}
                <Button
                  size="sm"
                  onClick={() => onViewProfile(candidate.id)}
                >
                  View Profile
                </Button>
              </div>
            </div>

            <CandidateMetaRow
              items={[
                { id: "exp", icon: ExperienceIcon, value: `Exp: ${experienceValue}` },
                {
                  id: "np",
                  icon: NoticePeriodIcon,
                  value:
                    noticePeriodValue === "Immediate Joiner" ? (
                      <span className="text-danger">NP: {noticePeriodValue}</span>
                    ) : (
                      `NP: ${noticePeriodValue}`
                    ),
                },
                {
                  id: "salary",
                  icon: SalaryIcon,
                  value: salaryValue === "--"
                    ? "Sal: --"
                    : `Sal: ${candidate.salary_currency === "INR" || !candidate.salary_currency ? "₹ " : `${candidate.salary_currency} `}${salaryValue}`,
                },
                { id: "location", icon: LocationIcon, value: `Loc: ${locationValue}` },
              ]}
            />

            {sectionRows.length ? (
              <div className="space-y-1.5">
                {sectionRows.map((section) => (
                  <p key={section.key} className="text-sm leading-6 text-ink-soft">
                    <span className="font-semibold text-ink">{section.label}</span>{" "}
                    <span className="break-words">{section.value}</span>
                  </p>
                ))}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={!hasResume}
                title={hasResume ? "Open resume" : "No resume"}
                onClick={() => {
                  if (hasResume) onViewResume?.(resumeUrl);
                }}
              >
                Resume
              </Button>
              <Button variant="ghost" size="sm">Shortlist</Button>
              <Button variant="ghost" size="sm">Add Note</Button>
              <Button variant="ghost" size="sm">Save to Folder</Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
