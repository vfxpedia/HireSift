import { cn } from "../../lib/cn";
import type { AttentionLevel, SubmissionStatus } from "../../types";

const ATTENTION_CONFIG: Record<AttentionLevel, { label: string; cls: string; dot: string }> = {
  low: { label: "Low Attention", cls: "bg-[#2F7D7E]/10 text-[#2F7D7E] border border-[#2F7D7E]/20", dot: "bg-[#2F7D7E]" },
  medium: { label: "Review Recommended", cls: "bg-[#C6923A]/10 text-[#8A6422] border border-[#C6923A]/20", dot: "bg-[#C6923A]" },
  high: { label: "High Attention", cls: "bg-[#C6923A]/15 text-[#7A5420] border border-[#C6923A]/30 font-semibold", dot: "bg-[#C6923A]" },
  manual: { label: "Manual Review Required", cls: "bg-[#172033]/10 text-[#172033] border border-[#172033]/20 font-semibold", dot: "bg-[#172033]" },
};

const STATUS_CONFIG: Record<SubmissionStatus, { label: string; cls: string }> = {
  pending: { label: "Pending", cls: "bg-gray-100 text-gray-500 border border-gray-200" },
  "in-progress": { label: "In Progress", cls: "bg-[#C6923A]/10 text-[#8A6422] border border-[#C6923A]/20" },
  submitted: { label: "Submitted", cls: "bg-[#2F7D7E]/10 text-[#2F7D7E] border border-[#2F7D7E]/20" },
  reviewed: { label: "Reviewed", cls: "bg-[#172033]/10 text-[#172033] border border-[#172033]/20" },
  "report-ready": { label: "Report Ready", cls: "bg-[#2F7D7E] text-white border border-[#2F7D7E]" },
};

export function AttentionBadge({ level }: { level: AttentionLevel }) {
  const cfg = ATTENTION_CONFIG[level];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium", cfg.cls)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", cfg.dot)} />
      {cfg.label}
    </span>
  );
}

export function StatusBadge({ status }: { status: SubmissionStatus }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={cn("inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium", cfg.cls)}>
      {cfg.label}
    </span>
  );
}
