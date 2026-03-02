import noticePeriodOptions from "../constants/noticePeriodOptions";
import {
  AVAILABILITY_OPTIONS,
  getLabelForValue,
} from "../constants/profileOptions";

const toTrimmed = (value) => (typeof value === "string" ? value.trim() : value);

const buildLocationParts = (profile = {}) => {
  const city = toTrimmed(profile.current_city) || toTrimmed(profile.location);
  const state = toTrimmed(profile.current_state);
  const rawCountry = toTrimmed(profile.country) || toTrimmed(profile.location_country);
  const country =
    rawCountry && rawCountry.toLowerCase() === "india" ? "INDIA" : rawCountry || "";
  return { city, state, country };
};

export function formatCandidateLocationForBanner(profile = {}) {
  const { city, state, country } = buildLocationParts(profile);
  const parts = [city, state, country].filter(Boolean);
  if (parts.length) {
    return parts.join(", ");
  }
  return "Add location";
}

export function formatCandidateLocationForCard(profile = {}) {
  const location = profile.location?.trim();
  const city = profile.current_city?.trim();
  const state = profile.current_state?.trim();
  const country = profile.country?.trim()?.toUpperCase();
  const parts = [city, state, country].filter(Boolean);
  if (parts.length) {
    return parts.join(", ");
  }
  if (location) return location;
  if (country) return country;
  return "-";
}

export function formatCandidateExperienceLabel(profile = {}) {
  const years = Number(profile.total_experience_years || 0);
  if (profile.work_status === "FRESHER" && years === 0) return "Fresher";
  if (years === 1) return "1 Year";
  return `${years} Years`;
}

export function getNoticePeriodLabel(profile = {}) {
  const raw = profile.notice_period_code;
  if (raw === null || raw === undefined || raw === "" || raw === 0 || raw === "0") {
    return "Immediate Joiner";
  }
  return (
    getLabelForValue(raw, noticePeriodOptions) ||
    getLabelForValue(profile.availability_to_join, AVAILABILITY_OPTIONS) ||
    "Add notice period"
  );
}

export function formatCandidateUpdatedAt(value) {
  if (!value) return "-";
  const dateObj = new Date(value);
  if (Number.isNaN(dateObj.getTime())) return "-";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
    .format(dateObj)
    .replace(/ /g, "")
    .replace(/(\d{2})([A-Za-z]{3}) (\d{4})/, "$1$2, $3")
    .replace(/(\d{2})([A-Za-z]{3})(\d{4})/, "$1$2, $3");
}

export function getLatestEmployment(employments = []) {
  if (!employments.length) return null;
  const current = employments.find((item) => item.is_current);
  if (current) return current;
  const sorted = [...employments].sort((a, b) => {
    const aDate = new Date(a.start_date || 0).getTime();
    const bDate = new Date(b.start_date || 0).getTime();
    return bDate - aDate;
  });
  return sorted[0];
}

export function buildCandidateEmploymentHeadline(title, company) {
  const safeTitle = (title || "").trim();
  const safeCompany = (company || "").trim();
  if (safeTitle && safeCompany) {
    return `${safeTitle} at ${safeCompany}`;
  }
  return safeTitle || safeCompany || "";
}
