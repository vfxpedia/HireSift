import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  Mic,
  MicOff,
  Video as VideoIcon,
  VideoOff,
  Maximize2,
  Camera as CameraIcon,
  PhoneOff,
  Shield,
} from "lucide-react";
import { TopBar } from "../components/layout/TopBar";
import { Card, SectionLabel } from "../components/primitives/Card";
import { PrimaryBtn, SecondaryBtn } from "../components/primitives/Buttons";
import { AttentionBadge } from "../components/primitives/Badges";
import { SignalGauge } from "../components/live/SignalGauge";
import { FaceMeshOverlay } from "../components/live/FaceMeshOverlay";
import { EventTimeline } from "../components/live/EventTimeline";
import { SessionMetadataPanel } from "../components/live/SessionMetadataPanel";
import { SourceToggle, type LiveSource } from "../components/live/SourceToggle";
import { BaselineCompare } from "../components/live/BaselineCompare";
import { listCandidates, getCandidate } from "../api/candidates";
import { getReview, setNotes } from "../api/reviews";
import { addAudit } from "../api/audit";
import { toast } from "../components/primitives/Toaster";
import { useLiveSignals } from "../hooks/useLiveSignals";
import { useMediaRecorder } from "../hooks/useMediaRecorder";
import { useFaceTracking } from "../hooks/useFaceTracking";
import { useTranslation } from "react-i18next";
import { cn } from "../lib/cn";

const DEMO_VIDEO = "/demo/interview.mp4";
const BASELINE_IMG = "/demo/baseline.jpg";

function formatTimer(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  const mm = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${mm}:${ss}`;
}

export default function LiveInterviewPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { candidateId } = useParams<{ candidateId?: string }>();
  const candidates = listCandidates();

  // Pick a sensible default candidate
  const targetId = useMemo(() => {
    if (candidateId) return candidateId;
    return (
      candidates.find((c) => c.submissionStatus === "submitted")?.id ??
      candidates.find((c) => c.submissionStatus === "in-progress")?.id ??
      candidates[0]?.id
    );
  }, [candidateId, candidates]);
  const candidate = targetId ? getCandidate(targetId) : undefined;
  const review = candidate ? getReview(candidate.id) : undefined;

  const [source, setSource] = useState<LiveSource>("demo");
  // `audioOn` controls the <video> element's `muted` attribute. We always
  // boot muted so autoplay is allowed, then the user clicks the mic button
  // to opt-in to sound (browser policy compliant gesture).
  const [audioOn, setAudioOn] = useState(false);
  const [camOn, setCamOn] = useState(true);
  const [tick, setTick] = useState(0); // 1Hz clock for elapsed timer
  const [videoTime, setVideoTime] = useState(0);
  const [note, setNote] = useState(review?.notes ?? "");
  const sessionStartRef = useRef<number>(Date.now());
  const auditedStartRef = useRef(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Real face tracking via face-api.js (lazy-loaded). Falls back to the
  // static mesh when the model is still loading or no face is detected.
  const { landmarks, confidence, ready: faceReady, error: faceError } =
    useFaceTracking({
      videoRef,
      active: !!candidate,
      intervalMs: 120,
    });

  // Live camera plumbing — only opens stream when source === "live"
  const { previewStream, permissionError, start, stop } = useMediaRecorder({
    kind: "video",
    maxDurationSec: 60 * 30, // never auto-stop in this context; we drive manually
  });

  // Reset session timer (and force-mute) when (re)entering or switching
  // candidate / source. The user has to click the mic button again on the
  // new source to unmute — keeps autoplay policy happy and prevents
  // surprise audio.
  useEffect(() => {
    sessionStartRef.current = Date.now();
    auditedStartRef.current = false;
    setVideoTime(0);
    setAudioOn(false);
  }, [targetId, source]);

  // 1Hz timer
  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  // Audit "session started" once per candidate/source combo
  useEffect(() => {
    if (!candidate || auditedStartRef.current) return;
    auditedStartRef.current = true;
    addAudit({
      action: source === "live" ? "Live camera session started" : "Demo interview session started",
      user: candidate.reviewer ?? "Reviewer",
      candidate: candidate.code,
      type: "review",
    });
  }, [candidate, source]);

  // Manage live camera stream
  useEffect(() => {
    if (source !== "live") {
      stop();
      return;
    }
    start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source]);

  // Wire the stream into the <video> element + apply mute state.
  // In live mode we always keep the local preview muted (otherwise the
  // presenter's own mic would feed back through the page); in demo mode
  // `audioOn` drives mute so the user can hear the deepfake clip after
  // their gesture.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (source === "live") {
      if (previewStream) {
        el.srcObject = previewStream;
        el.muted = true; // always muted in self-view to avoid echo
        el.play().catch(() => {});
      }
    } else {
      el.srcObject = null;
      if (el.src !== window.location.origin + DEMO_VIDEO && !el.src.endsWith(DEMO_VIDEO)) {
        el.src = DEMO_VIDEO;
        el.load();
      }
      el.muted = !audioOn;
      // Re-attempt play after mute change so a user-gesture unmute resumes
      // playback if the browser had paused it.
      el.play().catch(() => {});
    }
  }, [source, previewStream, audioOn]);

  // Track demo video currentTime so signals can react to scripted moments
  useEffect(() => {
    const el = videoRef.current;
    if (!el || source !== "demo") return;
    const onTime = () => setVideoTime(el.currentTime);
    const onEnded = () => setVideoTime(0);
    el.addEventListener("timeupdate", onTime);
    el.addEventListener("ended", onEnded);
    return () => {
      el.removeEventListener("timeupdate", onTime);
      el.removeEventListener("ended", onEnded);
    };
  }, [source]);

  const signals = useLiveSignals({
    active: !!candidate,
    videoTime,
    liveMode: source === "live",
  });

  void tick; // re-render trigger so the elapsed clock updates

  if (!candidate) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <TopBar title={t("liveInterview.title")} subtitle={t("liveInterview.noCandidatesSubtitle")} />
        <div className="flex-1 flex items-center justify-center p-6">
          <Card className="p-8 text-center max-w-sm">
            <p className="text-sm text-[#6B7280] mb-4">{t("liveInterview.noCandidatesBody")}</p>
            <PrimaryBtn onClick={() => navigate("/app/candidates")}>
              {t("liveInterview.goToCandidates")}
            </PrimaryBtn>
          </Card>
        </div>
      </div>
    );
  }

  const elapsedMs = Date.now() - sessionStartRef.current;
  const similarity = signals.faceConsistency.value;

  const onSaveNotes = () => {
    setNotes(candidate.id, note);
    toast.success(t("liveInterview.savedNotesToast"));
  };

  const onEndSession = () => {
    addAudit({
      action: "Live interview session ended",
      user: candidate.reviewer ?? "Reviewer",
      candidate: candidate.code,
      type: "review",
    });
    toast.success(t("liveInterview.endSessionToast"));
    navigate(`/app/reviewer/${candidate.id}`);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <TopBar
        title={t("liveInterview.title")}
        subtitle={`${candidate.name} · ${candidate.code} · ${formatTimer(elapsedMs)}`}
        actions={
          <div className="flex items-center gap-2">
            <SourceToggle value={source} onChange={setSource} />
            <SecondaryBtn onClick={onSaveNotes} className="text-sm py-2">
              {t("liveInterview.saveNotes")}
            </SecondaryBtn>
            <PrimaryBtn
              onClick={onEndSession}
              className="text-sm py-2"
              icon={<PhoneOff className="w-4 h-4" />}
            >
              {t("liveInterview.endSession")}
            </PrimaryBtn>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto mb-4 flex items-center gap-2 bg-[#172033]/5 border border-[#172033]/10 rounded-xl px-4 py-2.5 text-xs text-[#374151]">
          <Shield className="w-3.5 h-3.5 text-[#172033]" />
          <span>
            <strong className="font-semibold text-[#172033]">
              {t("liveInterview.principleStrong")}
            </strong>{" "}
            {t("liveInterview.principleTail")}
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* LEFT — Video + overlays + controls */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="overflow-hidden">
              <div className="relative bg-black aspect-video">
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  loop={source === "demo"}
                  muted
                  playsInline
                />
                <FaceMeshOverlay
                  active={!!candidate}
                  intensity={signals.faceConsistency.status === "low" ? 0.4 : 0.8}
                  landmarks={landmarks}
                />

                {/* Status pill — top-left */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/55 backdrop-blur text-white text-[11px] font-medium">
                    <span className="w-2 h-2 rounded-full bg-[#C6923A] animate-pulse" />
                    {source === "live" ? t("liveInterview.pillLive") : t("liveInterview.pillDemo")}
                  </div>
                  <div className="px-2.5 py-1 rounded-md bg-black/55 backdrop-blur text-white text-[11px] font-mono">
                    {formatTimer(elapsedMs)}
                  </div>
                  {landmarks && (
                    <div className="px-2.5 py-1 rounded-md bg-[#2F7D7E]/80 backdrop-blur text-white text-[10px] font-medium">
                      {t("liveInterview.faceTracking", { percent: Math.round(confidence * 100) })}
                    </div>
                  )}
                  {!landmarks && !faceReady && !faceError && (
                    <div className="px-2.5 py-1 rounded-md bg-black/55 backdrop-blur text-white/70 text-[10px] font-medium">
                      {t("liveInterview.faceModelLoading")}
                    </div>
                  )}
                  {!landmarks && faceReady && !faceError && (
                    <div className="px-2.5 py-1 rounded-md bg-[#C6923A]/80 backdrop-blur text-white text-[10px] font-medium">
                      {t("liveInterview.faceSearching")}
                    </div>
                  )}
                  {faceError && (
                    <div
                      className="px-2.5 py-1 rounded-md bg-[#7f1d1d]/80 backdrop-blur text-white text-[10px] font-medium max-w-[260px] truncate"
                      title={faceError}
                    >
                      {t("liveInterview.faceModelError")}
                    </div>
                  )}
                </div>

                {/* Attention badge — top-right */}
                <div className="absolute top-3 right-3">
                  <AttentionBadge level={signals.faceConsistency.status} />
                </div>

                {/* Guardrail chip — bottom-left */}
                <div className="absolute bottom-3 left-3 max-w-[60%] px-3 py-2 rounded-lg bg-black/55 backdrop-blur text-white/90 text-[11px] leading-snug">
                  {t("liveInterview.guardrailChip")}
                </div>

                {/* Permission error */}
                {source === "live" && permissionError && (
                  <div className="absolute inset-x-6 top-1/2 -translate-y-1/2 mx-auto px-4 py-3 rounded-xl bg-[#C6923A]/95 text-white text-xs text-center leading-relaxed">
                    {permissionError}
                  </div>
                )}
              </div>

              {/* Bottom controls */}
              <div className="px-4 py-3 border-t border-[#E5E7EB] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ControlButton
                    active={audioOn}
                    onClick={() => setAudioOn((v) => !v)}
                    title={
                      source === "live"
                        ? t("liveInterview.controls.muteLiveTooltip")
                        : audioOn
                        ? t("liveInterview.controls.muteDemo")
                        : t("liveInterview.controls.unmuteDemo")
                    }
                    disabled={source === "live"}
                  >
                    {audioOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </ControlButton>
                  <ControlButton
                    active={camOn}
                    onClick={() => setCamOn((v) => !v)}
                    disabled={source !== "live"}
                    title={camOn ? t("liveInterview.controls.camStop") : t("liveInterview.controls.camStart")}
                  >
                    {camOn ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </ControlButton>
                  <ControlButton
                    onClick={() => videoRef.current?.requestFullscreen?.()}
                    title={t("liveInterview.controls.fullscreen")}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </ControlButton>
                </div>
                <div className="text-[11px] text-[#9CA3AF]">
                  {source === "demo"
                    ? audioOn
                      ? t("liveInterview.caption.demoUnmuted")
                      : t("liveInterview.caption.demoMuted")
                    : t("liveInterview.caption.live")}
                </div>
              </div>
            </Card>

            {/* Signal gauges in 2x2 */}
            <Card className="p-4">
              <SectionLabel>{t("liveInterview.panels.liveSignals")}</SectionLabel>
              <div className="grid grid-cols-2 gap-3 -mt-1">
                <SignalGauge
                  label={t("liveInterview.signals.liveness")}
                  value={signals.liveness.value}
                  status={signals.liveness.status}
                  hint={t("liveInterview.signals.livenessHint")}
                />
                <SignalGauge
                  label={t("liveInterview.signals.faceConsistency")}
                  value={signals.faceConsistency.value}
                  status={signals.faceConsistency.status}
                  hint={t("liveInterview.signals.faceConsistencyHint")}
                />
                <SignalGauge
                  label={t("liveInterview.signals.voiceConsistency")}
                  value={signals.voiceConsistency.value}
                  status={signals.voiceConsistency.status}
                  hint={t("liveInterview.signals.voiceConsistencyHint")}
                />
                <SignalGauge
                  label={t("liveInterview.signals.sessionIntegrity")}
                  value={signals.sessionIntegrity.value}
                  status={signals.sessionIntegrity.status}
                  hint={t("liveInterview.signals.sessionIntegrityHint")}
                />
              </div>
            </Card>
          </div>

          {/* RIGHT — Side panels */}
          <div className="space-y-4">
            <Card className="p-4">
              <SectionLabel>{t("liveInterview.panels.recentEvents")}</SectionLabel>
              <EventTimeline events={signals.events} />
            </Card>

            <Card className="p-4">
              <SectionLabel>{t("liveInterview.panels.reviewerNotes")}</SectionLabel>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("liveInterview.panels.notesPlaceholder")}
                rows={5}
                className="w-full text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#2F7D7E]/30 resize-none"
              />
              <SecondaryBtn onClick={onSaveNotes} className="text-xs py-1.5 mt-2 w-full justify-center">
                {t("liveInterview.saveNotes")}
              </SecondaryBtn>
            </Card>

            <Card className="p-4">
              <SectionLabel>{t("liveInterview.panels.baselineCompare")}</SectionLabel>
              <BaselineCompare
                videoEl={videoRef.current}
                baselineSrc={BASELINE_IMG}
                similarity={similarity}
              />
            </Card>

            <Card className="p-4">
              <SectionLabel>{t("liveInterview.panels.sessionMetadata")}</SectionLabel>
              <SessionMetadataPanel
                latencyMs={42 + Math.sin(tick / 3) * 6}
                frameRate={24 + Math.sin(tick / 5) * 1.2}
              />
            </Card>

            <Card className="p-4">
              <SectionLabel>{t("liveInterview.panels.nextSteps")}</SectionLabel>
              <div className="space-y-2">
                <SecondaryBtn
                  onClick={() => navigate(`/app/candidates/${candidate.id}`)}
                  className="w-full justify-center text-sm"
                  icon={<CameraIcon className="w-4 h-4" />}
                >
                  {t("liveInterview.nextStep.candidateDetail")}
                </SecondaryBtn>
                <PrimaryBtn
                  onClick={() => navigate(`/app/reviewer/${candidate.id}`)}
                  className="w-full justify-center text-sm"
                >
                  {t("liveInterview.nextStep.reviewerConsole")}
                </PrimaryBtn>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  children,
  onClick,
  active = true,
  disabled,
  title,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors border",
        disabled
          ? "border-[#E5E7EB] text-[#D1D5DB] bg-[#F9FAFB] cursor-not-allowed"
          : active
          ? "border-[#E5E7EB] text-[#172033] bg-white hover:bg-[#F7F8FA]"
          : "border-[#C6923A]/40 text-[#8A6422] bg-[#C6923A]/10",
      )}
    >
      {children}
    </button>
  );
}
