import React from "react";
import { Bell, FileText, ClipboardCheck, Users, Mail, Share2, Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Popover } from "../primitives/Popover";
import { LanguageToggle } from "../primitives/LanguageToggle";
import { listAudit } from "../../api/audit";
import type { AuditType } from "../../types";

const TYPE_ICON: Record<AuditType, React.ComponentType<{ className?: string }>> = {
  report: FileText,
  review: ClipboardCheck,
  submission: Users,
  request: Mail,
  consent: Lock,
  share: Share2,
};

const TYPE_COLOR: Record<AuditType, string> = {
  report: "text-[#172033] bg-[#172033]/10",
  review: "text-[#2F7D7E] bg-[#2F7D7E]/10",
  submission: "text-[#8A6422] bg-[#C6923A]/10",
  request: "text-[#374151] bg-gray-100",
  consent: "text-[#2F7D7E] bg-[#2F7D7E]/10",
  share: "text-[#172033] bg-[#172033]/10",
};

export function TopBar({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  const { t } = useTranslation();
  const recent = listAudit().slice(0, 5);

  return (
    <div className="h-16 bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-[#111827] font-semibold text-base">{title}</h1>
        {subtitle && <p className="text-[#6B7280] text-xs mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <LanguageToggle />
        <Popover
          trigger={
            <button
              type="button"
              className="relative p-2 text-[#6B7280] hover:text-[#374151] hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Bell className="w-4 h-4" />
              {recent.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C6923A] rounded-full" />
              )}
            </button>
          }
        >
          <div className="min-w-72">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                {t("notifications.recentActivity")}
              </p>
              <span className="text-[10px] text-[#9CA3AF]">
                {t("notifications.itemsCount", { count: recent.length })}
              </span>
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {recent.length === 0 && (
                <p className="text-xs text-[#9CA3AF] py-4 text-center">{t("notifications.empty")}</p>
              )}
              {recent.map((entry) => {
                const Icon = TYPE_ICON[entry.type] ?? Bell;
                return (
                  <div
                    key={entry.id}
                    className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-[#F7F8FA]"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        TYPE_COLOR[entry.type] ?? "bg-gray-100"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#111827] truncate">
                        {entry.action}
                      </p>
                      <p className="text-[11px] text-[#9CA3AF] truncate">
                        {entry.user} · {entry.candidate}
                      </p>
                      <p className="text-[10px] text-[#9CA3AF] mt-0.5">{entry.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Popover>
      </div>
    </div>
  );
}
