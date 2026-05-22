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
import { listCandidates, getCandidate } from "../api/candidates";
import { getReport, listReports } from "../api/reports";
import { formatDate } from "../lib/format";
import { addAudit } from "../api/audit";

export default function TrustReportPage() {
  const navigate = useNavigate();
  const { candidateId } = useParams<{ candidateId?: string }>();
  const reports = listReports();

  const targetId = useMemo(() => {
    if (candidateId) return candidateId;
    return reports[0]?.candidateId ?? listCandidates().find((c) => c.reportReady)?.id;
  }, [candidateId, reports]);

  const candidate = targetId ? getCandidate(targetId) : undefined;
  const report = targetId ? getReport(targetId) : undefined;

  if (!candidate || !report) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <TopBar title="Candidate Trust Report" subtitle="No reports yet" />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="p-8 text-center max-w-sm">
            <p className="text-sm text-[#6B7280] mb-4">
              No trust report has been generated yet. Review a candidate and click "Generate Trust Report".
            </p>
            <PrimaryBtn onClick={() => navigate("/app/reviewer")}>Go to Reviewer</PrimaryBtn>
          </Card>
        </div>
      </div>
    );
  }

  const onExport = () => {
    addAudit({
      action: "PDF Export Requested",
      user: report.reviewer,
      candidate: candidate.code,
      type: "report",
    });
    window.print();
  };

  const onShare = async () => {
    const url = `${window.location.origin}/app/reports/${candidate.id}`;
    try {
      await navigator.clipboard.writeText(url);
      addAudit({
        action: "Report Shared",
        user: report.reviewer,
        candidate: candidate.code,
        type: "share",
      });
      alert(`Report link copied to clipboard:\n${url}`);
    } catch {
      alert(`Share link:\n${url}`);
    }
  };

  const summaryCards = [
    {
      label: "Identity Consistency",
      level: report.summary.identity,
      note: "Name and document signals are consistent.",
    },
    {
      label: "Portfolio Provenance",
      level: report.summary.portfolio,
      note: "Portfolio account activity reviewed.",
    },
    {
      label: "Interview Session Integrity",
      level: report.summary.session,
      note: "Session media quality is consistent and clear.",
    },
    {
      label: "Media Sample Quality",
      level: report.summary.mediaQuality,
      note: "Selfie and voice samples meet quality threshold.",
    },
    {
      label: "Manual Review Status",
      level: report.summary.manualReview,
      note: report.recommendedActionTitle,
    },
  ];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Candidate Trust Report"
        subtitle={`${candidate.name} · ${candidate.code}`}
        actions={
          <div className="flex items-center gap-2">
            <SecondaryBtn onClick={onShare} className="text-sm py-2" icon={<Share2 className="w-4 h-4" />}>
              Share
            </SecondaryBtn>
            <PrimaryBtn onClick={onExport} className="text-sm py-2" icon={<Download className="w-4 h-4" />}>
              Export PDF
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
                      Candidate Trust Report
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
                  Human Reviewed
                </div>
                <StatusBadge status="report-ready" />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-[#E5E7EB] pt-4">
              {[
                { label: "Organization", value: "TechCorp Hiring" },
                { label: "Verification Date", value: formatDate(report.generatedAt) },
                { label: "Reviewer", value: report.reviewer },
                { label: "Report Status", value: "Final" },
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
            <SectionLabel>Verification Summary</SectionLabel>
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

          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7EB]">
              <SectionLabel>Signal Matrix</SectionLabel>
              <p className="text-sm font-semibold text-[#111827] -mt-1">Review Signal Detail</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    {["Area", "Signal", "Status", "Evidence", "Reviewer Note"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#6B7280]">
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

          <Card className="p-5">
            <SectionLabel>Portfolio Provenance</SectionLabel>
            <p className="text-sm font-semibold text-[#111827] mb-4 -mt-1">Portfolio Account Review</p>
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
                      <p className="text-[10px] text-[#9CA3AF] mb-0.5">Account age</p>
                      <p className="text-xs font-medium text-[#374151]">{p.age}</p>
                    </div>
                    <div className="bg-[#F7F8FA] rounded-lg p-2.5">
                      <p className="text-[10px] text-[#9CA3AF] mb-0.5">Activity</p>
                      <p className="text-xs font-medium text-[#374151]">{p.activity}</p>
                    </div>
                    <div className="bg-[#F7F8FA] rounded-lg p-2.5">
                      <p className="text-[10px] text-[#9CA3AF] mb-0.5">Reviewer note</p>
                      <p className="text-xs text-[#C6923A]">
                        {p.note || <span className="text-[#9CA3AF]">None</span>}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <SectionLabel>Interview Session Integrity</SectionLabel>
            <p className="text-sm font-semibold text-[#111827] mb-4 -mt-1">Session Signal Review</p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  label: "Session completed",
                  value: `Yes — ${formatDate(report.generatedAt)}`,
                  icon: <CheckCircle className="w-4 h-4 text-[#2F7D7E]" />,
                },
                {
                  label: "Selfie video quality",
                  value:
                    report.summary.mediaQuality === "low"
                      ? "Clear · meets threshold"
                      : "Sample missing",
                  icon: <Video className="w-4 h-4 text-[#2F7D7E]" />,
                },
                {
                  label: "Face consistency signal",
                  value:
                    report.summary.session === "low"
                      ? "Consistent · Low Attention"
                      : "Needs reviewer attention",
                  icon: <User className="w-4 h-4 text-[#2F7D7E]" />,
                },
                {
                  label: "Voice consistency signal",
                  value:
                    report.summary.mediaQuality === "low"
                      ? "Clear · Low Attention"
                      : "Needs reviewer attention",
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
                No emotion analysis, personality analysis, or biometric profiling was performed on session
                media.
              </p>
            </div>
          </Card>

          <Card className="p-5 border-[#172033]/20">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 bg-[#172033] rounded-xl flex items-center justify-center shrink-0">
                <ClipboardCheck className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1">
                <SectionLabel>Recommended Action</SectionLabel>
                <h3 className="text-base font-bold text-[#172033] mb-2">
                  {report.recommendedActionTitle}
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed mb-3">
                  {report.recommendedActionDetail}
                </p>
                <div className="flex gap-2.5 print:hidden">
                  <AttentionBtn className="text-sm py-2" icon={<RefreshCw className="w-3.5 h-3.5" />}>
                    Request Follow-up
                  </AttentionBtn>
                  <SecondaryBtn className="text-sm py-2" icon={<Archive className="w-3.5 h-3.5" />}>
                    Mark Reviewed
                  </SecondaryBtn>
                </div>
              </div>
            </div>
          </Card>

          {report.reviewerNotes && (
            <Card className="p-5">
              <SectionLabel>Reviewer Notes</SectionLabel>
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

          <GuardrailNotice />

          <div className="flex items-center justify-between p-4 bg-[#172033] rounded-2xl print:hidden">
            <div className="text-white">
              <p className="font-semibold text-sm">Export as PDF</p>
              <p className="text-white/60 text-xs">
                Print-ready, audit-friendly format. Uses your browser's "Save as PDF" dialog.
              </p>
            </div>
            <button
              onClick={onExport}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#172033] text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
