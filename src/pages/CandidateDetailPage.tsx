import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  ClipboardCheck,
  FileText,
  Mail,
  MessageSquare,
  Eye,
  User,
  Link as LinkIcon,
  Video,
  Mic,
  FileText as FileIcon,
  Globe,
  Calendar,
  ClipboardList,
} from "lucide-react";
import { TopBar } from "../components/layout/TopBar";
import { Card, SectionLabel } from "../components/primitives/Card";
import { PrimaryBtn, SecondaryBtn } from "../components/primitives/Buttons";
import { AttentionBadge, StatusBadge } from "../components/primitives/Badges";
import { VerificationLinkModal } from "../components/modals/VerificationLinkModal";
import { RequestMoreInfoModal } from "../components/modals/RequestMoreInfoModal";
import { getCandidate } from "../api/candidates";
import { getSubmission } from "../api/submissions";
import { getReport } from "../api/reports";
import { listAudit } from "../api/audit";
import { getReview } from "../api/reviews";
import { formatDate } from "../lib/format";

export default function CandidateDetailPage() {
  const navigate = useNavigate();
  const { candidateId } = useParams<{ candidateId: string }>();
  const candidate = candidateId ? getCandidate(candidateId) : undefined;
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);

  if (!candidate) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <TopBar title="Candidate" subtitle="Not found" />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="p-8 text-center max-w-sm">
            <p className="text-sm text-[#6B7280] mb-4">
              This candidate could not be found. They may have been removed.
            </p>
            <PrimaryBtn onClick={() => navigate("/app/candidates")}>Back to Candidates</PrimaryBtn>
          </Card>
        </div>
      </div>
    );
  }

  const submission = getSubmission(candidate.id);
  const report = getReport(candidate.id);
  const review = getReview(candidate.id);
  const recentActivity = useMemo(
    () =>
      listAudit()
        .filter((a) => a.candidate === candidate.code)
        .slice(0, 5),
    [candidate.code],
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title={candidate.name}
        subtitle={`${candidate.role} · ${candidate.code}`}
        actions={
          <div className="flex items-center gap-2">
            <SecondaryBtn
              onClick={() => navigate("/app/candidates")}
              className="text-sm py-2"
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </SecondaryBtn>
            <SecondaryBtn
              onClick={() => navigate(`/app/reviewer/${candidate.id}`)}
              className="text-sm py-2"
              icon={<ClipboardCheck className="w-4 h-4" />}
            >
              Open Reviewer
            </SecondaryBtn>
            {candidate.reportReady && (
              <PrimaryBtn
                onClick={() => navigate(`/app/reports/${candidate.id}`)}
                className="text-sm py-2"
                icon={<Eye className="w-4 h-4" />}
              >
                View Trust Report
              </PrimaryBtn>
            )}
          </div>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-3 gap-5">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-5">
            {/* Overview */}
            <Card className="p-5">
              <SectionLabel>Candidate Overview</SectionLabel>
              <div className="flex items-start justify-between mb-4 -mt-1">
                <div>
                  <h3 className="font-bold text-base text-[#111827]">{candidate.name}</h3>
                  <p className="text-xs text-[#6B7280]">{candidate.role}</p>
                  <p className="text-[11px] text-[#9CA3AF] font-mono mt-0.5">{candidate.code}</p>
                </div>
                <div className="text-right space-y-1.5">
                  <StatusBadge status={candidate.submissionStatus} />
                  <div>
                    <AttentionBadge level={candidate.attentionLevel} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border-t border-[#E5E7EB] pt-4">
                {[
                  { label: "Email", value: candidate.email, icon: Mail },
                  { label: "Created", value: formatDate(candidate.createdAt), icon: Calendar },
                  { label: "Last updated", value: candidate.lastUpdated, icon: Calendar },
                  { label: "Reviewer", value: candidate.reviewer ?? "Unassigned", icon: User },
                ].map((f) => (
                  <div key={f.label}>
                    <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] mb-0.5 flex items-center gap-1">
                      <f.icon className="w-2.5 h-2.5" />
                      {f.label}
                    </p>
                    <p className="text-xs font-medium text-[#374151] truncate">{f.value}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Identity */}
            <Card className="p-5">
              <SectionLabel>Identity</SectionLabel>
              {submission.basicInfo ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 -mt-1">
                  {[
                    { label: "Full name", value: submission.basicInfo.fullName },
                    { label: "Email", value: submission.basicInfo.email },
                    { label: "Country", value: submission.basicInfo.country },
                    {
                      label: "LinkedIn",
                      value: submission.basicInfo.linkedin || "—",
                    },
                  ].map((f) => (
                    <div
                      key={f.label}
                      className="border border-[#E5E7EB] rounded-xl p-3 bg-[#F9FAFB]"
                    >
                      <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] mb-1">
                        {f.label}
                      </p>
                      <p className="text-xs text-[#374151] break-all">{f.value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyHint message="Candidate has not submitted basic information yet." />
              )}
            </Card>

            {/* Portfolio */}
            <Card className="p-5">
              <SectionLabel>Portfolio</SectionLabel>
              {submission.portfolio.length > 0 ? (
                <div className="space-y-2 -mt-1">
                  {submission.portfolio.map((p) => (
                    <div
                      key={p.platform + p.url}
                      className="flex items-center gap-3 border border-[#E5E7EB] rounded-xl px-3 py-2.5"
                    >
                      <div className="w-7 h-7 bg-[#F7F8FA] rounded-lg flex items-center justify-center shrink-0">
                        <Globe className="w-3.5 h-3.5 text-[#6B7280]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#374151]">{p.platform}</p>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-[#2F7D7E] hover:underline font-mono break-all"
                        >
                          {p.url}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyHint message="No portfolio links submitted yet." />
              )}
            </Card>

            {/* Media */}
            <Card className="p-5">
              <SectionLabel>Media Samples</SectionLabel>
              <div className="grid sm:grid-cols-3 gap-3 -mt-1">
                <MediaCell
                  label="Masked Document"
                  icon={<FileIcon className="w-4 h-4 text-[#6B7280]" />}
                >
                  {submission.document ? (
                    submission.document.mimeType.startsWith("image/") ? (
                      <img
                        src={submission.document.dataUrl}
                        alt="masked doc"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <p className="text-[11px] text-[#6B7280] truncate">
                        {submission.document.fileName} · {submission.document.mimeType}
                      </p>
                    )
                  ) : (
                    <EmptyDot />
                  )}
                </MediaCell>
                <MediaCell label="Selfie Video" icon={<Video className="w-4 h-4 text-[#6B7280]" />}>
                  {submission.selfie ? (
                    <video
                      src={submission.selfie.dataUrl}
                      controls
                      className="w-full h-32 object-cover rounded-lg bg-black"
                    />
                  ) : (
                    <EmptyDot />
                  )}
                </MediaCell>
                <MediaCell label="Voice Sample" icon={<Mic className="w-4 h-4 text-[#6B7280]" />}>
                  {submission.voice ? (
                    <audio src={submission.voice.dataUrl} controls className="w-full mt-2" />
                  ) : (
                    <EmptyDot />
                  )}
                </MediaCell>
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-5">
            {/* Quick actions */}
            <Card className="p-5">
              <SectionLabel>Quick Actions</SectionLabel>
              <div className="space-y-2 -mt-1">
                <PrimaryBtn
                  onClick={() => navigate(`/app/reviewer/${candidate.id}`)}
                  className="w-full justify-center text-sm"
                  icon={<ClipboardCheck className="w-4 h-4" />}
                >
                  Open Reviewer Review
                </PrimaryBtn>
                <SecondaryBtn
                  onClick={() => navigate(`/app/reports/${candidate.id}`)}
                  className="w-full justify-center text-sm"
                  icon={<FileText className="w-4 h-4" />}
                  disabled={!candidate.reportReady}
                >
                  View Trust Report
                </SecondaryBtn>
                <SecondaryBtn
                  onClick={() => setShowLinkModal(true)}
                  className="w-full justify-center text-sm"
                  icon={<LinkIcon className="w-4 h-4" />}
                >
                  Send / Copy Verification Link
                </SecondaryBtn>
                <SecondaryBtn
                  onClick={() => setShowRequestModal(true)}
                  className="w-full justify-center text-sm"
                  icon={<MessageSquare className="w-4 h-4" />}
                >
                  Request More Information
                </SecondaryBtn>
              </div>
            </Card>

            {/* Verification status */}
            <Card className="p-5">
              <SectionLabel>Verification Status</SectionLabel>
              <div className="-mt-1 space-y-2 text-xs">
                <StatusRow
                  label="Consent"
                  done={submission.consent.agreed}
                  detail={
                    submission.consent.agreedAt
                      ? `Given ${formatDate(submission.consent.agreedAt)}`
                      : undefined
                  }
                />
                <StatusRow label="Basic info" done={!!submission.basicInfo} />
                <StatusRow
                  label="Portfolio links"
                  done={submission.portfolio.length > 0}
                  detail={
                    submission.portfolio.length
                      ? `${submission.portfolio.length} link(s)`
                      : undefined
                  }
                />
                <StatusRow
                  label="Masked document"
                  done={!!submission.document}
                  detail={submission.document?.fileName}
                />
                <StatusRow
                  label="Selfie video"
                  done={!!submission.selfie}
                  detail={
                    submission.selfie
                      ? `${Math.round(submission.selfie.durationSec ?? 0)}s recorded`
                      : undefined
                  }
                />
                <StatusRow
                  label="Voice sample"
                  done={!!submission.voice}
                  detail={
                    submission.voice
                      ? `${Math.round(submission.voice.durationSec ?? 0)}s recorded`
                      : undefined
                  }
                />
                <StatusRow
                  label="Trust report"
                  done={!!report}
                  detail={report ? `Generated ${formatDate(report.generatedAt)}` : undefined}
                />
              </div>
            </Card>

            {/* Recent activity */}
            <Card className="p-5">
              <SectionLabel>Recent Activity</SectionLabel>
              {recentActivity.length === 0 ? (
                <EmptyHint message="No activity recorded yet." />
              ) : (
                <div className="-mt-1 space-y-2">
                  {recentActivity.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-start gap-2 text-xs text-[#374151] border border-[#E5E7EB] rounded-lg px-3 py-2"
                    >
                      <ClipboardList className="w-3 h-3 text-[#9CA3AF] mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{a.action}</p>
                        <p className="text-[10px] text-[#9CA3AF]">
                          {a.user} · {a.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {review.recommendedAction && review.recommendedAction !== "no-action" && (
              <Card className="p-5 border-[#C6923A]/30 bg-[#C6923A]/5">
                <SectionLabel>Reviewer Recommendation</SectionLabel>
                <p className="-mt-1 text-xs text-[#8A6422] font-medium capitalize">
                  {review.recommendedAction.replace(/-/g, " ")}
                </p>
                {review.notes && (
                  <p className="mt-2 text-xs text-[#6B7280] leading-relaxed line-clamp-4">
                    {review.notes}
                  </p>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>

      <VerificationLinkModal
        open={showLinkModal}
        onClose={() => setShowLinkModal(false)}
        candidate={candidate}
      />
      <RequestMoreInfoModal
        open={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        candidate={candidate}
        reviewer={candidate.reviewer}
      />
    </div>
  );
}

function MediaCell({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#E5E7EB] rounded-xl p-3">
      <p className="text-[10px] text-[#9CA3AF] mb-2 flex items-center gap-1">
        {icon}
        {label}
      </p>
      {children}
    </div>
  );
}

function EmptyDot() {
  return (
    <div className="flex items-center justify-center h-24 text-[11px] text-[#9CA3AF]">
      Not yet provided
    </div>
  );
}

function EmptyHint({ message }: { message: string }) {
  return <p className="text-xs text-[#9CA3AF] py-2">{message}</p>;
}

function StatusRow({
  label,
  done,
  detail,
}: {
  label: string;
  done: boolean;
  detail?: string;
}) {
  return (
    <div className="flex items-center justify-between border border-[#E5E7EB] rounded-lg px-3 py-2">
      <div className="min-w-0">
        <p className="text-[#374151] truncate">{label}</p>
        {detail && <p className="text-[10px] text-[#9CA3AF] truncate">{detail}</p>}
      </div>
      <span
        className={`text-[10px] font-semibold uppercase tracking-wider ${
          done ? "text-[#2F7D7E]" : "text-[#9CA3AF]"
        }`}
      >
        {done ? "Ready" : "Pending"}
      </span>
    </div>
  );
}
