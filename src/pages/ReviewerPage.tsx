import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Eye,
  FileText,
  Globe,
  Save,
  Check,
  ChevronDown,
} from "lucide-react";
import { TopBar } from "../components/layout/TopBar";
import { Card } from "../components/primitives/Card";
import { PrimaryBtn, SecondaryBtn } from "../components/primitives/Buttons";
import { AttentionBadge } from "../components/primitives/Badges";
import { listCandidates, getCandidate } from "../api/candidates";
import { getSubmission } from "../api/submissions";
import { getReview, setNotes, setRecommendedAction } from "../api/reviews";
import { generateReport } from "../api/reports";
import type { AttentionLevel, RecommendedAction } from "../types";

const ACTION_OPTIONS: { value: RecommendedAction; label: string }[] = [
  { value: "no-action", label: "No additional check needed" },
  { value: "verification-call", label: "Request re-verification call" },
  { value: "portfolio-walkthrough", label: "Request portfolio walkthrough" },
  { value: "additional-doc", label: "Request additional document" },
  { value: "manual-review", label: "Manual review required" },
];

export default function ReviewerPage() {
  const navigate = useNavigate();
  const { candidateId } = useParams<{ candidateId?: string }>();
  const candidates = listCandidates();

  const targetId = useMemo(() => {
    if (candidateId) return candidateId;
    return (
      candidates.find((c) => c.submissionStatus === "submitted")?.id ??
      candidates.find((c) => c.submissionStatus === "reviewed")?.id ??
      candidates[0]?.id
    );
  }, [candidateId, candidates]);

  const candidate = targetId ? getCandidate(targetId) : undefined;
  const review = candidate ? getReview(candidate.id) : undefined;
  const submission = candidate ? getSubmission(candidate.id) : undefined;

  const [note, setNote] = useState(review?.notes ?? "");
  const [action, setAction] = useState<RecommendedAction>(review?.recommendedAction ?? "no-action");
  const [savedTick, setSavedTick] = useState<number | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  if (!candidate) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <TopBar title="Reviewer Dashboard" subtitle="No candidates yet" />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="p-8 text-center max-w-sm">
            <p className="text-sm text-[#6B7280]">
              Create a verification request to start reviewing candidates.
            </p>
            <PrimaryBtn onClick={() => navigate("/app/candidates")} className="mt-4">
              Go to Candidates
            </PrimaryBtn>
          </Card>
        </div>
      </div>
    );
  }

  const signals: { area: string; signal: string; status: AttentionLevel; evidence: string; note: string }[] = [
    {
      area: "Basic identity information",
      signal: "Name consistency",
      status: submission?.basicInfo ? "low" : "medium",
      evidence: submission?.basicInfo
        ? `Submitted as ${submission.basicInfo.fullName}`
        : "Awaiting submission",
      note: "",
    },
    {
      area: "Portfolio account consistency",
      signal: "Portfolio links submitted",
      status: (submission?.portfolio.length ?? 0) >= 2 ? "low" : "medium",
      evidence: `${submission?.portfolio.length ?? 0} link(s) submitted`,
      note: (submission?.portfolio.length ?? 0) < 2 ? "Fewer portfolio links than expected" : "",
    },
    {
      area: "Masked document review",
      signal: "Document type visible",
      status: submission?.document ? "low" : "medium",
      evidence: submission?.document?.fileName ?? "Not uploaded",
      note: "",
    },
    {
      area: "Selfie sample quality",
      signal: "Face visible, stable lighting",
      status: submission?.selfie ? "low" : "medium",
      evidence: submission?.selfie
        ? `Recorded · ${Math.round(submission.selfie.durationSec ?? 0)} sec`
        : "Not recorded",
      note: "",
    },
    {
      area: "Voice sample quality",
      signal: "Clear audio, consistent voice",
      status: submission?.voice ? "low" : "medium",
      evidence: submission?.voice
        ? `Recorded · ${Math.round(submission.voice.durationSec ?? 0)} sec`
        : "Not recorded",
      note: "",
    },
  ];

  const portfolioPreview =
    submission?.portfolio && submission.portfolio.length > 0
      ? submission.portfolio.map((p, i) => ({
          platform: p.platform,
          url: p.url.replace(/^https?:\/\//, ""),
          age: i === 0 ? "Reviewer to verify" : "—",
          status: "low" as AttentionLevel,
        }))
      : [
          { platform: "GitHub", url: "github.com/alexkim-dev", age: "8 months", status: "medium" as AttentionLevel },
          { platform: "LinkedIn", url: "linkedin.com/in/alex-kim-fe", age: "3 years", status: "low" as AttentionLevel },
          { platform: "Website", url: "alexkimdev.com", age: "1 year", status: "low" as AttentionLevel },
        ];

  const summaryLevels = {
    identity: signals[0].status,
    portfolio: signals[1].status,
    session: signals[3].status,
    media: signals[4].status,
  };

  const saveDraft = () => {
    setNotes(candidate.id, note);
    setRecommendedAction(candidate.id, action);
    setSavedTick(Date.now());
    setTimeout(() => setSavedTick(null), 1500);
  };

  const onGenerate = () => {
    setNotes(candidate.id, note);
    setRecommendedAction(candidate.id, action);
    generateReport(candidate);
    navigate(`/app/reports/${candidate.id}`);
  };

  const submittedCandidates = candidates.filter(
    (c) => c.submissionStatus !== "pending" && c.submissionStatus !== "in-progress",
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Reviewer Dashboard"
        subtitle={`Reviewing: ${candidate.name} · ${candidate.code}`}
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setPickerOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#374151] border border-[#E5E7EB] rounded-xl bg-white hover:bg-gray-50"
              >
                Switch candidate
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {pickerOpen && (
                <div className="absolute right-0 mt-1 w-72 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-30 max-h-96 overflow-y-auto">
                  {submittedCandidates.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setPickerOpen(false);
                        navigate(`/app/reviewer/${c.id}`);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-[#F9FAFB] border-b border-[#E5E7EB] last:border-0"
                    >
                      <p className="text-sm font-medium text-[#111827]">{c.name}</p>
                      <p className="text-xs text-[#9CA3AF] font-mono">{c.code}</p>
                    </button>
                  ))}
                  {submittedCandidates.length === 0 && (
                    <p className="px-3 py-4 text-xs text-[#9CA3AF]">No submitted candidates yet.</p>
                  )}
                </div>
              )}
            </div>
            {candidate.reportReady && (
              <SecondaryBtn
                onClick={() => navigate(`/app/reports/${candidate.id}`)}
                className="text-sm py-2"
                icon={<Eye className="w-4 h-4" />}
              >
                View Report
              </SecondaryBtn>
            )}
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <Card className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-sm text-[#111827]">{candidate.name}</h3>
                  <p className="text-xs text-[#6B7280]">
                    {candidate.role} · {candidate.code}
                  </p>
                </div>
                <AttentionBadge level={candidate.attentionLevel} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Submission", value: candidate.submissionStatus, color: "#2F7D7E" },
                  {
                    label: "Reviewer",
                    value: candidate.reviewer ?? "Unassigned",
                    color: "#172033",
                  },
                  { label: "Updated", value: candidate.lastUpdated, color: "#6B7280" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#F7F8FA] rounded-xl p-3 text-center">
                    <p className="text-[10px] text-[#9CA3AF] mb-1">{s.label}</p>
                    <p className="text-xs font-medium capitalize" style={{ color: s.color }}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="px-5 py-4 border-b border-[#E5E7EB]">
                <h3 className="font-semibold text-sm text-[#111827]">Review Signal Matrix</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                      {["Area", "Signal", "Status", "Evidence", "Reviewer Note"].map((h) => (
                        <th key={h} className="px-4 py-2.5 text-left text-xs font-medium text-[#6B7280]">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {signals.map((s, i) => (
                      <tr key={i} className="border-b border-[#E5E7EB] last:border-0">
                        <td className="px-4 py-3 text-xs text-[#374151]">{s.area}</td>
                        <td className="px-4 py-3 text-xs text-[#374151]">{s.signal}</td>
                        <td className="px-4 py-3">
                          <AttentionBadge level={s.status} />
                        </td>
                        <td className="px-4 py-3 text-xs text-[#6B7280]">{s.evidence}</td>
                        <td className="px-4 py-3 text-xs text-[#C6923A]">
                          {s.note || <span className="text-[#9CA3AF]">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="font-semibold text-sm text-[#111827] mb-4">Portfolio Provenance</h3>
              <div className="space-y-3">
                {portfolioPreview.map((p) => (
                  <div
                    key={p.platform + p.url}
                    className="flex items-center justify-between border border-[#E5E7EB] rounded-xl p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-[#F7F8FA] rounded-lg flex items-center justify-center">
                        <Globe className="w-3.5 h-3.5 text-[#6B7280]" />
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[#374151]">{p.platform}</p>
                        <p className="text-xs text-[#9CA3AF] font-mono">{p.url}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-[10px] text-[#9CA3AF]">Account age</p>
                        <p className="text-xs text-[#374151]">{p.age}</p>
                      </div>
                      <AttentionBadge level={p.status} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {(submission?.document || submission?.selfie || submission?.voice) && (
              <Card className="p-5">
                <h3 className="font-semibold text-sm text-[#111827] mb-4">Submitted Media</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {submission?.document && (
                    <div className="border border-[#E5E7EB] rounded-xl p-3">
                      <p className="text-[10px] text-[#9CA3AF] mb-2">Masked Document</p>
                      {submission.document.mimeType.startsWith("image/") ? (
                        <img
                          src={submission.document.dataUrl}
                          alt="masked document"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="text-xs text-[#6B7280]">
                          {submission.document.fileName} ({submission.document.mimeType})
                        </div>
                      )}
                    </div>
                  )}
                  {submission?.selfie && (
                    <div className="border border-[#E5E7EB] rounded-xl p-3">
                      <p className="text-[10px] text-[#9CA3AF] mb-2">Selfie Video</p>
                      <video
                        src={submission.selfie.dataUrl}
                        controls
                        className="w-full h-32 object-cover rounded-lg bg-black"
                      />
                    </div>
                  )}
                  {submission?.voice && (
                    <div className="border border-[#E5E7EB] rounded-xl p-3">
                      <p className="text-[10px] text-[#9CA3AF] mb-2">Voice Sample</p>
                      <audio
                        src={submission.voice.dataUrl}
                        controls
                        className="w-full mt-2"
                      />
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          <div className="space-y-4">
            {[
              { label: "Identity Consistency", level: summaryLevels.identity },
              { label: "Portfolio Provenance", level: summaryLevels.portfolio },
              { label: "Interview Session", level: summaryLevels.session },
              { label: "Media Sample Quality", level: summaryLevels.media },
            ].map((c) => (
              <Card key={c.label} className="p-4">
                <p className="text-xs text-[#6B7280] mb-2">{c.label}</p>
                <AttentionBadge level={c.level} />
              </Card>
            ))}

            <Card className="p-4">
              <h3 className="font-semibold text-xs text-[#374151] mb-2">Reviewer Notes</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add your review notes here…"
                rows={4}
                className="w-full text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#2F7D7E]/30 resize-none"
              />
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-xs text-[#374151] mb-3">Recommended Action</h3>
              <div className="space-y-2">
                {ACTION_OPTIONS.map((opt) => (
                  <label key={opt.value} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="action"
                      value={opt.value}
                      checked={action === opt.value}
                      onChange={() => setAction(opt.value)}
                      className="accent-[#2F7D7E]"
                    />
                    <span className="text-xs text-[#374151]">{opt.label}</span>
                  </label>
                ))}
              </div>
            </Card>

            <div className="space-y-2">
              <SecondaryBtn
                onClick={saveDraft}
                className="w-full justify-center text-sm"
                icon={savedTick ? <Check className="w-4 h-4 text-[#2F7D7E]" /> : <Save className="w-4 h-4" />}
              >
                {savedTick ? "Saved" : "Save draft"}
              </SecondaryBtn>
              <PrimaryBtn onClick={onGenerate} className="w-full justify-center text-sm">
                <FileText className="w-4 h-4" />
                Generate Trust Report
              </PrimaryBtn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
