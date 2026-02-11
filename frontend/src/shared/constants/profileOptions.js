const WORK_STATUS_OPTIONS = [
  { label: "Fresher", value: "FRESHER" },
  { label: "Experienced", value: "EXPERIENCED" },
];

const AVAILABILITY_OPTIONS = [
  { label: "15 Days or less", value: "15_DAYS_OR_LESS" },
  { label: "1 Month", value: "1_MONTH" },
  { label: "2 Months", value: "2_MONTHS" },
  { label: "3 Months", value: "3_MONTHS" },
  { label: "More than 3 Months", value: "MORE_THAN_3_MONTHS" },
];

const PROJECT_STATUS_OPTIONS = [
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Finished", value: "FINISHED" },
];

const MONTH_OPTIONS = [
  { label: "Jan", value: "1" },
  { label: "Feb", value: "2" },
  { label: "Mar", value: "3" },
  { label: "Apr", value: "4" },
  { label: "May", value: "5" },
  { label: "Jun", value: "6" },
  { label: "Jul", value: "7" },
  { label: "Aug", value: "8" },
  { label: "Sep", value: "9" },
  { label: "Oct", value: "10" },
  { label: "Nov", value: "11" },
  { label: "Dec", value: "12" },
];

const getYearOptions = (startYear = 1970) => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= startYear; year -= 1) {
    years.push({ label: String(year), value: String(year) });
  }
  return years;
};

const mapLegacyValue = (value, options) => {
  if (!value) return "";
  const normalized = String(value).trim().toLowerCase();
  const match = options.find((option) => option.value.toLowerCase() === normalized);
  if (match) return match.value;
  const labelMatch = options.find(
    (option) => option.label.trim().toLowerCase() === normalized
  );
  return labelMatch ? labelMatch.value : value;
};

const getLabelForValue = (value, options) => {
  const match = options.find((option) => option.value === value);
  return match ? match.label : value || "";
};

export {
  WORK_STATUS_OPTIONS,
  AVAILABILITY_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  MONTH_OPTIONS,
  getYearOptions,
  mapLegacyValue,
  getLabelForValue,
};
