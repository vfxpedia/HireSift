import React from "react";
import { Bell } from "lucide-react";

export function TopBar({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="h-16 bg-white border-b border-[#E5E7EB] px-6 flex items-center justify-between shrink-0">
      <div>
        <h1 className="text-[#111827] font-semibold text-base">{title}</h1>
        {subtitle && <p className="text-[#6B7280] text-xs mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        <button className="relative p-2 text-[#6B7280] hover:text-[#374151] hover:bg-gray-50 rounded-lg transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#C6923A] rounded-full" />
        </button>
      </div>
    </div>
  );
}
