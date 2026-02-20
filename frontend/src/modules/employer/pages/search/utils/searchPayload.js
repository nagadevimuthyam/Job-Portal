export const emptyFilters = {
  keywords: "",
  location: "",
  exp_min: "",
  exp_max: "",
  updated_within: "",
  salary_min: "",
  salary_max: "",
  notice_period_code: null,
  work_status: "",
  availability_to_join: "",
  education: "",
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
  const skillIds = selectedSkills
    .filter((skill) => skill.id)
    .map((skill) => skill.id)
    .join(",");
  const customSkills = selectedSkills
    .filter((skill) => !skill.id)
    .map((skill) => skill.name)
    .join(", ");

  return cleanParams({
    ...filters,
    skills: customSkills,
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
