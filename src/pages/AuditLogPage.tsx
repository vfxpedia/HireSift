import { useMemo, useState } from "react";
import { Download, Filter, Search, Lock, X } from "lucide-react";
import { TopBar } from "../components/layout/TopBar";
import { Card } from "../components/primitives/Card";
import { SecondaryBtn } from "../components/primitives/Buttons";
import { Popover } from "../components/primitives/Popover";
import { cn } from "../lib/cn";
import { listAudit } from "../api/audit";
import type { AuditType } from "../types";

const TYPE_OPTIONS: { value: AuditType; label: string }[] = [
  { value: "report", label: "Report" },
  { value: "review", label: "Review" },
  { value: "submission", label: "Submission" },
  { value: "request", label: "Request" },
  { value: "consent", label: "Consent" },
  { value: "share", label: "Share" },
];

const TYPE_COLOR: Record<string, string> = {
  report: "bg-[#172033]/10 text-[#172033]",
  review: "bg-[#2F7D7E]/10 text-[#2F7D7E]",
  submission: "bg-[#C6923A]/10 text-[#8A6422]",
  request: "bg-gray-100 text-gray-600",
  consent: "bg-[#2F7D7E]/10 text-[#2F7D7E]",
  share: "bg-[#172033]/10 text-[#172033]",
};

export default function AuditLogPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<Set<AuditType>>(new Set());
  const entries = listAudit();
  const filtered = useMemo(
    () =>
      entries.filter((e) => {
        const matchesSearch =
          e.action.toLowerCase().includes(search.toLowerCase()) ||
          e.user.toLowerCase().includes(search.toLowerCase()) ||
          e.candidate.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter.size === 0 || typeFilter.has(e.type);
        return matchesSearch && matchesType;
      }),
    [entries, search, typeFilter],
  );

  const toggleType = (v: AuditType) => {
    const next = new Set(typeFilter);
    next.has(v) ? next.delete(v) : next.add(v);
    setTypeFilter(next);
  };

  const exportLog = () => {
    const headers = ["id", "action", "type", "user", "candidate", "time"];
    const rows = filtered.map((e) =>
      headers.map((h) => JSON.stringify((e as Record<string, unknown>)[h] ?? "")).join(","),
    );
    const csv = headers.join(",") + "\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hiresift-audit-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title="Audit Log"
        subtitle="Complete record of all actions and events"
        actions={
          <SecondaryBtn onClick={exportLog} className="text-sm py-2" icon={<Download className="w-4 h-4" />}>
            Export Log
          </SecondaryBtn>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <Card>
          <div className="px-5 py-4 border-b border-[#E5E7EB] flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search audit log…"
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F7D7E]/30"
              />
            </div>
            <Popover
              trigger={
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50",
                    typeFilter.size > 0
                      ? "border-[#2F7D7E] text-[#2F7D7E] bg-[#2F7D7E]/5"
                      : "border-[#E5E7EB] text-[#6B7280]",
                  )}
                >
                  <Filter className="w-3.5 h-3.5" />
                  Filter
                  {typeFilter.size > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#2F7D7E] text-white text-[10px] font-semibold">
                      {typeFilter.size}
                    </span>
                  )}
                </button>
              }
            >
              <div className="space-y-3 min-w-48">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF]">
                  Filter by type
                </p>
                <div className="space-y-1.5">
                  {TYPE_OPTIONS.map((opt) => (
                    <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-xs text-[#374151]">
                      <input
                        type="checkbox"
                        checked={typeFilter.has(opt.value)}
                        onChange={() => toggleType(opt.value)}
                        className="accent-[#2F7D7E] w-3.5 h-3.5"
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
                {typeFilter.size > 0 && (
                  <button
                    type="button"
                    onClick={() => setTypeFilter(new Set())}
                    className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#374151]"
                  >
                    <X className="w-3 h-3" /> Clear
                  </button>
                )}
              </div>
            </Popover>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  {["Action", "Type", "User", "Candidate", "Timestamp"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#6B7280]">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((entry) => (
                  <tr
                    key={entry.id}
                    className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB] transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium text-[#374151]">{entry.action}</td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-xs font-medium px-2.5 py-1 rounded-md capitalize",
                          TYPE_COLOR[entry.type] ?? "bg-gray-100 text-gray-600",
                        )}
                      >
                        {entry.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#374151]">{entry.user}</td>
                    <td className="px-4 py-3 text-xs text-[#9CA3AF] font-mono">{entry.candidate}</td>
                    <td className="px-4 py-3 text-xs text-[#6B7280]">{entry.time}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-[#9CA3AF]">
                      No audit entries match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <div className="mt-4 p-4 bg-white border border-[#E5E7EB] rounded-2xl">
          <div className="flex items-start gap-3">
            <Lock className="w-4 h-4 text-[#6B7280] mt-0.5 shrink-0" />
            <p className="text-xs text-[#6B7280] leading-relaxed">
              <strong className="text-[#374151]">Audit log integrity:</strong> All log entries are
              immutable and timestamped. Logs are retained for 2 years per the default data retention
              policy and may be exported for compliance review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
