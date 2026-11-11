import { useState } from "react";
import Image from "next/image";
import { BEARDS, BEARD_COLORS } from "../lib/beard";
import type { StudioState } from "../lib/compose";
import type { FaceShape, FaceShapeResult } from "../lib/geom";
import { HAIRSTYLES, HAIR_COLORS } from "../lib/hair";
import { EMPTY_MAKEUP, LOOKS } from "../lib/makeup";
import { cn } from "../utils/cn";
import { Chip, Section, Slider, Swatch, Toggle } from "./ui";

type Upd = (p: Partial<StudioState>) => void;

function Thumb({ src, active, label, badge, onClick }: { src?: string; active: boolean; label: string; badge?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} aria-label={label} aria-pressed={active} title={label} className={cn("group relative overflow-hidden rounded-xl border text-left transition", active ? "border-[#f3c3a3] ring-2 ring-[#f3c3a3]/40" : "border-white/10 hover:border-white/30")}>
      <div className="relative aspect-[5/6] w-full bg-stone-800">
        {src ? <Image src={src} alt={label} fill unoptimized sizes="(min-width: 1024px) 130px, 33vw" className="object-cover transition duration-500 group-hover:scale-105" /> : <div className="h-full w-full animate-pulse bg-gradient-to-br from-stone-800 to-stone-700" />}
      </div>
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-2 pb-2 pt-7">
      <div className="studio-thumb-label break-words text-[12px] font-semibold leading-tight text-white">{label}</div>
      </div>
      {badge && <span className="absolute left-1.5 top-1.5 rounded-full bg-gradient-to-r from-[#f8d6bd] to-[#e48b9b] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-stone-900">{badge}</span>}
    </button>
  );
}

export function HairPanel({ st, upd, thumbs, shape, naturalColor }: { st: StudioState; upd: Upd; thumbs: Record<string, string>; shape: FaceShape; naturalColor: string }) {
  const [cat, setCat] = useState<"all" | "women" | "men" | "best">("all");
  const [length, setLength] = useState<"all" | "Short" | "Medium" | "Long">("all");
  const list = HAIRSTYLES.filter((h) => (cat === "all" ? true : cat === "best" ? h.tags.includes(shape) : h.category === cat)).filter((h) => length === "all" || h.length === length);
  const pickColor = (hex: string) => upd({ hairColor: hex, recolor: st.hairId ? st.recolor : st.recolor || 0.85 });
  return (
    <div className="space-y-4">
      <Section title="Hairstyles">
        <div className="mb-3 flex flex-wrap gap-2">
          {(
            [
              ["all", "All"],
              ["best", `Best for ${shape}`],
              ["women", "Women"],
              ["men", "Men"],
            ] as const
          ).map(([k, l]) => (
            <Chip key={k} active={cat === k} onClick={() => setCat(k)}>
              {l}
            </Chip>
          ))}
        </div>
          <div className="mb-3 flex flex-wrap gap-2">
            {(["all", "Short", "Medium", "Long"] as const).map((item) => (
              <Chip key={item} active={length === item} onClick={() => setLength(item)}>
                {item === "all" ? "Any length" : item}
              </Chip>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2">
          <Thumb src={thumbs["__orig"]} active={!st.hairId} label="My hair" onClick={() => upd({ hairId: null })} />
          {list.map((h) => (
            <Thumb key={h.id} src={thumbs[h.id]} active={st.hairId === h.id} label={h.name} badge={h.tags.includes(shape) ? "Match" : undefined} onClick={() => upd({ hairId: h.id })} />
          ))}
        </div>
      </Section>

      <Section title="Hair color" right={<span className="text-[11px] text-stone-500">{HAIR_COLORS.find((c) => c.hex === st.hairColor)?.name ?? "Custom"}</span>}>
        <div className="flex flex-wrap gap-2.5">
          <button onClick={() => upd({ hairColor: naturalColor, recolor: 0 })} title="Natural (detected)" className={cn("flex h-8 items-center gap-1.5 rounded-full border px-2.5 text-[11px]", st.hairColor === naturalColor ? "border-[#f3c3a3] text-white" : "border-white/10 text-stone-400")}>
            <span className="h-4 w-4 rounded-full" style={{ background: naturalColor }} /> Natural
          </button>
          {HAIR_COLORS.map((c) => (
            <Swatch key={c.hex} color={c.hex} title={c.name} active={st.hairColor === c.hex} onClick={() => pickColor(c.hex)} />
          ))}
          <label className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-full border border-dashed border-white/30" title="Custom color">
            <input type="color" value={st.hairColor} onChange={(e) => pickColor(e.target.value)} className="absolute inset-0 h-full w-full cursor-pointer opacity-0" />
            <span className="flex h-full w-full items-center justify-center text-stone-400">+</span>
          </label>
        </div>
        {!st.hairId || !st.hideOriginal ? (
          <div className="mt-4">
            <Slider label="Color intensity on my real hair" value={st.recolor} onChange={(v) => upd({ recolor: v })} />
          </div>
        ) : null}
      </Section>

      {st.hairId && (
        <Section title="Fit & adjust">
          <div className="space-y-4">
            <Toggle checked={st.hideOriginal} onChange={(v) => upd({ hideOriginal: v })} label="Remove my original hair (AI inpaint)" />
            <Slider label="Size" min={0.85} max={1.2} value={st.fit.size} onChange={(v) => upd({ fit: { ...st.fit, size: v } })} format={(v) => v.toFixed(2) + "×"} />
            <Slider label="Width / volume" min={0.85} max={1.2} value={st.fit.width} onChange={(v) => upd({ fit: { ...st.fit, width: v } })} format={(v) => v.toFixed(2) + "×"} />
            <Slider label="Vertical position" min={-0.08} max={0.08} step={0.002} value={st.fit.offsetY} onChange={(v) => upd({ fit: { ...st.fit, offsetY: v } })} format={(v) => (v * 100).toFixed(1)} />
            <button onClick={() => upd({ fit: { size: 1, width: 1, offsetY: 0 } })} className="text-[12px] text-[#f3c3a3] hover:underline">
              Reset fit
            </button>
          </div>
        </Section>
      )}
    </div>
  );
}

export function BeardPanel({ st, upd, thumbs, shape }: { st: StudioState; upd: Upd; thumbs: Record<string, string>; shape: FaceShape }) {
  const [styleGroup, setStyleGroup] = useState<"all" | "full" | "goatee" | "mustache" | "stubble">("all");
  const beards = BEARDS.filter((b) => {
    if (styleGroup === "all") return true;
    if (styleGroup === "full") return b.tcMax >= 0.8 && b.length >= 0.04;
    if (styleGroup === "goatee") return b.tcMax > 0 && b.tcMax <= 0.5;
    if (styleGroup === "mustache") return b.tcMax === 0;
    return Boolean(b.stubble);
  });
  return (
    <div className="space-y-4">
      <Section title="Beard & mustache">
        <div className="mb-3 flex flex-wrap gap-2">
          {(["all", "full", "goatee", "mustache", "stubble"] as const).map((group) => (
            <Chip key={group} active={styleGroup === group} onClick={() => setStyleGroup(group)}>
              {group === "all" ? "All styles" : group === "mustache" ? "Mustaches" : group === "stubble" ? "Stubble" : group[0].toUpperCase() + group.slice(1)}
            </Chip>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Thumb src={thumbs["__none"]} active={!st.beardId} label="Clean shaven" onClick={() => upd({ beardId: null })} />
          {beards.map((b) => (
            <Thumb key={b.id} src={thumbs[b.id]} active={st.beardId === b.id} label={b.name} badge={b.tags.includes(shape) ? "Match" : undefined} onClick={() => upd({ beardId: b.id })} />
          ))}
        </div>
      </Section>
      <Section title="Beard color & density">
        <div className="mb-4 flex flex-wrap gap-2.5">
          {BEARD_COLORS.map((c) => (
            <Swatch key={c.hex} color={c.hex} title={c.name} active={st.beardColor === c.hex} onClick={() => upd({ beardColor: c.hex })} />
          ))}
          <button onClick={() => upd({ beardColor: st.hairColor })} className="rounded-full border border-white/10 px-3 text-[11px] text-stone-300 hover:bg-white/5">
            Match hair
          </button>
        </div>
        <Slider label="Density" min={0.3} max={1.2} value={st.beardIntensity} onChange={(v) => upd({ beardIntensity: v })} />
      </Section>
    </div>
  );
}

export const SHAPE_INFO: Record<FaceShape, { desc: string; hair: string; beard: string; avoid: string }> = {
  Oval: {
    desc: "Balanced proportions with a gently rounded jaw and forehead slightly wider than the chin – the most versatile face shape.",
    hair: "Almost every cut works: long layers, bobs, pixies, curtain bangs, pompadours and side parts.",
    beard: "Short boxed beards, stubble and circle beards keep your natural balance.",
    avoid: "Heavy blunt bangs that hide your proportions.",
  },
  Round: {
    desc: "Width and length are similar with full cheeks and a soft, rounded jawline.",
    hair: "Add height and vertical lines: pompadours, quiffs, long layers, side parts and lobs below the chin.",
    beard: "Goatees, Van Dyke and anchor styles that elongate the chin.",
    avoid: "Chin-length rounded bobs and very full sides.",
  },
  Square: {
    desc: "Strong, angular jawline with a broad forehead and similar widths across the face.",
    hair: "Soft waves, curtain bangs, side-swept fringes and textured layers soften the angles.",
    beard: "Circle beards and rounded goatees soften the jaw; stubble keeps it chiselled.",
    avoid: "Blunt, geometric cuts ending right at the jaw.",
  },
  Heart: {
    desc: "Wider forehead and cheekbones tapering to a narrow, delicate chin.",
    hair: "Volume at chin level: lobs, bobs, curtain bangs and side-swept pixies.",
    beard: "Fuller beards and Balbo styles add width to the lower face.",
    avoid: "Lots of volume at the crown with tight sides.",
  },
  Oblong: {
    desc: "Face length noticeably greater than width, with a long straight cheek line.",
    hair: "Width-building styles: curls, waves, bangs and medium textured cuts.",
    beard: "Chin straps and full beards with fuller sides, not long at the chin.",
    avoid: "Very tall pompadours or sleek, long straight hair.",
  },
  Diamond: {
    desc: "Wide, high cheekbones with a narrower forehead and chin.",
    hair: "Fringes, side parts and chin-length volume balance the cheekbones.",
    beard: "Full beards and short boxed beards add width at the jaw.",
    avoid: "Center-parted sleek styles that emphasize cheek width.",
  },
};

export function FacePanel({ res, upd, st }: { res: FaceShapeResult; upd: Upd; st: StudioState }) {
  const info = SHAPE_INFO[res.shape];
  const sorted = (Object.entries(res.scores) as [FaceShape, number][]).sort((a, b) => b[1] - a[1]);
  const hairRec = HAIRSTYLES.filter((h) => h.tags.includes(res.shape)).slice(0, 8);
  const beardRec = BEARDS.filter((b) => b.tags.includes(res.shape)).slice(0, 6);
  const makeupIds: Record<FaceShape, string[]> = {
    Oval: ["natural", "soft-glam", "peach-glow", "bronze"],
    Round: ["soft-glam", "bronze", "natural", "smoky"],
    Square: ["peach-glow", "rose", "soft-glam", "lavender-dusk"],
    Heart: ["natural", "peach-glow", "soft-glam", "editorial-rose"],
    Oblong: ["peach-glow", "rose", "natural", "soft-glam"],
    Diamond: ["soft-glam", "editorial-rose", "bronze", "lavender-dusk"],
  };
  const makeupRec = makeupIds[res.shape]
    .map((id) => LOOKS.find((look) => look.id === id))
    .filter((look): look is (typeof LOOKS)[number] => Boolean(look))
    .slice(0, 4);
  const applyMakeup = (look: (typeof LOOKS)[number]) =>
    upd({ makeup: { ...EMPTY_MAKEUP, foundationTint: st.makeup.foundationTint, ...look.state } });
  return (
    <div className="space-y-4">
      <Section title="Face shape">
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 60 80" className="h-20 w-16 shrink-0">
            <defs>
              <linearGradient id="fs" x1="0" x2="1">
                <stop offset="0" stopColor="#f8d6bd" />
                <stop offset="1" stopColor="#e48b9b" />
              </linearGradient>
            </defs>
            <path d={SHAPE_PATHS[res.shape]} fill="none" stroke="url(#fs)" strokeWidth="2.5" />
          </svg>
          <div>
            <div className="font-display text-3xl text-white">{res.shape}</div>
            <p className="mt-1 text-[13px] leading-relaxed text-stone-400">{info.desc}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2">
          {sorted.map(([k, v]) => (
            <div key={k} className="flex items-center gap-3 text-[12px]">
              <span className="w-16 text-stone-400">{k}</span>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                <div className="h-full rounded-full bg-gradient-to-r from-[#f3c3a3] to-[#e48b9b]" style={{ width: `${v}%` }} />
              </div>
              <span className="w-9 text-right font-mono text-stone-400">{v}%</span>
            </div>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-[11px]">
          {[
            ["Length / width", res.metrics.lengthToWidth.toFixed(2)],
            ["Forehead ratio", res.metrics.foreheadRatio.toFixed(2)],
            ["Jaw ratio", res.metrics.jawRatio.toFixed(2)],
            ["Jaw angle", res.metrics.jawAngle.toFixed(0) + "°"],
          ].map(([a, b]) => (
            <div key={a} className="rounded-lg bg-white/[0.04] px-3 py-2">
              <div className="text-stone-500">{a}</div>
              <div className="font-mono text-stone-200">{b}</div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Toggle checked={st.showMesh} onChange={(v) => upd({ showMesh: v })} label="Show 478-point face mesh" />
        </div>
      </Section>
      <Section title="Styling advice">
        <div className="space-y-3 text-[13px] leading-relaxed">
          <p>
            <span className="font-semibold text-[#f3c3a3]">Hair · </span>
            <span className="text-stone-300">{info.hair}</span>
          </p>
          <p>
            <span className="font-semibold text-[#f3c3a3]">Beard · </span>
            <span className="text-stone-300">{info.beard}</span>
          </p>
          <p>
            <span className="font-semibold text-rose-300">Avoid · </span>
            <span className="text-stone-400">{info.avoid}</span>
          </p>
        </div>
      </Section>
      <Section title="Recommended for you">
        <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-stone-500">Hair for {res.shape} faces</div>
        <div className="flex flex-wrap gap-2">
          {hairRec.map((h) => (
            <Chip key={h.id} active={st.hairId === h.id} onClick={() => upd({ hairId: h.id })}>
              {h.name}
            </Chip>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {beardRec.map((b) => (
            <Chip key={b.id} active={st.beardId === b.id} onClick={() => upd({ beardId: b.id })}>
              {b.name}
            </Chip>
          ))}
        </div>
        <div className="mt-4 border-t border-white/[0.06] pt-3">
          <div className="mb-2 text-[11px] font-medium uppercase tracking-wide text-stone-500">Makeup to try</div>
          <div className="flex flex-wrap gap-2">
            {makeupRec.map((look) => (
              <Chip key={look.id} active={Object.entries(look.state).every(([key, value]) => st.makeup[key as keyof typeof st.makeup] === value)} onClick={() => applyMakeup(look)}>
                {look.name}
              </Chip>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

const SHAPE_PATHS: Record<FaceShape, string> = {
  Oval: "M30 4 C48 4 54 22 54 38 C54 58 42 76 30 76 C18 76 6 58 6 38 C6 22 12 4 30 4Z",
  Round: "M30 8 C50 8 56 24 56 40 C56 60 44 74 30 74 C16 74 4 60 4 40 C4 24 10 8 30 8Z",
  Square: "M10 8 L50 8 C54 8 55 12 55 16 L55 58 C55 66 46 74 30 74 C14 74 5 66 5 58 L5 16 C5 12 6 8 10 8Z",
  Heart: "M6 14 C6 6 20 4 30 10 C40 4 54 6 54 14 C54 36 44 60 30 76 C16 60 6 36 6 14Z",
  Oblong: "M30 2 C46 2 50 14 50 30 L50 52 C50 68 40 78 30 78 C20 78 10 68 10 52 L10 30 C10 14 14 2 30 2Z",
  Diamond: "M30 2 C38 2 42 14 56 34 C46 56 38 78 30 78 C22 78 14 56 4 34 C18 14 22 2 30 2Z",
};
