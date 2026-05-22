import type { TrustReport, RecommendedAction, Candidate } from "../types";
import { db } from "./db";
import { getReview } from "./reviews";
import { getSubmission } from "./submissions";
import { setReportReady, setAttention } from "./candidates";
import { addAudit } from "./audit";

const ACTION_TITLE: Record<RecommendedAction, string> = {
  "no-action": "No Additional Check Needed",
  "verification-call": "Request Re-verification Call",
  "portfolio-walkthrough": "Request Portfolio Walkthrough",
  "additional-doc": "Request Additional Document",
  "manual-review": "Manual Review Required",
};

const ACTION_DETAIL: Record<RecommendedAction, string> = {
  "no-action":
    "Submitted signals are consistent. No additional verification step is recommended at this time.",
  "verification-call":
    "A short re-verification call with the candidate is recommended to confirm submitted signals before final hiring decision.",
  "portfolio-walkthrough":
    "A short portfolio walkthrough call is recommended before final review. Discuss contributed projects to help confirm ownership and context.",
  "additional-doc":
    "Please request one additional supporting document from the candidate (e.g., updated certificate or employment letter) before final review.",
  "manual-review":
    "Manual review by the hiring team is recommended before any final decision. The reviewer has flagged signals worth a closer look.",
};

export function listReports(): TrustReport[] {
  return db.getReports();
}

export function getReport(candidateId: string): TrustReport | undefined {
  return db.getReports().find((r) => r.candidateId === candidateId);
}

export function generateReport(candidate: Candidate): TrustReport {
  const review = getReview(candidate.id);
  const submission = getSubmission(candidate.id);

  const summary = {
    identity: submission.basicInfo ? ("low" as const) : ("medium" as const),
    portfolio: submission.portfolio.length >= 2 ? ("low" as const) : ("medium" as const),
    session: submission.selfie ? ("low" as const) : ("medium" as const),
    mediaQuality: submission.voice && submission.selfie ? ("low" as const) : ("medium" as const),
    manualReview:
      review.recommendedAction === "no-action" ? ("low" as const) : ("manual" as const),
  };

  const signalMatrix = [
    {
      area: "Basic identity",
      signal: "Name consistency",
      status: summary.identity,
      evidence: submission.basicInfo
        ? `Submitted as ${submission.basicInfo.fullName}`
        : "Basic information not yet provided",
      note: review.signalNotes["identity"] ?? "",
    },
    {
      area: "Portfolio accounts",
      signal: "Submitted portfolio links",
      status: summary.portfolio,
      evidence:
        submission.portfolio.length > 0
          ? `${submission.portfolio.length} link(s) provided`
          : "No portfolio link submitted",
      note: review.signalNotes["portfolio"] ?? "",
    },
    {
      area: "Masked document",
      signal: "Document type visible",
      status: submission.document ? ("low" as const) : ("medium" as const),
      evidence: submission.document
        ? submission.document.fileName ?? "Masked document uploaded"
        : "Document not uploaded",
      note: review.signalNotes["document"] ?? "",
    },
    {
      area: "Selfie sample",
      signal: "Face consistency",
      status: submission.selfie ? ("low" as const) : ("medium" as const),
      evidence: submission.selfie
        ? `Recorded · ${Math.round(submission.selfie.durationSec ?? 0)} sec`
        : "Selfie video not recorded",
      note: review.signalNotes["selfie"] ?? "",
    },
    {
      area: "Voice sample",
      signal: "Voice consistency",
      status: submission.voice ? ("low" as const) : ("medium" as const),
      evidence: submission.voice
        ? `Recorded · ${Math.round(submission.voice.durationSec ?? 0)} sec`
        : "Voice sample not recorded",
      note: review.signalNotes["voice"] ?? "",
    },
    {
      area: "Reviewer",
      signal: "Manual review notes",
      status: summary.manualReview === "manual" ? ("medium" as const) : ("low" as const),
      evidence: review.reviewer ? `Reviewed by ${review.reviewer}` : "Pending reviewer",
      note: review.notes ? "See reviewer notes" : "",
    },
  ];

  const portfolio = submission.portfolio.length
    ? submission.portfolio.map((p) => ({
        platform: p.platform,
        url: p.url.replace(/^https?:\/\//, ""),
        age: "—",
        activity: "Reviewer to verify",
        status: "low" as const,
      }))
    : [
        { platform: "GitHub", url: "github.com/—", age: "—", activity: "Not provided", status: "medium" as const, note: "No GitHub link submitted" },
        { platform: "LinkedIn", url: "linkedin.com/—", age: "—", activity: "Not provided", status: "medium" as const },
      ];

  const report: TrustReport = {
    candidateId: candidate.id,
    generatedAt: new Date().toISOString(),
    reviewer: review.reviewer ?? "Sarah Chen",
    recommendedAction: review.recommendedAction,
    recommendedActionTitle: ACTION_TITLE[review.recommendedAction],
    recommendedActionDetail: ACTION_DETAIL[review.recommendedAction],
    reviewerNotes: review.notes,
    summary,
    signalMatrix,
    portfolio,
  };

  const list = db.getReports();
  const idx = list.findIndex((r) => r.candidateId === candidate.id);
  if (idx === -1) list.push(report);
  else list[idx] = report;
  db.setReports(list);

  setReportReady(candidate.id, true);
  const inferredAttention =
    review.recommendedAction === "no-action"
      ? "low"
      : review.recommendedAction === "manual-review"
      ? "manual"
      : "medium";
  setAttention(candidate.id, inferredAttention);

  addAudit({
    action: "Report Generated",
    user: review.reviewer ?? "Sarah Chen",
    candidate: candidate.code,
    type: "report",
  });

  return report;
}
