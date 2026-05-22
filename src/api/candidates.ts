import type {
  Candidate,
  SubmissionStatus,
  AttentionLevel,
  VerificationType,
} from "../types";
import { db } from "./db";
import { formatDate, nextCandidateCode, uid } from "../lib/format";
import { addAudit } from "./audit";

export interface CreateCandidateInput {
  name: string;
  email: string;
  role: string;
  reviewer?: string;
  verificationType?: VerificationType;
  dueDate?: string;
  inviteNote?: string;
  isDemo?: boolean;
}

export function listCandidates(): Candidate[] {
  return db.getCandidates();
}

export function getCandidate(id: string): Candidate | undefined {
  return db.getCandidates().find((c) => c.id === id);
}

export function getCandidateByCode(code: string): Candidate | undefined {
  return db.getCandidates().find((c) => c.code === code);
}

export function createCandidate(input: CreateCandidateInput): Candidate {
  const list = db.getCandidates();
  const code = nextCandidateCode(list.map((c) => c.code));
  const c: Candidate = {
    id: uid(),
    code,
    name: input.name.trim(),
    email: input.email.trim(),
    role: input.role.trim(),
    reviewer: input.reviewer,
    submissionStatus: "pending",
    attentionLevel: "low",
    lastUpdated: formatDate(),
    reportReady: false,
    createdAt: new Date().toISOString(),
    verificationType: input.verificationType ?? "full",
    dueDate: input.dueDate,
    inviteNote: input.inviteNote,
    linkSent: false,
    isDemo: input.isDemo,
  };
  db.setCandidates([c, ...list]);
  addAudit({
    action: "Verification Request Created",
    user: "Admin",
    candidate: code,
    type: "request",
  });
  return c;
}

export function updateCandidate(id: string, patch: Partial<Candidate>): Candidate | undefined {
  const list = db.getCandidates();
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) return undefined;
  const next: Candidate = { ...list[idx], ...patch, lastUpdated: formatDate() };
  list[idx] = next;
  db.setCandidates(list);
  return next;
}

export function setSubmissionStatus(id: string, status: SubmissionStatus): Candidate | undefined {
  return updateCandidate(id, { submissionStatus: status });
}

export function setAttention(id: string, level: AttentionLevel): Candidate | undefined {
  return updateCandidate(id, { attentionLevel: level });
}

export function setReportReady(id: string, ready: boolean): Candidate | undefined {
  return updateCandidate(id, { reportReady: ready, submissionStatus: ready ? "report-ready" : "reviewed" });
}

export function markLinkSent(id: string): Candidate | undefined {
  return updateCandidate(id, { linkSent: true });
}

export function dashboardStats() {
  const list = db.getCandidates();
  return {
    total: list.length,
    pending: list.filter((c) => c.submissionStatus === "pending" || c.submissionStatus === "in-progress").length,
    reportsReady: list.filter((c) => c.reportReady).length,
    highAttention: list.filter((c) => c.attentionLevel === "high" || c.attentionLevel === "manual").length,
  };
}

export function attentionDistribution() {
  const list = db.getCandidates();
  const buckets = { low: 0, medium: 0, high: 0, manual: 0 } as Record<AttentionLevel, number>;
  list.forEach((c) => (buckets[c.attentionLevel] += 1));
  return [
    { name: "Low Attention", value: buckets.low, color: "#2F7D7E" },
    { name: "Review Recommended", value: buckets.medium + buckets.high, color: "#C6923A" },
    { name: "Manual Review", value: buckets.manual, color: "#172033" },
  ];
}
