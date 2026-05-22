import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Plus,
  Search,
  CheckCircle,
  Eye,
  MoreHorizontal,
  Filter,
  Copy,
  Check,
  X,
} from "lucide-react";
import { TopBar } from "../components/layout/TopBar";
import { Card } from "../components/primitives/Card";
import { PrimaryBtn } from "../components/primitives/Buttons";
import { AttentionBadge, StatusBadge } from "../components/primitives/Badges";
import { Popover } from "../components/primitives/Popover";
import { CreateVerificationModal } from "../components/modals/CreateVerificationModal";
import { listCandidates } from "../api/candidates";
import type { Candidate, AttentionLevel, SubmissionStatus } from "../types";
import { cn } from "../lib/cn";

const STATUS_VALUES: SubmissionStatus[] = ["pending", "in-progress", "submitted", "reviewed", "report-ready"];
const ATTENTION_VALUES: AttentionLevel[] = ["low", "medium", "high", "manual"];

export default function CandidatesPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [tick, setTick] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<Set<SubmissionStatus>>(new Set());
  const [attentionFilter, setAttentionFilter] = useState<Set<AttentionLevel>>(new Set());
  void tick;

  const candidates = listCandidates();
  const filtered = useMemo(
    () =>
      candidates.filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.code.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter.size === 0 || statusFilter.has(c.submissionStatus);
        const matchesAttention = attentionFilter.size === 0 || attentionFilter.has(c.attentionLevel);
        return matchesSearch && matchesStatus && matchesAttention;
      }),
    [candidates, search, statusFilter, attentionFilter],
  );

  const toggleStatus = (value: SubmissionStatus) => {
    const next = new Set(statusFilter);
    next.has(value) ? next.delete(value) : next.add(value);
    setStatusFilter(next);
  };
  const toggleAttention = (value: AttentionLevel) => {
    const next = new Set(attentionFilter);
    next.has(value) ? next.delete(value) : next.add(value);
    setAttentionFilter(next);
  };
  const clearFilters = () => {
    setStatusFilter(new Set());
    setAttentionFilter(new Set());
  };
  const activeFilterCount = statusFilter.size + attentionFilter.size;

  const copyLink = async (c: Candidate) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/verify/${c.id}`);
      setCopiedId(c.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title={t("candidates.title")}
        subtitle={t("candidates.subtitle", { count: candidates.length })}
        actions={
          <PrimaryBtn
            onClick={() => setShowModal(true)}
            icon={<Plus className="w-4 h-4" />}
            className="text-sm py-2"
          >
            {t("candidates.newVerification")}
          </PrimaryBtn>
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
                placeholder={t("candidates.searchPlaceholder")}
                className="w-full pl-9 pr-4 py-2 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F7D7E]/30 focus:border-[#2F7D7E]"
              />
            </div>
            <Popover
              trigger={
                <button
                  type="button"
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-sm border rounded-lg hover:bg-gray-50",
                    activeFilterCount > 0
                      ? "border-[#2F7D7E] text-[#2F7D7E] bg-[#2F7D7E]/5"
                      : "border-[#E5E7EB] text-[#6B7280]",
                  )}
                >
                  <Filter className="w-3.5 h-3.5" />
                  {t("common.filter")}
                  {activeFilterCount > 0 && (
                    <span className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#2F7D7E] text-white text-[10px] font-semibold">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
              }
            >
              <div className="space-y-4 min-w-60">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                    {t("candidates.filterStatus")}
                  </p>
                  <div className="space-y-1.5">
                    {STATUS_VALUES.map((value) => (
                      <label key={value} className="flex items-center gap-2 cursor-pointer text-xs text-[#374151]">
                        <input
                          type="checkbox"
                          checked={statusFilter.has(value)}
                          onChange={() => toggleStatus(value)}
                          className="accent-[#2F7D7E] w-3.5 h-3.5"
                        />
                        {t(`status.${value}`)}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
                    {t("candidates.filterAttention")}
                  </p>
                  <div className="space-y-1.5">
                    {ATTENTION_VALUES.map((value) => (
                      <label key={value} className="flex items-center gap-2 cursor-pointer text-xs text-[#374151]">
                        <input
                          type="checkbox"
                          checked={attentionFilter.has(value)}
                          onChange={() => toggleAttention(value)}
                          className="accent-[#2F7D7E] w-3.5 h-3.5"
                        />
                        {t(`attention.${value}`)}
                      </label>
                    ))}
                  </div>
                </div>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#374151]"
                  >
                    <X className="w-3 h-3" /> {t("common.clearAll")}
                  </button>
                )}
              </div>
            </Popover>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                  {[
                    t("candidates.colCandidate"),
                    t("candidates.colRole"),
                    t("candidates.colSubmission"),
                    t("candidates.colIdentity"),
                    t("candidates.colPortfolio"),
                    t("candidates.colSession"),
                    t("candidates.colAttention"),
                    t("candidates.colReport"),
                    t("candidates.colUpdated"),
                    "",
                  ].map((h, i) => (
                    <th
                      key={i}
                      className="px-4 py-3 text-left text-xs font-medium text-[#6B7280] whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB] transition-colors cursor-pointer"
                    onClick={() => navigate(`/app/candidates/${c.id}`)}
                  >
                    <td className="px-4 py-3.5">
                      <div>
                        <p className="text-sm font-medium text-[#111827]">{c.name}</p>
                        <p className="text-xs text-[#9CA3AF] font-mono mt-0.5">{c.code}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-[#374151] whitespace-nowrap">{c.role}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex flex-col items-start gap-1">
                        <StatusBadge status={c.submissionStatus} />
                        {c.submissionStatus === "pending" && c.linkSent && (
                          <span className="text-[10px] text-[#2F7D7E] flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" />
                            {t("candidates.linkSent")}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      {c.submissionStatus !== "pending" ? (
                        <span className="text-xs text-[#2F7D7E] flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {t("candidates.submittedShort")}
                        </span>
                      ) : (
                        <span className="text-xs text-[#9CA3AF]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {c.submissionStatus !== "pending" ? (
                        <span className="text-xs text-[#2F7D7E] flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {t("candidates.submittedShort")}
                        </span>
                      ) : (
                        <span className="text-xs text-[#9CA3AF]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      {c.submissionStatus !== "pending" && c.submissionStatus !== "in-progress" ? (
                        <span className="text-xs text-[#2F7D7E] flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Submitted
                        </span>
                      ) : (
                        <span className="text-xs text-[#9CA3AF]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5">
                      <AttentionBadge level={c.attentionLevel} />
                    </td>
                    <td className="px-4 py-3.5">
                      {c.reportReady ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/app/reports/${c.id}`);
                          }}
                          className="text-xs text-[#2F7D7E] hover:underline flex items-center gap-1 whitespace-nowrap"
                        >
                          <Eye className="w-3 h-3" /> {t("candidates.viewReport")}
                        </button>
                      ) : (
                        <span className="text-xs text-[#9CA3AF]">{t("candidates.notReady")}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-[#6B7280] whitespace-nowrap">
                      {c.lastUpdated}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => copyLink(c)}
                          title={t("candidates.copyLink")}
                          className="p-1.5 text-[#9CA3AF] hover:text-[#2F7D7E] rounded hover:bg-gray-50"
                        >
                          {copiedId === c.id ? (
                            <Check className="w-4 h-4 text-[#2F7D7E]" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => navigate(`/app/reviewer/${c.id}`)}
                          className="p-1.5 text-[#9CA3AF] hover:text-[#374151] rounded hover:bg-gray-50"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-12 text-center text-sm text-[#9CA3AF]">
                      {t("candidates.noMatch")}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
      {showModal && (
        <CreateVerificationModal
          onClose={() => {
            setShowModal(false);
            setTick((t) => t + 1);
          }}
          onCreated={(c) => {
            setShowModal(false);
            navigate(`/app/candidates/${c.id}`);
          }}
        />
      )}
    </div>
  );
}
