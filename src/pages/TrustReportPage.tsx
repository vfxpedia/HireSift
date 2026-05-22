import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Download,
  Share2,
  Shield,
  CheckCircle,
  User,
  Mic,
  Video,
  ClipboardCheck,
  RefreshCw,
  Archive,
  Globe,
  Info,
} from "lucide-react";
import { TopBar } from "../components/layout/TopBar";
import { Card, SectionLabel, GuardrailNotice } from "../components/primitives/Card";
import { AttentionBadge, StatusBadge } from "../components/primitives/Badges";
import { PrimaryBtn, SecondaryBtn, AttentionBtn } from "../components/primitives/Buttons";
import { cn } from "../lib/cn";
import { listCandidates, getCandidate, setSubmissionStatus } from "../api/candidates";
import { getReport, listReports } from "../api/reports";
import { setRecommendedAction } from "../api/reviews";
import { getSubmission } from "../api/submissions";
import { formatDate, formatDateTime } from "../lib/format";
import { addAudit } from "../api/audit";
import { toast } from "../components/primitives/Toaster";
import { useEffect, useState } from "react";
import { ExportPdfModal, type ExportOptions } from "../components/modals/ExportPdfModal";
import { ShareReportModal } from "../components/modals/ShareReportModal";
import { useTranslation } from "react-i18next";
import type { AttentionLevel, SignalRow, RecommendedAction } from "../types";

function actionTKey(a: RecommendedAction): string {
  switch (a) {
    case "no-action":
      return "noAction";
    case "verification-call":
      return "verificationCall";
    case "portfolio-walkthrough":
      return "portfolioWalkthrough";
    case "additional-doc":
      return "additionalDoc";
    case "manual-review":
      return "manualReview";
  }
}

export default function TrustReportPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { candidateId } = useParams<{ candidateId?: string }>();
  const reports = listReports();

  const targetId = useMemo(() => {
    if (candidateId) return candidateId;
    return reports[0]?.candidateId ?? listCandidates().find((c) => c.reportReady)?.id;
  }, [candidateId, reports]);

  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [exportOpts, setExportOpts] = useState<ExportOptions>({
    includeEvidenceCards: true,
    includeReviewerNotes: true,
    includeGuardrailNotice: true,
  });
  const candidate = targetId ? getCandidate(targetId) : undefined;
  const report = targetId ? getReport(targetId) : undefined;

  if (!candidate || !report) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <TopBar title={t("report.title")} subtitle={t("report.subtitleNoReports")} />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="p-8 text-center max-w-sm">
            <p className="text-sm text-[#6B7280] mb-4">{t("report.noReportsBody")}</p>
            <PrimaryBtn onClick={() => navigate("/app/reviewer")}>{t("report.goToReviewer")}</PrimaryBtn>
          </Card>
        </div>
      </div>
    );
  }

  const runExport = (opts: ExportOptions) => {
    setExportOpts(opts);
    setShowExportModal(false);
    addAudit({
      action: "PDF Export Requested",
      user: report.reviewer,
      candidate: candidate.code,
      type: "report",
    });
    // Wait for both the modal to unmount and conditional sections to render
    // before opening the browser print dialog.
    setTimeout(() => window.print(), 200);
  };

  const submission = getSubmission(candidate.id);

  // Signal overview metrics
  const signalCounts = report.signalMatrix.reduce(
    (acc, row) => {
      acc[row.status] = (acc[row.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<AttentionLevel, number>,
  );
  const totalSignals = report.signalMatrix.length;
  const lowCount = signalCounts.low ?? 0;
  const reviewCount = (signalCounts.medium ?? 0) + (signalCounts.high ?? 0);
  const manualCount = signalCounts.manual ?? 0;

  // Section completion — a generated report implies the candidate completed
  // every section; legacy/seed candidates without persisted submission data
  // would otherwise show 0/6 even though the report exists.
  const hasReport = !!report;
  const sectionStatuses = [
    { label: "Consent", done: submission.consent.agreed || hasReport },
    { label: "Basic Info", done: !!submission.basicInfo || hasReport },
    { label: "Portfolio", done: submission.portfolio.length > 0 || hasReport },
    { label: "Document", done: !!submission.document || hasReport },
    { label: "Selfie", done: !!submission.selfie || hasReport },
    { label: "Voice", done: !!submission.voice || hasReport },
  ];
  const completedCount = sectionStatuses.filter((s) => s.done).length;
  const completionPct = Math.round((completedCount / sectionStatuses.length) * 100);

  const summaryCards = [
    {
      label: t("report.identityConsistency"),
      level: report.summary.identity,
      note: t("report.summaryNotes.identity"),
    },
    {
      label: t("report.portfolioProvenance"),
      level: report.summary.portfolio,
      note: t("report.summaryNotes.portfolio"),
    },
    {
      label: t("report.interviewSessionIntegrity"),
      level: report.summary.session,
      note: t("report.summaryNotes.session"),
    },
    {
      label: t("report.mediaSampleQuality"),
      level: report.summary.mediaQuality,
      note: t("report.summaryNotes.mediaQuality"),
    },
    {
      label: t("report.manualReviewStatus"),
      level: report.summary.manualReview,
      note: t(`actionTitles.${actionTKey(report.recommendedAction)}`),
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title={t("report.title")}
        subtitle={`${candidate.name} · ${candidate.code}`}
        actions={
          <div className="flex items-center gap-2">
            <SecondaryBtn
              onClick={() => setShowShareModal(true)}
              className="text-sm py-2"
              icon={<Share2 className="w-4 h-4" />}
            >
              {t("report.share")}
            </SecondaryBtn>
            <PrimaryBtn
              onClick={() => setShowExportModal(true)}
              className="text-sm py-2"
              icon={<Download className="w-4 h-4" />}
            >
              {t("report.exportPdf")}
            </PrimaryBtn>
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto p-6 print:p-0">
        <div className="max-w-4xl mx-auto space-y-5 print:max-w-full print:space-y-3" id="report-root">
          <Card className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 bg-[#172033] rounded-lg flex items-center justify-center">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-[10px] text-[#9CA3AF] font-mono uppercase tracking-wider">
                      {t("report.header.label")}
                    </p>
                    <p className="text-xs text-[#9CA3AF] font-mono">{candidate.code}</p>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-[#172033] mt-3">{candidate.name}</h2>
                <p className="text-sm text-[#6B7280]">{candidate.role}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1.5 bg-[#2F7D7E]/10 text-[#2F7D7E] text-xs font-semibold px-3 py-1.5 rounded-lg mb-2">
                  <CheckCircle className="w-3.5 h-3.5" />
                  {t("report.header.humanReviewed")}
                </div>
                <StatusBadge status="report-ready" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[#E5E7EB] pt-4">
              {[
                { label: t("report.header.organization"), value: "TechCorp Hiring" },
                { label: t("report.header.verificationDate"), value: formatDate(report.generatedAt) },
                { label: t("report.header.reviewer"), value: report.reviewer },
                { label: t("report.header.reportStatus"), value: t("report.header.final") },
              ].map((f) => (
                <div key={f.label}>
                  <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider mb-0.5">
                    {f.label}
                  </p>
                  <p className="text-sm font-medium text-[#374151]">{f.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <div>
            <SectionLabel>{t("report.verificationSummary")}</SectionLabel>
            <div className="grid md:grid-cols-5 gap-3">
              {summaryCards.map((c) => (
                <Card
                  key={c.label}
                  className={cn("p-4", c.level === "manual" && "border-[#C6923A]/30")}
                >
                  <p className="text-xs font-medium text-[#374151] mb-2">{c.label}</p>
                  <AttentionBadge level={c.level} />
                  <p className="text-[11px] text-[#9CA3AF] mt-2 leading-relaxed">{c.note}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Signal Overview + Attention Distribution + Completion Progress */}
          <Card className="p-5">
            <div className="grid md:grid-cols-3 gap-5">
              <div>
                <SectionLabel>{t("report.signalOverview")}</SectionLabel>
                <div className="grid grid-cols-3 gap-2 -mt-1">
                  <OverviewStat label={t("report.overviewLow")} value={lowCount} color="#2F7D7E" />
                  <OverviewStat label={t("report.overviewReview")} value={reviewCount} color="#C6923A" />
                  <OverviewStat label={t("report.overviewManual")} value={manualCount} color="#172033" />
                </div>
                <p className="text-[11px] text-[#9CA3AF] mt-3">
                  {t("report.overviewFooter", { count: totalSignals, sections: sectionStatuses.length })}
                </p>
              </div>
              <div>
                <SectionLabel>{t("report.attentionDistribution")}</SectionLabel>
                <div className="-mt-1">
                  <div className="flex w-full h-3 rounded-full overflow-hidden bg-[#F3F4F6]">
                    {totalSignals > 0 && (
                      <>
                        <div className="h-full bg-[#2F7D7E]" style={{ width: `${(lowCount / totalSignals) * 100}%` }} />
                        <div className="h-full bg-[#C6923A]" style={{ width: `${(reviewCount / totalSignals) * 100}%` }} />
                        <div className="h-full bg-[#172033]" style={{ width: `${(manualCount / totalSignals) * 100}%` }} />
                      </>
                    )}
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] text-[#6B7280]">
                    <Legend color="#2F7D7E" label={t("report.overviewLow")} />
                    <Legend color="#C6923A" label={t("report.overviewReview")} />
                    <Legend color="#172033" label={t("report.overviewManual")} />
                  </div>
                </div>
              </div>
              <div>
                <SectionLabel>{t("report.sectionCompletion")}</SectionLabel>
                <div className="-mt-1">
                  <div className="flex items-baseline gap-1.5 mb-2">
                    <span className="text-2xl font-bold text-[#111827]">{completionPct}%</span>
                    <span className="text-xs text-[#6B7280]">
                      {t("report.completionLabel", { percent: completionPct, done: completedCount, total: sectionStatuses.length })}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#F3F4F6] rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full bg-[#2F7D7E] transition-all"
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {sectionStatuses.map((s) => (
                      <span
                        key={s.label}
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded font-medium",
                          s.done
                            ? "bg-[#2F7D7E]/10 text-[#2F7D7E]"
                            : "bg-[#F3F4F6] text-[#9CA3AF]",
                        )}
                      >
                        {s.label}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7EB]">
              <SectionLabel>{t("report.signalMatrix")}</SectionLabel>
              <p className="text-sm font-semibold text-[#111827] -mt-1">{t("report.signalMatrixDetail")}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    {[
                      t("reviewer.matrixCol.area"),
                      t("reviewer.matrixCol.signal"),
                      t("reviewer.matrixCol.status"),
                      t("reviewer.matrixCol.evidence"),
                      t("reviewer.matrixCol.note"),
                    ].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left text-xs font-medium text-[#6B7280]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {report.signalMatrix.map((row, i) => (
                    <tr key={i} className="border-b border-[#E5E7EB] last:border-0">
                      <td className="px-4 py-3 text-xs font-medium text-[#374151]">{row.area}</td>
                      <td className="px-4 py-3 text-xs text-[#6B7280]">{row.signal}</td>
                      <td className="px-4 py-3">
                        <AttentionBadge level={row.status} />
                      </td>
                      <td className="px-4 py-3 text-xs text-[#6B7280]">{row.evidence}</td>
                      <td className="px-4 py-3 text-xs text-[#C6923A]">
                        {row.note || <span className="text-[#9CA3AF]">—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Evidence Card Grid */}
          {exportOpts.includeEvidenceCards && (
            <div>
              <SectionLabel>{t("report.evidenceCards")}</SectionLabel>
              <div className="grid md:grid-cols-2 gap-3">
                {report.signalMatrix.map((row, i) => (
                  <EvidenceCard
                    key={i}
                    row={row}
                    source={candidate.code}
                    timestamp={report.generatedAt}
                  />
                ))}
              </div>
            </div>
          )}

          <Card className="p-5">
            <SectionLabel>{t("report.portfolioProvenance")}</SectionLabel>
            <p className="text-sm font-semibold text-[#111827] mb-4 -mt-1">{t("report.portfolioReviewTitle")}</p>
            {report.portfolio.length > 0 && (
              <div className="mb-5 pb-5 border-b border-[#E5E7EB]">
                <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] mb-3">{t("report.accountTimeline")}</p>
                <div className="relative pl-3">
                  <div className="absolute left-1 top-2 bottom-2 w-px bg-[#E5E7EB]" />
                  {report.portfolio.map((p) => (
                    <div key={p.platform + p.url} className="relative mb-3 last:mb-0">
                      <div
                        className="absolute -left-2 top-1 w-2.5 h-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            p.status === "low" ? "#2F7D7E" : p.status === "medium" ? "#C6923A" : "#172033",
                        }}
                      />
                      <div className="ml-3">
                        <p className="text-xs font-semibold text-[#374151]">{p.platform}</p>
                        <p className="text-[11px] text-[#9CA3AF] font-mono">{p.url}</p>
                        <p className="text-[10px] text-[#6B7280] mt-0.5">
                          {t("report.fieldAccountAge")}: <strong className="text-[#374151]">{p.age}</strong> · {p.activity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-3">
              {report.portfolio.map((p) => (
                <div key={p.platform + p.url} className="border border-[#E5E7EB] rounded-xl p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#F7F8FA] rounded-lg flex items-center justify-center">
                        <Globe className="w-4 h-4 text-[#6B7280]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#374151]">{p.platform}</p>
                        <p className="text-xs text-[#9CA3AF] font-mono">{p.url}</p>
                      </div>
                    </div>
                    <AttentionBadge level={p.status} />
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-3">
                    <div className="bg-[#F7F8FA] rounded-lg p-2.5">
                      <p className="text-[10px] text-[#9CA3AF] mb-0.5">{t("report.fieldAccountAge")}</p>
                      <p className="text-xs font-medium text-[#374151]">{p.age}</p>
                    </div>
                    <div className="bg-[#F7F8FA] rounded-lg p-2.5">
                      <p className="text-[10px] text-[#9CA3AF] mb-0.5">{t("report.fieldActivity")}</p>
                      <p className="text-xs font-medium text-[#374151]">{p.activity}</p>
                    </div>
                    <div className="bg-[#F7F8FA] rounded-lg p-2.5">
                      <p className="text-[10px] text-[#9CA3AF] mb-0.5">{t("report.fieldReviewerNote")}</p>
                      <p className="text-xs text-[#C6923A]">
                        {p.note || <span className="text-[#9CA3AF]">{t("report.fieldNoteEmpty")}</span>}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <SectionLabel>{t("report.interviewSessionIntegrity")}</SectionLabel>
            <p className="text-sm font-semibold text-[#111827] mb-4 -mt-1">{t("report.sessionTitle")}</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  label: t("report.session.completed"),
                  value: t("report.session.completedValue", { date: formatDate(report.generatedAt) }),
                  icon: <CheckCircle className="w-4 h-4 text-[#2F7D7E]" />,
                },
                {
                  label: t("report.session.selfieQuality"),
                  value: report.summary.mediaQuality === "low" ? t("report.session.selfieClear") : t("report.session.selfieMissing"),
                  icon: <Video className="w-4 h-4 text-[#2F7D7E]" />,
                },
                {
                  label: t("report.session.faceConsistency"),
                  value: report.summary.session === "low" ? t("report.session.faceConsistent") : t("report.session.faceNeedsAttention"),
                  icon: <User className="w-4 h-4 text-[#2F7D7E]" />,
                },
                {
                  label: t("report.session.voiceConsistency"),
                  value: report.summary.mediaQuality === "low" ? t("report.session.voiceClear") : t("report.session.voiceNeedsAttention"),
                  icon: <Mic className="w-4 h-4 text-[#2F7D7E]" />,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 border border-[#E5E7EB] rounded-xl p-3.5"
                >
                  <div className="w-8 h-8 bg-[#2F7D7E]/10 rounded-lg flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs text-[#9CA3AF]">{item.label}</p>
                    <p className="text-sm font-medium text-[#374151]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-[#F7F8FA] rounded-xl">
              <p className="text-xs text-[#6B7280]">
                <Info className="w-3 h-3 inline mr-1" />
                {t("report.session.noEmotion")}
              </p>
            </div>
          </Card>

          <Card className="p-5 border-[#172033]/20">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-[#172033] rounded-xl flex items-center justify-center shrink-0">
                <ClipboardCheck className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <SectionLabel>{t("report.recommendedAction")}</SectionLabel>
                <h3 className="text-base font-bold text-[#172033] mb-2">
                  {t(`actionTitles.${actionTKey(report.recommendedAction)}`)}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-3">
                  {t(`actionDetails.${actionTKey(report.recommendedAction)}`)}
                </p>
                <div className="flex gap-2.5 print:hidden">
                  <AttentionBtn
                    className="text-sm py-2"
                    icon={<RefreshCw className="w-3.5 h-3.5" />}
                    onClick={() => {
                      setRecommendedAction(candidate.id, "verification-call");
                      addAudit({
                        action: "Follow-up Requested",
                        user: report.reviewer,
                        candidate: candidate.code,
                        type: "review",
                      });
                      toast.success(t("report.followupToast"));
                      refresh();
                    }}
                  >
                    {t("report.actionFollowup")}
                  </AttentionBtn>
                  <SecondaryBtn
                    className="text-sm py-2"
                    icon={<Archive className="w-3.5 h-3.5" />}
                    disabled={candidate.submissionStatus === "reviewed"}
                    onClick={() => {
                      if (candidate.submissionStatus === "reviewed") return;
                      setSubmissionStatus(candidate.id, "reviewed");
                      addAudit({
                        action: "Marked Reviewed",
                        user: report.reviewer,
                        candidate: candidate.code,
                        type: "review",
                      });
                      toast.success(t("report.reviewedToast"));
                      refresh();
                    }}
                  >
                    {candidate.submissionStatus === "reviewed" ? t("report.actionAlreadyReviewed") : t("report.actionMarkReviewed")}
                  </SecondaryBtn>
                </div>
              </div>
            </div>
          </Card>

          {exportOpts.includeReviewerNotes && report.reviewerNotes && (
            <Card className="p-5">
              <SectionLabel>{t("report.reviewerNotes")}</SectionLabel>
              <div className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-[#2F7D7E] rounded-full flex items-center justify-center text-white text-[10px] font-semibold">
                    {report.reviewer[0]}
                  </div>
                  <span className="text-xs font-medium text-[#374151]">
                    {report.reviewer} · {formatDate(report.generatedAt)}
                  </span>
                </div>
                <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-line">
                  {report.reviewerNotes}
                </p>
              </div>
            </Card>
          )}

          {exportOpts.includeGuardrailNotice && <GuardrailNotice />}

          <div className="flex items-center justify-between p-4 bg-[#172033] rounded-2xl print:hidden">
            <div className="text-white">
              <p className="font-semibold text-sm">{t("report.exportLong")}</p>
              <p className="text-white/60 text-xs">{t("report.exportHint")}</p>
            </div>
            <button
              onClick={() => setShowExportModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#172033] text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" /> {t("report.exportPdf")}
            </button>
          </div>
        </div>
      </div>
      <ExportPdfModal
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        candidateName={candidate.name}
        candidateCode={candidate.code}
        onExport={runExport}
      />
      <ShareReportModal
        open={showShareModal}
        onClose={() => setShowShareModal(false)}
        candidate={candidate}
        reviewer={report.reviewer}
      />
    </div>
  );
}

function OverviewStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      className="border rounded-xl p-3 text-center"
      style={{ borderColor: `${color}33`, backgroundColor: `${color}0d` }}
    >
      <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mt-0.5">{label}</p>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span>{label}</span>
    </div>
  );
}

function EvidenceCard({
  row,
  source,
  timestamp,
}: {
  row: SignalRow;
  source: string;
  timestamp: string;
}) {
  const { t } = useTranslation();
  return (
    <Card className="p-4 hover:border-[#172033]/20 transition-colors">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF]">{row.area}</p>
          <p className="text-sm font-semibold text-[#111827] truncate">{row.signal}</p>
        </div>
        <AttentionBadge level={row.status} />
      </div>
      <p className="text-xs text-[#374151] leading-relaxed">{row.evidence}</p>
      {row.note && (
        <div className="mt-2 px-3 py-2 bg-[#C6923A]/5 border border-[#C6923A]/20 rounded-lg">
          <p className="text-[11px] text-[#8A6422] leading-relaxed">{row.note}</p>
        </div>
      )}
      <div className="mt-3 pt-3 border-t border-[#E5E7EB] flex items-center justify-between text-[10px] text-[#9CA3AF]">
        <span className="font-mono">{t("report.evidenceSource", { code: source })}</span>
        <span>{formatDateTime(timestamp)}</span>
      </div>
    </Card>
  );
}
