import { useState } from "react";
import type { OverlayKind, StudioState } from "../lib/compose";
import { BLUSH_COLORS, BROW_COLORS, EMPTY_MAKEUP, LINER_COLORS, LIP_COLORS, LOOKS, SHADOW_COLORS, type MakeupState } from "../lib/makeup";
import type { SkinReport } from "../lib/skin";
import { cn } from "../utils/cn";
import { Chip, ScoreRing, Section, Slider, Swatch } from "./ui";

type Upd = (p: Partial<StudioState>) => void;

export function MakeupPanel({ st, upd, report }: { st: StudioState; upd: Upd; report: SkinReport | null }) {
  const m = st.makeup;
  const set = (p: Partial<MakeupState>) => upd({ makeup: { ...m, ...p } });
  const applyLook = (p: Partial<MakeupState>) => upd({ makeup: { ...EMPTY_MAKEUP, foundationTint: report?.suggestions.foundation.hex ?? m.foundationTint, ...p } });
  const sug = report?.suggestions;
  return (
    <div className="space-y-4">
      {sug && (
        <div className="rounded-2xl border border-[#f3c3a3]/30 bg-gradient-to-br from-[#f3c3a3]/10 to-[#e48b9b]/5 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-[#f3c3a3]">Personalized for you</div>
              <div className="mt-1 font-display text-lg text-white">
                {report!.undertone} undertone · {report!.depth}
              </div>
            </div>
            <button onClick={() => applyLook(sug.look)} className="btn-gold shrink-0 rounded-full px-4 py-2 text-[12px] font-semibold">
              Apply my look
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            {[sug.foundation.hex, sug.lips[0].hex, sug.blush[0].hex, sug.eyes[0].hex, sug.eyes[1].hex].map((c, i) => (
              <span key={i} className="h-6 w-6 rounded-full border border-white/20" style={{ background: c }} />
            ))}
          </div>
        </div>
      )}

      <Section title="Signature looks">
        <div className="grid grid-cols-2 gap-2">
          {LOOKS.map((l) => {
            const s = { ...EMPTY_MAKEUP, ...l.state };
            return (
              <button key={l.id} onClick={() => applyLook(l.state)} className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-left transition hover:border-[#f3c3a3]/60 hover:bg-white/[0.05]">
                <div className="mb-2 flex gap-1">
                  {l.id === "none" ? (
                    <span className="text-[11px] text-stone-500">—</span>
                  ) : (
                    [s.lip ? s.lipColor : null, s.blush ? s.blushColor : null, s.shadow ? s.shadowColor : null, s.liner ? s.linerColor : null].filter(Boolean).map((c, i) => <span key={i} className="h-3.5 w-3.5 rounded-full" style={{ background: c! }} />)
                  )}
                </div>
                <div className="text-[13px] font-medium text-white">{l.name}</div>
                <div className="text-[11px] text-stone-500">{l.desc}</div>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Skin · foundation">
        <div className="space-y-3">
          <Slider label="Smoothing & coverage" value={m.foundation} onChange={(v) => set({ foundation: v })} />
          <div className="flex flex-wrap items-center gap-2">
            {sug && <Swatch color={sug.foundation.hex} title={`Your match: ${sug.foundation.name}`} active={m.foundationTint === sug.foundation.hex} onClick={() => set({ foundationTint: sug.foundation.hex })} />}
            {["#f1d3bd", "#e6bf9f", "#d9a982", "#c48c63", "#a96f48", "#8a5536", "#6a3f28", "#4a2c1d"].map((c) => (
              <Swatch key={c} size="sm" color={c} active={m.foundationTint === c} onClick={() => set({ foundationTint: c })} />
            ))}
          </div>
        </div>
      </Section>

      <Section title="Lips">
        <div className="mb-3 flex flex-wrap gap-2">
          {(sug ? [...sug.lips.map((x) => x.hex), ...LIP_COLORS] : LIP_COLORS)
            .filter((c, i, a) => a.indexOf(c) === i)
            .map((c) => (
              <Swatch key={c} size="sm" color={c} active={m.lipColor === c && m.lip > 0} onClick={() => set({ lipColor: c, lip: m.lip || 0.65 })} />
            ))}
        </div>
        <div className="mb-3 flex gap-2">
          {(["matte", "satin", "gloss"] as const).map((f) => (
            <Chip key={f} active={m.lipFinish === f} onClick={() => set({ lipFinish: f, lip: m.lip || 0.65 })}>
              {f[0].toUpperCase() + f.slice(1)}
            </Chip>
          ))}
        </div>
        <Slider label="Intensity" value={m.lip} onChange={(v) => set({ lip: v })} />
      </Section>

      <Section title="Eyes">
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-[12px] text-stone-400">Eyeshadow</div>
            <div className="mb-2 flex flex-wrap gap-2">
              {SHADOW_COLORS.map((c) => (
                <Swatch key={c} size="sm" color={c} active={m.shadowColor === c && m.shadow > 0} onClick={() => set({ shadowColor: c, shadow: m.shadow || 0.55 })} />
              ))}
            </div>
            <Slider label="Shadow intensity" value={m.shadow} onChange={(v) => set({ shadow: v })} />
          </div>
          <div>
            <div className="mb-2 text-[12px] text-stone-400">Eyeliner</div>
            <div className="mb-2 flex flex-wrap gap-2">
              {LINER_COLORS.map((c) => (
                <Swatch key={c} size="sm" color={c} active={m.linerColor === c && m.liner > 0} onClick={() => set({ linerColor: c, liner: m.liner || 0.6 })} />
              ))}
            </div>
            <div className="space-y-3">
              <Slider label="Liner thickness" value={m.liner} onChange={(v) => set({ liner: v })} />
              <Slider label="Wing length" value={m.wing} onChange={(v) => set({ wing: v })} />
              <Slider label="Lashes / mascara" value={m.lashes} onChange={(v) => set({ lashes: v })} />
            </div>
          </div>
        </div>
      </Section>

      <Section title="Cheeks & sculpt">
        <div className="mb-2 flex flex-wrap gap-2">
          {(sug ? [...sug.blush.map((x) => x.hex), ...BLUSH_COLORS] : BLUSH_COLORS)
            .filter((c, i, a) => a.indexOf(c) === i)
            .map((c) => (
              <Swatch key={c} size="sm" color={c} active={m.blushColor === c && m.blush > 0} onClick={() => set({ blushColor: c, blush: m.blush || 0.45 })} />
            ))}
        </div>
        <div className="space-y-3">
          <Slider label="Blush" value={m.blush} onChange={(v) => set({ blush: v })} />
          <Slider label="Contour" value={m.contour} onChange={(v) => set({ contour: v })} />
          <Slider label="Highlighter" value={m.highlight} onChange={(v) => set({ highlight: v })} />
        </div>
      </Section>

      <Section title="Brows">
        <div className="mb-2 flex flex-wrap gap-2">
          {BROW_COLORS.map((c) => (
            <Swatch key={c} size="sm" color={c} active={m.browColor === c && m.brow > 0} onClick={() => set({ browColor: c, brow: m.brow || 0.45 })} />
          ))}
        </div>
        <Slider label="Brow definition" value={m.brow} onChange={(v) => set({ brow: v })} />
      </Section>
    </div>
  );
}

export function CustomMakeupPanel({ st, upd, report }: { st: StudioState; upd: Upd; report: SkinReport | null }) {
  const m = st.makeup;
  const set = (p: Partial<MakeupState>) => upd({ makeup: { ...m, ...p } });
  const sug = report?.suggestions;
  if (!sug) {
    return (
      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 text-center">
        <div className="text-sm font-medium text-stone-200">Preparing your makeup shades</div>
        <p className="mt-2 text-xs leading-relaxed text-stone-500">Your photo-based color suggestions will appear here when the skin analysis is ready.</p>
      </div>
    );
  }
  const applyAll = () => set({ ...sug.look, foundationTint: sug.foundation.hex, foundation: Math.max(m.foundation, 0.45), lipColor: sug.lips[0]?.hex ?? m.lipColor, lip: Math.max(m.lip, 0.55), blushColor: sug.blush[0]?.hex ?? m.blushColor, blush: Math.max(m.blush, 0.4), shadowColor: sug.eyes[0]?.hex ?? m.shadowColor, shadow: Math.max(m.shadow, 0.4) });
  const chooseLip = (hex: string) => set({ lipColor: hex, lip: Math.max(m.lip, 0.65) });
  const chooseBlush = (hex: string) => set({ blushColor: hex, blush: Math.max(m.blush, 0.45) });
  const chooseEyes = (hex: string) => set({ shadowColor: hex, shadow: Math.max(m.shadow, 0.5) });

  return (
    <div className="space-y-4">
      <Section title="Custom makeup apply">
        <p className="text-[12px] leading-relaxed text-stone-500">Choose a recommended shade to apply it to your photo, then fine-tune the finish and intensity.</p>
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
          <span className="h-10 w-10 shrink-0 rounded-full border border-white/20" style={{ background: sug.foundation.hex }} />
          <div className="min-w-0 flex-1">
            <div className="text-[12px] font-medium text-stone-200">Foundation · {sug.foundation.name}</div>
            <div className="text-[11px] text-stone-500">Concealer · {sug.concealer.name}</div>
          </div>
          <button onClick={() => set({ foundationTint: sug.foundation.hex, foundation: Math.max(m.foundation, 0.45) })} className="rounded-full border border-white/10 px-3 py-1.5 text-[11px] text-stone-200 transition hover:border-[#0F766E]">
            Apply
          </button>
        </div>
        {(
          [
            ["Lip color", sug.lips, m.lipColor, chooseLip],
            ["Blush", sug.blush, m.blushColor, chooseBlush],
            ["Eyeshadow", sug.eyes, m.shadowColor, chooseEyes],
          ] as const
        ).map(([title, shades, selected, choose]) => (
          <div key={title} className="mt-4">
            <div className="mb-2 text-[12px] font-medium text-stone-300">{title}</div>
            <div className="grid grid-cols-2 gap-2">
              {shades.map((shade) => (
                <button key={shade.hex} onClick={() => choose(shade.hex)} className={cn("flex min-w-0 items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-[11px] transition", selected === shade.hex ? "border-[#0F766E] bg-[#0F766E]/10 text-stone-900" : "border-white/10 text-stone-300 hover:border-[#0F766E]/50")}>
                  <span className="h-5 w-5 shrink-0 rounded-full border border-black/10" style={{ background: shade.hex }} />
                  <span className="truncate">{shade.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        <button onClick={applyAll} className="btn-gold mt-4 w-full rounded-full py-2.5 text-[13px] font-semibold">
          Apply full suggested look
        </button>
      </Section>

      <Section title="Personalize the finish">
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-[12px] text-stone-300">Lip finish</div>
            <div className="flex flex-wrap gap-2">
              {(["matte", "satin", "gloss"] as const).map((finish) => (
                <Chip key={finish} active={m.lipFinish === finish} onClick={() => set({ lipFinish: finish, lip: Math.max(m.lip, 0.55) })}>
                  {finish[0].toUpperCase() + finish.slice(1)}
                </Chip>
              ))}
            </div>
          </div>
          <Slider label="Foundation coverage" value={m.foundation} onChange={(v) => set({ foundation: v })} />
          <Slider label="Lip intensity" value={m.lip} onChange={(v) => set({ lip: v })} />
          <Slider label="Blush intensity" value={m.blush} onChange={(v) => set({ blush: v })} />
          <Slider label="Eyeshadow intensity" value={m.shadow} onChange={(v) => set({ shadow: v })} />
          <Slider label="Eyeliner" value={m.liner} onChange={(v) => set({ liner: v })} />
          <Slider label="Lashes" value={m.lashes} onChange={(v) => set({ lashes: v })} />
        </div>
      </Section>
      <p className="px-2 text-center text-[10px] leading-relaxed text-stone-500">Color matches are estimates from one photo. Lighting, screen settings, and camera processing can affect how shades appear.</p>
    </div>
  );
}

const MAP_BTNS: { k: Exclude<OverlayKind, null>; label: string; color: string }[] = [
  { k: "redness", label: "Redness", color: "#ff2a46" },
  { k: "shine", label: "Oil / shine", color: "#50c8ff" },
  { k: "texture", label: "Texture", color: "#ffbe28" },
  { k: "spots", label: "Spots", color: "#be50ff" },
];
const METRIC_MAP: Record<string, OverlayKind> = { redness: "redness", oil: "shine", texture: "texture", spots: "spots" };

export function SkinPanel({ report, error, st, upd, goMakeup }: { report: SkinReport | null; error?: string | null; st: StudioState; upd: Upd; goMakeup: () => void }) {
  const [routineMode, setRoutineMode] = useState<"daily" | "evening" | "focus">("daily");
  if (!report && error)
    return (
      <div role="alert" className="rounded-xl border border-rose-300/30 bg-rose-500/10 p-4 text-[13px] leading-relaxed text-rose-200">
        {error}
      </div>
    );
  if (!report)
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-stone-400">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#f3c3a3] border-t-transparent" />
        Analyzing skin…
      </div>
    );
  const sug = report.suggestions;
  const cleanser = report.routine.find((r) => r.step === "Cleanse");
  const moisturizer = report.routine.find((r) => r.step === "Moisturize");
  const protect = report.routine.find((r) => r.step === "Protect");
  const treatment = report.routine.find((r) => !["Cleanse", "Moisturize", "Protect"].includes(r.step));
  const routineSteps =
    routineMode === "daily"
      ? report.routine
      : routineMode === "evening"
        ? [
            cleanser,
            treatment ?? { step: "Support", product: "A fragrance-free hydrating serum", why: "Keep the routine simple and comfortable." },
            moisturizer,
          ].filter((step): step is NonNullable<typeof step> => Boolean(step))
        : [
            {
              step: "Main focus",
              product: report.concerns[0] ?? "Maintain your current routine",
              why: report.concerns.length ? "This was the lowest-scoring area in this photo estimate." : "Your measured skin indicators are relatively balanced.",
            },
            {
              step: "Keep it gentle",
              product: "Introduce one new product at a time and patch test first",
              why: "A single photo cannot identify skin conditions or predict product tolerance.",
            },
          ];
  return (
    <div className="space-y-4">
      <Section title="Skin health overview">
        <div className="flex items-center gap-5">
          <ScoreRing value={report.overall} label="score" />
          <div className="flex-1 space-y-1.5 text-[13px]">
            <div className="flex justify-between">
              <span className="text-stone-400">Skin type</span>
              <span className="font-medium text-white">{report.skinType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Fitzpatrick</span>
              <span className="font-medium text-white">Type {report.fitzpatrick}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Undertone</span>
              <span className="font-medium text-white">{report.undertone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-stone-400">Depth</span>
              <span className="font-medium text-white">{report.depth}</span>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/[0.04] p-3">
          <span className="h-11 w-11 shrink-0 rounded-full border border-white/20" style={{ background: report.toneHex }} />
          <div className="text-[11px] leading-relaxed text-stone-400">
            <div className="font-mono text-stone-200">
              {report.toneHex.toUpperCase()} · L* {report.lab[0].toFixed(1)} a* {report.lab[1].toFixed(1)} b* {report.lab[2].toFixed(1)}
            </div>
            ITA° {report.ita.toFixed(1)} · hue {report.hue.toFixed(1)}° · white-balanced from eye sclera
          </div>
        </div>
      </Section>

      <Section title="Heat-map overlay">
        <div className="flex flex-wrap gap-2">
          <Chip active={!st.overlay} onClick={() => upd({ overlay: null })}>
            Off
          </Chip>
          {MAP_BTNS.map((b) => (
            <button
              key={b.k}
              onClick={() => upd({ overlay: st.overlay === b.k ? null : b.k })}
              className={cn("flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px]", st.overlay === b.k ? "border-white/40 bg-white/10 text-white" : "border-white/10 text-stone-300 hover:bg-white/5")}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: b.color }} />
              {b.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Detailed metrics">
        <div className="space-y-3.5">
          {report.metrics.map((m) => {
            const col = m.score >= 80 ? "#7ee2b8" : m.score >= 65 ? "#f3c3a3" : m.score >= 50 ? "#f1a35f" : "#ef6f7f";
            const ov = METRIC_MAP[m.key];
            return (
              <div key={m.key} className={cn("group rounded-lg", ov && "cursor-pointer")} onClick={() => ov && upd({ overlay: st.overlay === ov ? null : ov })}>
                <div className="mb-1 flex items-center justify-between text-[13px]">
                  <span className="text-stone-200">
                    {m.label} {ov && <span className="text-[10px] text-stone-500 group-hover:text-[#f3c3a3]">· map</span>}
                  </span>
                  <span className="font-mono text-[12px]" style={{ color: col }}>
                    {m.score}
                  </span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${m.score}%`, background: col }} />
                </div>
                <div className="mt-1 flex justify-between text-[11px] text-stone-500">
                  <span>{m.desc}</span>
                </div>
                <div className="text-[10px] font-mono text-stone-600">{m.value}</div>
              </div>
            );
          })}
        </div>
      </Section>

      {report.concerns.length > 0 && (
        <Section title="Focus areas">
          <div className="flex flex-wrap gap-2">
            {report.concerns.map((c) => (
              <span key={c} className="rounded-full border border-rose-300/20 bg-rose-300/5 px-3 py-1 text-[12px] text-rose-200">
                {c}
              </span>
            ))}
          </div>
        </Section>
      )}

      <Section title="Your skincare routine">
        <div className="mb-3 flex flex-wrap gap-2">
          {(
            [
              ["daily", "Daily basics"],
              ["evening", "Evening care"],
              ["focus", "Focus area"],
            ] as const
          ).map(([mode, label]) => (
            <Chip key={mode} active={routineMode === mode} onClick={() => setRoutineMode(mode)}>
              {label}
            </Chip>
          ))}
        </div>
        <ol className="space-y-3">
          {routineSteps.map((r, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#f8d6bd] to-[#e48b9b] text-[11px] font-bold text-stone-900">{i + 1}</span>
              <div>
                <div className="text-[13px] font-medium text-white">
                  {r.step} <span className="font-normal text-stone-300">— {r.product}</span>
                </div>
                <div className="text-[11px] text-stone-500">{r.why}</div>
              </div>
            </li>
          ))}
        </ol>
        {routineMode !== "focus" && <p className="mt-3 text-[10px] leading-relaxed text-stone-500">Daily: {cleanser?.product} · {moisturizer?.product} · {protect?.product}</p>}
      </Section>

      <Section title="Makeup color match">
        <div className="space-y-3 text-[12px]">
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 rounded-full border border-white/20" style={{ background: sug.foundation.hex }} />
            <div>
              <div className="text-stone-200">Foundation: {sug.foundation.name}</div>
              <div className="text-stone-500">Concealer: {sug.concealer.name}</div>
            </div>
          </div>
          {(
            [
              ["Lipsticks", sug.lips],
              ["Blush", sug.blush],
              ["Eyeshadow", sug.eyes],
            ] as const
          ).map(([t, arr]) => (
            <div key={t}>
              <div className="mb-1.5 text-stone-400">{t}</div>
              <div className="flex flex-wrap gap-2">
                {arr.map((c) => (
                  <span key={c.name} className="flex items-center gap-1.5 rounded-full bg-white/[0.04] py-1 pl-1 pr-2.5 text-stone-300">
                    <span className="h-4 w-4 rounded-full" style={{ background: c.hex }} />
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <p className="text-stone-400">Jewelry tones: {sug.metals}</p>
          <ul className="list-disc space-y-1 pl-4 text-stone-400">
            {sug.tips.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <button onClick={goMakeup} className="btn-gold mt-1 w-full rounded-full py-2.5 text-[13px] font-semibold">
            Try my matched makeup →
          </button>
        </div>
      </Section>
      <p className="px-2 text-center text-[10px] leading-relaxed text-stone-600">
        Computer-vision estimate from a single photo. Lighting, camera processing and makeup affect results. Not a medical diagnosis.
      </p>
    </div>
  );
}
