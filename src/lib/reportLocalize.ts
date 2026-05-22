// Trust Report stores its row data as plain English strings (seed reports
// and generateReport() both predate i18n). Localizing the rendered output
// without migrating the persisted schema means looking the strings up
// against a known set of phrases at render time. Unknown strings fall
// through unchanged so user-typed reviewer notes still display.

type TFn = (key: string, options?: Record<string, unknown>) => string;

const AREA_KEY: Record<string, string> = {
  "Basic identity": "report.tableData.area.basicIdentity",
  "Basic identity information": "report.tableData.area.basicIdentity",
  "Portfolio accounts": "report.tableData.area.portfolioAccounts",
  "Portfolio account consistency": "report.tableData.area.portfolioAccounts",
  "Masked document": "report.tableData.area.maskedDocument",
  "Masked document review": "report.tableData.area.maskedDocument",
  "Selfie sample": "report.tableData.area.selfieSample",
  "Selfie sample quality": "report.tableData.area.selfieSample",
  "Voice sample": "report.tableData.area.voiceSample",
  "Voice sample quality": "report.tableData.area.voiceSample",
  "Public profile": "report.tableData.area.publicProfile",
  Reviewer: "report.tableData.area.reviewer",
};

const SIGNAL_KEY: Record<string, string> = {
  "Name consistency": "report.tableData.signal.nameConsistency",
  "Submitted portfolio links": "report.tableData.signal.submittedPortfolioLinks",
  "Portfolio links submitted": "report.tableData.signal.submittedPortfolioLinks",
  "Account age — GitHub": "report.tableData.signal.accountAgeGithub",
  "Document type visible": "report.tableData.signal.documentVisible",
  "Face consistency": "report.tableData.signal.faceConsistency",
  "Voice consistency": "report.tableData.signal.voiceConsistency",
  "Face visible, stable lighting": "report.tableData.signal.faceConsistency",
  "Clear audio, consistent voice": "report.tableData.signal.voiceConsistency",
  "Digital footprint": "report.tableData.signal.digitalFootprint",
  "Manual review notes": "report.tableData.signal.manualReviewNotes",
};

const NOTE_KEY: Record<string, string> = {
  "Short for claimed senior experience": "report.tableData.note.shortForSenior",
  "Fewer portfolio links than expected": "report.tableData.note.fewerLinksThanExpected",
  "Portfolio walkthrough recommended": "report.tableData.note.portfolioWalkthroughRecommended",
  "Account age shorter than claimed experience": "report.tableData.note.ageShorterThanClaimed",
  "See reviewer notes": "report.tableData.evidence.seeReviewerNotes",
};

const PLATFORM_KEY: Record<string, string> = {
  GitHub: "report.tableData.portfolio.platform.github",
  LinkedIn: "report.tableData.portfolio.platform.linkedin",
  "Personal Website": "report.tableData.portfolio.platform.personalWebsite",
  Website: "report.tableData.portfolio.platform.personalWebsite",
  Behance: "report.tableData.portfolio.platform.behance",
  Notion: "report.tableData.portfolio.platform.notion",
};

export function localizeArea(s: string | undefined, t: TFn): string {
  if (!s) return "";
  return s in AREA_KEY ? t(AREA_KEY[s]) : s;
}

export function localizeSignal(s: string | undefined, t: TFn): string {
  if (!s) return "";
  return s in SIGNAL_KEY ? t(SIGNAL_KEY[s]) : s;
}

export function localizeNote(s: string | undefined, t: TFn): string {
  if (!s) return "";
  return s in NOTE_KEY ? t(NOTE_KEY[s]) : s;
}

export function localizePlatform(s: string | undefined, t: TFn): string {
  if (!s) return "";
  return s in PLATFORM_KEY ? t(PLATFORM_KEY[s]) : s;
}

export function localizeEvidence(s: string | undefined, t: TFn): string {
  if (!s) return "";

  // Static phrases first (cheaper than regex)
  const STATIC: Record<string, string> = {
    "Matches across all submitted fields": "report.tableData.evidence.matchesAllFields",
    "Basic information not yet provided": "report.tableData.evidence.basicInfoMissing",
    "No portfolio link submitted": "report.tableData.evidence.noPortfolio",
    "Professional certificate (masked)": "report.tableData.evidence.professionalCertificateMasked",
    "Masked document uploaded": "report.tableData.evidence.documentMaskedUploaded",
    "Document not uploaded": "report.tableData.evidence.documentMissing",
    "Not uploaded": "report.tableData.evidence.documentMissing",
    "Selfie video not recorded": "report.tableData.evidence.selfieMissing",
    "Voice sample not recorded": "report.tableData.evidence.voiceMissing",
    "Clear, stable, consistent": "report.tableData.evidence.clearStableConsistent",
    "Clear quality, consistent face": "report.tableData.evidence.clearStableConsistent",
    "Clear audio, no anomalies": "report.tableData.evidence.clearAudioNoAnomalies",
    "Matches expected voice quality": "report.tableData.evidence.clearAudioNoAnomalies",
    "Pending reviewer": "report.tableData.evidence.pendingReviewer",
    "Reviewer to verify": "report.tableData.evidence.reviewerToVerify",
  };
  if (s in STATIC) return t(STATIC[s]);

  let m: RegExpMatchArray | null;
  if ((m = s.match(/^Submitted as (.+)$/))) {
    return t("report.tableData.evidence.submittedAs", { name: m[1] });
  }
  if ((m = s.match(/^(\d+)\s+link\(s\)\s+submitted$/i))) {
    return t("report.tableData.evidence.linksSubmitted", { count: parseInt(m[1], 10) });
  }
  if ((m = s.match(/^(\d+)\s+link\(s\)\s+provided$/i))) {
    return t("report.tableData.evidence.linksProvided", { count: parseInt(m[1], 10) });
  }
  if ((m = s.match(/^(\d+)\s+months?\s+old$/i))) {
    return t("report.tableData.evidence.monthsOld", { count: parseInt(m[1], 10) });
  }
  if ((m = s.match(/^Recorded\s*·\s*(\d+)\s*sec$/i))) {
    return t("report.tableData.evidence.recordedSec", { seconds: parseInt(m[1], 10) });
  }
  if ((m = s.match(/^LinkedIn\s+(\d+)\s+years?,\s*active$/i))) {
    return t("report.tableData.evidence.linkedinYearsActive", { years: parseInt(m[1], 10) });
  }
  if ((m = s.match(/^Reviewed by (.+)$/))) {
    return t("report.tableData.evidence.reviewedBy", { name: m[1] });
  }
  return s;
}

export function localizeAge(s: string | undefined, t: TFn): string {
  if (!s) return "";
  if (s === "—") return s;
  if (s === "Reviewer to verify") return t("report.tableData.portfolio.age.reviewerToVerify");
  let m: RegExpMatchArray | null;
  if ((m = s.match(/^(\d+)\s+months?$/i))) {
    return t("report.tableData.portfolio.age.months", { count: parseInt(m[1], 10) });
  }
  if ((m = s.match(/^(\d+)\s+years?$/i))) {
    return t("report.tableData.portfolio.age.years", { count: parseInt(m[1], 10) });
  }
  return s;
}

export function localizeActivity(s: string | undefined, t: TFn): string {
  if (!s) return "";
  const STATIC: Record<string, string> = {
    Active: "report.tableData.portfolio.activity.active",
    "Portfolio projects": "report.tableData.portfolio.activity.portfolioProjects",
    "Not provided": "report.tableData.portfolio.activity.notProvided",
    "Reviewer to verify": "report.tableData.portfolio.activity.reviewerToVerify",
  };
  if (s in STATIC) return t(STATIC[s]);
  let m: RegExpMatchArray | null;
  if ((m = s.match(/^(\d+)\s+commits?$/i))) {
    return t("report.tableData.portfolio.activity.commits", { count: parseInt(m[1], 10) });
  }
  if ((m = s.match(/^(\d+)\+\s+connections$/i))) {
    return t("report.tableData.portfolio.activity.connectionsPlus", { count: parseInt(m[1], 10) });
  }
  return s;
}
