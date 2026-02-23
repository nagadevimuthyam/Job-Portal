export const formatINR = (value) => {
  if (!value) return "";
  const digits = String(value).replace(/[^\d]/g, "");
  if (digits.length <= 3) return digits;
  const last3 = digits.slice(-3);
  const rest = digits.slice(0, -3);
  const restGrouped = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return `${restGrouped},${last3}`;
};
