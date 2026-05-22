export type AttentionLevel = "low" | "medium" | "high" | "manual";

export type SubmissionStatus =
  | "pending"
  | "in-progress"
  | "submitted"
  | "reviewed"
  | "report-ready";

export type RecommendedAction =
  | "no-action"
  | "verification-call"
  | "portfolio-walkthrough"
  | "additional-doc"
  | "manual-review";

export type AuditType =
  | "report"
  | "review"
  | "submission"
  | "request"
  | "consent"
  | "share";

export type VerificationType = "full" | "identity-only" | "portfolio-only";

export interface Candidate {
  id: string;
  code: string;
  name: string;
  email: string;
  role: string;
  submissionStatus: SubmissionStatus;
  attentionLevel: AttentionLevel;
  reviewer?: string;
  lastUpdated: string;
  reportReady: boolean;
  createdAt: string;
  verificationType?: VerificationType;
  dueDate?: string;
  inviteNote?: string;
  linkSent?: boolean;
  /** Marks a candidate created by the /verify demo intro screen. */
  isDemo?: boolean;
}

export interface PortfolioLink {
  platform: string;
  url: string;
}

export interface BasicInfo {
  fullName: string;
  email: string;
  country: string;
  linkedin?: string;
}

export interface MediaAsset {
  dataUrl: string;
  mimeType: string;
  size: number;
  fileName?: string;
  durationSec?: number;
  /**
   * True when the candidate skipped capture (e.g. denied camera/mic
   * access during the demo) and we recorded a placeholder so the
   * downstream flow can still proceed.
   */
  placeholder?: boolean;
}

export interface CandidateSubmission {
  candidateId: string;
  step: number;
  consent: { agreed: boolean; agreedAt?: string };
  basicInfo?: BasicInfo;
  portfolio: PortfolioLink[];
  document?: MediaAsset;
  selfie?: MediaAsset;
  voice?: MediaAsset;
  submittedAt?: string;
  reference?: string;
}

export interface ReviewerData {
  candidateId: string;
  notes: string;
  recommendedAction: RecommendedAction;
  signalNotes: Record<string, string>;
  reviewedAt?: string;
  reviewer?: string;
}

export interface SignalRow {
  area: string;
  signal: string;
  status: AttentionLevel;
  evidence: string;
  note: string;
}

export interface PortfolioProvenance {
  platform: string;
  url: string;
  age: string;
  activity: string;
  status: AttentionLevel;
  note?: string;
}

export interface TrustReport {
  candidateId: string;
  generatedAt: string;
  reviewer: string;
  recommendedAction: RecommendedAction;
  recommendedActionTitle: string;
  recommendedActionDetail: string;
  reviewerNotes: string;
  summary: {
    identity: AttentionLevel;
    portfolio: AttentionLevel;
    session: AttentionLevel;
    mediaQuality: AttentionLevel;
    manualReview: AttentionLevel;
  };
  signalMatrix: SignalRow[];
  portfolio: PortfolioProvenance[];
}

export interface AuditEntry {
  id: string;
  action: string;
  user: string;
  candidate: string;
  time: string;
  type: AuditType;
}

export interface OrgSettings {
  name: string;
  contactEmail: string;
  timeZone: string;
  retention: {
    submission: string;
    media: string;
    reports: string;
    auditLogs: string;
  };
  consentTemplate: string;
  consentTemplateUpdatedAt?: string;
  consentTemplateVersion?: string;
}
