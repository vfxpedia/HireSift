const PREFIX = "hiresift:v1:";

export function load<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function save<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.warn("[hiresift] failed to persist", key, err);
  }
}

export function clearAll(): void {
  if (typeof window === "undefined") return;
  Object.keys(window.localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => window.localStorage.removeItem(k));
}
