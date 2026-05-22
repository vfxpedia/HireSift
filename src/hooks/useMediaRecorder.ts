import { useCallback, useEffect, useRef, useState } from "react";

export type RecorderKind = "video" | "audio";

export interface RecorderResult {
  blob: Blob;
  dataUrl: string;
  mimeType: string;
  durationSec: number;
  size: number;
}

interface UseMediaRecorderOptions {
  kind: RecorderKind;
  maxDurationSec?: number;
  videoBitsPerSecond?: number;
  audioBitsPerSecond?: number;
}

const pickMimeType = (kind: RecorderKind): string => {
  const candidates =
    kind === "video"
      ? ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm", "video/mp4"]
      : ["audio/webm;codecs=opus", "audio/webm", "audio/mp4", "audio/ogg;codecs=opus"];
  for (const m of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)) return m;
  }
  return "";
};

const blobToDataUrl = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });

export function useMediaRecorder(opts: UseMediaRecorderOptions) {
  const { kind, maxDurationSec = 10 } = opts;

  const [permissionError, setPermissionError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [result, setResult] = useState<RecorderResult | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const stopReasonRef = useRef<"manual" | "auto">("manual");

  const cleanupStream = useCallback(() => {
    setPreviewStream((s) => {
      if (s) s.getTracks().forEach((t) => t.stop());
      return null;
    });
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => () => cleanupStream(), [cleanupStream]);

  const start = useCallback(async () => {
    setPermissionError(null);
    setResult(null);
    chunksRef.current = [];
    try {
      const constraints: MediaStreamConstraints =
        kind === "video"
          ? { audio: true, video: { width: 320, height: 240, frameRate: 24 } }
          : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setPreviewStream(stream);

      const mimeType = pickMimeType(kind);
      const recorder = new MediaRecorder(stream, {
        mimeType: mimeType || undefined,
        videoBitsPerSecond: opts.videoBitsPerSecond ?? 400_000,
        audioBitsPerSecond: opts.audioBitsPerSecond ?? 32_000,
      });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || (kind === "video" ? "video/webm" : "audio/webm"),
        });
        const durationSec = (performance.now() - startTimeRef.current) / 1000;
        try {
          const dataUrl = await blobToDataUrl(blob);
          setResult({ blob, dataUrl, mimeType: blob.type, durationSec, size: blob.size });
        } catch (err) {
          setPermissionError("Failed to read recording: " + (err as Error).message);
        }
        cleanupStream();
        setIsRecording(false);
      };

      startTimeRef.current = performance.now();
      recorder.start();
      setIsRecording(true);
      setElapsed(0);
      timerRef.current = window.setInterval(() => {
        const e = (performance.now() - startTimeRef.current) / 1000;
        setElapsed(e);
        if (e >= maxDurationSec) {
          stopReasonRef.current = "auto";
          recorder.stop();
        }
      }, 100);
    } catch (err) {
      const msg = (err as Error).message;
      setPermissionError(
        msg.includes("Permission") || msg.toLowerCase().includes("denied")
          ? "Camera/microphone access was denied. Please allow access in your browser settings."
          : `Failed to start recording: ${msg}`,
      );
      cleanupStream();
    }
  }, [kind, maxDurationSec, opts.audioBitsPerSecond, opts.videoBitsPerSecond, cleanupStream]);

  const stop = useCallback(() => {
    stopReasonRef.current = "manual";
    recorderRef.current?.state === "recording" && recorderRef.current?.stop();
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setElapsed(0);
    setPermissionError(null);
  }, []);

  return {
    isRecording,
    elapsed,
    previewStream,
    permissionError,
    result,
    start,
    stop,
    reset,
  };
}
