import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Droplets, Paintbrush, ScanFace, Scissors, Sparkles, UserRound, type LucideIcon } from "lucide-react";
import { BEARDS } from "../lib/beard";
import { compose, ensureRemoved, estimateHairColor, renderThumb, type Cache, type StudioState } from "../lib/compose";
import { analyzeFaceShape, makeFrame, type Frame } from "../lib/geom";
import { HAIRSTYLES } from "../lib/hair";
import { makeCanvas } from "../lib/imageOps";
import { EMPTY_MAKEUP } from "../lib/makeup";
import { analyzeSkin, type SkinReport } from "../lib/skin";
import type { FaceData } from "../lib/vision";
import { cn } from "../utils/cn";
import { BeardPanel, FacePanel, HairPanel } from "./PanelsA";
import { CustomMakeupPanel, MakeupPanel, SkinPanel } from "./PanelsB";

type Tab = "hair" | "beard" | "makeup" | "custom-makeup" | "skin" | "face";
const TABS: { k: Tab; label: string; icon: LucideIcon }[] = [
  { k: "hair", label: "Hair", icon: Scissors },
  { k: "beard", label: "Beard", icon: UserRound },
  { k: "makeup", label: "Makeup", icon: Sparkles },
  { k: "custom-makeup", label: "Custom Makeup", icon: Paintbrush },
  { k: "skin", label: "Skin", icon: Droplets },
  { k: "face", label: "Face", icon: ScanFace },
];

function cropThumb(src: HTMLCanvasElement, fr: Frame, kind: "hair" | "beard", size = 150) {
  const cw = fr.s * (kind === "hair" ? 3.6 : 2.6);
  const chh = cw * 1.2;
  const ctr = kind === "hair" ? fr.toImg(0, 0.42) : fr.toImg(0, 0.8);
  const c = makeCanvas(size, size * 1.2);
  const x = c.getContext("2d")!;
  const k = size / cw;
  x.setTransform(k, 0, 0, k, -(ctr.x - cw / 2) * k, -(ctr.y - chh / 2) * k);
  x.drawImage(src, 0, 0);
  return c.toDataURL("image/jpeg", 0.82);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function Studio({ src, face, onNew }: { src: HTMLCanvasElement; face: FaceData; onNew: () => void }) {
  const fr = useMemo(() => makeFrame(face.lm), [face]);
  const shape = useMemo(() => analyzeFaceShape(face.lm), [face]);
  const yawDegrees = Math.round((Math.abs(fr.pose.yaw) * 180) / Math.PI);
  const pitchDegrees = Math.round((fr.pose.pitch * 180) / Math.PI);
  const rollDegrees = Math.round((fr.pose.roll * 180) / Math.PI);
  const poseLabel = yawDegrees < 18 ? "Front" : yawDegrees < 55 ? "Angled" : "Profile";
  const natural = useMemo(() => estimateHairColor(src, face), [src, face]);
  const initial = useMemo<StudioState>(
    () => ({
      hairId: null,
      hairColor: natural,
      recolor: 0,
      hideOriginal: true,
      fit: { size: 1, width: 1, offsetY: 0 },
      beardId: null,
      beardColor: "#33241a",
      beardIntensity: 0.9,
      makeup: EMPTY_MAKEUP,
      overlay: null,
      showMesh: false,
    }),
    [natural],
  );
  const [st, setSt] = useState<StudioState>(initial);
  const upd = useCallback((p: Partial<StudioState>) => setSt((s) => ({ ...s, ...p })), []);
  const [tab, setTab] = useState<Tab>("hair");
  const [report, setReport] = useState<SkinReport | null>(null);
  const [skinError, setSkinError] = useState<string | null>(null);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [beardThumbs, setBeardThumbs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [compare, setCompare] = useState(false);
  const [pos, setPos] = useState(50);
  const [hold, setHold] = useState(false);
  const cache = useRef<Cache>({});
  const outRef = useRef<HTMLCanvasElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const origUrl = useMemo(() => src.toDataURL("image/jpeg", 0.92), [src]);

  // ---- skin analysis (once) ----
  useEffect(() => {
    const id = setTimeout(() => {
      try {
        setReport(analyzeSkin(src, face));
      } catch (e) {
        console.error("skin analysis failed", e);
        setSkinError("Skin analysis could not be completed. Try a clear, evenly lit photo again.");
      }
    }, 250);
    return () => clearTimeout(id);
  }, [src, face]);

  // ---- render scheduler (coalesces rapid slider changes) ----
  const stRef = useRef(st);
  const reportRef = useRef(report);
  useEffect(() => {
    stRef.current = st;
    reportRef.current = report;
  }, [st, report]);
  const dirty = useRef(false);
  const running = useRef(false);
  const kick = useCallback(() => {
    dirty.current = true;
    if (running.current) return;
    running.current = true;
    setBusy(true);
    const loop = () => {
      if (!dirty.current) {
        running.current = false;
        setBusy(false);
        return;
      }
      dirty.current = false;
      setTimeout(() => {
        try {
          if (outRef.current) compose(outRef.current, src, face, fr, stRef.current, cache.current, reportRef.current);
        } catch (e) {
          console.error(e);
        }
        requestAnimationFrame(loop);
      }, 16);
    };
    requestAnimationFrame(loop);
  }, [src, face, fr]);
  useEffect(() => {
    kick();
  }, [st, report, kick]);

  // ---- hairstyle thumbnails on the user's own face ----
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await sleep(600);
      if (cancelled) return;
      if (!thumbs["__orig"]) setThumbs((t) => ({ ...t, __orig: cropThumb(src, fr, "hair") }));
      let base = src;
      await sleep(30);
      const removed = ensureRemoved(src, face, fr, cache.current);
      if (removed) {
        const c = makeCanvas(src.width, src.height);
        c.getContext("2d")!.putImageData(removed, 0, 0);
        base = c;
      }
      for (const h of HAIRSTYLES) {
        if (cancelled) return;
        await sleep(10);
        try {
          const url = renderThumb(base, face, fr, "hair", h.id, st.hairColor, { size: 1, width: 1, offsetY: 0 });
          if (!cancelled) setThumbs((t) => ({ ...t, [h.id]: url }));
        } catch (e) {
          console.error(e);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [st.hairColor, src, face, fr]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await sleep(1500);
      if (cancelled) return;
      setBeardThumbs((t) => ({ ...t, __none: cropThumb(src, fr, "beard") }));
      for (const b of BEARDS) {
        if (cancelled) return;
        await sleep(10);
        try {
          const url = renderThumb(src, face, fr, "beard", b.id, st.beardColor, { size: 1, width: 1, offsetY: 0 });
          if (!cancelled) setBeardThumbs((t) => ({ ...t, [b.id]: url }));
        } catch (e) {
          console.error(e);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [st.beardColor, src, face, fr]);

  // ---- compare slider drag ----
  const dragging = useRef(false);
  const onPointer = (e: React.PointerEvent) => {
    if (!compare || !viewRef.current) return;
    if (e.type === "pointerdown") {
      dragging.current = true;
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    }
    if (e.type === "pointerup" || e.type === "pointercancel") dragging.current = false;
    if (!dragging.current) return;
    const r = viewRef.current.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100)));
  };

  const download = (side: boolean) => {
    const out = outRef.current;
    if (!out) return;
    let c = out;
    if (side) {
      c = makeCanvas(out.width * 2 + 24, out.height);
      const x = c.getContext("2d")!;
      x.fillStyle = "#0c0a09";
      x.fillRect(0, 0, c.width, c.height);
      x.drawImage(src, 0, 0);
      x.drawImage(out, out.width + 24, 0);
      x.font = `${Math.round(out.width * 0.035)}px Georgia`;
      x.fillStyle = "rgba(255,255,255,.85)";
      x.fillText("Before", out.width * 0.04, out.height * 0.06);
      x.fillText("After · AI Beauty Studio", out.width * 1.04 + 24, out.height * 0.06);
    }
    c.toBlob(
      (b) => {
        if (!b) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = side ? "ai-beauty-studio-before-after.jpg" : "ai-beauty-studio-look.jpg";
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      },
      "image/jpeg",
      0.93,
    );
  };

  const changed = st.hairId || st.beardId || st.recolor > 0 || Object.entries(st.makeup).some(([k, v]) => typeof v === "number" && v > 0 && k !== "wing");

  return (
    <div className="flex min-h-[calc(100dvh-62px)] flex-col overflow-visible lg:h-[calc(100dvh-62px)] lg:min-h-[420px] lg:overflow-hidden">
      <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-white/5 px-4 lg:px-6">
        <div className="flex items-center gap-2.5">
          <span className="hidden font-display text-xl text-white sm:inline">AI Beauty Studio</span>
          <span className="ml-2 hidden rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-300 md:inline">● on-device</span>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button onClick={onNew} className="rounded-full border border-white/10 px-3 py-1.5 text-[12px] text-stone-300 hover:bg-white/5 sm:px-4">
            New photo
          </button>
          <button onClick={() => setCompare((c) => !c)} className={cn("rounded-full border px-3 py-1.5 text-[12px] sm:px-4", compare ? "border-[#f3c3a3] bg-[#f3c3a3]/10 text-[#f3c3a3]" : "border-white/10 text-stone-300 hover:bg-white/5")}>
            Before / After
          </button>
          <button onClick={() => setSt({ ...initial })} disabled={!changed} className="hidden rounded-full border border-white/10 px-4 py-1.5 text-[12px] text-stone-300 hover:bg-white/5 disabled:opacity-40 sm:block">
            Reset
          </button>
          <div className="group relative">
            <button onClick={() => download(false)} className="btn-gold rounded-full px-4 py-1.5 text-[12px] font-semibold">
              Download
            </button>
            <div className="invisible absolute right-0 top-full z-30 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
              <div className="w-44 rounded-xl border border-white/10 bg-stone-900 p-1.5 shadow-xl">
                <button onClick={() => download(false)} className="w-full rounded-lg px-3 py-2 text-left text-[12px] text-stone-300 hover:bg-white/5">
                  Result only
                </button>
                <button onClick={() => download(true)} className="w-full rounded-lg px-3 py-2 text-left text-[12px] text-stone-300 hover:bg-white/5">
                  Before & after
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 flex-col lg:min-h-0 lg:flex-row">
        {/* viewer */}
        <div className="relative flex h-[52vh] shrink-0 items-center justify-center bg-[radial-gradient(ellipse_at_center,#1c1917_0%,#0c0a09_70%)] p-3 lg:h-auto lg:flex-1 lg:p-6">
          <div
            ref={viewRef}
            className="relative max-h-full max-w-full overflow-hidden rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,.8)] ring-1 ring-white/10"
            style={{ aspectRatio: `${src.width}/${src.height}`, height: "100%" }}
            onPointerDown={onPointer}
            onPointerMove={onPointer}
            onPointerUp={onPointer}
            onPointerCancel={onPointer}
          >
            <Image src={origUrl} alt="Original" fill unoptimized sizes="(min-width: 1024px) 60vw, 100vw" className="select-none object-fill" draggable={false} />
            <canvas
              ref={outRef}
              className="absolute inset-0 h-full w-full"
              style={{ clipPath: compare ? `inset(0 0 0 ${pos}%)` : undefined, opacity: hold ? 0 : 1, transition: "opacity .15s" }}
            />
            <span
              title={`Detected head pose: yaw ${yawDegrees}°, pitch ${pitchDegrees}°, roll ${rollDegrees}°`}
              className="glass absolute left-1/2 top-3 -translate-x-1/2 rounded-full px-2.5 py-1 text-[10px] text-white"
            >
              {poseLabel} · yaw {yawDegrees}° · pitch {pitchDegrees}° · roll {rollDegrees}° · width fit {fr.hairWidthScale.toFixed(2)}×
            </span>
            {compare && (
              <>
                <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,.6)]" style={{ left: `${pos}%` }}>
                  <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-stone-900 shadow-lg">⇆</div>
                </div>
                <span className="glass absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] text-white">Before</span>
                <span className="glass absolute right-3 top-3 rounded-full px-2.5 py-1 text-[11px] text-white">After</span>
              </>
            )}
            {busy && (
              <div className="glass absolute bottom-3 right-3 flex items-center gap-2 rounded-full px-3 py-1.5 text-[11px] text-stone-200">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#f3c3a3] border-t-transparent" /> Rendering
              </div>
            )}
          </div>
          {!compare && (
            <button
              onPointerDown={() => setHold(true)}
              onPointerUp={() => setHold(false)}
              onPointerLeave={() => setHold(false)}
              className="glass absolute bottom-5 left-1/2 -translate-x-1/2 select-none rounded-full border border-white/10 px-4 py-2 text-[12px] text-stone-200 lg:bottom-8"
            >
              Hold to see original
            </button>
          )}
        </div>

        {/* panel */}
        <aside className="flex flex-col border-white/5 bg-stone-950/80 lg:min-h-0 lg:flex-1 lg:border-l lg:flex-none lg:w-[430px]">
          <nav className="flex shrink-0 gap-1 border-b border-white/5 p-2">
            {TABS.map((t) => (
              <button
                key={t.k}
                onClick={() => setTab(t.k)}
                aria-label={t.label}
                aria-pressed={tab === t.k}
                title={t.label}
                className={cn("flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[11px] font-medium transition", tab === t.k ? "bg-white/[0.07] text-white" : "text-stone-500 hover:text-stone-300")}
              >
                <t.icon size={18} strokeWidth={1.7} aria-hidden="true" />
                <span className="max-w-full text-center leading-tight">{t.label}</span>
                {tab === t.k && <span className="mt-0.5 h-0.5 w-5 rounded-full bg-gradient-to-r from-[#f3c3a3] to-[#e48b9b]" />}
              </button>
            ))}
          </nav>
          <div className="scroll-thin p-4 lg:min-h-0 lg:flex-1 lg:overflow-y-auto">
            {tab === "hair" && <HairPanel st={st} upd={upd} thumbs={thumbs} shape={shape.shape} naturalColor={natural} />}
            {tab === "beard" && <BeardPanel st={st} upd={upd} thumbs={beardThumbs} shape={shape.shape} />}
            {tab === "makeup" && <MakeupPanel st={st} upd={upd} report={report} />}
            {tab === "custom-makeup" && <CustomMakeupPanel st={st} upd={upd} report={report} />}
            {tab === "skin" && <SkinPanel report={report} error={skinError} st={st} upd={upd} goMakeup={() => setTab("makeup")} />}
            {tab === "face" && <FacePanel res={shape} upd={upd} st={st} />}
          </div>
        </aside>
      </div>
    </div>
  );
}
