export const emptyFilters = {
  keywords: "",
  location: "",
  exp_min: "",
  exp_max: "",
  updated_within: "6_MONTHS",
  updated_type: "active_updated",
  salary_min: "",
  salary_max: "",
  notice_period_code: null,
  work_status: "",
  availability_to_join: "",
  education: "",
  gender: [],
};

export const cleanParams = (params) => {
  const cleaned = {};
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (typeof value === "string" && value.trim() === "") return;
    cleaned[key] = value;
  });
  return cleaned;
};

export const buildSearchPayload = (filters, selectedSkills) => {
  const salaryMin = filters.salary_min
    ? String(filters.salary_min).replace(/[^\d]/g, "")
    : "";
  const salaryMax = filters.salary_max
    ? String(filters.salary_max).replace(/[^\d]/g, "")
    : "";
  const genderValue = Array.isArray(filters.gender)
    ? filters.gender.join(",")
    : filters.gender;
  const skillIds = selectedSkills
    .filter((skill) => skill.id)
    .map((skill) => skill.id)
    .join(",");
  const skillNames = selectedSkills
    .map((skill) => skill.name)
    .filter(Boolean)
    .join(", ");

  return cleanParams({
    ...filters,
    salary_min: salaryMin,
    salary_max: salaryMax,
    gender: genderValue,
    skills: skillNames,
    skill_ids: skillIds,
  });
};

export const buildSearchLabel = (filters, skills) => {
  const parts = [];
  if (filters.keywords) parts.push(filters.keywords);
  if (skills.length) parts.push(skills.map((skill) => skill.name).join(", "));
  if (filters.location) parts.push(filters.location);
  return parts.join(" · ") || "Quick search";
};
