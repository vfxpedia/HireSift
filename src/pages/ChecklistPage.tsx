import { useEffect, useState } from "react";
import { CheckCircle, Circle, AlertTriangle, Clock } from "lucide-react";
import { useTranslation } from "react-i18next";
import { TopBar } from "../components/layout/TopBar";
import { Card, SectionLabel } from "../components/primitives/Card";
import { PrimaryBtn } from "../components/primitives/Buttons";
import { cn } from "../lib/cn";
import { load, save } from "../api/storage";
import { toast } from "../components/primitives/Toaster";

type Status = "complete" | "partial" | "missing" | "manual";

interface ChecklistItem {
  id: string;
  requirement: string;
  defaultStatus: Status;
  defaultNotes?: string;
}

const ITEMS: ChecklistItem[] = [
  { id: "landing", requirement: "Landing Page", defaultStatus: "complete" },
  { id: "dashboard", requirement: "Admin Dashboard", defaultStatus: "complete" },
  { id: "candidate-list", requirement: "Candidate List", defaultStatus: "complete" },
  { id: "candidate-detail", requirement: "Candidate Detail", defaultStatus: "complete" },
  { id: "create-verification", requirement: "Create Verification Request", defaultStatus: "complete" },
  { id: "consent", requirement: "Candidate Consent", defaultStatus: "complete" },
  { id: "submission", requirement: "Candidate Submission", defaultStatus: "complete" },
  { id: "reviewer", requirement: "Reviewer Dashboard", defaultStatus: "complete" },
  { id: "trust-report", requirement: "Candidate Trust Report", defaultStatus: "complete" },
  { id: "export-pdf", requirement: "Export PDF", defaultStatus: "complete" },
  { id: "share-report", requirement: "Share Report", defaultStatus: "complete" },
  { id: "settings", requirement: "Settings", defaultStatus: "complete" },
  { id: "audit-log", requirement: "Audit Log", defaultStatus: "complete" },
  {
    id: "i18n",
    requirement: "EN/KR Toggle",
    defaultStatus: "missing",
    defaultNotes: "Planned for next iteration",
  },
  { id: "guardrails", requirement: "Privacy Guardrails", defaultStatus: "complete" },
  { id: "scope", requirement: "MVP / Future / Out-of-Scope", defaultStatus: "complete" },
];

const STATUS_CONFIG: Record<Status, { cls: string; icon: React.ComponentType<{ className?: string }>; iconCls: string }> = {
  complete: {
    cls: "bg-[#2F7D7E]/10 text-[#2F7D7E] border-[#2F7D7E]/30",
    icon: CheckCircle,
    iconCls: "text-[#2F7D7E]",
  },
  partial: {
    cls: "bg-[#C6923A]/10 text-[#8A6422] border-[#C6923A]/30",
    icon: Clock,
    iconCls: "text-[#8A6422]",
  },
  missing: {
    cls: "bg-gray-100 text-gray-500 border-gray-200",
    icon: Circle,
    iconCls: "text-gray-500",
  },
  manual: {
    cls: "bg-[#172033]/10 text-[#172033] border-[#172033]/30",
    icon: AlertTriangle,
    iconCls: "text-[#172033]",
  },
};

const STORAGE_KEY = "checklist:v1";

interface ChecklistState {
  [id: string]: { status: Status; notes: string };
}

function buildDefault(): ChecklistState {
  return ITEMS.reduce<ChecklistState>((acc, item) => {
    acc[item.id] = { status: item.defaultStatus, notes: item.defaultNotes ?? "" };
    return acc;
  }, {});
}

export default function ChecklistPage() {
  const { t } = useTranslation();
  const [state, setState] = useState<ChecklistState>(() => ({
    ...buildDefault(),
    ...load<ChecklistState>(STORAGE_KEY, {}),
  }));
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (dirty) {
      save(STORAGE_KEY, state);
      setDirty(false);
    }
  }, [dirty, state]);

  const update = (id: string, patch: Partial<{ status: Status; notes: string }>) => {
    setState((prev) => ({
      ...prev,
      [id]: { ...(prev[id] ?? { status: "missing", notes: "" }), ...patch },
    }));
    setDirty(true);
  };

  const reset = () => {
    setState(buildDefault());
    save(STORAGE_KEY, {});
    toast.success(t("checklist.resetToast"));
  };

  const totals = ITEMS.reduce<Record<Status, number>>(
    (acc, item) => {
      const s = state[item.id]?.status ?? item.defaultStatus;
      acc[s] = (acc[s] ?? 0) + 1;
      return acc;
    },
    { complete: 0, partial: 0, missing: 0, manual: 0 },
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title={t("checklist.title")}
        subtitle={t("checklist.subtitle")}
        actions={
          <PrimaryBtn onClick={reset} className="text-sm py-2">
            {t("checklist.reset")}
          </PrimaryBtn>
        }
      />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-5">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(["complete", "partial", "manual", "missing"] as Status[]).map((s) => {
              const cfg = STATUS_CONFIG[s];
              const Icon = cfg.icon;
              return (
                <Card key={s} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon className={cn("w-4 h-4", cfg.iconCls)} />
                    <p className="text-xs text-[#6B7280]">{t(`checklist.status.${s}`)}</p>
                  </div>
                  <p className="text-2xl font-bold text-[#111827]">{totals[s] ?? 0}</p>
                </Card>
              );
            })}
          </div>

          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7EB]">
              <SectionLabel>{t("checklist.requirementsTitle")}</SectionLabel>
              <p className="text-sm font-semibold text-[#111827] -mt-1">
                {t("checklist.requirementsHeading")}
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    {[t("checklist.colRequirement"), t("checklist.colStatus"), t("checklist.colNotes")].map((h, i) => (
                      <th key={i} className="px-4 py-3 text-left text-xs font-medium text-[#6B7280]">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ITEMS.map((item) => {
                    const row = state[item.id] ?? { status: item.defaultStatus, notes: "" };
                    return (
                      <tr key={item.id} className="border-b border-[#E5E7EB] last:border-0 hover:bg-[#F9FAFB]">
                        <td className="px-4 py-3 align-top">
                          <p className="text-sm font-medium text-[#374151]">
                            {t(`checklist.items.${item.id}`, { defaultValue: item.requirement })}
                          </p>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <select
                            value={row.status}
                            onChange={(e) => update(item.id, { status: e.target.value as Status })}
                            className={cn(
                              "text-xs font-medium px-2.5 py-1 rounded-md border focus:outline-none focus:ring-2 focus:ring-[#2F7D7E]/30",
                              STATUS_CONFIG[row.status].cls,
                            )}
                          >
                            {(Object.keys(STATUS_CONFIG) as Status[]).map((s) => (
                              <option key={s} value={s}>
                                {t(`checklist.status.${s}`)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 align-top w-1/2">
                          <input
                            type="text"
                            value={row.notes}
                            onChange={(e) => update(item.id, { notes: e.target.value })}
                            placeholder={t("checklist.notesPlaceholder")}
                            className="w-full text-xs bg-transparent border border-transparent hover:border-[#E5E7EB] focus:border-[#2F7D7E] focus:bg-white rounded px-2 py-1 transition-colors focus:outline-none"
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <div className="text-[11px] text-[#9CA3AF] text-center">{t("checklist.footnote")}</div>
        </div>
      </div>
    </div>
  );
}
