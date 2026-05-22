export type PolicyKey = "privacy" | "retention" | "guardrails" | "about" | "contact";

export const POLICY_KEYS: PolicyKey[] = ["privacy", "retention", "guardrails", "about", "contact"];

export const POLICY_PARAGRAPH_KEYS: Record<PolicyKey, string[]> = {
  privacy: ["p1", "p2", "p3", "p4"],
  retention: ["p1", "p2", "p3", "p4", "p5", "p6"],
  guardrails: ["p1", "p2", "p3", "p4"],
  about: ["p1", "p2", "p3"],
  contact: ["p1", "p2", "p3", "p4"],
};
