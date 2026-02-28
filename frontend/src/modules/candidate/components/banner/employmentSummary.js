export const buildEmploymentHeadline = (title, company) => {
  const safeTitle = (title || "").trim();
  const safeCompany = (company || "").trim();
  if (safeTitle && safeCompany) {
    return `${safeTitle} at ${safeCompany}`;
  }
  return safeTitle || safeCompany || "";
};
