import type {
  Candidate,
  AuditEntry,
  TrustReport,
  ReviewerData,
  OrgSettings,
} from "../types";

export const SEED_CANDIDATES: Candidate[] = [
  { id: "1", code: "HS-2026-041", name: "Alex Kim", email: "alex.kim@example.com", role: "Senior Frontend Developer", submissionStatus: "report-ready", attentionLevel: "medium", reviewer: "Sarah Chen", lastUpdated: "May 21, 2026", reportReady: true, createdAt: "2026-05-15T09:00:00Z" },
  { id: "2", code: "HS-2026-042", name: "Jordan Lee", email: "jordan.lee@example.com", role: "Backend Engineer", submissionStatus: "reviewed", attentionLevel: "low", reviewer: "Marcus Webb", lastUpdated: "May 20, 2026", reportReady: true, createdAt: "2026-05-14T09:00:00Z" },
  { id: "3", code: "HS-2026-043", name: "Priya Nair", email: "priya.nair@example.com", role: "UI/UX Designer", submissionStatus: "submitted", attentionLevel: "high", reviewer: "Sarah Chen", lastUpdated: "May 19, 2026", reportReady: false, createdAt: "2026-05-13T09:00:00Z" },
  { id: "4", code: "HS-2026-044", name: "David Park", email: "david.park@example.com", role: "Full Stack Developer", submissionStatus: "in-progress", attentionLevel: "low", lastUpdated: "May 18, 2026", reportReady: false, createdAt: "2026-05-12T09:00:00Z" },
  { id: "5", code: "HS-2026-045", name: "Emma Torres", email: "emma.torres@example.com", role: "Product Designer", submissionStatus: "pending", attentionLevel: "low", lastUpdated: "May 17, 2026", reportReady: false, createdAt: "2026-05-11T09:00:00Z" },
  { id: "6", code: "HS-2026-046", name: "Liam Nguyen", email: "liam.nguyen@example.com", role: "DevOps Engineer", submissionStatus: "reviewed", attentionLevel: "low", reviewer: "Marcus Webb", lastUpdated: "May 16, 2026", reportReady: true, createdAt: "2026-05-10T09:00:00Z" },
];

export const SEED_AUDIT: AuditEntry[] = [
  { id: "a1", action: "Report Generated", user: "Sarah Chen", candidate: "HS-2026-041", time: "May 21, 2026 14:32", type: "report" },
  { id: "a2", action: "Review Submitted", user: "Marcus Webb", candidate: "HS-2026-042", time: "May 20, 2026 11:15", type: "review" },
  { id: "a3", action: "Candidate Submitted", user: "System", candidate: "HS-2026-043", time: "May 19, 2026 09:48", type: "submission" },
  { id: "a4", action: "Verification Request Created", user: "Admin", candidate: "HS-2026-044", time: "May 18, 2026 16:22", type: "request" },
  { id: "a5", action: "Consent Recorded", user: "System", candidate: "HS-2026-043", time: "May 19, 2026 09:30", type: "consent" },
  { id: "a6", action: "Report Shared", user: "Sarah Chen", candidate: "HS-2026-042", time: "May 20, 2026 14:05", type: "share" },
];

export const SEED_REVIEWS: ReviewerData[] = [
  {
    candidateId: "1",
    notes:
      "Identity and session signals are consistent. The main area of attention is the GitHub account age (8 months) relative to the candidate's claimed 4+ years of frontend development experience. This is not a disqualifying signal — the account may be a recently created public profile. A short portfolio walkthrough to discuss contributed projects is recommended.",
    recommendedAction: "portfolio-walkthrough",
    signalNotes: {},
    reviewer: "Sarah Chen",
    reviewedAt: "2026-05-21T14:32:00Z",
  },
];

export const SEED_REPORTS: TrustReport[] = [
  {
    candidateId: "1",
    generatedAt: "2026-05-21T14:32:00Z",
    reviewer: "Sarah Chen",
    recommendedAction: "portfolio-walkthrough",
    recommendedActionTitle: "Request Portfolio Walkthrough",
    recommendedActionDetail:
      "A short portfolio walkthrough call is recommended before final review. The GitHub account age is shorter than expected for a claimed senior role, and a brief discussion of contributed projects would help confirm ownership and context.",
    reviewerNotes:
      "Identity and session signals are consistent. The main area of attention is the GitHub account age (8 months) relative to the candidate's claimed 4+ years of frontend development experience. This is not a disqualifying signal — the account may be a recently created public profile. A short portfolio walkthrough to discuss contributed projects is recommended.",
    summary: {
      identity: "low",
      portfolio: "medium",
      session: "low",
      mediaQuality: "low",
      manualReview: "manual",
    },
    signalMatrix: [
      { area: "Basic identity", signal: "Name consistency", status: "low", evidence: "Matches across all submitted fields", note: "" },
      { area: "Portfolio accounts", signal: "Account age — GitHub", status: "medium", evidence: "8 months old", note: "Short for claimed senior experience" },
      { area: "Masked document", signal: "Document type visible", status: "low", evidence: "Professional certificate (masked)", note: "" },
      { area: "Selfie sample", signal: "Face consistency", status: "low", evidence: "Clear, stable, consistent", note: "" },
      { area: "Voice sample", signal: "Voice consistency", status: "low", evidence: "Clear audio, no anomalies", note: "" },
      { area: "Public profile", signal: "Digital footprint", status: "low", evidence: "LinkedIn 3 years, active", note: "" },
      { area: "Reviewer", signal: "Manual review notes", status: "medium", evidence: "Reviewed by Sarah Chen", note: "Portfolio walkthrough recommended" },
    ],
    portfolio: [
      { platform: "GitHub", url: "github.com/alexkim-dev", age: "8 months", activity: "142 commits", status: "medium", note: "Account age shorter than claimed experience" },
      { platform: "LinkedIn", url: "linkedin.com/in/alex-kim-fe", age: "3 years", activity: "500+ connections", status: "low" },
      { platform: "Personal Website", url: "alexkimdev.com", age: "1 year", activity: "Portfolio projects", status: "low" },
    ],
  },
];

export const DEFAULT_CONSENT_TEMPLATE = `HireSift Verification Consent

HireSift helps the hiring team review identity and portfolio consistency in remote hiring. This process does not automatically determine your hiring result.

Your submitted information is used only for verification review and will be handled according to the stated retention policy. You may request deletion at any time.

What is collected: Basic information, portfolio links, masked document, selfie video sample, voice sample.

What is NOT done: Automatic rejection, lie detection, emotion analysis, biometric profiling.`;

export const SEED_ORG: OrgSettings = {
  name: "TechCorp Hiring",
  contactEmail: "hiring@techcorp.com",
  timeZone: "Asia/Seoul (KST)",
  retention: {
    submission: "90 days",
    media: "30 days",
    reports: "1 year",
    auditLogs: "2 years",
  },
  consentTemplate: DEFAULT_CONSENT_TEMPLATE,
  consentTemplateUpdatedAt: "2026-05-21T00:00:00Z",
  consentTemplateVersion: "1.2",
};

export const WEEKLY_DATA = [
  { day: "Mon", submissions: 2, reviews: 1 },
  { day: "Tue", submissions: 3, reviews: 2 },
  { day: "Wed", submissions: 1, reviews: 3 },
  { day: "Thu", submissions: 4, reviews: 2 },
  { day: "Fri", submissions: 2, reviews: 4 },
];

export const REVIEWERS = ["Sarah Chen", "Marcus Webb"];
