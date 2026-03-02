import { formatINR } from "@/shared/utils/formatINR";

export function handleSalaryInputChange({ event, field, ref, safeFilters, setFilters }) {
  const input = event.target;
  const prevValue = input.value;
  const prevPos = input.selectionStart ?? prevValue.length;
  const prevCommas = (prevValue.match(/,/g) || []).length;
  const rawDigits = prevValue.replace(/[^\d]/g, "");
  const nextRaw = rawDigits.slice(0, 9);
  const nextDisplay = formatINR(nextRaw);
  const nextCommas = (nextDisplay.match(/,/g) || []).length;
  setFilters({ ...safeFilters, [field]: nextRaw });
  requestAnimationFrame(() => {
    const el = ref.current;
    if (!el) return;
    const delta = nextCommas - prevCommas;
    const nextPos = Math.max(0, prevPos + delta);
    el.setSelectionRange(nextPos, nextPos);
  });
}
