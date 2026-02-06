export default function parseApiErrors(err) {
  const data = err?.data;
  if (!data) return {};

  if (typeof data === "string") {
    return { _error: data };
  }

  if (data.detail && typeof data.detail === "string") {
    return { _error: data.detail };
  }

  if (data.detail && typeof data.detail === "object") {
    return normalizeErrors(data.detail);
  }

  return normalizeErrors(data);
}

function normalizeErrors(payload) {
  if (!payload || typeof payload !== "object") return {};
  const result = {};
  Object.entries(payload).forEach(([field, value]) => {
    if (Array.isArray(value)) {
      result[field] = value[0];
      return;
    }
    if (typeof value === "string") {
      result[field] = value;
      return;
    }
    if (value && typeof value === "object") {
      const nested = normalizeErrors(value);
      if (Object.keys(nested).length) {
        result[field] = Object.values(nested)[0];
      }
    }
  });
  return result;
}
