import type { AuditEntry, AuditType } from "../types";
import { db } from "./db";
import { formatDateTime, uid } from "../lib/format";

export function listAudit(): AuditEntry[] {
  return db.getAudit();
}

export function addAudit(input: {
  action: string;
  user: string;
  candidate: string;
  type: AuditType;
}): AuditEntry {
  const entry: AuditEntry = {
    id: uid(),
    action: input.action,
    user: input.user,
    candidate: input.candidate,
    time: formatDateTime(),
    type: input.type,
  };
  const list = db.getAudit();
  db.setAudit([entry, ...list]);
  return entry;
}
