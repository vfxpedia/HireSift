import type {
  Candidate,
  CandidateSubmission,
  ReviewerData,
  TrustReport,
  AuditEntry,
  OrgSettings,
} from "../types";
import { load, save } from "./storage";
import {
  SEED_CANDIDATES,
  SEED_AUDIT,
  SEED_REVIEWS,
  SEED_REPORTS,
  SEED_ORG,
} from "../lib/seed";

const KEYS = {
  candidates: "candidates",
  submissions: "submissions",
  reviews: "reviews",
  reports: "reports",
  audit: "audit",
  org: "org",
  seeded: "seeded",
} as const;

function ensureSeeded() {
  if (load(KEYS.seeded, false)) return;
  save(KEYS.candidates, SEED_CANDIDATES);
  save(KEYS.submissions, [] as CandidateSubmission[]);
  save(KEYS.reviews, SEED_REVIEWS);
  save(KEYS.reports, SEED_REPORTS);
  save(KEYS.audit, SEED_AUDIT);
  save(KEYS.org, SEED_ORG);
  save(KEYS.seeded, true);
}

ensureSeeded();

export const db = {
  getCandidates(): Candidate[] {
    return load<Candidate[]>(KEYS.candidates, SEED_CANDIDATES);
  },
  setCandidates(list: Candidate[]) {
    save(KEYS.candidates, list);
  },
  getSubmissions(): CandidateSubmission[] {
    return load<CandidateSubmission[]>(KEYS.submissions, []);
  },
  setSubmissions(list: CandidateSubmission[]) {
    save(KEYS.submissions, list);
  },
  getReviews(): ReviewerData[] {
    return load<ReviewerData[]>(KEYS.reviews, SEED_REVIEWS);
  },
  setReviews(list: ReviewerData[]) {
    save(KEYS.reviews, list);
  },
  getReports(): TrustReport[] {
    return load<TrustReport[]>(KEYS.reports, SEED_REPORTS);
  },
  setReports(list: TrustReport[]) {
    save(KEYS.reports, list);
  },
  getAudit(): AuditEntry[] {
    return load<AuditEntry[]>(KEYS.audit, SEED_AUDIT);
  },
  setAudit(list: AuditEntry[]) {
    save(KEYS.audit, list);
  },
  getOrg(): OrgSettings {
    return load<OrgSettings>(KEYS.org, SEED_ORG);
  },
  setOrg(org: OrgSettings) {
    save(KEYS.org, org);
  },
};
