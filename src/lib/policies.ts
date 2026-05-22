export interface PolicyDoc {
  title: string;
  paragraphs: string[];
}

export const POLICIES: Record<string, PolicyDoc> = {
  privacy: {
    title: "Privacy Policy",
    paragraphs: [
      "HireSift collects only the information necessary to support remote hiring verification. Candidate-submitted materials (basic identification, portfolio links, masked documents, selfie video, voice sample) are processed solely to organize review signals for a human reviewer.",
      "We do not perform automatic hiring decisions, lie detection, emotion analysis, biometric profiling, or background check replacement.",
      "Candidates may request deletion of any submitted material at any time by contacting privacy@hiresift.com.",
      "Reviewer activity and report generation are recorded in an immutable audit log to support compliance and traceability.",
    ],
  },
  retention: {
    title: "Data Retention",
    paragraphs: [
      "Default retention windows are configurable in organization Settings:",
      "• Candidate submission data — 90 days",
      "• Media samples (selfie video, voice sample) — 30 days",
      "• Trust reports — 1 year",
      "• Audit logs — 2 years",
      "Candidates may request early deletion at any time. Retention windows can only be shortened (not extended beyond defaults) without explicit candidate consent.",
    ],
  },
  guardrails: {
    title: "Guardrails",
    paragraphs: [
      "HireSift is a review-assist tool, not a decision engine. Every report requires human review before any hiring outcome is determined.",
      "We avoid accusatory language by design. The product uses Attention-level vocabulary (Low / Review Recommended / Manual Review Required) rather than fraud or fake labels.",
      "No emotion, personality, or biometric inference is run on submitted media. Selfie and voice samples are used only for session consistency review.",
      "Red-warning aesthetics and automatic rejection actions are explicitly out of scope.",
    ],
  },
  about: {
    title: "About HireSift",
    paragraphs: [
      "HireSift is an AI-powered Trust Layer for remote hiring, built for startups, outsourcing companies, and recruiting agencies that face increasing uncertainty about who is actually showing up in remote interviews.",
      "Our mission is to give hiring teams structured review signals — not verdicts — so a human can quickly decide whether additional verification is warranted.",
      "Founded in 2026, headquartered remotely, optimized for English-Korean bilingual hiring workflows.",
    ],
  },
  contact: {
    title: "Contact",
    paragraphs: [
      "Sales & demos: sales@hiresift.com",
      "Privacy requests: privacy@hiresift.com",
      "Support: support@hiresift.com",
      "We respond within one business day across all channels.",
    ],
  },
};
