import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "../primitives/Modal";
import { PrimaryBtn, SecondaryBtn } from "../primitives/Buttons";
import { inputClass } from "../primitives/Field";

interface EditTemplateModalProps {
  open: boolean;
  onClose: () => void;
  initialValue: string;
  onSave: (next: string) => void;
}

export function EditTemplateModal({ open, onClose, initialValue, onSave }: EditTemplateModalProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState(initialValue);

  const save = () => {
    onSave(value);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t("settings.editModal.title")}
      description={t("settings.editModal.description")}
      size="lg"
      footer={
        <>
          <SecondaryBtn onClick={onClose}>{t("common.cancel")}</SecondaryBtn>
          <PrimaryBtn onClick={save}>{t("settings.saveChanges")}</PrimaryBtn>
        </>
      }
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={16}
        className={inputClass + " font-mono text-xs leading-relaxed"}
      />
      <p className="text-[11px] text-[#9CA3AF] mt-2">{t("settings.editModal.footnote")}</p>
    </Modal>
  );
}
