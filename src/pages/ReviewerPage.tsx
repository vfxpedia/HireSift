import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Eye,
  FileText,
  Globe,
  Save,
  Check,
  ChevronDown,
  Shield,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { TopBar } from "../components/layout/TopBar";
import { Card } from "../components/primitives/Card";
import { PrimaryBtn, SecondaryBtn, AttentionBtn } from "../components/primitives/Buttons";
import { AttentionBadge } from "../components/primitives/Badges";
import { RequestMoreInfoModal } from "../components/modals/RequestMoreInfoModal";
import { listCandidates, getCandidate, setAttention } from "../api/candidates";
import { getSubmission } from "../api/submissions";
import { getReview, saveReview, setNotes, setRecommendedAction } from "../api/reviews";
import { generateReport } from "../api/reports";
import { addAudit } from "../api/audit";
import { toast } from "../components/primitives/Toaster";
import { useTranslation } from "react-i18next";
import type { AttentionLevel, RecommendedAction } from "../types";

const ACTION_VALUES: RecommendedAction[] = [
  "no-action",
  "verification-call",
  "portfolio-walkthrough",
  "additional-doc",
  "manual-review",
];

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

export default function ReviewerPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [, setTick] = useState(0);
  const refresh = () => setTick((t) => t + 1);

  if (!candidate) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <TopBar title={t("reviewer.title")} subtitle={t("reviewer.noCandidatesSubtitle")} />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="p-8 text-center max-w-sm">
            <p className="text-sm text-[#6B7280]">{t("reviewer.noCandidatesBody")}</p>
            <PrimaryBtn onClick={() => navigate("/app/candidates")} className="mt-4">
              {t("reviewer.goToCandidates")}
            </PrimaryBtn>
          </Card>
        </div>
      </div>
    );
  }

  const portfolioCount = submission?.portfolio.length ?? 0;
  const signals: { area: string; signal: string; status: AttentionLevel; evidence: string; note: string }[] = [
    {
      area: t("reviewer.signalRow.areaIdentity"),
      signal: t("reviewer.signalRow.identityName"),
      status: submission?.basicInfo ? "low" : "medium",
      evidence: submission?.basicInfo
        ? t("reviewer.signalRow.identityEvidence", { name: submission.basicInfo.fullName })
        : t("reviewer.signalRow.identityAwaiting"),
      note: "",
    },
    {
      area: t("reviewer.signalRow.areaPortfolio"),
      signal: t("reviewer.signalRow.portfolioSubmitted"),
      status: portfolioCount >= 2 ? "low" : "medium",
      evidence: t("reviewer.signalRow.portfolioEvidence", { count: portfolioCount }),
      note: portfolioCount < 2 ? t("reviewer.signalRow.portfolioFewer") : "",
    },
    {
      area: t("reviewer.signalRow.areaDocument"),
      signal: t("reviewer.signalRow.documentVisible"),
      status: submission?.document ? "low" : "medium",
      evidence: submission?.document?.fileName ?? t("reviewer.signalRow.documentNotUploaded"),
      note: "",
    },
    {
      area: t("reviewer.signalRow.areaSelfie"),
      signal: t("reviewer.signalRow.selfieFace"),
      status: submission?.selfie ? "low" : "medium",
      evidence: submission?.selfie
        ? t("reviewer.signalRow.selfieRecorded", { seconds: Math.round(submission.selfie.durationSec ?? 0) })
        : t("reviewer.signalRow.selfieNotRecorded"),
      note: "",
    },
    {
      area: t("reviewer.signalRow.areaVoice"),
      signal: t("reviewer.signalRow.voiceClear"),
      status: submission?.voice ? "low" : "medium",
      evidence: submission?.voice
        ? t("reviewer.signalRow.voiceRecorded", { seconds: Math.round(submission.voice.durationSec ?? 0) })
        : t("reviewer.signalRow.voiceNotRecorded"),
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
    toast.success("Draft saved");
  };

  const onGenerate = () => {
    setNotes(candidate.id, note);
    setRecommendedAction(candidate.id, action);
    generateReport(candidate);
    toast.success("Trust report generated");
    navigate(`/app/reports/${candidate.id}`);
  };

  const onMarkManualReview = () => {
    saveReview(candidate.id, { recommendedAction: "manual-review", notes: note });
    setAction("manual-review");
    setAttention(candidate.id, "manual");
    addAudit({
      action: "Marked for Manual Review",
      user: candidate.reviewer ?? "Reviewer",
      candidate: candidate.code,
      type: "review",
    });
    toast.success("Candidate flagged for manual review");
    refresh();
  };

  const onPreviewReport = () => {
    if (!candidate.reportReady) {
      toast.error("Generate the Trust Report first before previewing.");
      return;
    }
    navigate(`/app/reports/${candidate.id}`);
  };

  const submittedCandidates = candidates.filter(
    (c) => c.submissionStatus !== "pending" && c.submissionStatus !== "in-progress",
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title={t("reviewer.title")}
        subtitle={`${t("reviewer.reviewingPrefix")} ${candidate.name} · ${candidate.code}`}
        actions={
          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setPickerOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-[#374151] border border-[#E5E7EB] rounded-xl bg-white hover:bg-gray-50"
              >
                {t("reviewer.switchCandidate")}
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
                    <p className="px-3 py-4 text-xs text-[#9CA3AF]">{t("reviewer.candidateSwitchEmpty")}</p>
                  )}
                </div>
              )}
            </div>
            <SecondaryBtn
              onClick={onPreviewReport}
              className="text-sm py-2"
              icon={<Eye className="w-4 h-4" />}
              disabled={!candidate.reportReady}
            >
              {candidate.reportReady ? t("reviewer.previewReport") : t("reviewer.reportNotReady")}
            </SecondaryBtn>
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto mb-4 flex items-center gap-2 bg-[#172033]/5 border border-[#172033]/10 rounded-xl px-4 py-2.5 text-xs text-[#374151]">
          <Shield className="w-3.5 h-3.5 text-[#172033]" />
          <span>{t("reviewer.principle")}</span>
        </div>
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
                  { label: t("reviewer.fieldSubmission"), value: t(`status.${candidate.submissionStatus}`), color: "#2F7D7E" },
                  {
                    label: t("reviewer.fieldReviewer"),
                    value: candidate.reviewer ?? t("reviewer.fieldUnassigned"),
                    color: "#172033",
                  },
                  { label: t("reviewer.fieldUpdated"), value: candidate.lastUpdated, color: "#6B7280" },
                ].map((s) => (
                  <div key={s.label} className="bg-[#F7F8FA] rounded-xl p-3 text-center">
                    <p className="text-[10px] text-[#9CA3AF] mb-1">{s.label}</p>
                    <p className="text-xs font-medium" style={{ color: s.color }}>
                      {s.value}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="px-5 py-4 border-b border-[#E5E7EB]">
                <h3 className="font-semibold text-sm text-[#111827]">{t("reviewer.matrixTitle")}</h3>
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
                        <th key={i} className="px-4 py-2.5 text-left text-xs font-medium text-[#6B7280]">
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
              <h3 className="font-semibold text-sm text-[#111827] mb-4">{t("reviewer.portfolioTitle")}</h3>
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
                        <p className="text-[10px] text-[#9CA3AF]">{t("reviewer.accountAge")}</p>
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
                <h3 className="font-semibold text-sm text-[#111827] mb-4">{t("reviewer.submittedMedia")}</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {submission?.document && (
                    <div className="border border-[#E5E7EB] rounded-xl p-3">
                      <p className="text-[10px] text-[#9CA3AF] mb-2">{t("candidateDetail.maskedDocument")}</p>
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
                      <p className="text-[10px] text-[#9CA3AF] mb-2">{t("candidateDetail.selfieVideo")}</p>
                      <video
                        src={submission.selfie.dataUrl}
                        controls
                        className="w-full h-32 object-cover rounded-lg bg-black"
                      />
                    </div>
                  )}
                  {submission?.voice && (
                    <div className="border border-[#E5E7EB] rounded-xl p-3">
                      <p className="text-[10px] text-[#9CA3AF] mb-2">{t("candidateDetail.voiceSample")}</p>
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
              { label: t("reviewer.summary.identity"), level: summaryLevels.identity },
              { label: t("reviewer.summary.portfolio"), level: summaryLevels.portfolio },
              { label: t("reviewer.summary.session"), level: summaryLevels.session },
              { label: t("reviewer.summary.media"), level: summaryLevels.media },
            ].map((c) => (
              <Card key={c.label} className="p-4">
                <p className="text-xs text-[#6B7280] mb-2">{c.label}</p>
                <AttentionBadge level={c.level} />
              </Card>
            ))}

            <Card className="p-4">
              <h3 className="font-semibold text-xs text-[#374151] mb-2">{t("reviewer.notesTitle")}</h3>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("reviewer.notesPlaceholder")}
                rows={4}
                className="w-full text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#2F7D7E]/30 resize-none"
              />
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold text-xs text-[#374151] mb-3">{t("reviewer.recommendedAction")}</h3>
              <div className="space-y-2">
                {ACTION_VALUES.map((value) => (
                  <label key={value} className="flex items-center gap-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="action"
                      value={value}
                      checked={action === value}
                      onChange={() => setAction(value)}
                      className="accent-[#2F7D7E]"
                    />
                    <span className="text-xs text-[#374151]">{t(`actions.${actionTKey(value)}`)}</span>
                  </label>
                ))}
              </div>
            </Card>

            <div className="space-y-2">
              <SecondaryBtn
                onClick={() => setShowRequestModal(true)}
                className="w-full justify-center text-sm"
                icon={<MessageSquare className="w-4 h-4" />}
              >
                {t("reviewer.requestMoreInfo")}
              </SecondaryBtn>
              <AttentionBtn
                onClick={onMarkManualReview}
                className="w-full justify-center text-sm"
                icon={<AlertTriangle className="w-4 h-4" />}
              >
                {t("reviewer.markForManualReview")}
              </AttentionBtn>
              <SecondaryBtn
                onClick={saveDraft}
                className="w-full justify-center text-sm"
                icon={savedTick ? <Check className="w-4 h-4 text-[#2F7D7E]" /> : <Save className="w-4 h-4" />}
              >
                {savedTick ? t("reviewer.saved") : t("reviewer.saveDraft")}
              </SecondaryBtn>
              <PrimaryBtn onClick={onGenerate} className="w-full justify-center text-sm">
                <FileText className="w-4 h-4" />
                {t("reviewer.generateReport")}
              </PrimaryBtn>
            </div>
          </div>
        </div>
      </div>
      <RequestMoreInfoModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        candidate={candidate}
        reviewer={candidate.reviewer}
      />
    </div>
  );
}
