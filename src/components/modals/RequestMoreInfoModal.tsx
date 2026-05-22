import { useState } from "react";
import { Mail } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Modal } from "../primitives/Modal";
import { PrimaryBtn, SecondaryBtn } from "../primitives/Buttons";
import { inputClass } from "../primitives/Field";
import { toast } from "../primitives/Toaster";
import { addAudit } from "../../api/audit";
import type { Candidate } from "../../types";

interface Props {
  open: boolean;
  onClose: () => void;
  candidate: Candidate;
  reviewer?: string;
}

export function RequestMoreInfoModal({ open, onClose, candidate, reviewer }: Props) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");

  const presets = t("modals.requestMoreInfo.presets", { returnObjects: true }) as string[];

  const send = () => {
    const text = message.trim();
    if (!text) {
      toast.error(t("modals.requestMoreInfo.missingMessage"));
      return;
    }
    addAudit({
      action: "Additional Information Requested",
      user: reviewer ?? "Reviewer",
      candidate: candidate.code,
      type: "review",
    });
    toast.success(t("modals.requestMoreInfo.sentToast", { email: candidate.email }));
    setMessage("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("modals.requestMoreInfo.title")}
      description={t("modals.requestMoreInfo.description", { name: candidate.name })}
      size="md"
      footer={
        <>
          <SecondaryBtn onClick={onClose}>{t("common.cancel")}</SecondaryBtn>
          <PrimaryBtn onClick={send} icon={<Mail className="w-4 h-4" />}>
            {t("modals.requestMoreInfo.send")}
          </PrimaryBtn>
        </>
      }
    >
      <div className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder={t("modals.requestMoreInfo.placeholder")}
          className={inputClass + " resize-none"}
        />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
            {t("modals.requestMoreInfo.preset")}
          </p>
          <div className="space-y-1">
            {Array.isArray(presets) &&
              presets.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setMessage(p)}
                  className="w-full text-left text-xs text-[#374151] px-3 py-2 rounded-lg hover:bg-[#F7F8FA] border border-[#E5E7EB]"
                >
                  {p}
                </button>
              ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
