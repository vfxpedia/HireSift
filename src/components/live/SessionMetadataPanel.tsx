import { Globe, Cpu, Wifi, MonitorSmartphone, Volume2, Frame } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  latencyMs: number;
  frameRate: number;
}

export function SessionMetadataPanel({ latencyMs, frameRate }: Props) {
  const { t } = useTranslation();
  const rows = [
    {
      Icon: MonitorSmartphone,
      label: t("liveInterview.metadata.device"),
      value: t("liveInterview.metadata.deviceValue"),
    },
    {
      Icon: Globe,
      label: t("liveInterview.metadata.ipRegion"),
      value: t("liveInterview.metadata.ipRegionValue"),
    },
    {
      Icon: Wifi,
      label: t("liveInterview.metadata.latency"),
      value: t("liveInterview.metadata.latencyValue", { ms: Math.round(latencyMs) }),
    },
    {
      Icon: Volume2,
      label: t("liveInterview.metadata.audioGain"),
      value: t("liveInterview.metadata.audioGainValue"),
    },
    {
      Icon: Frame,
      label: t("liveInterview.metadata.frameRate"),
      value: t("liveInterview.metadata.frameRateValue", { fps: frameRate.toFixed(0) }),
    },
    {
      Icon: Cpu,
      label: t("liveInterview.metadata.codec"),
      value: t("liveInterview.metadata.codecValue"),
    },
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
