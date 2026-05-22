import { useState } from "react";
import { Info, Mail, Copy, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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

const VERIFICATION_TYPE_VALUES: VerificationType[] = ["full", "identity-only", "portfolio-only"];

function verificationTypeKey(v: VerificationType): string {
  switch (v) {
    case "full":
      return "full";
    case "identity-only":
      return "identityOnly";
    case "portfolio-only":
      return "portfolioOnly";
  }
}

export function CreateVerificationModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (candidate: Candidate) => void;
}) {
  const { t } = useTranslation();
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
    mode: "onTouched",
    reValidateMode: "onChange",
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
    toast.success(t("modals.createVerification.createdToast", { code: c.code }));
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
      toast.success(t("modals.createVerification.linkCopiedToast"));
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
    toast.success(t("modals.createVerification.inviteSentToast", { email: created.email }));
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={created ? t("modals.createVerification.successTitle") : t("modals.createVerification.title")}
      size="md"
    >
      {!created ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field label={t("modals.createVerification.candidateName")} error={errors.name?.message}>
            <TextInput
              placeholder={t("modals.createVerification.candidateNamePlaceholder")}
              error={!!errors.name}
              {...register("name", { required: t("modals.createVerification.errorRequired") })}
            />
          </Field>
          <Field label={t("modals.createVerification.candidateEmail")} error={errors.email?.message}>
            <TextInput
              type="email"
              placeholder={t("modals.createVerification.candidateEmailPlaceholder")}
              error={!!errors.email}
              {...register("email", {
                required: t("modals.createVerification.errorRequired"),
                pattern: { value: /\S+@\S+\.\S+/, message: t("modals.createVerification.errorInvalidEmail") },
              })}
            />
          </Field>
          <Field label={t("modals.createVerification.role")} error={errors.role?.message}>
            <TextInput
              placeholder={t("modals.createVerification.rolePlaceholder")}
              error={!!errors.role}
              {...register("role", { required: t("modals.createVerification.errorRequired") })}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label={t("modals.createVerification.verificationType")}>
              <select className={inputClass} {...register("verificationType")}>
                {VERIFICATION_TYPE_VALUES.map((v) => (
                  <option key={v} value={v}>
                    {t(`modals.createVerification.verificationTypeOption.${verificationTypeKey(v)}`)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={t("modals.createVerification.dueDate")}>
              <TextInput type="date" {...register("dueDate")} />
            </Field>
          </div>

          <Field label={t("modals.createVerification.assignedReviewer")}>
            <select className={inputClass} {...register("reviewer")}>
              {REVIEWERS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>

          <Field label={t("modals.createVerification.optionalNote")} optional>
            <textarea
              rows={3}
              placeholder={t("modals.createVerification.optionalNotePlaceholder")}
              className={inputClass + " resize-none"}
              {...register("inviteNote")}
            />
          </Field>

          <div className="bg-[#F7F8FA] rounded-xl p-3">
            <p className="text-xs text-[#6B7280] leading-relaxed">
              <Info className="w-3 h-3 inline mr-1 text-[#9CA3AF]" />
              {t("modals.createVerification.infoNote")}
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <SecondaryBtn onClick={onClose} className="flex-1 justify-center">
              {t("common.cancel")}
            </SecondaryBtn>
            <PrimaryBtn
              type="submit"
              disabled={isSubmitting}
              className="flex-1 justify-center"
              icon={<Mail className="w-4 h-4" />}
            >
              {t("modals.createVerification.submit")}
            </PrimaryBtn>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-[#2F7D7E]/10 border border-[#2F7D7E]/20 rounded-xl text-xs text-[#2F7D7E]">
            <Check className="w-3.5 h-3.5 inline mr-1.5" />
            {t("modals.createVerification.createdHeading", { code: created.code, name: created.name })}
          </div>
          <div className="space-y-1.5 text-[11px] text-[#6B7280]">
            <p className="flex items-center gap-2">
              <Check className="w-3 h-3 text-[#2F7D7E]" /> {t("modals.createVerification.linkGenerated")}
            </p>
            {copied && (
              <p className="flex items-center gap-2">
                <Check className="w-3 h-3 text-[#2F7D7E]" /> {t("modals.createVerification.linkCopiedStep")}
              </p>
            )}
            {inviteSent && (
              <>
                <p className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-[#2F7D7E]" /> {t("modals.createVerification.inviteSentStep")}
                </p>
                <p className="flex items-center gap-2">
                  <Check className="w-3 h-3 text-[#2F7D7E]" /> {t("modals.createVerification.statusLinkSent")}
                </p>
              </>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1.5">
              {t("modals.createVerification.verificationLinkLabel")}
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

          {!inviteSent ? (
            <PrimaryBtn
              onClick={sendInvite}
              className="w-full justify-center"
              icon={<Mail className="w-4 h-4" />}
            >
              {t("modals.createVerification.sendInvite")}
            </PrimaryBtn>
          ) : null}

          <div className="flex gap-3 pt-1">
            <SecondaryBtn onClick={onClose} className="flex-1 justify-center">
              {t("common.close")}
            </SecondaryBtn>
            <PrimaryBtn onClick={() => onCreated(created)} className="flex-1 justify-center">
              {t("modals.createVerification.openCandidate")}
            </PrimaryBtn>
          </div>
        </div>
      )}
    </Modal>
  );
}
