export function formatDate(d: Date | string = new Date()): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(d: Date | string = new Date()): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return (
    date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) +
    " " +
    date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
  );
}

export function nextCandidateCode(existing: string[]): string {
  const year = new Date().getFullYear();
  const prefix = `HS-${year}-`;
  const nums = existing
    .filter((c) => c.startsWith(prefix))
    .map((c) => parseInt(c.slice(prefix.length), 10))
    .filter((n) => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 40) + 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

export function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}
