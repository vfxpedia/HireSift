import { useState } from "react";
import { Camera, RefreshCw } from "lucide-react";
import { SecondaryBtn } from "../primitives/Buttons";

interface Props {
  videoEl: HTMLVideoElement | null;
  baselineSrc: string;
  similarity: number; // 0..100
}

export function BaselineCompare({ videoEl, baselineSrc, similarity }: Props) {
  const [snapshot, setSnapshot] = useState<string | null>(null);

  const takeSnapshot = () => {
    if (!videoEl) return;
    const w = videoEl.videoWidth || 320;
    const h = videoEl.videoHeight || 240;
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    try {
      ctx.drawImage(videoEl, 0, 0, w, h);
      setSnapshot(canvas.toDataURL("image/jpeg", 0.75));
    } catch {
      /* getUserMedia w/o CORS may throw */
    }
  };

  const sim = Math.round(similarity);
  const simColor = sim >= 88 ? "#2F7D7E" : sim >= 72 ? "#C6923A" : "#172033";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <Cell label="Baseline">
          <img src={baselineSrc} alt="baseline" className="w-full h-20 object-cover rounded-md" />
        </Cell>
        <Cell label="Live frame">
          {snapshot ? (
            <img src={snapshot} alt="live snapshot" className="w-full h-20 object-cover rounded-md" />
          ) : (
            <div className="w-full h-20 flex items-center justify-center rounded-md bg-[#F3F4F6] text-[10px] text-[#9CA3AF]">
              Take snapshot
            </div>
          )}
        </Cell>
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="text-[#6B7280]">Similarity</span>
        <div className="flex-1 h-1.5 rounded-full bg-[#F3F4F6] overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${sim}%`, backgroundColor: simColor }}
          />
        </div>
        <span className="font-mono text-[#374151]">{sim}%</span>
      </div>
      <SecondaryBtn
        onClick={takeSnapshot}
        className="text-xs py-1.5 w-full justify-center"
        icon={snapshot ? <RefreshCw className="w-3.5 h-3.5" /> : <Camera className="w-3.5 h-3.5" />}
      >
        {snapshot ? "Retake snapshot" : "Take snapshot"}
      </SecondaryBtn>
    </div>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#E5E7EB] rounded-lg p-2">
      <p className="text-[10px] uppercase tracking-wider text-[#9CA3AF] mb-1.5">{label}</p>
      {children}
    </div>
  );
}
