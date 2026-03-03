const NOTICE_LABELS = {
  IMMEDIATE_JOINER: "Immediate joiner",
  IMMEDIATE: "Immediate joiner",
  "15_DAYS_OR_LESS": "15 days",
  "1_MONTH": "1 month",
  "2_MONTHS": "2 months",
  "3_MONTHS": "3 months",
  MORE_THAN_3_MONTHS: "More than 3 months",
};

const toText = (value) => (value === null || value === undefined ? "" : String(value).trim());

const parseCsv = (value) =>
  toText(value)
    .split(",")
    .map((token) => token.trim())
    .filter(Boolean);

const formatExperience = (min, max) => {
  const minText = toText(min);
  const maxText = toText(max);
  if (!minText && !maxText) return "";
  if (minText && maxText) return `${minText}-${maxText} yrs`;
  if (minText) return `${minText}+ yrs`;
  return `Up to ${maxText} yrs`;
};

const formatSalary = (min, max) => {
  const minText = toText(min);
  const maxText = toText(max);
  if (!minText && !maxText) return "";
  if (minText && maxText) return `${minText}-${maxText}`;
  if (minText) return `${minText}+`;
  return `Up to ${maxText}`;
};

const truncateWithMore = (text, maxLength = 92) => {
  const normalized = toText(text);
  if (normalized.length <= maxLength) return normalized;
  const shortened = normalized.slice(0, maxLength).trim().replace(/[.,;:-]+$/, "");
  return `${shortened} ...more`;
};

export const buildSearchSummary = (filters = {}) => {
  const parts = [];
  const keyword = toText(filters.keywords || filters.keyword || filters.job_title);
  if (keyword) parts.push(keyword);

  const skills = parseCsv(filters.skills).slice(0, 3);
  if (skills.length) parts.push(skills.join(", "));

  const location = toText(filters.location);
  if (location) parts.push(location);

  const experience = formatExperience(filters.exp_min, filters.exp_max);
  if (experience) parts.push(experience);

  const salary = formatSalary(filters.salary_min, filters.salary_max);
  if (salary) parts.push(salary);

  const noticeCode = toText(filters.notice_period_code).toUpperCase();
  if (noticeCode) {
    parts.push(NOTICE_LABELS[noticeCode] || toText(filters.notice_period_code));
  } else {
    const availability = toText(filters.availability_to_join);
    if (availability) parts.push(availability);
  }

  const gender = parseCsv(filters.gender);
  if (gender.length) parts.push(gender.join("/"));

  const employment = toText(filters.work_status || filters.employment_type);
  if (employment) parts.push(employment);

  if (!parts.length) return "Search filters";
  return truncateWithMore(parts.join(" • "));
};
