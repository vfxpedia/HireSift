import { useState } from "react";
import { Mail } from "lucide-react";
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

const PRESETS = [
  "Could you walk us through one of your recent GitHub commits?",
  "Please share an additional document that confirms your professional certification.",
  "Could you re-record the selfie video in better lighting?",
  "Please confirm the dates of employment listed on your portfolio.",
];

export function RequestMoreInfoModal({ open, onClose, candidate, reviewer }: Props) {
  const [message, setMessage] = useState("");

  const send = () => {
    const text = message.trim();
    if (!text) {
      toast.error("Please add a message before sending.");
      return;
    }
    addAudit({
      action: "Additional Information Requested",
      user: reviewer ?? "Reviewer",
      candidate: candidate.code,
      type: "review",
    });
    toast.success(`Request sent to ${candidate.email}`);
    setMessage("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request More Information"
      description={`Send ${candidate.name} a short message asking for additional verification material.`}
      size="md"
      footer={
        <>
          <SecondaryBtn onClick={onClose}>Cancel</SecondaryBtn>
          <PrimaryBtn onClick={send} icon={<Mail className="w-4 h-4" />}>
            Send request
          </PrimaryBtn>
        </>
      }
    >
      <div className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          placeholder="Describe what you would like the candidate to provide…"
          className={inputClass + " resize-none"}
        />
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] mb-2">
            Or pick a preset
          </p>
          <div className="space-y-1">
            {PRESETS.map((p) => (
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
