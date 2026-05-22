import { useEffect, useRef, useState } from "react";
import type { AttentionLevel } from "../types";

export interface LiveSignal {
  value: number;
  status: AttentionLevel;
}

export interface LiveEvent {
  id: string;
  at: number; // ms since session start
  label: string;
  kind: "info" | "warn" | "critical";
}

export interface LiveSignalsState {
  liveness: LiveSignal;
  faceConsistency: LiveSignal;
  voiceConsistency: LiveSignal;
  sessionIntegrity: LiveSignal;
  events: LiveEvent[];
  startedAt: number;
}

interface Options {
  active: boolean;
  /** When set, this clock (in seconds) drives the staged anomaly script. */
  videoTime?: number;
  /**
   * If true, signals jitter around baseline but never dip into anomaly
   * territory. Useful for the live-camera mode where we don't know what the
   * presenter looks like.
   */
  liveMode?: boolean;
}

const baseline = {
  liveness: 96,
  faceConsistency: 94,
  voiceConsistency: 91,
  sessionIntegrity: 98,
};

function jitter(amount: number) {
  return (Math.random() - 0.5) * amount;
}

function statusFor(value: number): AttentionLevel {
  if (value >= 88) return "low";
  if (value >= 72) return "medium";
  if (value >= 55) return "high";
  return "manual";
}

function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, n));
}

export function useLiveSignals({ active, videoTime, liveMode = false }: Options): LiveSignalsState {
  const [state, setState] = useState<LiveSignalsState>(() => ({
    liveness: { value: baseline.liveness, status: "low" },
    faceConsistency: { value: baseline.faceConsistency, status: "low" },
    voiceConsistency: { value: baseline.voiceConsistency, status: "low" },
    sessionIntegrity: { value: baseline.sessionIntegrity, status: "low" },
    events: [
      {
        id: "seed-1",
        at: 0,
        label: "Live session started",
        kind: "info",
      },
    ],
    startedAt: Date.now(),
  }));

  const triggeredRef = useRef<Set<string>>(new Set());

  // Reset event log + baselines when active toggles on/off or mode flips
  useEffect(() => {
    triggeredRef.current = new Set();
    setState({
      liveness: { value: baseline.liveness, status: "low" },
      faceConsistency: { value: baseline.faceConsistency, status: "low" },
      voiceConsistency: { value: baseline.voiceConsistency, status: "low" },
      sessionIntegrity: { value: baseline.sessionIntegrity, status: "low" },
      events: [
        {
          id: `start-${Date.now()}`,
          at: 0,
          label: liveMode ? "Live camera session started" : "Demo session started",
          kind: "info",
        },
      ],
      startedAt: Date.now(),
    });
  }, [active, liveMode]);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setState((prev) => {
        const t = (Date.now() - prev.startedAt) / 1000;
        let liveness = clamp(baseline.liveness + jitter(3));
        let face = clamp(baseline.faceConsistency + jitter(4));
        let voice = clamp(baseline.voiceConsistency + jitter(5));
        let session = clamp(baseline.sessionIntegrity + jitter(2));
        const newEvents: LiveEvent[] = [];

        if (!liveMode) {
          const vt = videoTime ?? t;

          // Scripted anomalies tied to the demo video timeline
          if (vt >= 4 && vt <= 7) {
            face = clamp(58 + jitter(6));
            if (!triggeredRef.current.has("face-mismatch")) {
              triggeredRef.current.add("face-mismatch");
              newEvents.push({
                id: `face-${Date.now()}`,
                at: t * 1000,
                label: "Face consistency dropped — reviewer attention recommended",
                kind: "warn",
              });
            }
          }
          if (vt >= 10 && vt <= 12) {
            liveness = clamp(64 + jitter(5));
            if (!triggeredRef.current.has("liveness-dip")) {
              triggeredRef.current.add("liveness-dip");
              newEvents.push({
                id: `live-${Date.now()}`,
                at: t * 1000,
                label: "Liveness signal weakened briefly",
                kind: "warn",
              });
            }
          }
          if (vt >= 16 && vt <= 18) {
            voice = clamp(60 + jitter(8));
            if (!triggeredRef.current.has("voice-mismatch")) {
              triggeredRef.current.add("voice-mismatch");
              newEvents.push({
                id: `voice-${Date.now()}`,
                at: t * 1000,
                label: "Voice consistency outside baseline range",
                kind: "warn",
              });
            }
          }
          if (vt >= 22 && !triggeredRef.current.has("review-suggested")) {
            triggeredRef.current.add("review-suggested");
            newEvents.push({
              id: `review-${Date.now()}`,
              at: t * 1000,
              label: "Multiple attention signals — manual review suggested",
              kind: "critical",
            });
          }
        }

        return {
          liveness: { value: liveness, status: statusFor(liveness) },
          faceConsistency: { value: face, status: statusFor(face) },
          voiceConsistency: { value: voice, status: statusFor(voice) },
          sessionIntegrity: { value: session, status: statusFor(session) },
          events:
            newEvents.length > 0
              ? [...newEvents, ...prev.events].slice(0, 8)
              : prev.events,
          startedAt: prev.startedAt,
        };
      });
    }, 250);
    return () => window.clearInterval(id);
  }, [active, videoTime, liveMode]);

  return state;
}
