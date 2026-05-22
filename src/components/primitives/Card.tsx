import React from "react";
import { Info } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/cn";

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white border border-[#E5E7EB] rounded-2xl", className)}>{children}</div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-[#6B7280] mb-3">{children}</p>
  );
}

export function GuardrailNotice() {
  const { t } = useTranslation();
  return (
    <div className="flex gap-3 bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl p-4">
      <Info className="w-4 h-4 text-[#6B7280] mt-0.5 shrink-0" />
      <div className="text-xs text-[#6B7280] leading-relaxed">
        <strong className="text-[#374151]">Guardrail Notice:</strong> {t("report.guardrail")}
      </div>
    </div>
  );
}
