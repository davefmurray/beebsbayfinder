export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function parsePrice(raw: string | number | undefined): number | null {
  if (raw === undefined || raw === null) return null;
  if (typeof raw === "number") return raw;
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function normalizeSetNumber(input: string): string {
  const cleaned = input.trim().replace(/[^0-9-]/g, "");
  if (cleaned.includes("-")) return cleaned;
  return `${cleaned}-1`;
}

export function isValidSetNumber(input: string): boolean {
  const cleaned = input.trim().replace(/-\d+$/, "");
  return /^\d{4,7}$/.test(cleaned);
}
