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

const GENDER_OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
  { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" },
];

const MARITAL_STATUS_OPTIONS = [
  { label: "Single", value: "SINGLE" },
  { label: "Married", value: "MARRIED" },
  { label: "Divorced", value: "DIVORCED" },
  { label: "Widowed", value: "WIDOWED" },
  { label: "Prefer not to say", value: "PREFER_NOT_TO_SAY" },
];

const PROJECT_STATUS_OPTIONS = [
  { label: "In progress", value: "IN_PROGRESS" },
  { label: "Finished", value: "FINISHED" },
];

const EDUCATION_LABELS = {
  DOCTORATE_PHD: "Doctorate/PhD",
  MASTERS_POST_GRADUATION: "Masters/Post-Graduation",
  GRADUATION_DIPLOMA: "Graduation/Diploma",
  TWELFTH: "12th",
  TENTH: "10th",
  BELOW_TENTH: "Below 10th",
};

const EDUCATION_VALUE_ORDER = [
  "DOCTORATE_PHD",
  "MASTERS_POST_GRADUATION",
  "GRADUATION_DIPLOMA",
  "TWELFTH",
  "TENTH",
  "BELOW_TENTH",
];

const EDUCATION_OPTIONS = EDUCATION_VALUE_ORDER.map((value) => ({
  value,
  label: EDUCATION_LABELS[value],
}));

const COURSE_TYPE_LABELS = {
  FULL_TIME: "Full time",
  PART_TIME: "Part time",
  DISTANCE_LEARNING: "Correspondence/Distance learning",
};

const COURSE_TYPE_VALUE_ORDER = ["FULL_TIME", "PART_TIME", "DISTANCE_LEARNING"];

const COURSE_TYPE_OPTIONS = COURSE_TYPE_VALUE_ORDER.map((value) => ({
  value,
  label: COURSE_TYPE_LABELS[value],
}));

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

const toSentenceCaseWords = (value) =>
  value
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map((word) => {
      if (/^\d+(st|nd|rd|th)$/.test(word) || /^\d+$/.test(word)) return word;
      return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
    })
    .join(" ");

const formatEnumLabel = (value) => {
  if (value === null || value === undefined) return "";
  const raw = String(value).trim();
  if (!raw) return "";
  return toSentenceCaseWords(raw.replace(/[_-]+/g, " "));
};

const getEducationLabel = (value) => {
  if (value === null || value === undefined) return "";
  const raw = String(value).trim();
  if (!raw) return "";
  const normalized = raw.toUpperCase();
  return EDUCATION_LABELS[normalized] || formatEnumLabel(raw);
};

const getCourseTypeLabel = (value) => {
  if (value === null || value === undefined) return "";
  const raw = String(value).trim();
  if (!raw) return "";
  const normalized = raw.toUpperCase();
  return COURSE_TYPE_LABELS[normalized] || formatEnumLabel(raw);
};

export {
  WORK_STATUS_OPTIONS,
  AVAILABILITY_OPTIONS,
  GENDER_OPTIONS,
  MARITAL_STATUS_OPTIONS,
  PROJECT_STATUS_OPTIONS,
  EDUCATION_LABELS,
  EDUCATION_OPTIONS,
  COURSE_TYPE_LABELS,
  COURSE_TYPE_OPTIONS,
  MONTH_OPTIONS,
  getYearOptions,
  mapLegacyValue,
  getLabelForValue,
  formatEnumLabel,
  getEducationLabel,
  getCourseTypeLabel,
};
