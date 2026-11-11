import type { FaceReport } from "@/lib/face-analysis";

export function HarmonyChart({ report, compact = false }: { report: FaceReport; compact?: boolean }) {
  const entries = [
    { label: "Symmetry", score: report.symmetry },
    { label: "Golden", score: report.golden },
    { label: "Thirds", score: report.thirds },
    { label: "Fifths", score: report.fifths },
    { label: "Eyes", score: report.eyes },
    { label: "Jaw", score: report.jaw },
  ];
  const pos = (index: number, value: number) => {
    const angle = (-90 + index * 60) * Math.PI / 180;
    return { x: 160 + Math.cos(angle) * value * 1.03, y: 160 + Math.sin(angle) * value * 1.03 };
  };
  const shape = (values: number[]) => values.map((value, index) => {
    const { x, y } = pos(index, value);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const labelPositions = [
    { x: 160, y: 34, anchor: "middle" as const },
    { x: 272, y: 103, anchor: "start" as const },
    { x: 272, y: 233, anchor: "start" as const },
    { x: 160, y: 302, anchor: "middle" as const },
    { x: 48, y: 233, anchor: "end" as const },
    { x: 48, y: 103, anchor: "end" as const },
  ];

  return (
    <div className="w-full" role="img" aria-label={`Harmony chart: ${entries.map(({ label, score }) => `${label} ${score} out of 100`).join(", ")}`}>
      <svg viewBox="0 0 320 320" className={`mx-auto h-auto w-full ${compact ? "max-w-[290px]" : "max-w-[350px]"}`} aria-hidden="true">
        {[25, 50, 75, 100].map((level) => <polygon key={level} points={shape(Array(6).fill(level))} fill="none" stroke="#e8e3e1" strokeWidth="1" />)}
        {entries.map((_, index) => {
          const end = pos(index, 100);
          return <line key={index} x1="160" y1="160" x2={end.x} y2={end.y} stroke="#e8e3e1" strokeWidth="1" />;
        })}
        <polygon points={shape(entries.map((entry) => entry.score))} fill="#3A8F86" fillOpacity="0.17" stroke="#0F766E" strokeWidth="2" strokeLinejoin="round" />
        {entries.map((entry, index) => {
          const dot = pos(index, entry.score);
          return <circle key={entry.label} cx={dot.x} cy={dot.y} r="3.5" fill="#0F766E" stroke="white" strokeWidth="1.5" />;
        })}
        {entries.map((entry, index) => <g key={entry.label}>
          <text x={labelPositions[index].x} y={labelPositions[index].y} textAnchor={labelPositions[index].anchor} fill="#545158" fontSize="10" fontFamily="Inter Variable, sans-serif" fontWeight="500">{entry.label}</text>
          <text x={labelPositions[index].x} y={labelPositions[index].y + 13} textAnchor={labelPositions[index].anchor} fill="#0F766E" fontSize="11" fontFamily="IBM Plex Mono, monospace" fontWeight="500">{entry.score}</text>
        </g>)}
      </svg>
    </div>
  );
}
