import type { CandidateSubmission, MediaAsset, PortfolioLink, BasicInfo } from "../types";
import { db } from "./db";
import { formatDate } from "../lib/format";
import { setSubmissionStatus } from "./candidates";
import { addAudit } from "./audit";

const EMPTY = (candidateId: string): CandidateSubmission => ({
  candidateId,
  step: 0,
  consent: { agreed: false },
  portfolio: [],
});

export function getSubmission(candidateId: string): CandidateSubmission {
  const list = db.getSubmissions();
  return list.find((s) => s.candidateId === candidateId) ?? EMPTY(candidateId);
}

function persist(sub: CandidateSubmission) {
  const list = db.getSubmissions();
  const idx = list.findIndex((s) => s.candidateId === sub.candidateId);
  if (idx === -1) list.push(sub);
  else list[idx] = sub;
  db.setSubmissions(list);
}

export function updateSubmission(
  candidateId: string,
  patch: Partial<CandidateSubmission>,
): CandidateSubmission {
  const current = getSubmission(candidateId);
  const next: CandidateSubmission = { ...current, ...patch };
  persist(next);
  if (current.step === 0 && (patch.step ?? 0) > 0) {
    setSubmissionStatus(candidateId, "in-progress");
  }
  return next;
}

export function setStep(candidateId: string, step: number) {
  return updateSubmission(candidateId, { step });
}

export function recordConsent(candidateId: string, agreed: boolean) {
  const next = updateSubmission(candidateId, {
    consent: { agreed, agreedAt: agreed ? new Date().toISOString() : undefined },
  });
  if (agreed) {
    const code = lookupCode(candidateId);
    if (code)
      addAudit({ action: "Consent Recorded", user: "System", candidate: code, type: "consent" });
  }
  return next;
}

export function saveBasicInfo(candidateId: string, info: BasicInfo) {
  return updateSubmission(candidateId, { basicInfo: info });
}

export function savePortfolio(candidateId: string, links: PortfolioLink[]) {
  return updateSubmission(candidateId, { portfolio: links });
}

export function saveDocument(candidateId: string, asset: MediaAsset) {
  return updateSubmission(candidateId, { document: asset });
}

export function saveSelfie(candidateId: string, asset: MediaAsset) {
  return updateSubmission(candidateId, { selfie: asset });
}

export function saveVoice(candidateId: string, asset: MediaAsset) {
  return updateSubmission(candidateId, { voice: asset });
}

export function finalizeSubmission(candidateId: string): CandidateSubmission {
  const code = lookupCode(candidateId);
  const reference = code ? `${code}` : `HS-${formatDate()}`;
  const next = updateSubmission(candidateId, {
    submittedAt: new Date().toISOString(),
    reference,
    step: 7,
  });
  setSubmissionStatus(candidateId, "submitted");
  if (code) {
    addAudit({ action: "Candidate Submitted", user: "System", candidate: code, type: "submission" });
  }
  return next;
}

function lookupCode(candidateId: string): string | undefined {
  return db.getCandidates().find((c) => c.id === candidateId)?.code;
}
