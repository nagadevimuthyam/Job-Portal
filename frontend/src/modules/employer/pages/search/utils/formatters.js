const IST_TIMEZONE = "Asia/Kolkata";

const getIstDateParts = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: IST_TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const parts = formatter.formatToParts(date);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);
  if (!year || !month || !day) return null;
  return { year, month, day };
};

const getIstTodayParts = () => getIstDateParts(Date.now());

export const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
    timeZone: IST_TIMEZONE,
    month: "short",
    day: "numeric",
    year: "numeric",
  });

export const experienceOptions = Array.from({ length: 21 }, (_, i) => i);

export const formatExperience = (value) => {
  if (value === "" || value === null || value === undefined) return "Years";
  const num = Number(value);
  if (Number.isNaN(num)) return "Years";
  return `${num} Year${num === 1 ? "" : "s"}`;
};

export const formatRelativeDays = (value) => {
  if (!value) return "";
  const activity = getIstDateParts(value);
  const today = getIstTodayParts();
  if (!activity || !today) return "";

  if (
    activity.year === today.year &&
    activity.month === today.month &&
    activity.day === today.day
  ) {
    return "today";
  }

  const activityUtc = Date.UTC(activity.year, activity.month - 1, activity.day);
  const todayUtc = Date.UTC(today.year, today.month - 1, today.day);
  const diffDays = Math.round((todayUtc - activityUtc) / 86400000);
  if (diffDays === 1) return "yesterday";
  return formatDate(value);
};
