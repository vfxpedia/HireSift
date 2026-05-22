import { useState } from "react";
import { Download, FileText, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Modal } from "../primitives/Modal";
import { PrimaryBtn, SecondaryBtn } from "../primitives/Buttons";

export interface ExportOptions {
  includeEvidenceCards: boolean;
  includeReviewerNotes: boolean;
  includeGuardrailNotice: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  candidateName: string;
  candidateCode: string;
  onExport: (opts: ExportOptions) => void;
}

export function ExportPdfModal({ open, onClose, candidateName, candidateCode, onExport }: Props) {
  const { t } = useTranslation();
  const [opts, setOpts] = useState<ExportOptions>({
    includeEvidenceCards: true,
    includeReviewerNotes: true,
    includeGuardrailNotice: true,
  });
  const [ready, setReady] = useState(false);

  const toggle = (key: keyof ExportOptions) => setOpts({ ...opts, [key]: !opts[key] });

  const handleExport = () => {
    onExport(opts);
    setReady(true);
  };

  const close = () => {
    setReady(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title={t("modals.exportPdf.title")}
      description={`${candidateName} · ${candidateCode}`}
      size="md"
      footer={
        <>
          <SecondaryBtn onClick={close}>{ready ? t("common.close") : t("common.cancel")}</SecondaryBtn>
          {!ready && (
            <PrimaryBtn onClick={handleExport} icon={<Download className="w-4 h-4" />}>
              {t("modals.exportPdf.download")}
            </PrimaryBtn>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <div className="border border-[#E5E7EB] rounded-xl p-4 bg-[#F9FAFB]">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="w-4 h-4 text-[#172033]" />
            <p className="text-sm font-semibold text-[#111827]">{t("modals.exportPdf.previewTitle")}</p>
          </div>
          <p className="text-xs text-[#6B7280] leading-relaxed">{t("modals.exportPdf.previewBody")}</p>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
            {t("modals.exportPdf.sections")}
          </p>
          <div className="space-y-2">
            {(
              [
                { key: "includeEvidenceCards", label: t("modals.exportPdf.optEvidence") },
                { key: "includeReviewerNotes", label: t("modals.exportPdf.optReviewerNotes") },
                { key: "includeGuardrailNotice", label: t("modals.exportPdf.optGuardrail") },
              ] as const
            ).map((opt) => (
              <label
                key={opt.key}
                className="flex items-center gap-2.5 cursor-pointer border border-[#E5E7EB] rounded-lg px-3 py-2.5 hover:bg-[#F7F8FA]"
              >
                <input
                  type="checkbox"
                  checked={opts[opt.key]}
                  onChange={() => toggle(opt.key)}
                  className="accent-[#2F7D7E] w-4 h-4"
                />
                <span className="text-sm text-[#374151]">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        {ready && (
          <div className="flex items-start gap-2 px-3 py-2.5 bg-[#2F7D7E]/10 border border-[#2F7D7E]/30 rounded-lg">
            <Check className="w-3.5 h-3.5 text-[#2F7D7E] mt-0.5" />
            <div className="text-xs text-[#2F7D7E] leading-relaxed">
              <p className="font-semibold">{t("modals.exportPdf.readyTitle")}</p>
              <p>{t("modals.exportPdf.readyBody")}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
