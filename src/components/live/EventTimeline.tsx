import { AlertTriangle, Info, Activity } from "lucide-react";
import { cn } from "../../lib/cn";
import type { LiveEvent } from "../../hooks/useLiveSignals";

interface Props {
  events: LiveEvent[];
}

const STYLE: Record<LiveEvent["kind"], { icon: typeof Info; bg: string; text: string }> = {
  info: { icon: Info, bg: "bg-[#172033]/8", text: "text-[#172033]" },
  warn: { icon: AlertTriangle, bg: "bg-[#C6923A]/10", text: "text-[#8A6422]" },
  critical: { icon: Activity, bg: "bg-[#C6923A]/15", text: "text-[#8A6422]" },
};

function formatRelative(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const mm = Math.floor(s / 60)
    .toString()
    .padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `+${mm}:${ss}`;
}

export function EventTimeline({ events }: Props) {
  if (events.length === 0) {
    return <p className="text-xs text-[#9CA3AF] py-2">No events yet.</p>;
  }
  return (
    <div className="space-y-2">
      {events.map((e) => {
        const cfg = STYLE[e.kind];
        const Icon = cfg.icon;
        return (
          <div
            key={e.id}
            className="flex items-start gap-2 border border-[#E5E7EB] rounded-lg px-3 py-2"
          >
            <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center shrink-0", cfg.bg)}>
              <Icon className={cn("w-3 h-3", cfg.text)} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-[#374151] leading-snug">{e.label}</p>
              <p className="text-[10px] text-[#9CA3AF] mt-0.5 font-mono">{formatRelative(e.at)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
