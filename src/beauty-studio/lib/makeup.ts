import { IDX, catmull, centroid, clamp, dist, lerpP, mid, pick, polyPath, scalePoly, seeded, type Frame } from "./geom";
import { makeCanvas } from "./imageOps";
import type { FaceData, P } from "./vision";

export type LipFinish = "matte" | "satin" | "gloss";
export interface MakeupState {
  foundation: number; // smoothing 0..1
  foundationTint: string;
  lipColor: string;
  lip: number;
  lipFinish: LipFinish;
  blushColor: string;
  blush: number;
  shadowColor: string;
  shadow: number;
  linerColor: string;
  liner: number;
  wing: number;
  lashes: number;
  browColor: string;
  brow: number;
  contour: number;
  highlight: number;
}

export const EMPTY_MAKEUP: MakeupState = {
  foundation: 0, foundationTint: "#d9b08f", lipColor: "#b0505a", lip: 0, lipFinish: "satin", blushColor: "#d9777a", blush: 0,
  shadowColor: "#8a5a4a", shadow: 0, linerColor: "#1a1412", liner: 0, wing: 0.5, lashes: 0, browColor: "#3b2a20", brow: 0, contour: 0, highlight: 0,
};

export interface MakeupLook {
  id: string;
  name: string;
  desc: string;
  state: Partial<MakeupState>;
}

export const LOOKS: MakeupLook[] = [
  { id: "none", name: "Bare Face", desc: "No makeup", state: {} },
  { id: "natural", name: "No-Makeup Makeup", desc: "Skin-perfecting, soft & fresh", state: { foundation: 0.45, lipColor: "#b9706e", lip: 0.35, lipFinish: "satin", blushColor: "#e08f86", blush: 0.35, brow: 0.35, lashes: 0.4, highlight: 0.25 } },
  { id: "soft-glam", name: "Soft Glam", desc: "Warm bronze eyes, nude-rose lip", state: { foundation: 0.55, lipColor: "#a85c5c", lip: 0.6, lipFinish: "satin", blushColor: "#d27b6f", blush: 0.45, shadowColor: "#8c5a42", shadow: 0.55, liner: 0.55, wing: 0.45, lashes: 0.75, brow: 0.5, contour: 0.45, highlight: 0.45 } },
  { id: "red-carpet", name: "Classic Red", desc: "Bold red lip & sharp wing", state: { foundation: 0.6, lipColor: "#b3142a", lip: 0.85, lipFinish: "matte", blushColor: "#cf6f6a", blush: 0.3, shadowColor: "#7d5a4e", shadow: 0.3, liner: 0.85, wing: 0.9, lashes: 0.85, brow: 0.55, contour: 0.4, highlight: 0.4 } },
  { id: "smoky", name: "Smoky Night", desc: "Smoldering charcoal eyes", state: { foundation: 0.55, lipColor: "#9a6a66", lip: 0.45, lipFinish: "satin", blushColor: "#b9696a", blush: 0.3, shadowColor: "#2d2a2e", shadow: 0.85, liner: 0.9, wing: 0.55, lashes: 1, brow: 0.55, contour: 0.5, highlight: 0.35 } },
  { id: "rose", name: "Rosy Dewy", desc: "K-beauty glow, gradient pink lips", state: { foundation: 0.5, lipColor: "#d4566f", lip: 0.55, lipFinish: "gloss", blushColor: "#f08a9c", blush: 0.55, shadowColor: "#c98b8a", shadow: 0.4, liner: 0.3, wing: 0.2, lashes: 0.5, brow: 0.3, highlight: 0.6 } },
  { id: "berry", name: "Berry Chic", desc: "Deep berry lip, plum eyes", state: { foundation: 0.5, lipColor: "#7a1f3d", lip: 0.8, lipFinish: "satin", blushColor: "#c06a7a", blush: 0.4, shadowColor: "#6a3d55", shadow: 0.55, liner: 0.65, wing: 0.6, lashes: 0.8, brow: 0.5, contour: 0.35, highlight: 0.3 } },
  { id: "bronze", name: "Bronze Goddess", desc: "Sun-kissed golden bronze", state: { foundation: 0.5, lipColor: "#a0644a", lip: 0.55, lipFinish: "gloss", blushColor: "#c7754f", blush: 0.5, shadowColor: "#a0682f", shadow: 0.6, liner: 0.5, wing: 0.5, lashes: 0.75, brow: 0.5, contour: 0.6, highlight: 0.65 } },
  { id: "clean-girl", name: "Fresh & Polished", desc: "Soft definition with a natural satin finish", state: { foundation: 0.38, lipColor: "#bd8178", lip: 0.28, lipFinish: "satin", blushColor: "#e5a096", blush: 0.24, shadowColor: "#c5a18a", shadow: 0.18, liner: 0.2, wing: 0.12, lashes: 0.35, brow: 0.42, contour: 0.12, highlight: 0.32 } },
  { id: "peach-glow", name: "Peach Glow", desc: "Warm peach cheeks and a glossy lip", state: { foundation: 0.42, lipColor: "#db8068", lip: 0.5, lipFinish: "gloss", blushColor: "#ee997c", blush: 0.48, shadowColor: "#c58b68", shadow: 0.32, liner: 0.28, wing: 0.18, lashes: 0.55, brow: 0.38, contour: 0.22, highlight: 0.55 } },
  { id: "lavender-dusk", name: "Lavender Dusk", desc: "Muted lilac eyes and a cool rose lip", state: { foundation: 0.48, lipColor: "#a86680", lip: 0.58, lipFinish: "satin", blushColor: "#cb8297", blush: 0.36, shadowColor: "#8a7fa8", shadow: 0.48, linerColor: "#3c3552", liner: 0.48, wing: 0.35, lashes: 0.7, brow: 0.45, contour: 0.28, highlight: 0.38 } },
  { id: "emerald-evening", name: "Emerald Evening", desc: "Deep green accents with a balanced nude lip", state: { foundation: 0.52, lipColor: "#a66d60", lip: 0.46, lipFinish: "satin", blushColor: "#c87973", blush: 0.32, shadowColor: "#4b5a3a", shadow: 0.62, linerColor: "#17251d", liner: 0.7, wing: 0.55, lashes: 0.82, brow: 0.52, contour: 0.42, highlight: 0.4 } },
  { id: "editorial-rose", name: "Editorial Rose", desc: "Rose monochrome with softly defined eyes", state: { foundation: 0.5, lipColor: "#a83e58", lip: 0.72, lipFinish: "matte", blushColor: "#d27587", blush: 0.5, shadowColor: "#9a6070", shadow: 0.48, liner: 0.52, wing: 0.38, lashes: 0.75, brow: 0.58, contour: 0.38, highlight: 0.42 } },
  { id: "soft-bronze", name: "Soft Bronze", desc: "A wearable bronze eye with a warm nude lip", state: { foundation: 0.45, lipColor: "#a86d58", lip: 0.42, lipFinish: "satin", blushColor: "#d58b70", blush: 0.34, shadowColor: "#9b7049", shadow: 0.45, liner: 0.38, wing: 0.24, lashes: 0.62, brow: 0.46, contour: 0.34, highlight: 0.48 } },
  { id: "groom", name: "Grooming (Men)", desc: "Even skin, groomed brows", state: { foundation: 0.45, brow: 0.25, highlight: 0.0, contour: 0.15 } },
];

export const LIP_COLORS = ["#c48b7f", "#b9706e", "#a85c5c", "#d4566f", "#e0607a", "#c2303f", "#b3142a", "#8e1b2b", "#7a1f3d", "#5c2033", "#a0644a", "#8f4e3a", "#d87a5d", "#f07c6b", "#b25f8a", "#6b3a2c"];
export const BLUSH_COLORS = ["#f2a0a5", "#e08f86", "#d9777a", "#f08a9c", "#d27b6f", "#c7754f", "#c06a7a", "#b9696a", "#e6956b"];
export const SHADOW_COLORS = ["#c9a28a", "#b48a6f", "#8c5a42", "#a0682f", "#c98b8a", "#6a3d55", "#2d2a2e", "#4b5a3a", "#3c4f73", "#8a7fa8", "#c4a35a", "#7d5a4e"];
export const LINER_COLORS = ["#0f0d0c", "#3a271d", "#1f2b4a", "#2e4532", "#5a2a4a"];
export const BROW_COLORS = ["#1c1512", "#3b2a20", "#5a4030", "#7a5a40", "#9a7a5a"];

/* ---------------- helpers ---------------- */
function blurred(src: HTMLCanvasElement, radius: number) {
  const k = Math.max(1, radius / 1.6);
  const sm = makeCanvas(src.width / k, src.height / k);
  const sx = sm.getContext("2d")!;
  sx.imageSmoothingQuality = "high";
  sx.drawImage(src, 0, 0, sm.width, sm.height);
  const out = makeCanvas(src.width, src.height);
  const ox = out.getContext("2d")!;
  ox.imageSmoothingQuality = "high";
  ox.drawImage(sm, 0, 0, out.width, out.height);
  return out;
}

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

function faceBox(face: FaceData, s: number): Box {
  let x0 = 1e9,
    y0 = 1e9,
    x1 = -1e9,
    y1 = -1e9;
  for (const p of face.lm) {
    x0 = Math.min(x0, p.x);
    y0 = Math.min(y0, p.y);
    x1 = Math.max(x1, p.x);
    y1 = Math.max(y1, p.y);
  }
  const pad = s * 0.25;
  x0 = Math.max(0, Math.floor(x0 - pad));
  y0 = Math.max(0, Math.floor(y0 - pad));
  x1 = Math.min(face.width, Math.ceil(x1 + pad));
  y1 = Math.min(face.height, Math.ceil(y1 + pad));
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

/** draws a shape into a box-sized layer, blurs it, tints it, composites */
function paint(
  ctx: CanvasRenderingContext2D,
  box: Box,
  draw: (c: CanvasRenderingContext2D) => void,
  color: string,
  blur: number,
  ops: [GlobalCompositeOperation, number][],
  cut?: (c: CanvasRenderingContext2D) => void,
) {
  const m = makeCanvas(box.w, box.h);
  const mx = m.getContext("2d")!;
  mx.translate(-box.x, -box.y);
  mx.fillStyle = "#fff";
  mx.strokeStyle = "#fff";
  draw(mx);
  let layer = blur > 0.5 ? blurred(m, blur) : m;
  if (cut) {
    const lx = layer.getContext("2d")!;
    lx.save();
    lx.translate(-box.x, -box.y);
    lx.globalCompositeOperation = "destination-out";
    cut(lx);
    lx.restore();
  }
  const lx = layer.getContext("2d")!;
  lx.globalCompositeOperation = "source-in";
  lx.fillStyle = color;
  lx.fillRect(0, 0, box.w, box.h);
  ctx.save();
  for (const [op, a] of ops) {
    if (a <= 0) continue;
    ctx.globalCompositeOperation = op;
    ctx.globalAlpha = Math.min(1, a);
    ctx.drawImage(layer, box.x, box.y);
  }
  ctx.restore();
  layer = null as never;
}

/** skin mask (alpha 0..255 per pixel, full image size) – face oval minus features */
export function skinMask(face: FaceData, featherK = 1): Uint8ClampedArray {
  const W = face.width,
    H = face.height;
  const lm = face.lm;
  const c = makeCanvas(W, H);
  const x = c.getContext("2d", { willReadFrequently: true })!;
  const oval = pick(lm, IDX.faceOval);
  x.fillStyle = "#fff";
  x.fill(polyPath(catmull(scalePoly(oval, 0.96), true, 4)));
  x.globalCompositeOperation = "destination-out";
  const cut = (idx: number[], k: number) => x.fill(polyPath(catmull(scalePoly(pick(lm, idx), k), true, 4)));
  cut(IDX.eyeL, 1.45);
  cut(IDX.eyeR, 1.45);
  cut(IDX.browL, 1.25);
  cut(IDX.browR, 1.25);
  cut(IDX.lipsOuter, 1.12);
  cut([98, 97, 2, 326, 327, 294, 278, 344, 440, 275, 4, 45, 220, 115, 48, 64], 1.0);
  const s = dist(lm[234], lm[454]) / 2;
  const b = blurred(c, s * 0.03 * featherK);
  const bx = b.getContext("2d", { willReadFrequently: true })!;
  const d = bx.getImageData(0, 0, W, H).data;
  const out = new Uint8ClampedArray(W * H);
  for (let i = 0; i < W * H; i++) out[i] = d[i * 4 + 3];
  return out;
}

function ellipse(c: CanvasRenderingContext2D, ctr: P, rx: number, ry: number, rot: number) {
  c.beginPath();
  c.ellipse(ctr.x, ctr.y, rx, ry, rot, 0, Math.PI * 2);
  c.fill();
}

/* ---------------- main ---------------- */
export function renderMakeup(ctx: CanvasRenderingContext2D, face: FaceData, fr: Frame, m: MakeupState) {
  const lm = face.lm;
  const s = fr.s;
  const sx = fr.sx;
  const effectScale = Math.sqrt(s * sx);
  const yawStrength = Math.min(1, Math.abs(fr.pose.yaw) / 1.05);
  const farSide = Math.sign(fr.pose.yaw);
  const farEyeWidth = farSide > 0 ? dist(lm[263], lm[362]) : dist(lm[33], lm[133]);
  const nearEyeWidth = farSide > 0 ? dist(lm[33], lm[133]) : dist(lm[263], lm[362]);
  const farSideVisibility = nearEyeWidth > 0 ? clamp(farEyeWidth / nearEyeWidth, 0.12, 1) : 1;
  const sideOpacity = (side: number) => (side === farSide && farSide !== 0 ? 1 - (1 - farSideVisibility) * yawStrength : 1);
  const box = faceBox(face, s);
  const rot = fr.angle;

  // ---- contour ----
  if (m.contour > 0) {
    paint(
      ctx,
      box,
      (c) => {
        for (const [ear, mouth, side] of [
          [234, 61, -1],
          [454, 291, 1],
        ] as const) {
          const a = lerpP(lm[ear], lm[mouth], 0.32);
          const ctr = { x: a.x + fr.uy.x * s * 0.06, y: a.y + fr.uy.y * s * 0.06 };
          const ang = Math.atan2(lm[mouth].y - lm[ear].y, lm[mouth].x - lm[ear].x);
          c.globalAlpha = sideOpacity(side);
          ellipse(c, ctr, sx * 0.3, s * 0.07, ang);
          // temple
          const t = lerpP(lm[side < 0 ? 54 : 284], lm[side < 0 ? 127 : 356], 0.5);
          ellipse(c, t, sx * 0.08, s * 0.16, rot);
          c.globalAlpha = 1;
        }
        // jaw under chin shadow
        const j = pick(lm, [172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397]);
        c.lineWidth = effectScale * 0.08;
        c.stroke(polyPath(j, false));
      },
      "#6e4a3a",
      effectScale * 0.09,
      [["multiply", m.contour * 0.42]],
    );
  }

  // ---- blush ----
  if (m.blush > 0) {
    paint(
      ctx,
      box,
      (c) => {
        for (const [a, b, side] of [
          [205, 117, -1],
          [425, 346, 1],
        ] as const) {
          const ctr = lerpP(lm[a], lm[b], 0.45);
          c.globalAlpha = sideOpacity(side);
          ellipse(c, ctr, sx * 0.24, s * 0.15, rot - side * 0.45);
          c.globalAlpha = 1;
        }
      },
      m.blushColor,
      effectScale * 0.12,
      [
        ["multiply", m.blush * 0.45],
        ["soft-light", m.blush * 0.5],
      ],
    );
  }

  // ---- highlighter ----
  if (m.highlight > 0) {
    paint(
      ctx,
      box,
      (c) => {
        for (const [a, b, side] of [
          [117, 234, -1],
          [346, 454, 1],
        ] as const) {
          const p = lerpP(lm[a], lm[b], 0.3);
          const ctr = { x: p.x - fr.uy.x * s * 0.03, y: p.y - fr.uy.y * s * 0.03 };
          c.globalAlpha = sideOpacity(side);
          ellipse(c, ctr, sx * 0.17, s * 0.055, rot - side * 0.5);
          c.globalAlpha = 1;
        }
        // nose bridge
        c.lineWidth = effectScale * 0.05;
        c.lineCap = "round";
        c.stroke(polyPath(pick(lm, [168, 6, 197, 195]), false));
        // cupid's bow + chin + center forehead
        ellipse(c, { x: lm[0].x - fr.uy.x * s * 0.04, y: lm[0].y - fr.uy.y * s * 0.04 }, sx * 0.05, s * 0.025, rot);
        ellipse(c, lerpP(lm[152], lm[17], 0.45), sx * 0.07, s * 0.04, rot);
        ellipse(c, lerpP(lm[9], lm[10], 0.4), sx * 0.09, s * 0.12, rot);
      },
      "#fff4e6",
      effectScale * 0.05,
      [
        ["soft-light", m.highlight * 0.7],
        ["screen", m.highlight * 0.18],
      ],
    );
  }

  // ---- eyeshadow ----
  if (m.shadow > 0) {
    paint(
      ctx,
      box,
      (c) => {
        for (const [lid, brow, side] of [
          [IDX.eyeLUpper, IDX.browLLower, -1],
          [IDX.eyeRUpper, IDX.browRLower, 1],
        ] as const) {
          const L = pick(lm, lid);
          const Bw = pick(lm, brow);
          const top = L.map((p, i) => {
            const t = (i / (L.length - 1)) * (Bw.length - 1);
            const i0 = Math.floor(t),
              i1 = Math.min(Bw.length - 1, i0 + 1);
            const b = lerpP(Bw[i0], Bw[i1], t - i0);
            return lerpP(p, b, 0.55 - 0.15 * (i / (L.length - 1)));
          });
          const outer = L[0];
          const wingP = { x: outer.x + (outer.x - L[L.length - 1].x) * 0.18 - fr.uy.x * s * 0.05, y: outer.y + (outer.y - L[L.length - 1].y) * 0.18 - fr.uy.y * s * 0.05 };
          c.globalAlpha = sideOpacity(side);
          c.fill(polyPath(catmull([wingP, ...top, ...L.slice().reverse()], true, 4)));
          c.globalAlpha = 1;
        }
      },
      m.shadowColor,
      effectScale * 0.05,
      [
        ["multiply", m.shadow * 0.75],
        ["color", m.shadow * 0.3],
      ],
      (c) => {
        c.fill(polyPath(pick(lm, IDX.eyeL)));
        c.fill(polyPath(pick(lm, IDX.eyeR)));
      },
    );
  }

  // ---- brows ----
  if (m.brow > 0) {
    paint(
      ctx,
      box,
      (c) => {
        c.globalAlpha = sideOpacity(-1);
        c.fill(polyPath(catmull(pick(lm, IDX.browL), true, 4)));
        c.globalAlpha = sideOpacity(1);
        c.fill(polyPath(catmull(pick(lm, IDX.browR), true, 4)));
        c.globalAlpha = 1;
      },
      m.browColor,
      effectScale * 0.012,
      [
        ["multiply", m.brow * 0.55],
        ["source-over", m.brow * 0.12],
      ],
    );
    // fine brow hairs
    const rnd = seeded(99);
    ctx.save();
    ctx.strokeStyle = m.browColor;
    ctx.lineCap = "round";
    ctx.lineWidth = Math.max(0.6, s / 320);
    ctx.globalAlpha = 0.35 * m.brow;
    for (const [up, lo] of [
      [IDX.browLUpper, IDX.browLLower],
      [IDX.browRUpper, IDX.browRLower],
    ]) {
      const U = pick(lm, up),
        Lw = pick(lm, lo);
      // up: outer->inner? ensure inner first
      const innerU = U[U.length - 1],
        outerU = U[0];
      const innerL = Lw[Lw.length - 1],
        outerL = Lw[0];
      const p = new Path2D();
      for (let k = 0; k < 70; k++) {
        const t = rnd();
        const a = lerpP(innerU, outerU, t),
          b = lerpP(innerL, outerL, t);
        const pt = lerpP(b, a, rnd());
        const dirOut = { x: outerU.x - innerU.x, y: outerU.y - innerU.y };
        const l = Math.hypot(dirOut.x, dirOut.y) || 1;
        const up2 = { x: -fr.uy.x, y: -fr.uy.y };
        const k2 = t < 0.25 ? 0.8 : 0.25;
        const d = { x: (dirOut.x / l) * (1 - k2) + up2.x * k2, y: (dirOut.y / l) * (1 - k2) + up2.y * k2 };
        const len = s * (0.03 + rnd() * 0.03);
        p.moveTo(pt.x, pt.y);
        p.lineTo(pt.x + d.x * len, pt.y + d.y * len);
      }
      ctx.stroke(p);
    }
    ctx.restore();
  }

  // ---- eyeliner & lashes ----
  if (m.liner > 0 || m.lashes > 0) {
    for (const [lidIdx, side] of [
      [IDX.eyeLUpper, -1],
      [IDX.eyeRUpper, 1],
    ] as const) {
      const L = pick(lm, lidIdx); // outer -> inner
      const inner = L[L.length - 1],
        outer = L[0];
      const eyeW = dist(inner, outer);
      const outDir = { x: (outer.x - inner.x) / eyeW, y: (outer.y - inner.y) / eyeW };
      const upDir = { x: -fr.uy.x, y: -fr.uy.y };
      const pts = catmull(L.slice().reverse(), false, 4); // inner -> outer
      if (m.liner > 0) {
        const thick = eyeW * 0.075 * (0.5 + m.liner * 0.7);
        const topEdge: P[] = [],
          botEdge: P[] = [];
        pts.forEach((p, i) => {
          const t = i / (pts.length - 1);
          const w = thick * (0.25 + 0.75 * t * t);
          topEdge.push({ x: p.x + upDir.x * w, y: p.y + upDir.y * w });
          botEdge.push({ x: p.x + upDir.x * thick * 0.08, y: p.y + upDir.y * thick * 0.08 });
        });
        const wingLen = eyeW * 0.38 * m.wing;
        const tip = {
          x: outer.x + outDir.x * wingLen * 0.85 + upDir.x * wingLen * 0.55,
          y: outer.y + outDir.y * wingLen * 0.85 + upDir.y * wingLen * 0.55,
        };
        const poly = [...botEdge, tip, ...topEdge.reverse()];
        paint(ctx, box, (c) => {
          c.globalAlpha = sideOpacity(side);
          c.fill(polyPath(poly));
          c.globalAlpha = 1;
        }, m.linerColor, Math.max(1, effectScale * 0.004), [
          ["multiply", 0.85 * m.liner + 0.15],
          ["source-over", 0.6 * m.liner],
        ]);
      }
      if (m.lashes > 0) {
        const rnd = seeded(lidIdx[0]);
        ctx.save();
        ctx.strokeStyle = "#0d0b0a";
        ctx.lineCap = "round";
        const p = new Path2D();
        const n = 34;
        for (let k = 0; k < n; k++) {
          const t = 0.08 + (k / (n - 1)) * 0.9 + (rnd() - 0.5) * 0.02;
          const fi = t * (pts.length - 1);
          const i0 = Math.floor(fi),
            i1 = Math.min(pts.length - 1, i0 + 1);
          const base = lerpP(pts[i0], pts[i1], fi - i0);
          const len = eyeW * (0.12 + 0.16 * t) * (0.6 + 0.6 * m.lashes) * (0.8 + rnd() * 0.4);
          const d = { x: upDir.x * 0.75 + outDir.x * (0.15 + 0.6 * t), y: upDir.y * 0.75 + outDir.y * (0.15 + 0.6 * t) };
          const dl = Math.hypot(d.x, d.y);
          const e = { x: base.x + (d.x / dl) * len, y: base.y + (d.y / dl) * len };
          const cp = { x: base.x + upDir.x * len * 0.75, y: base.y + upDir.y * len * 0.75 };
          p.moveTo(base.x, base.y);
          p.quadraticCurveTo(cp.x, cp.y, e.x, e.y);
        }
        ctx.lineWidth = Math.max(0.7, eyeW * 0.012);
        ctx.globalAlpha = 0.75 * m.lashes * sideOpacity(side);
        ctx.stroke(p);
        // lash line density
        ctx.lineWidth = eyeW * 0.03 * m.lashes;
        ctx.globalAlpha = 0.5 * m.lashes * sideOpacity(side);
        ctx.stroke(polyPath(pts, false));
        ctx.restore();
      }
    }
  }

  // ---- lips ----
  if (m.lip > 0) {
    const outer = catmull(pick(lm, IDX.lipsOuter), true, 4);
    const inner = catmull(pick(lm, IDX.lipsInner), true, 4);
    const lipDraw = (c: CanvasRenderingContext2D) => {
      const p = new Path2D();
      p.addPath(polyPath(outer));
      p.addPath(polyPath(inner));
      c.fill(p, "evenodd");
    };
    const a = m.lip;
    const finish = m.lipFinish;
    paint(ctx, box, lipDraw, m.lipColor, Math.max(1.2, effectScale * 0.009), [
      ["multiply", a * (finish === "matte" ? 0.75 : 0.6)],
      ["color", a * 0.55],
      ["soft-light", a * 0.3],
    ]);
    if (finish !== "matte") {
      const lowerC = lerpP(lm[14], lm[17], 0.45);
      const upperC = lerpP(lm[0], lm[13], 0.5);
      const lw = dist(lm[61], lm[291]);
      paint(
        ctx,
        box,
        (c) => {
          ellipse(c, { x: lowerC.x - fr.ux.x * lw * 0.08, y: lowerC.y - fr.ux.y * lw * 0.08 }, lw * 0.16, lw * 0.045, rot);
          ellipse(c, { x: upperC.x + fr.ux.x * lw * 0.17, y: upperC.y + fr.ux.y * lw * 0.17 }, lw * 0.07, lw * 0.025, rot - 0.2);
          ellipse(c, { x: upperC.x - fr.ux.x * lw * 0.17, y: upperC.y - fr.ux.y * lw * 0.17 }, lw * 0.07, lw * 0.025, rot + 0.2);
        },
        "#ffffff",
        lw * (finish === "gloss" ? 0.03 : 0.05),
        [["screen", finish === "gloss" ? 0.55 * a : 0.22 * a]],
        (c) => c.fill(polyPath(inner)),
      );
    } else {
      // matte: velvet finish – mute natural lip shine with a flat color pass
      paint(ctx, box, lipDraw, m.lipColor, Math.max(1, effectScale * 0.006), [["darken", a * 0.25]]);
    }
  }
  void mid;
  void centroid;
}
