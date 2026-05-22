import { useState } from "react";
import { Mail, Copy, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Modal } from "../primitives/Modal";
import { PrimaryBtn, SecondaryBtn } from "../primitives/Buttons";
import { inputClass } from "../primitives/Field";
import { toast } from "../primitives/Toaster";
import { addAudit } from "../../api/audit";
import type { Candidate } from "../../types";

interface VerificationLinkModalProps {
  open: boolean;
  onClose: () => void;
  candidate: Candidate;
}

export function VerificationLinkModal({ open, onClose, candidate }: VerificationLinkModalProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const link = `${typeof window !== "undefined" ? window.location.origin : "https://hire-sift.vercel.app"}/verify/${candidate.id}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success(t("modals.createVerification.linkCopiedToast"));
    } catch {
      /* noop */
    }
  };

  const sendInvite = () => {
    addAudit({
      action: "Verification Link Sent",
      user: "Admin",
      candidate: candidate.code,
      type: "request",
    });
    setSent(true);
    toast.success(t("modals.createVerification.inviteSentToast", { email: candidate.email }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("modals.verificationLink.title")}
      description={t("modals.verificationLink.description", { name: candidate.name })}
      size="md"
      footer={
        <>
          <SecondaryBtn onClick={onClose}>{t("common.close")}</SecondaryBtn>
          <PrimaryBtn onClick={sendInvite} icon={<Mail className="w-4 h-4" />}>
            {sent ? t("modals.verificationLink.inviteSent") : t("modals.verificationLink.sendInvite")}
          </PrimaryBtn>
        </>
      }
    >
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1.5">
            {t("modals.verificationLink.secureLink")}
          </label>
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
        <div className="text-xs text-[#6B7280] bg-[#F7F8FA] rounded-lg p-3 leading-relaxed">
          {t("modals.verificationLink.info")}
        </div>
      </div>
    </Modal>
  );
}
