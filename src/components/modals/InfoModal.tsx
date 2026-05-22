import React from "react";
import { Modal } from "../primitives/Modal";
import { PrimaryBtn } from "../primitives/Buttons";

interface InfoModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  body: React.ReactNode;
  closeLabel?: string;
}

export function InfoModal({ open, onClose, title, body, closeLabel = "Close" }: InfoModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="md"
      footer={<PrimaryBtn onClick={onClose}>{closeLabel}</PrimaryBtn>}
    >
      <div className="text-sm text-[#374151] leading-relaxed space-y-3">{body}</div>
    </Modal>
  );
}
