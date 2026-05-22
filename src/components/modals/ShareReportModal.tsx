import { useState } from "react";
import { Share2, Copy, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
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

const ACCESS_LEVEL_VALUES: AccessLevel[] = ["view-only", "internal", "client"];

function accessLabelKey(a: AccessLevel): string {
  if (a === "view-only") return "accessViewOnly";
  if (a === "internal") return "accessInternal";
  return "accessClient";
}
function accessDescKey(a: AccessLevel): string {
  if (a === "view-only") return "accessViewOnlyDesc";
  if (a === "internal") return "accessInternalDesc";
  return "accessClientDesc";
}

export function ShareReportModal({ open, onClose, candidate, reviewer }: Props) {
  const { t } = useTranslation();
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
      toast.success(t("modals.shareReport.linkCopiedToast"));
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
    toast.success(t("modals.shareReport.sharedToast", { date: expiration }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("modals.shareReport.title")}
      description={`${candidate.name} · ${candidate.code}`}
      size="md"
      footer={
        <>
          <SecondaryBtn onClick={onClose}>{shared ? t("common.close") : t("common.cancel")}</SecondaryBtn>
          {!shared && (
            <PrimaryBtn onClick={share} icon={<Share2 className="w-4 h-4" />}>
              {t("modals.shareReport.shareLink")}
            </PrimaryBtn>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">{t("modals.shareReport.readonlyLink")}</label>
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
              {copied ? t("common.copied") : t("common.copy")}
            </button>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
            {t("modals.shareReport.accessLevel")}
          </p>
          <div className="space-y-2">
            {ACCESS_LEVEL_VALUES.map((value) => (
              <label
                key={value}
                className="flex items-start gap-2.5 cursor-pointer border border-[#E5E7EB] rounded-lg px-3 py-2.5 hover:bg-[#F7F8FA]"
              >
                <input
                  type="radio"
                  name="access"
                  value={value}
                  checked={access === value}
                  onChange={() => setAccess(value)}
                  className="accent-[#2F7D7E] mt-0.5"
                />
                <div className="min-w-0">
                  <p className="text-sm text-[#374151] font-medium">{t(`modals.shareReport.${accessLabelKey(value)}`)}</p>
                  <p className="text-[11px] text-[#6B7280]">{t(`modals.shareReport.${accessDescKey(value)}`)}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">{t("modals.shareReport.expiration")}</label>
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
            <span className="text-xs text-[#374151]">{t("modals.shareReport.enableClient")}</span>
          </label>
        </div>

        {shared && (
          <div className="flex items-start gap-2 px-3 py-2.5 bg-[#2F7D7E]/10 border border-[#2F7D7E]/30 rounded-lg">
            <Check className="w-3.5 h-3.5 text-[#2F7D7E] mt-0.5" />
            <div className="text-xs text-[#2F7D7E] leading-relaxed">
              <p className="font-semibold">{t("modals.shareReport.sharedTitle")}</p>
              <p>{t("modals.shareReport.sharedBody")}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
