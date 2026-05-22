import { Video, Camera } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";

export type LiveSource = "demo" | "live";

interface Props {
  value: LiveSource;
  onChange: (next: LiveSource) => void;
  disabled?: boolean;
}

export function SourceToggle({ value, onChange, disabled }: Props) {
  const { t } = useTranslation();
  const opts: { value: LiveSource; label: string; Icon: typeof Video }[] = [
    { value: "demo", label: t("liveInterview.source.demo"), Icon: Video },
    { value: "live", label: t("liveInterview.source.live"), Icon: Camera },
  ];
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-[#E5E7EB] bg-[#F7F8FA] p-0.5",
        disabled && "opacity-60 pointer-events-none",
      )}
      role="group"
      aria-label={t("liveInterview.source.label")}
    >
      {opts.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors",
              active ? "bg-white text-[#172033] shadow-sm" : "text-[#6B7280] hover:text-[#374151]",
            )}
            aria-pressed={active}
          >
            <opt.Icon className="w-3.5 h-3.5" />
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
