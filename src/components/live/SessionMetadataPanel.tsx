import { Globe, Cpu, Wifi, MonitorSmartphone, Volume2, Frame } from "lucide-react";

interface Row {
  Icon: typeof Globe;
  label: string;
  value: string;
}

interface Props {
  latencyMs: number;
  frameRate: number;
}

export function SessionMetadataPanel({ latencyMs, frameRate }: Props) {
  const rows: Row[] = [
    { Icon: MonitorSmartphone, label: "Device", value: "MacBook Pro · Chrome 128" },
    { Icon: Globe, label: "IP region", value: "Seoul, KR (anonymized)" },
    { Icon: Wifi, label: "Latency", value: `${Math.round(latencyMs)} ms` },
    { Icon: Volume2, label: "Audio gain", value: "−18 dBFS" },
    { Icon: Frame, label: "Frame rate", value: `${frameRate.toFixed(0)} fps` },
    { Icon: Cpu, label: "Stream codec", value: "VP9 · Opus" },
  ];
  return (
    <div className="space-y-1.5">
      {rows.map((r) => (
        <div
          key={r.label}
          className="flex items-center gap-2 text-xs text-[#374151] border border-[#E5E7EB] rounded-lg px-3 py-1.5"
        >
          <r.Icon className="w-3.5 h-3.5 text-[#6B7280] shrink-0" />
          <span className="text-[#6B7280] w-20 shrink-0">{r.label}</span>
          <span className="font-mono text-[#111827] truncate">{r.value}</span>
        </div>
      ))}
    </div>
  );
}
