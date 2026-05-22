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
  reseedReviews: "reseed:reviews:v2",
  reseedReports: "reseed:reports:v2",
} as const;

function ensureSeeded() {
  if (!load(KEYS.seeded, false)) {
    save(KEYS.candidates, SEED_CANDIDATES);
    save(KEYS.submissions, [] as CandidateSubmission[]);
    save(KEYS.reviews, SEED_REVIEWS);
    save(KEYS.reports, SEED_REPORTS);
    save(KEYS.audit, SEED_AUDIT);
    save(KEYS.org, SEED_ORG);
    save(KEYS.seeded, true);
  }

  // Targeted reseed for seed-candidate reviews/reports so that demos
  // recover the curated content even after a user previously overwrote
  // (e.g. saved an empty note). User-created rows for non-seed
  // candidates are preserved.
  if (!load(KEYS.reseedReviews, false)) {
    const seedIds = new Set(SEED_REVIEWS.map((r) => r.candidateId));
    const existing = load<ReviewerData[]>(KEYS.reviews, []);
    const preserved = existing.filter((r) => !seedIds.has(r.candidateId));
    save(KEYS.reviews, [...SEED_REVIEWS, ...preserved]);
    save(KEYS.reseedReviews, true);
  }

  if (!load(KEYS.reseedReports, false)) {
    const seedIds = new Set(SEED_REPORTS.map((r) => r.candidateId));
    const existing = load<TrustReport[]>(KEYS.reports, []);
    const preserved = existing.filter((r) => !seedIds.has(r.candidateId));
    save(KEYS.reports, [...SEED_REPORTS, ...preserved]);
    save(KEYS.reseedReports, true);
  }
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
