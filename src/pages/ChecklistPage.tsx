import { useEffect, useState } from "react";
import { CheckCircle, Circle, AlertTriangle, Clock } from "lucide-react";
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

const STATUS_CONFIG: Record<Status, { label: string; cls: string; icon: React.ComponentType<{ className?: string }> }> = {
  complete: {
    label: "Complete",
    cls: "bg-[#2F7D7E]/10 text-[#2F7D7E] border-[#2F7D7E]/30",
    icon: CheckCircle,
  },
  partial: {
    label: "Partial",
    cls: "bg-[#C6923A]/10 text-[#8A6422] border-[#C6923A]/30",
    icon: Clock,
  },
  missing: {
    label: "Missing",
    cls: "bg-gray-100 text-gray-500 border-gray-200",
    icon: Circle,
  },
  manual: {
    label: "Needs Manual Review",
    cls: "bg-[#172033]/10 text-[#172033] border-[#172033]/30",
    icon: AlertTriangle,
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
    toast.success("Checklist reset to defaults");
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
        title="Prototype Completion Checklist"
        subtitle="Track which MVP requirements are ready for demo"
        actions={
          <PrimaryBtn onClick={reset} className="text-sm py-2">
            Reset to defaults
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
                    <Icon className={cn("w-4 h-4", cfg.cls.split(" ")[1])} />
                    <p className="text-xs text-[#6B7280]">{cfg.label}</p>
                  </div>
                  <p className="text-2xl font-bold text-[#111827]">{totals[s] ?? 0}</p>
                </Card>
              );
            })}
          </div>

          <Card>
            <div className="px-5 py-4 border-b border-[#E5E7EB]">
              <SectionLabel>Requirements</SectionLabel>
              <p className="text-sm font-semibold text-[#111827] -mt-1">
                MVP completion status — editable
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#E5E7EB] bg-[#F9FAFB]">
                    {["Requirement", "Status", "Notes"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-medium text-[#6B7280]">
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
                          <p className="text-sm font-medium text-[#374151]">{item.requirement}</p>
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
                                {STATUS_CONFIG[s].label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 align-top w-1/2">
                          <input
                            type="text"
                            value={row.notes}
                            onChange={(e) => update(item.id, { notes: e.target.value })}
                            placeholder="Add a quick note…"
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

          <div className="text-[11px] text-[#9CA3AF] text-center">
            Changes are saved automatically to your browser. Use "Reset to defaults" to start over.
          </div>
        </div>
      </div>
    </div>
  );
}
