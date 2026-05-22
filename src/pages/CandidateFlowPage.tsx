import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
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
import { listCandidates, getCandidate, setSubmissionStatus } from "../api/candidates";
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
  { label: "Consent", icon: Lock },
  { label: "Basic Info", icon: User },
  { label: "Portfolio", icon: LinkIcon },
  { label: "Document", icon: FileText },
  { label: "Selfie", icon: Video },
  { label: "Voice", icon: Mic },
  { label: "Review", icon: Eye },
  { label: "Complete", icon: CheckCircle },
];

export default function CandidateFlowPage() {
  const navigate = useNavigate();
  const { candidateId } = useParams<{ candidateId?: string }>();

  const targetId = useMemo(() => {
    if (candidateId) return candidateId;
    const list = listCandidates();
    return (
      list.find((c) => c.submissionStatus === "pending")?.id ??
      list.find((c) => c.submissionStatus === "in-progress")?.id ??
      list[0]?.id
    );
  }, [candidateId]);

  const candidate = targetId ? getCandidate(targetId) : undefined;

  const [step, setStep] = useState<number>(() => (targetId ? getSubmission(targetId).step : 0));

  useEffect(() => {
    if (targetId) setStepApi(targetId, step);
  }, [targetId, step]);

  if (!candidate || !targetId) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-6">
        <Card className="p-8 max-w-sm text-center">
          <h2 className="text-base font-bold text-[#172033] mb-2">No verification request</h2>
          <p className="text-sm text-[#6B7280] mb-5">
            This verification link is invalid or expired. Please contact the hiring team for a new link.
          </p>
          <PrimaryBtn onClick={() => navigate("/")}>Back to home</PrimaryBtn>
        </Card>
      </div>
    );
  }

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
              <p className="font-semibold text-sm text-[#172033]">HireSift Verification</p>
              <p className="text-[10px] text-[#9CA3AF] font-mono">
                {candidate.code} · {candidate.role}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 bg-[#F7F8FA] px-3 py-1.5 rounded-lg">
            <Lock className="w-3 h-3 text-[#6B7280]" />
            <span className="text-xs text-[#6B7280]">Secure session</span>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-[#E5E7EB] px-6 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center flex-1 last:flex-none">
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
                    {s.label}
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
  const submission = getSubmission(candidateId);
  const [agreed, setAgreed] = useState(submission.consent.agreed);

  const submit = () => {
    if (!agreed) return;
    recordConsent(candidateId, true);
    setSubmissionStatus(candidateId, "in-progress");
    onAdvance();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#172033] mb-2">Consent & Privacy Notice</h2>
      <p className="text-sm text-[#6B7280] mb-6">
        Please review and confirm your consent before submitting any information.
      </p>
      <Card className="p-5 mb-4">
        <h3 className="font-semibold text-sm text-[#111827] mb-3">What we collect</h3>
        <div className="space-y-2 text-sm text-[#374151]">
          {[
            "Basic contact and identification information",
            "Portfolio and work sample links",
            "A masked copy of an identity document or certificate",
            "A short selfie video sample (5–10 seconds)",
            "A short voice sample (5–10 seconds)",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <CheckCircle className="w-4 h-4 text-[#2F7D7E] mt-0.5 shrink-0" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5 mb-4">
        <h3 className="font-semibold text-sm text-[#111827] mb-3">What we do NOT do</h3>
        <div className="space-y-2 text-sm text-[#374151]">
          {[
            "Automatically reject or approve your application",
            "Perform lie detection or emotion analysis",
            "Share your data with third parties without disclosure",
            "Make any hiring decision automatically",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2.5">
              <X className="w-4 h-4 text-[#C6923A] mt-0.5 shrink-0" />
              <p>{item}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-5 mb-5">
        <h3 className="font-semibold text-sm text-[#111827] mb-2">Data retention</h3>
        <p className="text-sm text-[#6B7280]">
          Your submitted materials are stored for 90 days unless you request earlier deletion. You may
          contact{" "}
          <a href="#" className="text-[#2F7D7E] hover:underline">
            privacy@hiresift.com
          </a>{" "}
          at any time to request deletion or review.
        </p>
      </Card>
      <label className="flex items-start gap-3 cursor-pointer mb-6">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 w-4 h-4 rounded accent-[#2F7D7E]"
        />
        <span className="text-sm text-[#374151]">
          I have read and understood the privacy notice. I consent to submit the materials listed above
          for verification purposes.
        </span>
      </label>
      <div className="flex justify-end">
        <PrimaryBtn onClick={submit} disabled={!agreed}>
          I agree — Continue →
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
      <h2 className="text-xl font-bold text-[#172033] mb-2">Basic Information</h2>
      <p className="text-sm text-[#6B7280] mb-6">
        Please provide your basic contact information for verification.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Full name" error={errors.fullName?.message}>
          <TextInput
            placeholder="As it appears on official documents"
            error={!!errors.fullName}
            {...register("fullName", { required: "Required" })}
          />
        </Field>
        <Field label="Email address" error={errors.email?.message}>
          <TextInput
            type="email"
            placeholder="Your primary email"
            error={!!errors.email}
            {...register("email", {
              required: "Required",
              pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email" },
            })}
          />
        </Field>
        <Field label="Country of residence" error={errors.country?.message}>
          <TextInput
            placeholder="e.g. South Korea"
            error={!!errors.country}
            {...register("country", { required: "Required" })}
          />
        </Field>
        <Field label="LinkedIn profile URL" optional>
          <TextInput
            placeholder="https://linkedin.com/in/yourname"
            {...register("linkedin")}
          />
        </Field>
        <div className="mt-2 p-3 bg-[#F7F8FA] rounded-xl">
          <p className="text-xs text-[#6B7280]">
            <Info className="w-3 h-3 inline mr-1" />
            Only provide information you are comfortable sharing. You may use a name that matches your
            professional identity.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <SecondaryBtn onClick={onBack} className="text-sm">
            ← Back
          </SecondaryBtn>
          <PrimaryBtn type="submit" className="text-sm ml-auto">
            Continue →
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
      setError("Please provide at least one portfolio link.");
      return;
    }
    const invalid = cleaned.find((l) => !/^https?:\/\//.test(l.url));
    if (invalid) {
      setError(`Please include https:// in your ${invalid.platform} URL.`);
      return;
    }
    savePortfolio(candidateId, cleaned);
    onAdvance();
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-[#172033] mb-2">Portfolio Links</h2>
      <p className="text-sm text-[#6B7280] mb-6">
        Share links to your professional profiles and work samples. At least one is required.
      </p>
      <div className="space-y-3">
        {PLATFORMS.map((p) => (
          <Field
            key={p}
            label={p}
            optional={p !== "GitHub" && p !== "LinkedIn"}
          >
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
          Portfolio links are reviewed for account age, activity patterns, and ownership consistency —
          not to judge the quality of your work.
        </p>
      </div>
      <div className="flex gap-3 pt-4">
        <SecondaryBtn onClick={onBack} className="text-sm">
          ← Back
        </SecondaryBtn>
        <PrimaryBtn onClick={submit} className="text-sm ml-auto">
          Continue →
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
  const existing = getSubmission(candidateId).document;
  const [asset, setAsset] = useState<MediaAsset | undefined>(existing);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFile = async (file: File) => {
    setError(null);
    if (file.size > 5 * 1024 * 1024) {
      setError("File is larger than 5MB.");
      return;
    }
    const accepted = ["image/png", "image/jpeg", "application/pdf"];
    if (!accepted.includes(file.type)) {
      setError("Accepted formats: PDF, PNG, JPG.");
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
      setError("Please upload a masked document before continuing.");
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
      <h2 className="text-xl font-bold text-[#172033] mb-2">Masked Document Upload</h2>
      <p className="text-sm text-[#6B7280] mb-4">
        Upload a masked version of an identity document or professional certificate.
      </p>
      <Card className="p-4 mb-5 border-[#C6923A]/20 bg-[#C6923A]/5">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#C6923A] mt-0.5 shrink-0" />
          <div className="text-xs text-[#8A6422]">
            <p className="font-semibold mb-1">
              Important: Mask sensitive information before uploading.
            </p>
            <p>
              Cover or blur your full ID number, date of birth, and any other unnecessary personal
              details. You may show only the name field and document type.
            </p>
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
          <p className="font-medium text-sm text-[#374151] mb-1">Click to upload or drag and drop</p>
          <p className="text-xs text-[#9CA3AF]">PDF, JPG, or PNG — max 5MB</p>
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
        <Card className="p-4 mb-4">
          <div className="flex items-start gap-4">
            {asset.mimeType.startsWith("image/") ? (
              <img
                src={asset.dataUrl}
                alt="masked document preview"
                className="w-32 h-32 object-cover rounded-lg border border-[#E5E7EB]"
              />
            ) : (
              <div className="w-32 h-32 bg-[#F7F8FA] rounded-lg border border-[#E5E7EB] flex items-center justify-center">
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
                  Replace
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

      <p className="text-xs text-[#6B7280] mb-6">
        Accepted: Passport (masked), Professional certificate, Driver license (masked), Employment
        verification letter.
      </p>

      <div className="flex gap-3">
        <SecondaryBtn onClick={onBack} className="text-sm">
          ← Back
        </SecondaryBtn>
        <PrimaryBtn onClick={submit} className="text-sm ml-auto">
          Continue →
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
  const existing = getSubmission(candidateId).selfie;
  return (
    <MediaCaptureStep
      kind="video"
      title="Selfie Video Sample"
      description="Record a short 5–10 second video sample for session integrity review."
      promptText='Look at the camera and say: "I am [your name] and I confirm this verification."'
      maxDurationSec={10}
      existing={existing}
      onSave={(asset) => saveSelfie(candidateId, asset)}
      onBack={onBack}
      onAdvance={onAdvance}
      footerNote="This sample is used only for session integrity review. No emotion or sentiment analysis is performed."
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
  const existing = getSubmission(candidateId).voice;
  return (
    <MediaCaptureStep
      kind="audio"
      title="Voice Sample"
      description="Record a short 5–10 second voice sample by reading the provided phrase."
      promptText={`"My name is ${candidateName}. Today is ${new Date().toLocaleDateString()}. I am submitting this verification for my remote hiring review."`}
      maxDurationSec={10}
      existing={existing}
      onSave={(asset) => saveVoice(candidateId, asset)}
      onBack={onBack}
      onAdvance={onAdvance}
      footerNote="Voice samples are used for session consistency review only. No voice biometric profiling is performed."
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
  const { isRecording, elapsed, previewStream, permissionError, result, start, stop, reset } =
    useMediaRecorder({ kind, maxDurationSec });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [saved, setSaved] = useState<MediaAsset | undefined>(existing);

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
        <p className="text-xs text-[#6B7280] mb-2">Please {kind === "video" ? "read this aloud while recording" : "read this phrase clearly"}:</p>
        <p className="text-sm font-medium text-[#111827] leading-relaxed italic">{promptText}</p>
      </Card>

      <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl p-6 mb-4">
        {saved ? (
          <div className="space-y-4">
            <p className="text-xs text-[#9CA3AF] uppercase tracking-wider text-center font-semibold">
              Recorded preview
            </p>
            {kind === "video" ? (
              <video src={saved.dataUrl} controls className="w-full rounded-xl bg-black max-h-72" />
            ) : (
              <audio src={saved.dataUrl} controls className="w-full" />
            )}
            <div className="flex items-center justify-center gap-3 text-xs text-[#6B7280]">
              <span>
                Duration: {Math.round(saved.durationSec ?? 0)}s
              </span>
              <span>·</span>
              <span>Size: {(saved.size / 1024).toFixed(1)} KB</span>
            </div>
            <div className="flex justify-center">
              <SecondaryBtn onClick={onRetake} icon={<RefreshCw className="w-4 h-4" />}>
                Re-record
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
                <p className="text-sm text-[#374151] font-medium">Recording…</p>
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-[#6B7280]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C6923A] animate-pulse" />
                Recording · {elapsed.toFixed(1)}s
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
                Stop recording
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-[#172033]/5 rounded-full flex items-center justify-center mx-auto mb-4">
              {icon}
            </div>
            <p className="font-medium text-sm text-[#374151] mb-3">Ready to record</p>
            <button
              onClick={start}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#2F7D7E] text-white text-sm font-medium rounded-xl hover:bg-[#276970] transition-colors"
            >
              <Play className="w-4 h-4" /> Start Recording
            </button>
            <p className="text-xs text-[#9CA3AF] mt-3">
              Your {kind === "video" ? "camera and microphone" : "microphone"} will be used briefly for
              this step only.
            </p>
          </div>
        )}
      </div>

      {permissionError && (
        <div className="mb-4 p-3 bg-[#C6923A]/10 border border-[#C6923A]/30 rounded-lg text-xs text-[#8A6422]">
          {permissionError}
        </div>
      )}

      <p className="text-xs text-[#9CA3AF] mb-6">
        <Info className="w-3 h-3 inline mr-1" />
        {footerNote}
      </p>

      <div className="flex gap-3">
        <SecondaryBtn onClick={onBack} className="text-sm">
          ← Back
        </SecondaryBtn>
        <PrimaryBtn onClick={onContinue} className="text-sm ml-auto" disabled={!saved}>
          Continue →
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
  const sub = getSubmission(candidateId);

  const sections = [
    { label: "Consent", done: sub.consent.agreed, note: undefined },
    {
      label: "Basic Information",
      done: !!sub.basicInfo,
      note: sub.basicInfo?.fullName,
    },
    {
      label: "Portfolio Links",
      done: sub.portfolio.length > 0,
      note: `${sub.portfolio.length} link(s) provided`,
    },
    {
      label: "Masked Document",
      done: !!sub.document,
      note: sub.document?.fileName,
    },
    {
      label: "Selfie Video",
      done: !!sub.selfie,
      note: sub.selfie ? `${Math.round(sub.selfie.durationSec ?? 0)}s recorded` : undefined,
    },
    {
      label: "Voice Sample",
      done: !!sub.voice,
      note: sub.voice ? `${Math.round(sub.voice.durationSec ?? 0)}s recorded` : undefined,
    },
  ];

  const allReady = sections.every((s) => s.done);

  return (
    <div>
      <h2 className="text-xl font-bold text-[#172033] mb-2">Review Your Submission</h2>
      <p className="text-sm text-[#6B7280] mb-6">
        Review your submitted materials before final submission.
      </p>
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
              {s.done ? "Ready" : "Missing"}
            </span>
          </div>
        ))}
      </Card>
      <GuardrailNotice />
      <div className="flex gap-3 pt-4">
        <SecondaryBtn onClick={onBack} className="text-sm">
          ← Back
        </SecondaryBtn>
        <PrimaryBtn onClick={onSubmit} className="text-sm ml-auto" disabled={!allReady}>
          Submit Verification →
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
  const sub = getSubmission(candidateId);
  const submittedAt = sub.submittedAt ? new Date(sub.submittedAt) : new Date();

  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-[#2F7D7E]/10 rounded-full flex items-center justify-center mx-auto mb-5">
        <CheckCircle className="w-8 h-8 text-[#2F7D7E]" />
      </div>
      <h2 className="text-xl font-bold text-[#172033] mb-2">Submission Complete</h2>
      <p className="text-sm text-[#6B7280] mb-6 max-w-sm mx-auto">
        Your verification materials have been securely submitted. A human reviewer will check your
        signals and the hiring team will be notified.
      </p>
      <Card className="p-4 text-left max-w-sm mx-auto mb-6">
        <div className="space-y-2 text-xs text-[#374151]">
          {[
            "Your submission has been received securely.",
            "A human reviewer will inspect the signals.",
            "This does not automatically determine your hiring outcome.",
            "You may request deletion at: privacy@hiresift.com",
          ].map((item) => (
            <div key={item} className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-[#2F7D7E] mt-0.5 shrink-0" />
              {item}
            </div>
          ))}
        </div>
      </Card>
      <p className="text-xs text-[#9CA3AF] mb-4">
        Reference: {sub.reference ?? "—"} · Submitted{" "}
        {submittedAt.toLocaleDateString()}
      </p>
      <SecondaryBtn onClick={onBackToHome}>Back to home</SecondaryBtn>
    </div>
  );
}
