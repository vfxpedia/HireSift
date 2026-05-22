import { useState } from "react";
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
  const [value, setValue] = useState(initialValue);

  const save = () => {
    onSave(value);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Consent Template"
      description="This template is shown to every candidate before they begin verification. Keep it clear, non-accusatory, and aligned with privacy guardrails."
      size="lg"
      footer={
        <>
          <SecondaryBtn onClick={onClose}>Cancel</SecondaryBtn>
          <PrimaryBtn onClick={save}>Save changes</PrimaryBtn>
        </>
      }
    >
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={16}
        className={inputClass + " font-mono text-xs leading-relaxed"}
      />
      <p className="text-[11px] text-[#9CA3AF] mt-2">
        Avoid words like "fraud", "fake", "reject", or any automatic-decision language.
      </p>
    </Modal>
  );
}
