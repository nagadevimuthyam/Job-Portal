export const normalizeSkill = (value = "") =>
  value
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

export const formatSkill = (value = "") => value.replace(/\s+/g, " ").trim();

export const dedupeSkills = (items = []) => {
  const seen = new Set();
  const next = [];
  items.forEach((item) => {
    const key = normalizeSkill(item.name);
    if (!key || seen.has(key)) return;
    seen.add(key);
    next.push(item);
  });
  return next;
};
