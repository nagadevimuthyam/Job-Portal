export const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-US", {
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
