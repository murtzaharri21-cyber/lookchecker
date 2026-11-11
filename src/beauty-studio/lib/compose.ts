import { BEARDS, renderBeard } from "./beard";
import { IDX, catmull, pick, polyPath, scalePoly, type Frame } from "./geom";
import { HAIRSTYLES, faceCutPoints, renderHair, type HairFit } from "./hair";
import { hexToRgb, makeCanvas, recolorHair, removeHair, rgbToHex, smoothSkin } from "./imageOps";
import { renderMakeup, skinMask, type MakeupState } from "./makeup";
import type { SkinReport } from "./skin";
import type { FaceData } from "./vision";

export type OverlayKind = "redness" | "shine" | "texture" | "spots" | null;

export interface StudioState {
  hairId: string | null;
  hairColor: string;
  recolor: number; // 0..1 intensity applied to original hair
  hideOriginal: boolean;
  fit: HairFit;
  beardId: string | null;
  beardColor: string;
  beardIntensity: number;
  makeup: MakeupState;
  overlay: OverlayKind;
  showMesh: boolean;
}

export interface Cache {
  removed?: ImageData;
  faceFull?: Uint8ClampedArray;
  skin?: Uint8ClampedArray;
  protect?: Uint8ClampedArray;
  original?: ImageData;
}

export function estimateHairColor(src: HTMLCanvasElement, face: FaceData): string {
  if (!face.hairMask) return "#3a2a20";
  const ctx = src.getContext("2d", { willReadFrequently: true })!;
  const d = ctx.getImageData(0, 0, src.width, src.height).data;
  const m = face.hairMask;
  const px: number[][] = [];
  for (let i = 0; i < m.length; i += 2) {
    if (m[i] > 0.88) px.push([d[i * 4], d[i * 4 + 1], d[i * 4 + 2], 0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]]);
  }
  if (px.length < 80) return "#3a2a20";
  px.sort((a, b) => a[3] - b[3]);
  // use the mid-dark body of the hair (skip deep shadows and specular/background bleed)
  const sl = px.slice(Math.floor(px.length * 0.12), Math.floor(px.length * 0.6));
  let r = 0,
    g = 0,
    b = 0;
  for (const p of sl) {
    r += p[0];
    g += p[1];
    b += p[2];
  }
  r /= sl.length;
  g /= sl.length;
  b /= sl.length;
  const l = (r + g + b) / 3;
  const sat = 1.3; // compensate for desaturation from mixed edge pixels
  return rgbToHex((l + (r - l) * sat) * 1.08, (l + (g - l) * sat) * 1.08, (l + (b - l) * sat) * 1.08);
}

function protectMask(face: FaceData, fr: Frame): Uint8ClampedArray {
  const W = face.width,
    H = face.height;
  const c = makeCanvas(W, H);
  const x = c.getContext("2d", { willReadFrequently: true })!;
  x.fillStyle = "#fff";
  x.fill(polyPath(catmull(scalePoly(pick(face.lm, IDX.faceOval), 0.97), true, 4)));
  // only protect from the eyebrows downward
  const browV = Math.min(fr.toLocal(face.lm[105]).V, fr.toLocal(face.lm[334]).V) - 0.04;
  // forehead: protect only the skin clearly below the hairline (keeps bangs removable, avoids seams)
  x.fill(polyPath(catmull(faceCutPoints(face, fr, -0.05, 1.02), true, 4)));
  void browV;
  const id = x.getImageData(0, 0, W, H).data;
  const out = new Uint8ClampedArray(W * H);
  for (let i = 0; i < W * H; i++) out[i] = id[i * 4 + 3];
  return out;
}

export function ensureRemoved(src: HTMLCanvasElement, face: FaceData, fr: Frame, cache: Cache): ImageData | null {
  if (!face.hairMask) return null;
  if (!cache.protect) cache.protect = protectMask(face, fr);
  if (!cache.removed) {
    const base = src.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, src.width, src.height);
    if (!cache.faceFull) {
      const c = makeCanvas(face.width, face.height);
      const x = c.getContext("2d", { willReadFrequently: true })!;
      x.fillStyle = "#fff";
      x.fill(polyPath(catmull(faceCutPoints(face, fr, -0.16, 1.05), true, 4)));
      const id = x.getImageData(0, 0, face.width, face.height).data;
      cache.faceFull = new Uint8ClampedArray(face.width * face.height);
      for (let i = 0; i < cache.faceFull.length; i++) cache.faceFull[i] = id[i * 4 + 3];
    }
    removeHair(base, face.hairMask, cache.protect, 1, cache.faceFull);
    cache.removed = base;
  }
  return cache.removed;
}

export function compose(out: HTMLCanvasElement, src: HTMLCanvasElement, face: FaceData, fr: Frame, st: StudioState, cache: Cache, report: SkinReport | null) {
  const W = src.width,
    H = src.height;
  if (out.width !== W) out.width = W;
  if (out.height !== H) out.height = H;
  const ctx = out.getContext("2d", { willReadFrequently: true })!;
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1;
  ctx.drawImage(src, 0, 0);

  const style = st.hairId ? HAIRSTYLES.find((h) => h.id === st.hairId) ?? null : null;
  const needRemove = !!(style && st.hideOriginal && face.hairMask);
  const needRecolor = !!(face.hairMask && st.recolor > 0 && !needRemove);
  const needSmooth = st.makeup.foundation > 0;

  if (needRemove || needRecolor || needSmooth) {
    if (!cache.protect) cache.protect = protectMask(face, fr);
    let img: ImageData;
    if (needRemove) {
      const removed = ensureRemoved(src, face, fr, cache)!;
      img = new ImageData(new Uint8ClampedArray(removed.data), W, H);
    } else {
      if (!cache.original) cache.original = src.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, W, H);
      img = new ImageData(new Uint8ClampedArray(cache.original.data), W, H);
    }
    if (needRecolor) recolorHair(img, face.hairMask!, hexToRgb(st.hairColor), st.recolor, cache.protect);
    if (needSmooth) {
      if (!cache.skin) cache.skin = skinMask(face);
      smoothSkin(img, cache.skin, 0.25 + st.makeup.foundation * 0.7, Math.max(2, fr.s * 0.022), hexToRgb(st.makeup.foundationTint), st.makeup.foundation * 0.6);
    }
    ctx.putImageData(img, 0, 0);
  }

  renderMakeup(ctx, face, fr, st.makeup);

  if (st.beardId) {
    const b = BEARDS.find((x) => x.id === st.beardId);
    if (b) renderBeard(ctx, face, fr, b, st.beardColor, 1, st.beardIntensity);
  }
  if (style) renderHair(ctx, face, fr, style, { color: st.hairColor, fit: st.fit, quality: 1, photo: src });

  if (report && st.overlay) {
    const map = report.maps[st.overlay];
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 0.95;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(map, report.box.x, report.box.y, report.box.w, report.box.h);
    if (st.overlay === "spots") {
      ctx.strokeStyle = "rgba(220,160,255,0.95)";
      ctx.lineWidth = Math.max(1.5, fr.s / 160);
      for (const p of report.spots) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, fr.s * 0.035, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  if (st.showMesh) {
    ctx.save();
    ctx.fillStyle = "rgba(120,255,220,0.85)";
    const r = Math.max(1, fr.s / 220);
    for (const p of face.lm) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(120,255,220,0.6)";
    ctx.lineWidth = r;
    for (const idx of [IDX.faceOval, IDX.lipsOuter, IDX.eyeL, IDX.eyeR, IDX.browL, IDX.browR]) ctx.stroke(polyPath(pick(face.lm, idx)));
    ctx.restore();
  }
}

/** Renders a small preview of a hairstyle / beard on the user's own photo */
export function renderThumb(base: HTMLCanvasElement, face: FaceData, fr: Frame, kind: "hair" | "beard", id: string, color: string, fit: HairFit, size = 150): string {
  const cw = fr.s * (kind === "hair" ? 3.6 : 2.6);
  const chh = cw * 1.2;
  const ctr = kind === "hair" ? fr.toImg(0, 0.42) : fr.toImg(0, 0.8);
  const k = size / cw;
  const c = makeCanvas(size, size * 1.2);
  const x = c.getContext("2d")!;
  x.setTransform(k, 0, 0, k, -(ctr.x - cw / 2) * k, -(ctr.y - chh / 2) * k);
  x.drawImage(base, 0, 0);
  if (kind === "hair") {
    const st = HAIRSTYLES.find((h) => h.id === id)!;
    renderHair(x, face, fr, st, { color, fit, quality: 0.3, maskScale: Math.min(0.35, 360 / Math.max(face.width, face.height)), lineBoost: 0.75 / (k * 1.4) });
  } else {
    const b = BEARDS.find((h) => h.id === id)!;
    renderBeard(x, face, fr, b, color, 0.35, 1);
  }
  return c.toDataURL("image/jpeg", 0.82);
}
