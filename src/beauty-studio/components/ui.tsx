import type { ReactNode } from "react";
import { cn } from "../utils/cn";

export function Slider({
  label,
  value,
  min = 0,
  max = 1,
  step = 0.01,
  onChange,
  format,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <label className="block select-none">
      <div className="mb-1.5 flex items-center justify-between text-[12px]">
        <span className="text-stone-300">{label}</span>
        <span className="font-mono text-stone-400">{format ? format(value) : Math.round(pct) + "%"}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="lux-range w-full"
        style={{ ["--pct" as string]: `${pct}%` }}
      />
    </label>
  );
}

export function Swatch({ color, active, onClick, title, size = "md" }: { color: string; active?: boolean; onClick?: () => void; title?: string; size?: "sm" | "md" | "lg" }) {
  const s = size === "sm" ? "h-6 w-6" : size === "lg" ? "h-10 w-10" : "h-8 w-8";
  return (
    <button
      title={title}
      onClick={onClick}
      className={cn(
        s,
        "relative shrink-0 rounded-full border border-white/15 shadow-inner transition hover:scale-110",
        active && "ring-2 ring-[#f3c3a3] ring-offset-2 ring-offset-stone-900",
      )}
      style={{ background: `radial-gradient(circle at 32% 28%, rgba(255,255,255,.45), transparent 42%), ${color}` }}
    />
  );
}

export function Section({ title, children, right, className }: { title: string; children: ReactNode; right?: ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border border-white/[0.07] bg-white/[0.03] p-4", className)}>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-400">{title}</h3>
        {right}
      </div>
      {children}
    </section>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button onClick={() => onChange(!checked)} className="flex w-full items-center justify-between gap-3 py-1 text-left text-[13px] text-stone-300">
      <span>{label}</span>
      <span className={cn("relative h-5 w-9 rounded-full transition", checked ? "bg-gradient-to-r from-[#f3c3a3] to-[#e48b9b]" : "bg-stone-700")}>
        <span className={cn("absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all", checked ? "left-[18px]" : "left-0.5")} />
      </span>
    </button>
  );
}

export function Chip({ active, children, onClick }: { active?: boolean; children: ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-[12px] font-medium transition",
        active ? "border-transparent bg-gradient-to-r from-[#f3c3a3] to-[#e48b9b] text-stone-900" : "border-white/10 bg-white/[0.03] text-stone-300 hover:bg-white/[0.08]",
      )}
    >
      {children}
    </button>
  );
}

export function ScoreRing({ value, size = 92, label }: { value: number; size?: number; label?: string }) {
  const r = size / 2 - 7;
  const c = 2 * Math.PI * r;
  const col = value >= 80 ? "#7ee2b8" : value >= 65 ? "#f3c3a3" : value >= 50 ? "#f1a35f" : "#ef6f7f";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,.08)" strokeWidth={7} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={col}
          strokeWidth={7}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - value / 100)}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold text-white">{value}</span>
        {label && <span className="text-[10px] uppercase tracking-wider text-stone-400">{label}</span>}
      </div>
    </div>
  );
}
