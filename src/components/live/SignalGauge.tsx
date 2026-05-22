import { cn } from "../../lib/cn";
import type { AttentionLevel } from "../../types";

interface Props {
  label: string;
  value: number; // 0 — 100
  status: AttentionLevel;
  hint?: string;
}

const COLOR: Record<AttentionLevel, string> = {
  low: "#2F7D7E",
  medium: "#C6923A",
  high: "#C6923A",
  manual: "#172033",
};

const TEXT_COLOR: Record<AttentionLevel, string> = {
  low: "text-[#2F7D7E]",
  medium: "text-[#8A6422]",
  high: "text-[#8A6422]",
  manual: "text-[#172033]",
};

const BG_TINT: Record<AttentionLevel, string> = {
  low: "bg-[#2F7D7E]/5 border-[#2F7D7E]/20",
  medium: "bg-[#C6923A]/5 border-[#C6923A]/30",
  high: "bg-[#C6923A]/10 border-[#C6923A]/40",
  manual: "bg-[#172033]/5 border-[#172033]/30",
};

export function SignalGauge({ label, value, status, hint }: Props) {
  const safe = Math.max(0, Math.min(100, value));
  const stroke = COLOR[status];
  // Half-circle arc geometry
  const radius = 38;
  const circumference = Math.PI * radius; // half circle
  const dash = (safe / 100) * circumference;

  return (
    <div className={cn("rounded-xl border p-3 transition-colors", BG_TINT[status])}>
      <p className="text-[10px] uppercase tracking-wider text-[#6B7280] mb-1 truncate">{label}</p>
      <div className="flex items-end gap-3">
        <svg viewBox="0 0 100 60" className="w-20 h-12 shrink-0">
          <path
            d={`M 12 50 A ${radius} ${radius} 0 0 1 88 50`}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth={6}
            strokeLinecap="round"
          />
          <path
            d={`M 12 50 A ${radius} ${radius} 0 0 1 88 50`}
            fill="none"
            stroke={stroke}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            style={{ transition: "stroke-dasharray 240ms ease-out, stroke 240ms ease-out" }}
          />
        </svg>
        <div className="flex-1 min-w-0">
          <p className={cn("text-2xl font-bold leading-none", TEXT_COLOR[status])}>
            {Math.round(safe)}
            <span className="text-xs font-medium text-[#9CA3AF] ml-0.5">%</span>
          </p>
        </div>
      </div>
      {hint && <p className="text-[10px] text-[#9CA3AF] mt-2 leading-snug">{hint}</p>}
    </div>
  );
}
