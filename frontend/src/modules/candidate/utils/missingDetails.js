const DEFAULT_LABELS = {
  personal_full_name: "Add full name",
  personal_email: "Add email address",
  personal_phone: "Add phone number",
  personal_location: "Add location",
  work_status: "Add work status",
  availability: "Add availability",
  summary: "Add summary",
  skills: "Add key skills",
  employment: "Add employment history",
  education: "Add education details",
  projects: "Add project details",
  resume: "Upload resume",
};

const DEFAULT_PERCENTS = {
  personal_full_name: 5,
  personal_email: 5,
  personal_phone: 5,
  personal_location: 5,
  work_status: 5,
  availability: 5,
  summary: 15,
  skills: 15,
  employment: 15,
  education: 15,
  projects: 5,
  resume: 10,
};

const formatLabel = (key) => {
  if (!key) {
    return "Add missing details";
  }
  return DEFAULT_LABELS[key] || key.split("_").join(" ");
};

const formatPercent = (key) => DEFAULT_PERCENTS[key] ?? 0;

export const normalizeMissingDetails = (details = []) => {
  if (!Array.isArray(details)) return [];
  return details.map((item) => {
    const key = item?.key;
    if (!key) return item;
    const label = item.label || item.missing_field_label || formatLabel(key);
    const percent = item.percent ?? item.missing_percent ?? formatPercent(key);
    return {
      ...item,
      key,
      label,
      percent,
      missing_field_label: label,
      missing_percent: percent,
    };
  });
};
