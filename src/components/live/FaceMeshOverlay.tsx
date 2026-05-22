import { useMemo } from "react";
import type { FacePoint } from "../../hooks/useFaceTracking";

interface Props {
  active: boolean;
  intensity?: number; // 0..1 — drives glow / scale animation amplitude
  /**
   * Optional live landmarks (face-api 68-point format), normalized to 0..1
   * of the underlying video's intrinsic frame. When supplied, the mesh
   * follows the detected face. When omitted, falls back to a static idle
   * mesh centered on the typical demo framing.
   */
  landmarks?: FacePoint[] | null;
}

// ── Fallback (no live landmarks): 32-node static mesh centered around the
// canonical demo framing. Coordinates in 0..1 of the SVG viewBox.
const FALLBACK_NODES: [number, number][] = [
  [0.32, 0.55], [0.34, 0.6], [0.37, 0.64], [0.41, 0.68], [0.46, 0.7],
  [0.5, 0.71], [0.54, 0.7], [0.59, 0.68], [0.63, 0.64], [0.66, 0.6], [0.68, 0.55],
  [0.36, 0.36], [0.4, 0.34], [0.44, 0.34], [0.48, 0.35],
  [0.52, 0.35], [0.56, 0.34], [0.6, 0.34], [0.64, 0.36],
  [0.4, 0.42], [0.44, 0.42],
  [0.56, 0.42], [0.6, 0.42],
  [0.5, 0.45], [0.48, 0.5], [0.5, 0.52], [0.52, 0.5],
  [0.45, 0.58], [0.48, 0.59], [0.5, 0.595], [0.52, 0.59], [0.55, 0.58],
];
const FALLBACK_EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10],
  [11, 12], [12, 13], [13, 14], [15, 16], [16, 17], [17, 18],
  [11, 0], [18, 10],
  [19, 20], [21, 22],
  [12, 19], [13, 20], [16, 21], [17, 22],
  [23, 24], [24, 25], [25, 26], [26, 23],
  [20, 23], [21, 23],
  [27, 28], [28, 29], [29, 30], [30, 31],
  [25, 29],
  [11, 19], [18, 22], [19, 24], [22, 26], [4, 27], [6, 31],
];

// ── face-api 68-point edge map: jawline, brows, nose, eyes, lips + a few
// cross-connections so the overlay feels like a connected mesh rather
// than disjoint contours.
function buildEdges68(): [number, number][] {
  const edges: [number, number][] = [];
  const chain = (start: number, end: number) => {
    for (let i = start; i < end; i++) edges.push([i, i + 1]);
  };
  const loop = (start: number, end: number) => {
    chain(start, end);
    edges.push([end, start]);
  };
  chain(0, 16); // jawline
  chain(17, 21); // right brow
  chain(22, 26); // left brow
  chain(27, 30); // nose bridge
  chain(31, 35); // nose bottom
  edges.push([30, 33]); // bridge → bottom anchor
  loop(36, 41); // right eye
  loop(42, 47); // left eye
  loop(48, 59); // outer lip
  loop(60, 67); // inner lip
  // Cross-mesh structural lines
  edges.push([17, 36], [21, 39], [22, 42], [26, 45]);
  edges.push([0, 17], [16, 26]);
  edges.push([27, 21], [27, 22]);
  edges.push([33, 51], [8, 57]);
  return edges;
}
const EDGES_68 = buildEdges68();

const MESH_COLOR = "rgba(79, 209, 197, 0.9)";
const NODE_COLOR = "rgba(155, 246, 230, 0.95)";

export function FaceMeshOverlay({ active, intensity = 0.5, landmarks }: Props) {
  const opacity = active ? 0.78 : 0;
  const usingLive = !!landmarks && landmarks.length >= 60;

  const fallbackPaths = useMemo(
    () => ({ nodes: FALLBACK_NODES, edges: FALLBACK_EDGES }),
    [],
  );

  return (
    <svg
      viewBox="0 0 1 1"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 w-full h-full transition-opacity duration-500"
      style={{
        opacity,
        filter: "drop-shadow(0 0 6px rgba(79,209,197,0.35))",
      }}
      aria-hidden
    >
      <defs>
        {!usingLive && (
          <radialGradient id="meshGlow" cx="0.5" cy="0.45" r="0.32">
            <stop offset="0%" stopColor="rgba(79,209,197,0.18)" />
            <stop offset="100%" stopColor="rgba(79,209,197,0)" />
          </radialGradient>
        )}
      </defs>

      {usingLive ? (
        <g>
          {EDGES_68.map(([a, b], i) => {
            const pa = landmarks![a];
            const pb = landmarks![b];
            if (!pa || !pb) return null;
            return (
              <line
                key={`edge-${i}`}
                x1={pa.x}
                y1={pa.y}
                x2={pb.x}
                y2={pb.y}
                stroke={MESH_COLOR}
                strokeWidth={0.0028}
                strokeLinecap="round"
                style={{ transition: "x1 80ms linear, y1 80ms linear, x2 80ms linear, y2 80ms linear" }}
              />
            );
          })}
          {landmarks!.map((p, i) => (
            <circle
              key={`node-${i}`}
              cx={p.x}
              cy={p.y}
              r={0.0045}
              fill={NODE_COLOR}
              style={{ transition: "cx 80ms linear, cy 80ms linear" }}
            />
          ))}
        </g>
      ) : (
        <g
          style={{
            transformOrigin: "50% 45%",
            animation: active ? "hiresift-mesh-breath 2.6s ease-in-out infinite" : "none",
          }}
        >
          <circle cx={0.5} cy={0.45} r={0.32} fill="url(#meshGlow)" />
          {fallbackPaths.edges.map(([a, b], i) => {
            const [x1, y1] = fallbackPaths.nodes[a];
            const [x2, y2] = fallbackPaths.nodes[b];
            return (
              <line
                key={`fb-edge-${i}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={MESH_COLOR}
                strokeWidth={0.0035}
                strokeLinecap="round"
              />
            );
          })}
          {fallbackPaths.nodes.map(([x, y], i) => (
            <circle key={`fb-node-${i}`} cx={x} cy={y} r={0.006} fill={NODE_COLOR} />
          ))}
        </g>
      )}

      <style>{`
        @keyframes hiresift-mesh-breath {
          0%, 100% { transform: scale(${1 + intensity * 0.005}) rotate(-0.2deg); }
          50%      { transform: scale(${1 + intensity * 0.022}) rotate(0.3deg); }
        }
      `}</style>
    </svg>
  );
}
