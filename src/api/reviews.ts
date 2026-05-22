import type { ReviewerData, RecommendedAction } from "../types";
import { db } from "./db";

const EMPTY = (candidateId: string): ReviewerData => ({
  candidateId,
  notes: "",
  recommendedAction: "no-action",
  signalNotes: {},
});

export function getReview(candidateId: string): ReviewerData {
  return db.getReviews().find((r) => r.candidateId === candidateId) ?? EMPTY(candidateId);
}

export function saveReview(candidateId: string, patch: Partial<ReviewerData>): ReviewerData {
  const list = db.getReviews();
  const current = list.find((r) => r.candidateId === candidateId) ?? EMPTY(candidateId);
  const next: ReviewerData = {
    ...current,
    ...patch,
    reviewer: patch.reviewer ?? current.reviewer ?? "Sarah Chen",
    reviewedAt: new Date().toISOString(),
  };
  const idx = list.findIndex((r) => r.candidateId === candidateId);
  if (idx === -1) list.push(next);
  else list[idx] = next;
  db.setReviews(list);
  return next;
}

export function setRecommendedAction(candidateId: string, action: RecommendedAction) {
  return saveReview(candidateId, { recommendedAction: action });
}

export function setNotes(candidateId: string, notes: string) {
  return saveReview(candidateId, { notes });
}
