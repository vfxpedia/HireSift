import { useState } from "react";
import { Info, Mail, Copy, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { Modal } from "../primitives/Modal";
import { PrimaryBtn, SecondaryBtn } from "../primitives/Buttons";
import { Field, TextInput, inputClass } from "../primitives/Field";
import { toast } from "../primitives/Toaster";
import { createCandidate, markLinkSent } from "../../api/candidates";
import { addAudit } from "../../api/audit";
import { REVIEWERS } from "../../lib/seed";
import type { Candidate, VerificationType } from "../../types";

type FormValues = {
  name: string;
  email: string;
  role: string;
  reviewer: string;
  verificationType: VerificationType;
  dueDate: string;
  inviteNote: string;
};

const VERIFICATION_TYPES: { value: VerificationType; label: string }[] = [
  { value: "full", label: "Full verification (identity + portfolio + media)" },
  { value: "identity-only", label: "Identity-only" },
  { value: "portfolio-only", label: "Portfolio-only" },
];

export function CreateVerificationModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (candidate: Candidate) => void;
}) {
  const [created, setCreated] = useState<Candidate | null>(null);
  const [copied, setCopied] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);

  const today = new Date();
  const defaultDue = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      name: "",
      email: "",
      role: "",
      reviewer: REVIEWERS[0],
      verificationType: "full",
      dueDate: defaultDue,
      inviteNote: "",
    },
  });

  const link = created
    ? `${typeof window !== "undefined" ? window.location.origin : "https://hire-sift.vercel.app"}/verify/${created.id}`
    : "";

  const onSubmit = (values: FormValues) => {
    const c = createCandidate(values);
    setCreated(c);
    toast.success(`Verification request ${c.code} created`);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      toast.success("Link copied");
    } catch {
      /* noop */
    }
  };

  const sendInvite = () => {
    if (!created) return;
    markLinkSent(created.id);
    addAudit({
      action: "Verification Link Sent",
      user: "Admin",
      candidate: created.code,
      type: "request",
    });
    setInviteSent(true);
    toast.success(`Invite sent to ${created.email}`);
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={created ? "Verification Link Ready" : "New Verification Request"}
      size="md"
    >
      {!created ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Candidate name" error={errors.name?.message}>
            <TextInput
              placeholder="e.g. Alex Kim"
              error={!!errors.name}
              {...register("name", { required: "Required" })}
            />
          </Field>
          <Field label="Candidate email" error={errors.email?.message}>
            <TextInput
              type="email"
              placeholder="candidate@email.com"
              error={!!errors.email}
              {...register("email", {
                required: "Required",
                pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
              })}
            />
          </Field>
          <Field label="Role" error={errors.role?.message}>
            <TextInput
              placeholder="e.g. Senior Frontend Developer"
              error={!!errors.role}
              {...register("role", { required: "Required" })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Verification type">
              <select className={inputClass} {...register("verificationType")}>
                {VERIFICATION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Due date">
              <TextInput type="date" {...register("dueDate")} />
            </Field>
          </div>

          <Field label="Assigned reviewer">
            <select className={inputClass} {...register("reviewer")}>
              {REVIEWERS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Optional note to candidate" optional>
            <textarea
              rows={3}
              placeholder="Add context, scheduling details, or special instructions…"
              className={inputClass + " resize-none"}
              {...register("inviteNote")}
            />
          </Field>

          <div className="bg-[#F7F8FA] rounded-xl p-3">
            <p className="text-xs text-[#6B7280] leading-relaxed">
              <Info className="w-3 h-3 inline mr-1 text-[#9CA3AF]" />A secure verification link will be
              generated. The candidate will see the full consent and privacy notice before submitting
              any information.
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <SecondaryBtn onClick={onClose} className="flex-1 justify-center">
              Cancel
            </SecondaryBtn>
            <PrimaryBtn
              type="submit"
              disabled={isSubmitting}
              className="flex-1 justify-center"
              icon={<Mail className="w-4 h-4" />}
            >
              Create & Generate Link
            </PrimaryBtn>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-[#2F7D7E]/10 border border-[#2F7D7E]/20 rounded-xl text-xs text-[#2F7D7E]">
            <Check className="w-3.5 h-3.5 inline mr-1.5" />
            Created request <span className="font-mono font-semibold">{created.code}</span> for{" "}
            <span className="font-medium">{created.name}</span>.
          </div>
          <div className="space-y-1.5 text-[11px] text-[#6B7280]">
            <p className="flex items-center gap-2">
              <Check className="w-3 h-3 text-[#2F7D7E]" /> Verification link generated
            </p>
            {copied && (
              <p className="flex items-center gap-2">
                <Check className="w-3 h-3 text-[#2F7D7E]" /> Link copied to clipboard
              </p>
            )}
            {inviteSent && (
              <>
                <p className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-[#2F7D7E]" /> Email invite sent
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-[#2F7D7E]" /> Candidate status: <span className="font-semibold">Link Sent</span>
                </p>
              </>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">
              Verification link
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
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>

          {!inviteSent ? (
            <PrimaryBtn
              onClick={sendInvite}
              className="w-full justify-center"
              icon={<Mail className="w-4 h-4" />}
            >
              Send Invite Email
            </PrimaryBtn>
          ) : null}

          <div className="flex gap-3 pt-1">
            <SecondaryBtn onClick={onClose} className="flex-1 justify-center">
              Close
            </SecondaryBtn>
            <PrimaryBtn onClick={() => onCreated(created)} className="flex-1 justify-center">
              Open Candidate
            </PrimaryBtn>
          </div>
        </div>
      )}
    </Modal>
  );
}
