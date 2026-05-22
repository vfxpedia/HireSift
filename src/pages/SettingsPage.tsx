import { useState } from "react";
import { Info } from "lucide-react";
import { TopBar } from "../components/layout/TopBar";
import { Card } from "../components/primitives/Card";
import { PrimaryBtn, SecondaryBtn } from "../components/primitives/Buttons";
import { inputClass } from "../components/primitives/Field";
import { EditTemplateModal } from "../components/modals/EditTemplateModal";
import { cn } from "../lib/cn";
import { db } from "../api/db";
import { toast } from "../components/primitives/Toaster";
import { formatDate } from "../lib/format";
import type { OrgSettings } from "../types";

const RETENTION_OPTIONS = ["30 days", "60 days", "90 days", "180 days", "1 year", "2 years"];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"org" | "retention" | "consent">("org");
  const [org, setOrg] = useState<OrgSettings>(db.getOrg());
  const [savedTick, setSavedTick] = useState(false);
  const [showTemplateEditor, setShowTemplateEditor] = useState(false);

  const updateOrg = (patch: Partial<OrgSettings>) => setOrg({ ...org, ...patch });
  const updateRetention = (key: keyof OrgSettings["retention"], value: string) =>
    setOrg({ ...org, retention: { ...org.retention, [key]: value } });

  const save = () => {
    db.setOrg(org);
    setSavedTick(true);
    setTimeout(() => setSavedTick(false), 1500);
    toast.success("Settings saved.");
  };

  const saveTemplate = (next: string) => {
    const updated: OrgSettings = {
      ...org,
      consentTemplate: next,
      consentTemplateUpdatedAt: new Date().toISOString(),
      consentTemplateVersion: bumpVersion(org.consentTemplateVersion),
    };
    setOrg(updated);
    db.setOrg(updated);
    toast.success("Consent template updated.");
  };

  const tabs = [
    { id: "org", label: "Organization" },
    { id: "retention", label: "Data Retention" },
    { id: "consent", label: "Consent Templates" },
  ] as const;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar title="Settings" subtitle="Organization and compliance settings" />
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex gap-1 bg-[#F3F4F6] p-1 rounded-xl mb-6 w-fit">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  activeTab === t.id
                    ? "bg-white text-[#172033] shadow-sm"
                    : "text-[#6B7280] hover:text-[#374151]",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {activeTab === "org" && (
            <div className="space-y-5">
              <Card className="p-5">
                <h3 className="font-semibold text-sm text-[#111827] mb-4">Organization Information</h3>
                <div className="space-y-4">
                  <Field label="Organization name">
                    <input
                      value={org.name}
                      onChange={(e) => updateOrg({ name: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Primary contact email">
                    <input
                      value={org.contactEmail}
                      onChange={(e) => updateOrg({ contactEmail: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                  <Field label="Time zone">
                    <input
                      value={org.timeZone}
                      onChange={(e) => updateOrg({ timeZone: e.target.value })}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <div className="mt-4 pt-4 border-t border-[#E5E7EB] flex justify-end">
                  <PrimaryBtn onClick={save} className="text-sm py-2">
                    {savedTick ? "Saved" : "Save changes"}
                  </PrimaryBtn>
                </div>
              </Card>
              <Card className="p-5">
                <h3 className="font-semibold text-sm text-[#111827] mb-3">Team Members</h3>
                <div className="space-y-3">
                  {[
                    { name: "Sarah Chen", email: "sarah@techcorp.com", role: "Admin" },
                    { name: "Marcus Webb", email: "marcus@techcorp.com", role: "Reviewer" },
                  ].map((m) => (
                    <div
                      key={m.name}
                      className="flex items-center justify-between py-2 border-b border-[#E5E7EB] last:border-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 bg-[#2F7D7E] rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {m.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#374151]">{m.name}</p>
                          <p className="text-xs text-[#9CA3AF]">{m.email}</p>
                        </div>
                      </div>
                      <span className="text-xs text-[#6B7280] bg-[#F3F4F6] px-2.5 py-1 rounded-md">
                        {m.role}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {activeTab === "retention" && (
            <Card className="p-5">
              <h3 className="font-semibold text-sm text-[#111827] mb-2">Data Retention Policy</h3>
              <p className="text-xs text-[#6B7280] mb-5">
                Control how long submitted candidate data is retained.
              </p>
              <div className="space-y-4">
                {(
                  [
                    { key: "submission", label: "Candidate submission data" },
                    { key: "media", label: "Media samples (video/voice)" },
                    { key: "reports", label: "Trust reports" },
                    { key: "auditLogs", label: "Audit logs" },
                  ] as const
                ).map((f) => (
                  <div
                    key={f.key}
                    className="flex items-center justify-between py-3 border-b border-[#E5E7EB] last:border-0"
                  >
                    <p className="text-sm font-medium text-[#374151]">{f.label}</p>
                    <select
                      value={org.retention[f.key]}
                      onChange={(e) => updateRetention(f.key, e.target.value)}
                      className="text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2F7D7E]/30"
                    >
                      {RETENTION_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-[#F7F8FA] rounded-xl">
                <p className="text-xs text-[#6B7280]">
                  <Info className="w-3 h-3 inline mr-1" />
                  Candidates may request early deletion at any time by contacting
                  privacy@hiresift.com. Retention settings apply to organizational defaults only.
                </p>
              </div>
              <div className="mt-4 flex justify-end">
                <PrimaryBtn onClick={save} className="text-sm py-2">
                  {savedTick ? "Saved" : "Save retention policy"}
                </PrimaryBtn>
              </div>
            </Card>
          )}

          {activeTab === "consent" && (
            <Card className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-[#111827]">Consent Template</h3>
                <SecondaryBtn className="text-xs py-1.5" onClick={() => setShowTemplateEditor(true)}>
                  Edit template
                </SecondaryBtn>
              </div>
              <pre className="bg-[#F7F8FA] border border-[#E5E7EB] rounded-xl p-4 text-sm text-[#374151] leading-relaxed whitespace-pre-wrap font-sans">
                {org.consentTemplate}
              </pre>
              <div className="mt-3 text-xs text-[#9CA3AF]">
                Last updated:{" "}
                {org.consentTemplateUpdatedAt ? formatDate(org.consentTemplateUpdatedAt) : "—"} · Version{" "}
                {org.consentTemplateVersion ?? "1.0"}
              </div>
            </Card>
          )}
        </div>
      </div>
      <EditTemplateModal
        open={showTemplateEditor}
        onClose={() => setShowTemplateEditor(false)}
        initialValue={org.consentTemplate}
        onSave={saveTemplate}
      />
    </div>
  );
}

function bumpVersion(v?: string): string {
  if (!v) return "1.0";
  const [major, minor] = v.split(".").map((n) => parseInt(n, 10) || 0);
  return `${major}.${minor + 1}`;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#374151] mb-1.5">{label}</label>
      {children}
    </div>
  );
}
