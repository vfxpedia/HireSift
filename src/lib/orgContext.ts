import { load, save } from "../api/storage";

export interface OrgOption {
  id: string;
  name: string;
  type: "startup" | "agency" | "outsourcing";
  seats: number;
}

export const ORGANIZATIONS: OrgOption[] = [
  { id: "techcorp", name: "TechCorp Hiring", type: "startup", seats: 8 },
  { id: "acme", name: "Acme Recruiting Agency", type: "agency", seats: 24 },
  { id: "northlab", name: "NorthLab Outsourcing", type: "outsourcing", seats: 12 },
];

const KEY = "currentOrg";

export function getCurrentOrgId(): string {
  return load<string>(KEY, ORGANIZATIONS[0].id);
}

export function getCurrentOrg(): OrgOption {
  const id = getCurrentOrgId();
  return ORGANIZATIONS.find((o) => o.id === id) ?? ORGANIZATIONS[0];
}

export function setCurrentOrgId(id: string) {
  save(KEY, id);
}
