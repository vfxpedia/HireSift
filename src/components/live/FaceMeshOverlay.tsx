import { useMemo } from "react";

interface Props {
  active: boolean;
  intensity?: number; // 0..1 — drives glow / scale animation amplitude
}

// 32-point face landmark approximation, normalized to a 0..1 viewBox
// centered around (0.5, 0.45). These coordinates are deliberately fixed so
// the overlay tracks the demo video's framing; the prop surface is kept
// minimal so a real ML keypoint stream can replace it later.
const NODES: [number, number][] = [
  // jawline
  [0.32, 0.55], [0.34, 0.60], [0.37, 0.64], [0.41, 0.68], [0.46, 0.70],
  [0.50, 0.71], [0.54, 0.70], [0.59, 0.68], [0.63, 0.64], [0.66, 0.60], [0.68, 0.55],
  // brow line
  [0.36, 0.36], [0.40, 0.34], [0.44, 0.34], [0.48, 0.35],
  [0.52, 0.35], [0.56, 0.34], [0.60, 0.34], [0.64, 0.36],
  // eyes
  [0.40, 0.42], [0.44, 0.42],
  [0.56, 0.42], [0.60, 0.42],
  // nose
  [0.50, 0.45], [0.48, 0.50], [0.50, 0.52], [0.52, 0.50],
  // lips
  [0.45, 0.58], [0.48, 0.59], [0.50, 0.595], [0.52, 0.59], [0.55, 0.58],
];

// Each entry is an index pair forming a mesh edge.
const EDGES: [number, number][] = [
  // jaw chain
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
  // brows
  [11, 12], [12, 13], [13, 14], [15, 16], [16, 17], [17, 18],
  // brow to jaw anchor
  [11, 0], [18, 10],
  // eyes
  [19, 20], [21, 22],
  // brow → eye
  [12, 19], [13, 20], [16, 21], [17, 22],
  // nose
  [23, 24], [24, 25], [25, 26], [26, 23],
  // eye corners → nose
  [20, 23], [21, 23],
  // lips
  [27, 28], [28, 29], [29, 30], [30, 31],
  // nose → lips
  [25, 29],
  // cheek triangles
  [11, 19], [18, 22], [19, 24], [22, 26], [4, 27], [6, 31],
];

export function FaceMeshOverlay({ active, intensity = 0.5 }: Props) {
  const opacity = active ? 0.72 : 0;
  const breath = 1 + intensity * 0.015;
  const meshColor = useMemo(() => "rgba(79, 209, 197, 0.85)", []);
  const nodeColor = useMemo(() => "rgba(155, 246, 230, 0.95)", []);

  return (
    <svg
      viewBox="0 0 1 1"
      preserveAspectRatio="xMidYMid meet"
      className="pointer-events-none absolute inset-0 w-full h-full transition-opacity duration-500"
      style={{
        opacity,
        filter: "drop-shadow(0 0 6px rgba(79,209,197,0.35))",
      }}
      aria-hidden
    >
      <defs>
        <radialGradient id="meshGlow" cx="0.5" cy="0.45" r="0.32">
          <stop offset="0%" stopColor="rgba(79,209,197,0.18)" />
          <stop offset="100%" stopColor="rgba(79,209,197,0)" />
        </radialGradient>
      </defs>
      <g
        style={{
          transformOrigin: "50% 45%",
          transform: `scale(${breath})`,
          transition: "transform 1.2s ease-in-out",
          animation: active ? "hiresift-mesh-breath 2.6s ease-in-out infinite" : "none",
        }}
      >
        <circle cx={0.5} cy={0.45} r={0.32} fill="url(#meshGlow)" />
        {EDGES.map(([a, b], i) => {
          const [x1, y1] = NODES[a];
          const [x2, y2] = NODES[b];
          return (
            <line
              key={`edge-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={meshColor}
              strokeWidth={0.0035}
              strokeLinecap="round"
            />
          );
        })}
        {NODES.map(([x, y], i) => (
          <circle key={`node-${i}`} cx={x} cy={y} r={0.006} fill={nodeColor} />
        ))}
      </g>
      <style>{`
        @keyframes hiresift-mesh-breath {
          0%, 100% { transform: scale(${1 + intensity * 0.005}) rotate(-0.2deg); }
          50%      { transform: scale(${1 + intensity * 0.022}) rotate(0.3deg); }
        }
      `}</style>
    </svg>
  );
}
