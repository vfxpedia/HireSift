import { useEffect, useRef, useState } from "react";

export interface FacePoint {
  x: number;
  y: number;
}

interface Options {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  active: boolean;
  intervalMs?: number;
}

// Models are cached for the lifetime of the page — first call pulls them
// from a CDN, subsequent calls resolve immediately. Keeps the main bundle
// clean: face-api itself is loaded via dynamic import below.
const MODEL_URL = "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";
let modelsLoaded: Promise<typeof import("@vladmandic/face-api")> | null = null;

function ensureModels() {
  if (modelsLoaded) return modelsLoaded;
  modelsLoaded = (async () => {
    const faceapi = await import("@vladmandic/face-api");
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
    ]);
    return faceapi;
  })().catch((err) => {
    console.warn("[useFaceTracking] face-api model load failed:", err);
    modelsLoaded = null;
    throw err;
  });
  return modelsLoaded;
}

export function useFaceTracking({ videoRef, active, intervalMs = 120 }: Options) {
  const [landmarks, setLandmarks] = useState<FacePoint[] | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelRef = useRef(false);

  useEffect(() => {
    if (!active) {
      setLandmarks(null);
      return;
    }
    cancelRef.current = false;
    let timer: number | undefined;
    let lastSeenAt = 0;

    (async () => {
      let faceapi: typeof import("@vladmandic/face-api");
      try {
        faceapi = await ensureModels();
        if (cancelRef.current) return;
        setReady(true);
      } catch (err) {
        setError((err as Error)?.message ?? "Failed to load face model");
        return;
      }

      const options = new faceapi.TinyFaceDetectorOptions({
        inputSize: 416, // 224 was too small to detect mid-distance faces
        scoreThreshold: 0.3,
      });

      const tick = async () => {
        if (cancelRef.current) return;
        const video = videoRef.current;
        if (video && video.readyState >= 2 && video.videoWidth > 0) {
          try {
            const detection = await faceapi
              .detectSingleFace(video, options)
              .withFaceLandmarks(true /* tiny landmark net */);
            if (detection) {
              const w = video.videoWidth;
              const h = video.videoHeight;
              const pts: FacePoint[] = detection.landmarks.positions.map((p) => ({
                x: p.x / w,
                y: p.y / h,
              }));
              setLandmarks(pts);
              setConfidence(detection.detection.score);
              lastSeenAt = performance.now();
            } else if (performance.now() - lastSeenAt > 800) {
              // No face for > 800ms: clear stale overlay so we don't pin
              // the mesh onto an empty frame.
              setLandmarks((prev) => (prev ? null : prev));
              setConfidence(0);
            }
          } catch (err) {
            console.warn("[useFaceTracking] detect error:", err);
            setError((err as Error).message);
          }
        }
        timer = window.setTimeout(tick, intervalMs);
      };
      tick();
    })();

    return () => {
      cancelRef.current = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [active, intervalMs, videoRef]);

  return { landmarks, confidence, ready, error };
}
