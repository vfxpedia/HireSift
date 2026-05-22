import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { Modal } from "../primitives/Modal";
import { PrimaryBtn, SecondaryBtn } from "../primitives/Buttons";
import { inputClass } from "../primitives/Field";
import { toast } from "../primitives/Toaster";
import { addAudit } from "../../api/audit";
import type { Candidate } from "../../types";

type AccessLevel = "view-only" | "internal" | "client";

interface Props {
  open: boolean;
  onClose: () => void;
  candidate: Candidate;
  reviewer: string;
}

const ACCESS_LEVELS: { value: AccessLevel; label: string; desc: string }[] = [
  { value: "view-only", label: "View only", desc: "Anyone with the link can read the report" },
  { value: "internal", label: "Internal reviewer only", desc: "Requires HireSift sign-in" },
  { value: "client", label: "Client viewer", desc: "Read-only branded view for the hiring client" },
];

export function ShareReportModal({ open, onClose, candidate, reviewer }: Props) {
  const [access, setAccess] = useState<AccessLevel>("internal");
  const [expiration, setExpiration] = useState<string>(
    new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  );
  const [clientViewer, setClientViewer] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const link = `${typeof window !== "undefined" ? window.location.origin : "https://hire-sift.vercel.app"}/app/reports/${candidate.id}${
    access === "client" || clientViewer ? "?view=client" : ""
  }`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("Link copied");
    } catch {
      /* noop */
    }
  };

  const share = async () => {
    await copyLink();
    addAudit({
      action: `Report Shared (${access})`,
      user: reviewer,
      candidate: candidate.code,
      type: "share",
    });
    setShared(true);
    toast.success(`Share link created — expires ${expiration}`);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Share Report"
      description={`${candidate.name} · ${candidate.code}`}
      size="md"
      footer={
        <>
          <SecondaryBtn onClick={onClose}>{shared ? "Close" : "Cancel"}</SecondaryBtn>
          {!shared && (
            <PrimaryBtn onClick={share} icon={<Share2 className="w-4 h-4" />}>
              Share link
            </PrimaryBtn>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">Read-only link</label>
          <div className="flex gap-2">
            <input
              readOnly
              value={link}
              className={inputClass + " font-mono text-xs"}
              onFocus={(e) => e.currentTarget.select()}
            />
            <button
              type="button"
              onClick={copyLink}
              className="px-3 py-2.5 text-xs font-medium bg-[#172033] text-white rounded-lg hover:bg-[#1e2d47] flex items-center gap-1.5 whitespace-nowrap"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
            Access level
          </p>
          <div className="space-y-2">
            {ACCESS_LEVELS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-start gap-2.5 cursor-pointer border border-[#E5E7EB] rounded-lg px-3 py-2.5 hover:bg-[#F7F8FA]"
              >
                <input
                  type="radio"
                  name="access"
                  value={opt.value}
                  checked={access === opt.value}
                  onChange={() => setAccess(opt.value)}
                  className="accent-[#2F7D7E] mt-0.5"
                />
                <div className="min-w-0">
                  <p className="text-sm text-[#374151] font-medium">{opt.label}</p>
                  <p className="text-[11px] text-[#6B7280]">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">Expiration</label>
            <input
              type="date"
              value={expiration}
              onChange={(e) => setExpiration(e.target.value)}
              className={inputClass}
            />
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-5">
            <input
              type="checkbox"
              checked={clientViewer}
              onChange={(e) => setClientViewer(e.target.checked)}
              className="accent-[#2F7D7E] w-4 h-4"
            />
            <span className="text-xs text-[#374151]">Enable client viewer</span>
          </label>
        </div>

        {shared && (
          <div className="flex items-start gap-2 px-3 py-2.5 bg-[#2F7D7E]/10 border border-[#2F7D7E]/30 rounded-lg">
            <Check className="w-3.5 h-3.5 text-[#2F7D7E] mt-0.5" />
            <div className="text-xs text-[#2F7D7E] leading-relaxed">
              <p className="font-semibold">Share recorded</p>
              <p>The share action is in the audit log. Recipients can open the link until expiration.</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
