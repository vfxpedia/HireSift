import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useTranslation, Trans } from "react-i18next";
import { LanguageToggle } from "../components/primitives/LanguageToggle";
import {
  Shield,
  Lock,
  User,
  Link as LinkIcon,
  FileText,
  Video,
  Mic,
  Eye,
  CheckCircle,
  Check,
  Info,
  Upload,
  Play,
  Square,
  RefreshCw,
  X,
} from "lucide-react";
import { cn } from "../lib/cn";
import { Card, GuardrailNotice } from "../components/primitives/Card";
import { PrimaryBtn, SecondaryBtn } from "../components/primitives/Buttons";
import { Field, TextInput, inputClass } from "../components/primitives/Field";
import { useMediaRecorder, type RecorderResult } from "../hooks/useMediaRecorder";
import { listCandidates, getCandidate, setSubmissionStatus, createCandidate } from "../api/candidates";
import {
  getSubmission,
  recordConsent,
  saveBasicInfo,
  savePortfolio,
  saveDocument,
  saveSelfie,
  saveVoice,
  finalizeSubmission,
  setStep as setStepApi,
} from "../api/submissions";
import type { BasicInfo, PortfolioLink, MediaAsset } from "../types";

const STEPS = [
  { tKey: "consent", icon: Lock },
  { tKey: "basicInfo", icon: User },
  { tKey: "portfolio", icon: LinkIcon },
  { tKey: "document", icon: FileText },
  { tKey: "selfie", icon: Video },
  { tKey: "voice", icon: Mic },
  { tKey: "review", icon: Eye },
  { tKey: "complete", icon: CheckCircle },
] as const;

export default function CandidateFlowPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { candidateId } = useParams<{ candidateId?: string }>();

  // Visiting /verify with no id is a demo entry point — show an intro
  // page that explicitly creates a fresh candidate on user gesture
  // rather than silently piggy-backing on whoever the next "pending"
  // seed row happens to be.
  if (!candidateId) {
    return <DemoIntroScreen />;
  }

  const candidate = getCandidate(candidateId);
  if (!candidate) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-6">
        <Card className="p-8 max-w-sm text-center">
          <h2 className="text-base font-bold text-[#172033] mb-2">{t("candidateFlow.title")}</h2>
          <p className="text-sm text-[#6B7280] mb-5">{t("candidateFlow.missingLink")}</p>
          <PrimaryBtn onClick={() => navigate("/")}>{t("candidateFlow.backToHome")}</PrimaryBtn>
        </Card>
      </div>
    );
  }

  // If this candidate already finished a submission, don't silently
  // boot them back into step 7 — give the visitor a clear exit.
  if (
    candidate.submissionStatus === "submitted" ||
    candidate.submissionStatus === "reviewed" ||
    candidate.submissionStatus === "report-ready"
  ) {
    return <AlreadySubmittedScreen candidateName={candidate.name} candidateId={candidate.id} />;
  }

  return <CandidateFlowSession candidateId={candidateId} />;
}

function DemoIntroScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const startDemo = () => {
    const ts = new Date();
    const stamp = `${ts.getFullYear()}${(ts.getMonth() + 1).toString().padStart(2, "0")}${ts
      .getDate()
      .toString()
      .padStart(2, "0")}-${ts.getHours().toString().padStart(2, "0")}${ts
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
    const candidate = createCandidate({
      name: `Demo Candidate ${stamp}`,
      email: "demo@hiresift.app",
      role: "Demo Verification",
    });
    navigate(`/verify/${candidate.id}`, { replace: true });
  };

  const features = [
    t("candidateFlow.intro.feature1"),
    t("candidateFlow.intro.feature2"),
    t("candidateFlow.intro.feature3"),
  ];

  return (
    <div
      className="min-h-screen bg-[#F7F8FA] flex flex-col"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#172033] rounded-lg flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <p className="font-semibold text-sm text-[#172033]">{t("candidateFlow.title")}</p>
          </div>
          <LanguageToggle />
        </div>
      </header>
      <div className="flex-1 flex items-start justify-center px-6 py-12">
        <Card className="p-8 max-w-2xl w-full">
          <h1 className="text-2xl font-bold text-[#172033] mb-2">{t("candidateFlow.intro.title")}</h1>
          <p className="text-sm text-[#6B7280] leading-relaxed mb-6">{t("candidateFlow.intro.lead")}</p>
          <div className="rounded-xl border border-[#C6923A]/20 bg-[#C6923A]/5 p-4 mb-6">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-[#C6923A] mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-semibold text-[#8A6422] mb-1">
                  {t("candidateFlow.intro.noteTitle")}
                </p>
                <p className="text-xs text-[#8A6422] leading-relaxed">
                  {t("candidateFlow.intro.noteBody")}
                </p>
              </div>
            </div>
          </div>
          <ul className="space-y-2.5 mb-7">
            {features.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-[#374151]">
                <CheckCircle className="w-4 h-4 text-[#2F7D7E] mt-0.5 shrink-0" />
                <span className="leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
          <PrimaryBtn onClick={startDemo} className="w-full justify-center text-sm">
            {t("candidateFlow.intro.start")}
          </PrimaryBtn>
          <p className="text-xs text-[#9CA3AF] text-center mt-4">
            {t("candidateFlow.intro.alreadyHave")}
          </p>
        </Card>
      </div>
    </div>
  );
}

function AlreadySubmittedScreen({
  candidateName,
  candidateId,
}: {
  candidateName: string;
  candidateId: string;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center px-6 py-12">
      <Card className="p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-[#2F7D7E]/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-[#2F7D7E]" />
        </div>
        <h1 className="text-xl font-bold text-[#172033] mb-2">
          {t("candidateFlow.alreadySubmitted.title")}
        </h1>
        <p className="text-sm text-[#6B7280] leading-relaxed mb-6">
          {t("candidateFlow.alreadySubmitted.body", { name: candidateName })}
        </p>
        <div className="space-y-2">
          <PrimaryBtn
            onClick={() => navigate(`/app/reviewer/${candidateId}`)}
            className="w-full justify-center text-sm"
          >
            {t("candidateFlow.alreadySubmitted.openReviewer")}
          </PrimaryBtn>
          <SecondaryBtn
            onClick={() => navigate("/verify", { replace: true })}
            className="w-full justify-center text-sm"
          >
            {t("candidateFlow.alreadySubmitted.startNew")}
          </SecondaryBtn>
        </div>
      </Card>
    </div>
  );
}

function CandidateFlowSession({ candidateId }: { candidateId: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const candidate = getCandidate(candidateId)!;
  const targetId = candidateId;

  const [step, setStep] = useState<number>(() => getSubmission(targetId).step);

  useEffect(() => {
    setStepApi(targetId, step);
  }, [targetId, step]);

  return (
    <div
      className="min-h-screen bg-[#F7F8FA] flex flex-col"
      style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      <header className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#172033] rounded-lg flex items-center justify-center">
              <Shield className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm text-[#172033]">{t("candidateFlow.title")}</p>
              <p className="text-[10px] text-[#9CA3AF] font-mono">
                {candidate.code} · {candidate.role}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#F7F8FA] px-3 py-1.5 rounded-lg">
              <Lock className="w-3 h-3 text-[#6B7280]" />
              <span className="text-xs text-[#6B7280]">{t("candidateFlow.secure")}</span>
            </div>
            <LanguageToggle />
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center">
            {STEPS.map((s, i) => (
              <div key={s.tKey} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                      i < step
                        ? "bg-[#2F7D7E] text-white"
                        : i === step
                        ? "bg-[#172033] text-white"
                        : "bg-gray-100 text-[#9CA3AF]",
                    )}
                  >
                    {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
                  </div>
                  <p
                    className={cn(
                      "text-[10px] mt-1 hidden sm:block",
                      i === step ? "text-[#172033] font-medium" : "text-[#9CA3AF]",
                    )}
                  >
                    {t(`candidateFlow.step.${s.tKey}`)}
                  </p>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "flex-1 h-px mx-2 mt-0 sm:-mt-4",
                      i < step ? "bg-[#2F7D7E]" : "bg-[#E5E7EB]",
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-8 px-6">
        <div className="max-w-2xl mx-auto">
          {step === 0 && (
            <ConsentStep
              candidateId={targetId}
              onAdvance={() => setStep(1)}
            />
          )}
          {step === 1 && (
            <BasicInfoStep
              candidateId={targetId}
              onBack={() => setStep(0)}
              onAdvance={() => setStep(2)}
              defaultEmail={candidate.email}
              defaultName={candidate.name}
            />
          )}
          {step === 2 && (
            <PortfolioStep
              candidateId={targetId}
              onBack={() => setStep(1)}
              onAdvance={() => setStep(3)}
            />
          )}
          {step === 3 && (
            <DocumentStep
              candidateId={targetId}
              onBack={() => setStep(2)}
              onAdvance={() => setStep(4)}
            />
          )}
          {step === 4 && (
            <SelfieStep
              candidateId={targetId}
              onBack={() => setStep(3)}
              onAdvance={() => setStep(5)}
            />
          )}
          {step === 5 && (
            <VoiceStep
              candidateId={targetId}
              onBack={() => setStep(4)}
              onAdvance={() => setStep(6)}
              candidateName={candidate.name}
            />
          )}
          {step === 6 && (
            <ReviewStep
              candidateId={targetId}
              onBack={() => setStep(5)}
              onSubmit={() => {
                finalizeSubmission(targetId);
                setStep(7);
              }}
            />
          )}
          {step === 7 && (
            <CompleteStep candidateId={targetId} onBackToHome={() => navigate("/")} />
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 0: Consent ────────────────────────────────────────── */
function ConsentStep({
  candidateId,
  onAdvance,
}: {
  candidateId: string;
  onAdvance: () => void;
}) {
  const { t } = useTranslation();
  const submission = getSubmission(candidateId);
  const [agreed, setAgreed] = useState(submission.consent.agreed);

  const submit = () => {
    if (!agreed) return;
    recordConsent(candidateId, true);
    setSubmissionStatus(candidateId, "in-progress");
    onAdvance();
  };

  const collectKeys = ["collect1", "collect2", "collect3", "collect4", "collect5"];
  const notKeys = ["not1", "not2", "not3", "not4"];

  return (
    <div>
      <h2 className="text-xl font-bold text-[#172033] mb-2">{t("candidateFlow.consent.title")}</h2>
      <p className="text-sm text-[#6B7280] mb-6">{t("candidateFlow.consent.intro")}</p>
      <Card className="p-5 mb-4">
        <h3 className="font-semibold text-sm text-[#111827] mb-3">{t("candidateFlow.consent.whatWeCollect")}</h3>
        <div className="space-y-2 text-sm text-[#374151]">
          {collectKeys.map((k) => (
            <div key={k} className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-[#2F7D7E] mt-0.5 shrink-0" />
              <p>{t(`candidateFlow.consent.${k}`)}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5 mb-4">
        <h3 className="font-semibold text-sm text-[#111827] mb-3">{t("candidateFlow.consent.whatNot")}</h3>
        <div className="space-y-2 text-sm text-[#374151]">
          {notKeys.map((k) => (
            <div key={k} className="flex items-start gap-2.5">
              <X className="w-4 h-4 text-[#C6923A] mt-0.5 shrink-0" />
              <p>{t(`candidateFlow.consent.${k}`)}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5 mb-5">
        <h3 className="font-semibold text-sm text-[#111827] mb-2">{t("candidateFlow.consent.retentionTitle")}</h3>
        <p className="text-sm text-[#6B7280]">
          <Trans
            i18nKey="candidateFlow.consent.retentionBody"
            components={[
              <a href="mailto:privacy@hiresift.com" className="text-[#2F7D7E] hover:underline" />,
            ]}
          />
        </p>
      </Card>
      <label className="flex items-start gap-3 cursor-pointer mb-6">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded accent-[#2F7D7E]"
        />
        <span className="text-sm text-[#374151]">{t("candidateFlow.consent.agreement")}</span>
      </label>
      <div className="flex justify-end">
        <PrimaryBtn onClick={submit} disabled={!agreed}>
          {t("candidateFlow.agreeContinue")}
        </PrimaryBtn>
      </div>
    </div>
  );
}

/* ─── Step 1: Basic Info ─────────────────────────────────────── */
function BasicInfoStep({
  candidateId,
  onBack,
  onAdvance,
  defaultEmail,
  defaultName,
}: {
  candidateId: string;
  onBack: () => void;
  onAdvance: () => void;
  defaultEmail: string;
  defaultName: string;
}) {
  const { t } = useTranslation();
  const existing = getSubmission(candidateId).basicInfo;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BasicInfo>({
    defaultValues: {
      fullName: existing?.fullName ?? defaultName,
      email: existing?.email ?? defaultEmail,
      country: existing?.country ?? "",
      linkedin: existing?.linkedin ?? "",
    },
  });

  const onSubmit = (values: BasicInfo) => {
    saveBasicInfo(candidateId, values);
    onAdvance();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#172033] mb-2">{t("candidateFlow.basicInfo.title")}</h2>
      <p className="text-sm text-[#6B7280] mb-6">{t("candidateFlow.basicInfo.intro")}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label={t("candidateFlow.basicInfo.fullName")} error={errors.fullName?.message}>
          <TextInput
            placeholder={t("candidateFlow.basicInfo.fullNamePlaceholder")}
            error={!!errors.fullName}
            {...register("fullName", { required: t("modals.createVerification.errorRequired") })}
          />
        </Field>
        <Field label={t("candidateFlow.basicInfo.email")} error={errors.email?.message}>
          <TextInput
            type="email"
            placeholder={t("candidateFlow.basicInfo.emailPlaceholder")}
            error={!!errors.email}
            {...register("email", {
              required: t("modals.createVerification.errorRequired"),
              pattern: { value: /\S+@\S+\.\S+/, message: t("modals.createVerification.errorInvalidEmail") },
            })}
          />
        </Field>
        <Field label={t("candidateFlow.basicInfo.country")} error={errors.country?.message}>
          <TextInput
            placeholder={t("candidateFlow.basicInfo.countryPlaceholder")}
            error={!!errors.country}
            {...register("country", { required: t("modals.createVerification.errorRequired") })}
          />
        </Field>
        <Field label={t("candidateFlow.basicInfo.linkedin")} optional>
          <TextInput placeholder="https://linkedin.com/in/yourname" {...register("linkedin")} />
        </Field>
        <div className="mt-2 p-3 bg-[#F7F8FA] rounded-xl">
          <p className="text-xs text-[#6B7280]">
            <Info className="w-3 h-3 inline mr-1" />
            {t("candidateFlow.basicInfo.infoNote")}
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <SecondaryBtn onClick={onBack} className="text-sm">
            {t("candidateFlow.back")}
          </SecondaryBtn>
          <PrimaryBtn type="submit" className="text-sm ml-auto">
            {t("candidateFlow.continue")}
          </PrimaryBtn>
        </div>
      </form>
    </div>
  );
}

/* ─── Step 2: Portfolio ──────────────────────────────────────── */
function PortfolioStep({
  candidateId,
  onBack,
  onAdvance,
}: {
  candidateId: string;
  onBack: () => void;
  onAdvance: () => void;
}) {
  const { t } = useTranslation();
  const PLATFORMS = ["GitHub", "LinkedIn", "Behance", "Personal Website"];
  const existing = getSubmission(candidateId).portfolio;
  const [links, setLinks] = useState<Record<string, string>>(() =>
    PLATFORMS.reduce((acc, p) => {
      acc[p] = existing.find((l) => l.platform === p)?.url ?? "";
      return acc;
    }, {} as Record<string, string>),
  );
  const [error, setError] = useState<string | null>(null);

  const submit = () => {
    const cleaned: PortfolioLink[] = Object.entries(links)
      .filter(([, url]) => url.trim().length > 0)
      .map(([platform, url]) => ({ platform, url: url.trim() }));
    if (cleaned.length === 0) {
      setError(t("candidateFlow.portfolio.errorRequired"));
      return;
    }
    const invalid = cleaned.find((l) => !/^https?:\/\//.test(l.url));
    if (invalid) {
      setError(t("candidateFlow.portfolio.errorInvalid", { platform: invalid.platform }));
      return;
    }
    savePortfolio(candidateId, cleaned);
    onAdvance();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#172033] mb-2">{t("candidateFlow.portfolio.title")}</h2>
      <p className="text-sm text-[#6B7280] mb-6">{t("candidateFlow.portfolio.intro")}</p>
      <div className="space-y-3">
        {PLATFORMS.map((p) => (
          <Field key={p} label={p} optional={p !== "GitHub" && p !== "LinkedIn"}>
            <TextInput
              placeholder={`https://${p.toLowerCase().replace(" ", "")}.com/yourname`}
              value={links[p]}
              onChange={(e) => setLinks({ ...links, [p]: e.target.value })}
            />
          </Field>
        ))}
      </div>
      {error && (
        <div className="mt-3 p-3 bg-[#C6923A]/10 border border-[#C6923A]/30 rounded-lg text-xs text-[#8A6422]">
          {error}
        </div>
      )}
      <div className="mt-4 p-3 bg-[#F7F8FA] rounded-xl">
        <p className="text-xs text-[#6B7280]">
          <Info className="w-3 h-3 inline mr-1" />
          {t("candidateFlow.portfolio.infoNote")}
        </p>
      </div>
      <div className="flex gap-3 pt-4">
        <SecondaryBtn onClick={onBack} className="text-sm">
          {t("candidateFlow.back")}
        </SecondaryBtn>
        <PrimaryBtn onClick={submit} className="text-sm ml-auto">
          {t("candidateFlow.continue")}
        </PrimaryBtn>
      </div>
    </div>
  );
}

/* ─── Step 3: Document Upload ─────────────────────────────────── */
function DocumentStep({
  candidateId,
  onBack,
  onAdvance,
}: {
  candidateId: string;
  onBack: () => void;
  onAdvance: () => void;
}) {
  const { t } = useTranslation();
  const existing = getSubmission(candidateId).document;
  const [asset, setAsset] = useState<MediaAsset | undefined>(existing);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (file: File) => {
    setError(null);
    if (file.size > 5 * 1024 * 1024) {
      setError(t("candidateFlow.document.errorTooLarge"));
      return;
    }
    const accepted = ["image/png", "image/jpeg", "application/pdf"];
    if (!accepted.includes(file.type)) {
      setError(t("candidateFlow.document.errorInvalidType"));
      return;
    }
    const dataUrl = await new Promise<string>((res, rej) => {
      const fr = new FileReader();
      fr.onloadend = () => res(fr.result as string);
      fr.onerror = () => rej(fr.error);
      fr.readAsDataURL(file);
    });
    const next: MediaAsset = {
      dataUrl,
      mimeType: file.type,
      size: file.size,
      fileName: file.name,
    };
    setAsset(next);
  };

  const submit = () => {
    if (!asset) {
      setError(t("candidateFlow.document.errorMissing"));
      return;
    }
    saveDocument(candidateId, asset);
    onAdvance();
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#172033] mb-2">{t("candidateFlow.document.title")}</h2>
      <p className="text-sm text-[#6B7280] mb-4">{t("candidateFlow.document.intro")}</p>
      <Card className="p-4 mb-5 border-[#C6923A]/20 bg-[#C6923A]/5">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#C6923A] mt-0.5 shrink-0" />
          <div className="text-xs text-[#8A6422]">
            <p className="font-semibold mb-1">{t("candidateFlow.document.warningTitle")}</p>
            <p>{t("candidateFlow.document.warningBody")}</p>
          </div>
        </div>
      </Card>

      {!asset ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className="border-2 border-dashed border-[#E5E7EB] rounded-2xl p-8 text-center hover:border-[#2F7D7E]/40 transition-colors cursor-pointer bg-[#F9FAFB] mb-4"
        >
          <Upload className="w-8 h-8 text-[#9CA3AF] mx-auto mb-3" />
          <p className="font-medium text-sm text-[#374151] mb-1">{t("candidateFlow.document.dropTitle")}</p>
          <p className="text-xs text-[#9CA3AF]">{t("candidateFlow.document.dropFormats")}</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onFile(f);
            }}
          />
        </div>
      ) : (
        <Card className="p-4 mb-4 border-[#2F7D7E]/30 bg-[#2F7D7E]/5">
          <div className="flex items-center gap-1.5 text-xs text-[#2F7D7E] font-semibold mb-3">
            <CheckCircle className="w-3.5 h-3.5" />
            {t("candidateFlow.document.uploadedOk")}
          </div>
          <div className="flex items-start gap-4">
            {asset.mimeType.startsWith("image/") ? (
              <img
                src={asset.dataUrl}
                alt="masked document preview"
                className="w-32 h-32 object-cover rounded-lg border border-[#E5E7EB]"
              />
            ) : (
              <div className="w-32 h-32 bg-white rounded-lg border border-[#E5E7EB] flex items-center justify-center">
                <FileText className="w-10 h-10 text-[#6B7280]" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-[#374151]">{asset.fileName}</p>
              <p className="text-xs text-[#9CA3AF]">
                {asset.mimeType} · {(asset.size / 1024).toFixed(1)} KB
              </p>
              <div className="mt-3 flex gap-2">
                <SecondaryBtn onClick={() => setAsset(undefined)} className="text-xs py-1.5">
                  {t("candidateFlow.document.replaceFile")}
                </SecondaryBtn>
              </div>
            </div>
          </div>
        </Card>
      )}

      {error && (
        <div className="mb-3 p-3 bg-[#C6923A]/10 border border-[#C6923A]/30 rounded-lg text-xs text-[#8A6422]">
          {error}
        </div>
      )}

      <p className="text-xs text-[#6B7280] mb-6">{t("candidateFlow.document.accepted")}</p>

      <div className="flex gap-3">
        <SecondaryBtn onClick={onBack} className="text-sm">
          {t("candidateFlow.back")}
        </SecondaryBtn>
        <PrimaryBtn onClick={submit} className="text-sm ml-auto">
          {t("candidateFlow.continue")}
        </PrimaryBtn>
      </div>
    </div>
  );
}

/* ─── Step 4: Selfie Video ───────────────────────────────────── */
function SelfieStep({
  candidateId,
  onBack,
  onAdvance,
}: {
  candidateId: string;
  onBack: () => void;
  onAdvance: () => void;
}) {
  const { t } = useTranslation();
  const existing = getSubmission(candidateId).selfie;
  return (
    <MediaCaptureStep
      kind="video"
      title={t("candidateFlow.selfie.title")}
      description={t("candidateFlow.selfie.intro")}
      promptText={t("candidateFlow.selfie.prompt")}
      maxDurationSec={10}
      existing={existing}
      onSave={(asset) => saveSelfie(candidateId, asset)}
      onBack={onBack}
      onAdvance={onAdvance}
      footerNote={t("candidateFlow.selfie.footerNote")}
      icon={<Video className="w-7 h-7 text-[#172033]/40" />}
    />
  );
}

/* ─── Step 5: Voice Sample ───────────────────────────────────── */
function VoiceStep({
  candidateId,
  onBack,
  onAdvance,
  candidateName,
}: {
  candidateId: string;
  onBack: () => void;
  onAdvance: () => void;
  candidateName: string;
}) {
  const { t } = useTranslation();
  const existing = getSubmission(candidateId).voice;
  return (
    <MediaCaptureStep
      kind="audio"
      title={t("candidateFlow.voice.title")}
      description={t("candidateFlow.voice.intro")}
      promptText={t("candidateFlow.voice.prompt", { name: candidateName, date: new Date().toLocaleDateString() })}
      maxDurationSec={10}
      existing={existing}
      onSave={(asset) => saveVoice(candidateId, asset)}
      onBack={onBack}
      onAdvance={onAdvance}
      footerNote={t("candidateFlow.voice.footerNote")}
      icon={<Mic className="w-7 h-7 text-[#172033]/40" />}
    />
  );
}

function MediaCaptureStep({
  kind,
  title,
  description,
  promptText,
  maxDurationSec,
  existing,
  onSave,
  onBack,
  onAdvance,
  footerNote,
  icon,
}: {
  kind: "video" | "audio";
  title: string;
  description: string;
  promptText: string;
  maxDurationSec: number;
  existing?: MediaAsset;
  onSave: (asset: MediaAsset) => void;
  onBack: () => void;
  onAdvance: () => void;
  footerNote: string;
  icon: React.ReactNode;
}) {
  const { t } = useTranslation();
  const { isRecording, elapsed, previewStream, permissionError, result, start, stop, reset } =
    useMediaRecorder({ kind, maxDurationSec });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [saved, setSaved] = useState<MediaAsset | undefined>(existing);
  const promptHintKind = kind === "video" ? "selfie" : "voice";

  const skipForDemo = () => {
    const seconds = kind === "video" ? 8 : 7;
    const asset: MediaAsset = {
      dataUrl: "",
      mimeType: kind === "video" ? "video/webm" : "audio/webm",
      size: 0,
      durationSec: seconds,
      placeholder: true,
    };
    setSaved(asset);
    onSave(asset);
  };

  useEffect(() => {
    if (videoRef.current && previewStream) {
      videoRef.current.srcObject = previewStream;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {});
    }
  }, [previewStream]);

  useEffect(() => {
    if (result) {
      const asset: MediaAsset = {
        dataUrl: result.dataUrl,
        mimeType: result.mimeType,
        size: result.size,
        durationSec: result.durationSec,
      };
      setSaved(asset);
      try {
        onSave(asset);
      } catch (err) {
        console.warn("Failed to save media (likely quota):", err);
      }
    }
  }, [result, onSave]);

  const onContinue = () => {
    if (!saved) return;
    onAdvance();
  };

  const onRetake = () => {
    setSaved(undefined);
    reset();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#172033] mb-2">{title}</h2>
      <p className="text-sm text-[#6B7280] mb-4">{description}</p>

      <Card className="p-4 bg-[#F7F8FA] border-[#E5E7EB] mb-4">
        <p className="text-xs text-[#6B7280] mb-2">{t(`candidateFlow.${promptHintKind}.prompt`) ? "" : null}</p>
        <p className="text-sm font-medium text-[#111827] leading-relaxed italic">{promptText}</p>
      </Card>

      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 mb-4">
        {saved ? (
          <div className="space-y-4">
            <p className="text-xs text-[#9CA3AF] uppercase tracking-wider text-center font-semibold">
              {t(`candidateFlow.${promptHintKind}.preview`)}
            </p>
            {saved.placeholder ? (
              <div className="rounded-xl border border-[#C6923A]/30 bg-[#C6923A]/5 px-4 py-6 text-center">
                <p className="text-xs text-[#8A6422] leading-relaxed">
                  <Info className="w-3 h-3 inline mr-1" />
                  {t("candidateFlow.mediaSkip.notice")}
                </p>
                <p className="text-xs text-[#8A6422] font-semibold mt-1">
                  {t("candidateFlow.mediaSkip.skipped", { seconds: Math.round(saved.durationSec ?? 0) })}
                </p>
              </div>
            ) : kind === "video" ? (
              <video src={saved.dataUrl} controls className="w-full rounded-xl bg-black max-h-72" />
            ) : (
              <audio src={saved.dataUrl} controls className="w-full" />
            )}
            <div className="flex items-center justify-center gap-3 text-xs text-[#6B7280]">
              <span>{t(`candidateFlow.${promptHintKind}.duration`, { seconds: Math.round(saved.durationSec ?? 0) })}</span>
              <span>·</span>
              <span>{(saved.size / 1024).toFixed(1)} KB</span>
            </div>
            <div className="flex justify-center">
              <SecondaryBtn onClick={onRetake} icon={<RefreshCw className="w-4 h-4" />}>
                {t(`candidateFlow.${promptHintKind}.rerecord`)}
              </SecondaryBtn>
            </div>
          </div>
        ) : isRecording ? (
          <div className="space-y-3">
            {kind === "video" ? (
              <video
                ref={videoRef}
                className="w-full max-h-72 rounded-xl bg-black object-cover"
                playsInline
              />
            ) : (
              <div className="flex flex-col items-center py-4">
                <div className="w-20 h-20 bg-[#C6923A]/10 rounded-full flex items-center justify-center mb-3 animate-pulse">
                  <Mic className="w-8 h-8 text-[#C6923A]" />
                </div>
                <p className="text-sm text-[#374151] font-medium">{t(`candidateFlow.${promptHintKind}.stop`)}…</p>
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C6923A] animate-pulse" />
                {elapsed.toFixed(1)}s
              </div>
              <span>{maxDurationSec.toFixed(0)}s max</span>
            </div>
            <div className="w-full h-1.5 bg-[#E5E7EB] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C6923A] transition-all"
                style={{ width: `${Math.min(100, (elapsed / maxDurationSec) * 100)}%` }}
              />
            </div>
            <div className="flex justify-center pt-1">
              <button
                onClick={stop}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#172033] text-white text-sm font-medium rounded-xl hover:bg-[#1e2d47]"
              >
                <Square className="w-4 h-4" />
                {t(`candidateFlow.${promptHintKind}.stop`)}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-[#172033]/5 rounded-full flex items-center justify-center mx-auto mb-4">
              {icon}
            </div>
            <p className="font-medium text-sm text-[#374151] mb-3">{t(`candidateFlow.${promptHintKind}.ready`)}</p>
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={start}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2F7D7E] text-white text-sm font-medium rounded-xl hover:bg-[#276970] transition-colors"
              >
                <Play className="w-4 h-4" /> {t(`candidateFlow.${promptHintKind}.start`)}
              </button>
              <button
                onClick={skipForDemo}
                className="text-xs text-[#6B7280] hover:text-[#374151] underline underline-offset-2"
              >
                {t("candidateFlow.mediaSkip.label")}
              </button>
            </div>
          </div>
        )}
      </div>

      {permissionError && (
        <div className="mb-4 p-3 bg-[#C6923A]/10 border border-[#C6923A]/30 rounded-lg text-xs text-[#8A6422]">
          <p className="mb-2">{permissionError}</p>
          <SecondaryBtn onClick={skipForDemo} className="text-xs py-1.5">
            {t("candidateFlow.mediaSkip.label")}
          </SecondaryBtn>
        </div>
      )}

      <p className="text-xs text-[#9CA3AF] mb-6">
        <Info className="w-3 h-3 inline mr-1" />
        {footerNote}
      </p>

      <div className="flex gap-3">
        <SecondaryBtn onClick={onBack} className="text-sm">
          {t("candidateFlow.back")}
        </SecondaryBtn>
        <PrimaryBtn onClick={onContinue} className="text-sm ml-auto" disabled={!saved}>
          {t("candidateFlow.continue")}
        </PrimaryBtn>
      </div>
    </div>
  );
}

/* ─── Step 6: Review ─────────────────────────────────────────── */
function ReviewStep({
  candidateId,
  onBack,
  onSubmit,
}: {
  candidateId: string;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const { t } = useTranslation();
  const sub = getSubmission(candidateId);

  const sections = [
    { label: t("candidateFlow.review.consent"), done: sub.consent.agreed, note: undefined as string | undefined },
    {
      label: t("candidateFlow.review.basicInfo"),
      done: !!sub.basicInfo,
      note: sub.basicInfo?.fullName,
    },
    {
      label: t("candidateFlow.review.portfolioLinks"),
      done: sub.portfolio.length > 0,
      note: t("candidateFlow.review.linksProvided", { count: sub.portfolio.length }),
    },
    {
      label: t("candidateFlow.review.documentLabel"),
      done: !!sub.document,
      note: sub.document?.fileName,
    },
    {
      label: t("candidateFlow.review.selfieLabel"),
      done: !!sub.selfie,
      note: sub.selfie
        ? t("candidateFlow.review.secondsRecorded", { seconds: Math.round(sub.selfie.durationSec ?? 0) })
        : undefined,
    },
    {
      label: t("candidateFlow.review.voiceLabel"),
      done: !!sub.voice,
      note: sub.voice
        ? t("candidateFlow.review.secondsRecorded", { seconds: Math.round(sub.voice.durationSec ?? 0) })
        : undefined,
    },
  ];

  const allReady = sections.every((s) => s.done);

  return (
    <div>
      <h2 className="text-xl font-bold text-[#172033] mb-2">{t("candidateFlow.review.title")}</h2>
      <p className="text-sm text-[#6B7280] mb-6">{t("candidateFlow.review.intro")}</p>
      <Card className="divide-y divide-[#E5E7EB] mb-5">
        {sections.map((s) => (
          <div key={s.label} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2.5">
              <CheckCircle className={cn("w-4 h-4", s.done ? "text-[#2F7D7E]" : "text-[#E5E7EB]")} />
              <span className="text-sm text-[#374151]">{s.label}</span>
              {s.note && <span className="text-xs text-[#9CA3AF]">· {s.note}</span>}
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                s.done ? "text-[#2F7D7E]" : "text-[#9CA3AF]",
              )}
            >
              {s.done ? t("common.ready") : t("common.missing")}
            </span>
          </div>
        ))}
      </Card>
      <GuardrailNotice />
      <div className="flex gap-3 pt-4">
        <SecondaryBtn onClick={onBack} className="text-sm">
          {t("candidateFlow.back")}
        </SecondaryBtn>
        <PrimaryBtn onClick={onSubmit} className="text-sm ml-auto" disabled={!allReady}>
          {t("candidateFlow.submitVerification")}
        </PrimaryBtn>
      </div>
    </div>
  );
}

/* ─── Step 7: Complete ───────────────────────────────────────── */
function CompleteStep({
  candidateId,
  onBackToHome,
}: {
  candidateId: string;
  onBackToHome: () => void;
}) {
  const { t } = useTranslation();
  const sub = getSubmission(candidateId);
  const submittedAt = sub.submittedAt ? new Date(sub.submittedAt) : new Date();
  const ackKeys = ["ack1", "ack2", "ack3", "ack4"];

  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-[#2F7D7E]/10 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle className="w-8 h-8 text-[#2F7D7E]" />
      </div>
      <h2 className="text-xl font-bold text-[#172033] mb-2">{t("candidateFlow.complete.title")}</h2>
      <p className="text-sm text-[#6B7280] mb-6 max-w-sm mx-auto">{t("candidateFlow.complete.intro")}</p>
      <Card className="p-4 text-left max-w-sm mx-auto mb-6">
        <div className="space-y-2 text-xs text-[#374151]">
          {ackKeys.map((k) => (
            <div key={k} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-[#2F7D7E] mt-0.5 shrink-0" />
              {t(`candidateFlow.complete.${k}`)}
            </div>
          ))}
        </div>
      </Card>
      <p className="text-xs text-[#9CA3AF] mb-4">
        {t("candidateFlow.complete.referenceLine", {
          ref: sub.reference ?? "—",
          date: submittedAt.toLocaleDateString(),
        })}
      </p>
      <SecondaryBtn onClick={onBackToHome}>{t("candidateFlow.backToHome")}</SecondaryBtn>
    </div>
  );
}
