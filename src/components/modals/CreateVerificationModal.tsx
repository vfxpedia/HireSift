import { useState } from "react";
import { X, Info, Mail, Copy, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { Card } from "../primitives/Card";
import { PrimaryBtn, SecondaryBtn } from "../primitives/Buttons";
import { Field, TextInput, inputClass } from "../primitives/Field";
import { createCandidate } from "../../api/candidates";
import { REVIEWERS } from "../../lib/seed";
import type { Candidate } from "../../types";

type FormValues = {
  name: string;
  email: string;
  role: string;
  reviewer: string;
};

export function CreateVerificationModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (candidate: Candidate) => void;
}) {
  const [created, setCreated] = useState<Candidate | null>(null);
  const [copied, setCopied] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: { name: "", email: "", role: "", reviewer: REVIEWERS[0] },
  });

  const link = created ? `${window.location.origin}/verify/${created.id}` : "";

  const onSubmit = (values: FormValues) => {
    const c = createCandidate(values);
    setCreated(c);
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* noop */
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-[#111827] text-base">
            {created ? "Verification Link Ready" : "New Verification Request"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-[#6B7280] hover:text-[#374151] rounded-lg hover:bg-gray-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

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
            <Field label="Assign reviewer">
              <select className={inputClass} {...register("reviewer")}>
                {REVIEWERS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>

            <div className="bg-[#F7F8FA] rounded-xl p-3">
              <p className="text-xs text-[#6B7280] leading-relaxed">
                <Info className="w-3 h-3 inline mr-1 text-[#9CA3AF]" />
                A secure verification link will be generated. The candidate will see a full consent and
                privacy notice before submitting any information.
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
              Created request <span className="font-mono font-semibold">{created.code}</span> for
              {" "}
              <span className="font-medium">{created.name}</span>.
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
              <p className="mt-1.5 text-xs text-[#9CA3AF]">
                Share this link with the candidate. They will see the consent notice before any data is
                collected.
              </p>
            </div>

            <div className="flex gap-3 pt-1">
              <SecondaryBtn onClick={onClose} className="flex-1 justify-center">
                Close
              </SecondaryBtn>
              <PrimaryBtn
                onClick={() => onCreated(created)}
                className="flex-1 justify-center"
              >
                View candidate
              </PrimaryBtn>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
