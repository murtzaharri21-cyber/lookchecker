import { IDX, catmull, clamp, polyPath, seeded, smooth, type Frame } from "./geom";
import { hexToRgb, makeCanvas, shade } from "./imageOps";
import type { FaceData, P } from "./vision";

const photoPixels = new WeakMap<HTMLCanvasElement, Uint8ClampedArray>();
const sourceHairLightCache = new WeakMap<Float32Array, number>();

function getPhotoPixels(photo: HTMLCanvasElement) {
  let pixels = photoPixels.get(photo);
  if (pixels) return pixels;
  try {
    pixels = photo.getContext("2d", { willReadFrequently: true })!.getImageData(0, 0, photo.width, photo.height).data;
    photoPixels.set(photo, pixels);
    return pixels;
  } catch {
    return null;
  }
}

type Flow = (U: number, V: number) => [number, number];
export type Texture = "straight" | "wavy" | "curly" | "coily" | "buzz";

export interface HairStyle {
  id: string;
  name: string;
  category: "women" | "men";
  length: "Short" | "Medium" | "Long";
  tags: string[];
  outline: [number, number][]; // right half (U>=0), normalized face coords
  asymL?: number;
  hairline: number; // negative raises hairline
  faceInset: number;
  bangs?: [number, number][];
  bangsFlow?: Flow;
  flow: Flow;
  texture: Texture;
  strandLen: number; // in half-face-width units
  density: number;
  wave?: { amp: number; freq: number; start: number };
  curl?: number;
  messy?: number;
  fade?: [number, number, number]; // V start, V end, min alpha
  sheen: number;
  bun?: { U: number; V: number; rx: number; ry: number };
  baseAlpha?: number;
}

/* ---------- flow fields (return isotropic direction in face frame) ---------- */
const partFlow =
  (o: { part?: number; cV?: number; flare?: number; inward?: number; endV?: number } = {}): Flow =>
  (U, V) => {
    const part = o.part ?? 0,
      cV = o.cV ?? 0.3,
      flare = o.flare ?? 0.1;
    const x = (U - part) * 0.38,
      y = V - cV;
    let tx: number, ty: number;
    if (x >= 0) {
      tx = -y;
      ty = x;
    } else {
      tx = y;
      ty = -x;
    }
    const l = Math.hypot(tx, ty) || 1;
    tx /= l;
    ty /= l;
    const side = U >= part ? 1 : -1;
    const t = smooth(cV - 0.12, cV + 0.18, V);
    let hx = side * flare;
    if (o.inward && o.endV) hx -= side * o.inward * smooth(o.endV - 0.22, o.endV, V);
    return [tx * (1 - t) + hx * t, ty * (1 - t) + 1 * t];
  };

const backFlow =
  (spread = 0.3, side = 0.55): Flow =>
  (U) => {
    const s = Math.abs(U);
    const k = smooth(0.6, 0.95, s);
    return [U * spread * (1 - k) + Math.sign(U) * side * k, -1];
  };

const crownFlow =
  (cU = 0, cV = -0.32): Flow =>
  (U, V) => [(U - cU) * 0.38, V - cV];

const sweepFlow =
  (dx: number, dy: number): Flow =>
  () => [dx, dy];

const curtainFlow: Flow = (U) => [Math.sign(U || 1) * 0.75, 1];

/* ---------- bangs shapes ---------- */
const BANGS_FULL: [number, number][] = [
  [-0.95, 0.02], [-0.97, 0.28], [-0.7, 0.26], [-0.35, 0.25], [0, 0.255], [0.35, 0.25], [0.7, 0.26], [0.97, 0.28], [0.95, 0.02], [0.55, -0.14], [0, -0.17], [-0.55, -0.14],
];
const BANGS_CURTAIN: [number, number][] = [
  [0, -0.08], [0.12, 0.08], [0.35, 0.26], [0.7, 0.44], [0.99, 0.52], [1.02, 0.2], [0.85, -0.05], [0.45, -0.14], [0, -0.16],
  [-0.45, -0.14], [-0.85, -0.05], [-1.02, 0.2], [-0.99, 0.52], [-0.7, 0.44], [-0.35, 0.26], [-0.12, 0.08],
];
const BANGS_SWEEP: [number, number][] = [
  [0.55, -0.16], [0.35, 0.0], [0.05, 0.1], [-0.35, 0.2], [-0.75, 0.3], [-0.98, 0.32], [-1.0, 0.05], [-0.7, -0.12], [-0.1, -0.2],
];
const BANGS_CROP: [number, number][] = [
  [-0.8, 0.01], [-0.65, 0.055], [-0.52, 0.038], [-0.34, 0.082], [-0.18, 0.06], [0.0, 0.092], [0.16, 0.063], [0.34, 0.086], [0.51, 0.045], [0.66, 0.055], [0.8, 0.01], [0.45, -0.13], [0, -0.16], [-0.45, -0.13],
];

const CAP_SHORT = (top: number, side = 1.08): [number, number][] => [
  [0, top], [0.42, top + 0.012], [0.8, top + 0.085], [1.03, -0.07], [side, 0.12], [side - 0.02, 0.29], [1.01, 0.37], [0.975, 0.5], [0.92, 0.49],
];

export const HAIRSTYLES: HairStyle[] = [
  {
    id: "long-straight", name: "Long Sleek Straight", category: "women", length: "Long", tags: ["Oval", "Round", "Heart", "Diamond"],
    outline: [[0, -0.3], [0.42, -0.285], [0.8, -0.2], [1.06, -0.04], [1.17, 0.18], [1.2, 0.45], [1.21, 0.75], [1.24, 1.05], [1.3, 1.35], [1.34, 1.6], [1.18, 1.7], [0.92, 1.66], [0.72, 1.38], [0.62, 1.1], [0.54, 0.92]],
    hairline: -0.02, faceInset: 0.95, flow: partFlow({ part: 0, flare: 0.05 }), texture: "straight", strandLen: 1.6, density: 1, sheen: 1,
  },
  {
    id: "long-waves", name: "Soft Beach Waves", category: "women", length: "Long", tags: ["Oval", "Square", "Oblong", "Diamond"],
    outline: [[0, -0.31], [0.45, -0.295], [0.85, -0.2], [1.12, -0.03], [1.26, 0.2], [1.32, 0.5], [1.38, 0.8], [1.44, 1.1], [1.48, 1.38], [1.42, 1.6], [1.2, 1.68], [0.95, 1.62], [0.74, 1.38], [0.63, 1.1], [0.54, 0.92]],
    asymL: 1.04, hairline: -0.02, faceInset: 0.93, flow: partFlow({ part: 0.2, flare: 0.16 }), texture: "wavy", strandLen: 1.5, density: 1.05,
    wave: { amp: 0.036, freq: 2.6, start: 0.32 }, sheen: 0.85,
  },
  {
    id: "curtain-bangs", name: "Curtain Bangs Layers", category: "women", length: "Long", tags: ["Oblong", "Heart", "Square", "Oval"],
    outline: [[0, -0.3], [0.42, -0.288], [0.82, -0.2], [1.08, -0.03], [1.2, 0.2], [1.24, 0.5], [1.26, 0.8], [1.3, 1.1], [1.33, 1.35], [1.2, 1.45], [0.95, 1.42], [0.74, 1.25], [0.62, 1.05], [0.54, 0.92]],
    hairline: -0.02, faceInset: 0.93, bangs: BANGS_CURTAIN, bangsFlow: curtainFlow, flow: partFlow({ part: 0, flare: 0.12 }), texture: "straight",
    strandLen: 1.3, density: 1.05, wave: { amp: 0.025, freq: 3, start: 0.5 }, sheen: 0.9,
  },
  {
    id: "bob", name: "Classic Chin Bob", category: "women", length: "Short", tags: ["Oval", "Oblong", "Heart", "Diamond"],
    outline: [[0, -0.305], [0.45, -0.29], [0.85, -0.2], [1.1, -0.03], [1.21, 0.2], [1.24, 0.5], [1.22, 0.78], [1.14, 0.96], [0.97, 1.03], [0.8, 1.0], [0.68, 0.92]],
    asymL: 1.03, hairline: -0.02, faceInset: 0.94, flow: partFlow({ part: 0.18, flare: 0.06, inward: 0.7, endV: 1.0 }), texture: "straight", strandLen: 1.1, density: 1.1, sheen: 1,
  },
  {
    id: "french-bob", name: "French Bob + Bangs", category: "women", length: "Short", tags: ["Oval", "Oblong", "Heart"],
    outline: [[0, -0.31], [0.45, -0.295], [0.86, -0.2], [1.12, -0.03], [1.23, 0.2], [1.26, 0.48], [1.22, 0.72], [1.12, 0.86], [0.95, 0.9], [0.8, 0.86], [0.7, 0.8]],
    hairline: -0.02, faceInset: 0.93, bangs: BANGS_FULL, bangsFlow: sweepFlow(0.04, 1), flow: partFlow({ part: 0, flare: 0.1, inward: 0.6, endV: 0.88 }),
    texture: "wavy", wave: { amp: 0.02, freq: 4, start: 0.4 }, strandLen: 1.0, density: 1.1, sheen: 0.85,
  },
  {
    id: "lob-waves", name: "Wavy Lob", category: "women", length: "Medium", tags: ["Round", "Square", "Oval", "Heart"],
    outline: [[0, -0.31], [0.45, -0.296], [0.86, -0.2], [1.13, -0.02], [1.26, 0.22], [1.32, 0.5], [1.36, 0.8], [1.36, 1.05], [1.22, 1.2], [0.98, 1.2], [0.76, 1.08], [0.6, 0.92]],
    asymL: 1.05, hairline: -0.02, faceInset: 0.93, flow: partFlow({ part: -0.22, flare: 0.18 }), texture: "wavy", wave: { amp: 0.045, freq: 3.2, start: 0.28 },
    strandLen: 1.2, density: 1.05, sheen: 0.8,
  },
  {
    id: "pixie", name: "Side-Swept Pixie", category: "women", length: "Short", tags: ["Oval", "Heart", "Diamond"],
    outline: CAP_SHORT(-0.315, 1.1), hairline: -0.02, faceInset: 0.95, bangs: BANGS_SWEEP, bangsFlow: sweepFlow(-1, 0.42), flow: partFlow({ part: 0.45, cV: 0.2 }),
    texture: "straight", strandLen: 0.5, density: 1.3, messy: 0.25, fade: [0.25, 0.5, 0.7], sheen: 0.8,
  },
  {
    id: "curly-shoulder", name: "Voluminous Curls", category: "women", length: "Medium", tags: ["Oblong", "Diamond", "Oval", "Heart"],
    outline: [[0, -0.37], [0.5, -0.35], [0.95, -0.23], [1.28, 0.0], [1.46, 0.3], [1.56, 0.65], [1.6, 1.0], [1.55, 1.25], [1.3, 1.36], [1.0, 1.3], [0.76, 1.1], [0.58, 0.92]],
    hairline: -0.03, faceInset: 0.93, flow: partFlow({ part: 0.12, flare: 0.25 }), texture: "curly", curl: 0.05, strandLen: 0.5, density: 1, sheen: 0.5,
  },
  {
    id: "afro", name: "Natural Afro", category: "women", length: "Medium", tags: ["Oblong", "Oval", "Diamond"],
    outline: [[0, -0.5], [0.62, -0.47], [1.12, -0.33], [1.5, -0.08], [1.7, 0.25], [1.7, 0.55], [1.56, 0.82], [1.3, 0.98], [1.02, 1.0], [0.78, 0.9], [0.62, 0.82]],
    hairline: -0.03, faceInset: 0.95, flow: crownFlow(0, 0.2), texture: "coily", curl: 0.022, strandLen: 0.3, density: 1, sheen: 0.35,
  },
  {
    id: "sleek-bun", name: "Sleek Top Bun", category: "women", length: "Long", tags: ["Oval", "Heart", "Diamond", "Oblong"],
    outline: [[0, -0.255], [0.4, -0.246], [0.78, -0.19], [1.02, -0.08], [1.09, 0.08], [1.09, 0.25], [1.04, 0.36], [0.98, 0.42], [0.94, 0.4]],
    hairline: -0.02, faceInset: 0.95, flow: backFlow(0.25, 0.4), texture: "straight", strandLen: 0.8, density: 1.1, sheen: 1,
    bun: { U: 0, V: -0.36, rx: 0.42, ry: 0.13 },
  },
  {
    id: "buzz", name: "Buzz Cut", category: "men", length: "Short", tags: ["Oval", "Square", "Diamond"],
    outline: CAP_SHORT(-0.252, 1.07), hairline: -0.01, faceInset: 0.95, flow: crownFlow(), texture: "buzz", strandLen: 0.05, density: 1, sheen: 0.2, baseAlpha: 0.62,
  },
  {
    id: "textured-crop", name: "Textured French Crop", category: "men", length: "Short", tags: ["Oval", "Square", "Oblong", "Diamond"],
    outline: CAP_SHORT(-0.295, 1.09), hairline: -0.01, faceInset: 0.95, bangs: BANGS_CROP, bangsFlow: sweepFlow(0.05, 1), flow: crownFlow(0, -0.36),
    texture: "straight", strandLen: 0.36, density: 1.35, messy: 0.5, fade: [0.05, 0.42, 0.62], sheen: 0.5,
  },
  {
    id: "side-part", name: "Classic Side Part", category: "men", length: "Short", tags: ["Oval", "Round", "Square", "Oblong"],
    outline: CAP_SHORT(-0.315, 1.1), asymL: 1.03, hairline: -0.015, faceInset: 0.95, flow: partFlow({ part: -0.45, cV: 0.2, flare: 0.1 }),
    texture: "straight", strandLen: 0.65, density: 1.25, messy: 0.08, fade: [0.12, 0.45, 0.65], sheen: 0.85,
  },
  {
    id: "pompadour", name: "Modern Pompadour", category: "men", length: "Short", tags: ["Round", "Oval", "Square", "Heart"],
    outline: [[0, -0.44], [0.3, -0.44], [0.62, -0.36], [0.92, -0.18], [1.06, 0.0], [1.08, 0.2], [1.03, 0.36], [0.98, 0.5], [0.93, 0.49]],
    hairline: -0.015, faceInset: 0.95, flow: backFlow(0.22, 0.6), texture: "straight", strandLen: 0.75, density: 1.3, messy: 0.06, fade: [0.02, 0.4, 0.62], sheen: 1,
  },
  {
    id: "quiff", name: "Textured Quiff", category: "men", length: "Short", tags: ["Round", "Oval", "Square", "Diamond"],
    outline: [[0, -0.4], [0.35, -0.395], [0.7, -0.31], [0.97, -0.15], [1.08, 0.03], [1.07, 0.25], [1.02, 0.37], [0.97, 0.5], [0.92, 0.49]],
    hairline: -0.015, faceInset: 0.95, flow: backFlow(0.45, 0.6), texture: "straight", strandLen: 0.55, density: 1.35, messy: 0.45, fade: [0.0, 0.38, 0.6], sheen: 0.6,
  },
  {
    id: "slick-back", name: "Slicked Back", category: "men", length: "Short", tags: ["Oval", "Square", "Diamond", "Heart"],
    outline: CAP_SHORT(-0.3, 1.1), hairline: -0.015, faceInset: 0.95, flow: backFlow(0.18, 0.5), texture: "straight", strandLen: 0.8, density: 1.25, sheen: 1.1,
    fade: [0.15, 0.45, 0.68],
  },
  {
    id: "man-bun", name: "Man Bun", category: "men", length: "Long", tags: ["Oval", "Square", "Diamond", "Oblong"],
    outline: CAP_SHORT(-0.285, 1.1), hairline: -0.015, faceInset: 0.95, flow: backFlow(0.25, 0.45), texture: "straight", strandLen: 0.8, density: 1.15, sheen: 0.9,
    messy: 0.08, bun: { U: 0, V: -0.34, rx: 0.32, ry: 0.12 },
  },
  {
    id: "medium-flow", name: "Medium Flow", category: "men", length: "Medium", tags: ["Oval", "Square", "Oblong", "Diamond"],
    outline: [[0, -0.315], [0.45, -0.302], [0.86, -0.21], [1.1, -0.05], [1.2, 0.18], [1.25, 0.45], [1.27, 0.72], [1.28, 0.93], [1.15, 1.03], [0.92, 1.0], [0.76, 0.9], [0.7, 0.84]],
    asymL: 1.04, hairline: -0.015, faceInset: 0.95, flow: partFlow({ part: 0.28, flare: 0.22 }), texture: "wavy", wave: { amp: 0.03, freq: 3.6, start: 0.3 },
    strandLen: 1.0, density: 1.1, messy: 0.12, sheen: 0.75,
  },
  {
    id: "curly-top", name: "Curly Top Fade", category: "men", length: "Short", tags: ["Oval", "Oblong", "Diamond", "Round"],
    outline: [[0, -0.39], [0.45, -0.38], [0.82, -0.28], [1.05, -0.1], [1.1, 0.1], [1.07, 0.3], [1.01, 0.38], [0.97, 0.5], [0.92, 0.49]],
    hairline: -0.015, faceInset: 0.95, flow: crownFlow(0, -0.2), texture: "curly", curl: 0.03, strandLen: 0.3, density: 1.15, fade: [-0.02, 0.33, 0.6], sheen: 0.4,
  },
  {
    id: "long-layered", name: "Long Face-Framing Layers", category: "women", length: "Long", tags: ["Round", "Square", "Heart", "Oval"],
    outline: [[0, -0.32], [0.45, -0.3], [0.85, -0.2], [1.13, -0.02], [1.28, 0.24], [1.3, 0.55], [1.34, 0.92], [1.36, 1.32], [1.22, 1.56], [1.02, 1.38], [0.82, 1.08], [0.62, 0.83]],
    asymL: 1.04, hairline: -0.025, faceInset: 0.93, flow: partFlow({ part: 0.14, flare: 0.12 }), texture: "wavy", wave: { amp: 0.025, freq: 3.4, start: 0.38 },
    strandLen: 1.45, density: 1.08, sheen: 0.78,
  },
  {
    id: "shag-bob", name: "Textured Shag Bob", category: "women", length: "Medium", tags: ["Oval", "Heart", "Square", "Diamond"],
    outline: [[0, -0.34], [0.46, -0.32], [0.86, -0.22], [1.14, -0.02], [1.28, 0.24], [1.3, 0.58], [1.33, 0.9], [1.23, 1.16], [1.04, 1.12], [0.84, 0.94], [0.64, 0.82]],
    hairline: -0.025, faceInset: 0.93, bangs: BANGS_CURTAIN, bangsFlow: curtainFlow, flow: partFlow({ part: -0.18, flare: 0.14 }),
    texture: "wavy", wave: { amp: 0.04, freq: 4, start: 0.28 }, strandLen: 1.05, density: 1.2, messy: 0.2, sheen: 0.72,
  },
  {
    id: "high-ponytail", name: "High Ponytail", category: "women", length: "Long", tags: ["Oval", "Round", "Square", "Heart"],
    outline: [[0, -0.29], [0.4, -0.28], [0.78, -0.2], [1.03, -0.06], [1.1, 0.13], [1.08, 0.32], [1.02, 0.42], [0.94, 0.4]],
    hairline: -0.02, faceInset: 0.95, flow: backFlow(0.26, 0.43), texture: "wavy", wave: { amp: 0.045, freq: 3, start: 0.25 },
    strandLen: 1.45, density: 1.08, sheen: 0.8, bun: { U: 0.7, V: -0.13, rx: 0.2, ry: 0.13 },
  },
  {
    id: "low-taper", name: "Low Taper Fade", category: "men", length: "Short", tags: ["Oval", "Round", "Square", "Diamond"],
    outline: CAP_SHORT(-0.31, 1.09), hairline: -0.015, faceInset: 0.95, flow: partFlow({ part: 0.16, cV: 0.08, flare: 0.08 }),
    texture: "straight", strandLen: 0.42, density: 1.22, fade: [0.08, 0.48, 0.58], sheen: 0.65,
  },
  {
    id: "curly-fringe", name: "Curly Fringe", category: "men", length: "Short", tags: ["Oblong", "Oval", "Diamond", "Heart"],
    outline: [[0, -0.38], [0.42, -0.37], [0.8, -0.28], [1.04, -0.1], [1.1, 0.12], [1.08, 0.34], [1.02, 0.43], [0.96, 0.5], [0.9, 0.47]],
    hairline: -0.01, faceInset: 0.95, bangs: BANGS_CROP, bangsFlow: curtainFlow, flow: crownFlow(0, -0.22),
    texture: "curly", curl: 0.035, strandLen: 0.34, density: 1.25, messy: 0.18, fade: [0.02, 0.4, 0.6], sheen: 0.42,
  },
  {
    id: "medium-slick-back", name: "Medium Slick Back", category: "men", length: "Medium", tags: ["Oval", "Square", "Heart", "Diamond"],
    outline: [[0, -0.37], [0.42, -0.35], [0.8, -0.27], [1.08, -0.08], [1.2, 0.16], [1.22, 0.48], [1.2, 0.8], [1.15, 1.02], [0.96, 1.0], [0.76, 0.86]],
    asymL: 1.03, hairline: -0.018, faceInset: 0.94, flow: backFlow(0.24, 0.48), texture: "wavy", wave: { amp: 0.018, freq: 3, start: 0.4 },
    strandLen: 0.95, density: 1.15, sheen: 0.9,
  },
];

export const HAIR_COLORS = [
  { name: "Jet Black", hex: "#14110f" },
  { name: "Soft Black", hex: "#2a211c" },
  { name: "Dark Brown", hex: "#3d2a1f" },
  { name: "Chocolate", hex: "#5a3a26" },
  { name: "Chestnut", hex: "#7b4a2b" },
  { name: "Caramel", hex: "#a06b3c" },
  { name: "Honey Blonde", hex: "#c39457" },
  { name: "Golden Blonde", hex: "#d8b475" },
  { name: "Platinum", hex: "#e6dccb" },
  { name: "Ash Blonde", hex: "#b7a68c" },
  { name: "Copper Red", hex: "#a2471f" },
  { name: "Auburn", hex: "#6f2a1a" },
  { name: "Burgundy", hex: "#5b1a2a" },
  { name: "Silver Grey", hex: "#a9a9ad" },
  { name: "Rose Gold", hex: "#c98a83" },
  { name: "Pastel Pink", hex: "#e3a3b8" },
  { name: "Lavender", hex: "#a493c9" },
  { name: "Ocean Blue", hex: "#355c8c" },
];

export interface HairFit {
  size: number;
  offsetY: number;
  width: number;
}
export interface HairOpts {
  color: string;
  fit: HairFit;
  quality: number;
  photo?: HTMLCanvasElement;
  maskScale?: number;
  lineBoost?: number;
  seed?: number;
}

function hash2(x: number, y: number) {
  const h = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return h - Math.floor(h);
}
/** smooth value noise 0..1 */
function vnoise(x: number, y: number) {
  const xi = Math.floor(x),
    yi = Math.floor(y);
  const xf = x - xi,
    yf = y - yi;
  const u = xf * xf * (3 - 2 * xf),
    v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi),
    b = hash2(xi + 1, yi),
    c = hash2(xi, yi + 1),
    d = hash2(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function inEllipse(U: number, V: number, b: { U: number; V: number; rx: number; ry: number }) {
  return ((U - b.U) / b.rx) ** 2 + ((V - b.V) / b.ry) ** 2 <= 1;
}

/** Face cut-out polygon in image coords (where face skin is visible) */
export function faceCutPoints(face: FaceData, fr: Frame, hairline: number, inset: number): P[] {
  return IDX.faceOval.map((i) => {
    const L = fr.toLocal(face.lm[i]);
    let U = L.U,
      V = L.V;
    if (V < 0.45) V += hairline * (1 - smooth(-0.05, 0.45, V));
    const k = inset + (1 - inset) * smooth(0.7, 0.95, V);
    U *= k;
    return fr.toImg(U, V);
  });
}

export function renderHair(ctx: CanvasRenderingContext2D, face: FaceData, fr: Frame, st: HairStyle, o: HairOpts) {
  const W = face.width,
    Hh = face.height;
  const s = fr.s;
  const isMen = st.category === "men";
  const yawStrength = smooth(0.12, 1.0, Math.abs(fr.pose.yaw));
  const farSide = Math.sign(fr.pose.yaw);
  const poseUStart = 0.9;
  const poseUScale = (U: number) => (Math.sign(U) === farSide ? 1 - 0.38 * yawStrength : 1 + 0.08 * yawStrength);
  const projectPoseU = (U: number) => {
    const side = Math.sign(U);
    const magnitude = Math.abs(U);
    if (magnitude <= poseUStart || !farSide) return U;
    return side * (poseUStart + (magnitude - poseUStart) * poseUScale(U));
  };
  const unprojectPoseU = (U: number) => {
    const side = Math.sign(U);
    const magnitude = Math.abs(U);
    if (magnitude <= poseUStart || !farSide) return U;
    return side * (poseUStart + (magnitude - poseUStart) / poseUScale(U));
  };
  const fit = o.fit;
  const fitWidth = fit.width * fr.hairWidthScale;
  const rnd = seeded((o.seed ?? 7) * 7919 + st.id.length * 131);
  const SK = st.category === "women" ? 0.24 : 0.05;
  const toStyle = (U: number, V: number) => {
    let v = (V - fit.offsetY - 0.3) / fit.size + 0.3;
    if (v < 0.3) v = 0.3 + (v - 0.3) / (1 + SK);
    return { U: unprojectPoseU(U) / (fitWidth * fit.size), V: v };
  };
  const fromStyle = (U: number, V: number) => {
    const v = V < 0.3 ? V + (V - 0.3) * SK : V;
    return fr.toImg(projectPoseU(U * fitWidth * fit.size), (v - 0.3) * fit.size + 0.3 + fit.offsetY);
  };

  // ---------- geometry ----------
  const R = st.outline;
  const asym = st.asymL ?? 1;
  const full: [number, number][] = [...R, ...R.slice(1).reverse().map(([u, v]) => [-u * asym, v] as [number, number])];
  const outlinePts = catmull(full.map(([u, v]) => fromStyle(u, v)), true, 10);
  const outlinePath = polyPath(outlinePts);
  const faceCut = faceCutPoints(face, fr, st.hairline + fit.offsetY * 0.3, st.faceInset);
  const facePath = polyPath(catmull(faceCut, true, 4));
  const fcC = fr.toImg(0, 0.55);
  const faceInner = polyPath(catmull(faceCut.map((p) => ({ x: fcC.x + (p.x - fcC.x) * 0.965, y: fcC.y + (p.y - fcC.y) * 0.975 })), true, 4));
  const bangsPath = st.bangs ? polyPath(catmull(st.bangs.map(([u, v]) => fromStyle(u, v)), true, 8)) : null;
  let bunPath: Path2D | null = null;
  if (st.bun) {
    const b = st.bun;
    const pts: P[] = [];
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 24) pts.push(fromStyle(b.U + Math.cos(a) * b.rx, b.V + Math.sin(a) * b.ry));
    bunPath = polyPath(pts);
  }

  // ---------- masks ----------
  const ms = o.maskScale ?? Math.min(1, 900 / Math.max(W, Hh));
  const mw = Math.max(2, Math.round(W * ms)),
    mh = Math.max(2, Math.round(Hh * ms));
  const mc = makeCanvas(mw, mh);
  const mx = mc.getContext("2d", { willReadFrequently: true })!;
  mx.setTransform(ms, 0, 0, ms, 0, 0);
  mx.fillStyle = "#fff";
  mx.fill(outlinePath);
  if (bunPath) mx.fill(bunPath);
  mx.globalCompositeOperation = "destination-out";
  mx.fill(faceInner);
  mx.globalCompositeOperation = "source-over";
  if (bangsPath) mx.fill(bangsPath);
  const md = mx.getImageData(0, 0, mw, mh).data;
  const M = new Float32Array(mw * mh);
  for (let i = 0; i < mw * mh; i++) M[i] = md[i * 4 + 3] / 255;
  let B: Float32Array | null = null;
  if (bangsPath) {
    const bc = makeCanvas(mw, mh);
    const bx = bc.getContext("2d", { willReadFrequently: true })!;
    bx.setTransform(ms, 0, 0, ms, 0, 0);
    bx.fill(bangsPath);
    const bd = bx.getImageData(0, 0, mw, mh).data;
    B = new Float32Array(mw * mh);
    for (let i = 0; i < mw * mh; i++) B[i] = bd[i * 4 + 3] / 255;
  }
  const mAt = (x: number, y: number) => {
    const mxp = (x * ms) | 0,
      myp = (y * ms) | 0;
    if (mxp < 0 || myp < 0 || mxp >= mw || myp >= mh) return 0;
    return M[myp * mw + mxp];
  };
  const bAt = (x: number, y: number) => {
    if (!B) return 0;
    const mxp = (x * ms) | 0,
      myp = (y * ms) | 0;
    if (mxp < 0 || myp < 0 || mxp >= mw || myp >= mh) return 0;
    return B[myp * mw + mxp];
  };

  // ---------- chamfer distance (depth from edge) ----------
  const D = new Float32Array(mw * mh);
  const INF = 1e9;
  for (let i = 0; i < mw * mh; i++) D[i] = M[i] > 0.5 ? INF : 0;
  for (let y = 0; y < mh; y++)
    for (let x = 0; x < mw; x++) {
      const i = y * mw + x;
      if (D[i] === 0) continue;
      let v = D[i];
      if (x > 0) v = Math.min(v, D[i - 1] + 1);
      if (y > 0) {
        v = Math.min(v, D[i - mw] + 1);
        if (x > 0) v = Math.min(v, D[i - mw - 1] + 1.414);
        if (x < mw - 1) v = Math.min(v, D[i - mw + 1] + 1.414);
      }
      D[i] = y === 0 || x === 0 || x === mw - 1 ? Math.min(v, 1) : v;
    }
  for (let y = mh - 1; y >= 0; y--)
    for (let x = mw - 1; x >= 0; x--) {
      const i = y * mw + x;
      if (D[i] === 0) continue;
      let v = D[i];
      if (x < mw - 1) v = Math.min(v, D[i + 1] + 1);
      if (y < mh - 1) {
        v = Math.min(v, D[i + mw] + 1);
        if (x < mw - 1) v = Math.min(v, D[i + mw + 1] + 1.414);
        if (x > 0) v = Math.min(v, D[i + mw - 1] + 1.414);
      }
      D[i] = v;
    }
  const dScale = 1 / (s * ms);
  const dAt = (x: number, y: number) => {
    const mxp = (x * ms) | 0,
      myp = (y * ms) | 0;
    if (mxp < 0 || myp < 0 || mxp >= mw || myp >= mh) return 0;
    return D[myp * mw + mxp] * dScale;
  };

  // ---------- lighting ----------
  const sheen = st.sheen;
  const light = (U: number, V: number, d: number) => {
    let L = 0.47 + 0.06 * smooth(0, 0.1, d);
    L += -0.045 * U;
    const top = 1 - smooth(-0.2, -0.02, V);
    // Men’s shorter cuts read better with a broad, low-contrast sheen than a bright rim.
    L += sheen * (isMen ? 0.17 : 0.24) * top * Math.exp(-((d - 0.15) ** 2) / (2 * (isMen ? 0.065 : 0.04) ** 2));
    L += sheen * (isMen ? 0.09 : 0.13) * smooth(0.25, 0.45, V) * Math.exp(-((V - 0.62) ** 2) / (2 * 0.06 ** 2)) * smooth(0.03, 0.14, d);
    L -= 0.08 * smooth(1.0, 1.6, V);
    if (yawStrength > 0) L -= 0.055 * yawStrength * smooth(-0.05, 0.9, U * Math.sign(fr.pose.yaw));
    return L;
  };
  const fadeAt = (U: number, V: number) => {
    if (!st.fade) return 1;
    const [f0, f1, fmin] = st.fade;
    return 1 - (1 - fmin) * smooth(f0, f1, V) * smooth(0.62, 0.97, Math.abs(U));
  };

  // palette
  // hue-preserving palette: shading scales the base color (never washes toward grey)
  const baseRgb = hexToRgb(o.color);
  const baseLum = (0.299 * baseRgb[0] + 0.587 * baseRgb[1] + 0.114 * baseRgb[2]) / 255;
  const spec = hexToRgb(shade(o.color, 0.55));
  const colorAt = (L: number) => {
    L = clamp(L);
    // factor 1.0 at L≈0.55; brighter hair needs less multiplicative headroom
    const head = 1.15 - baseLum * 0.6;
    const f = L <= 0.55 ? 0.3 + 0.7 * Math.pow(L / 0.55, 1.35) : 1 + head * 1.3 * ((L - 0.55) / 0.45);
    const sp = smooth(0.78, 1, L) * 0.35;
    return [0, 1, 2].map((k) => {
      const v = baseRgb[k] * f + 3 * f;
      return Math.min(255, v * (1 - sp) + spec[k] * sp);
    });
  };

  // Use the source hair's broad highlights as a weak lighting cue for new
  // strands. The selected color stays in control; the photo only adds texture.
  let sourcePixels: Uint8ClampedArray | null = null;
  let sourceHairLight = 0;
  if (o.photo && o.quality >= 0.75 && face.hairMask && o.photo.width === W && o.photo.height === Hh) {
    sourcePixels = getPhotoPixels(o.photo);
    if (sourcePixels) {
      const cachedLight = sourceHairLightCache.get(face.hairMask);
      if (cachedLight !== undefined) sourceHairLight = cachedLight;
      else {
        let total = 0,
          count = 0;
        for (let i = 0; i < face.hairMask.length; i += 8) {
          if (face.hairMask[i] < 0.65) continue;
          const p = i * 4;
          total += (0.299 * sourcePixels[p] + 0.587 * sourcePixels[p + 1] + 0.114 * sourcePixels[p + 2]) / 255;
          count++;
        }
        sourceHairLight = count ? total / count : 0;
        sourceHairLightCache.set(face.hairMask, sourceHairLight);
        if (!count) sourcePixels = null;
      }
    }
  }

  // ---------- base layer ----------
  const baseImg = mx.createImageData(mw, mh);
  const bd = baseImg.data;
  const baseAlpha = st.baseAlpha ?? 1;
  for (let y = 0; y < mh; y++)
    for (let x = 0; x < mw; x++) {
      const i = y * mw + x;
      const m = M[i];
      if (m <= 0) continue;
      const ix = (x + 0.5) / ms,
        iy = (y + 0.5) / ms;
      const L0 = fr.toLocal({ x: ix, y: iy });
      const S = toStyle(L0.U, L0.V);
      const d = D[i] * dScale;
      let L = light(S.U, S.V, d) * 0.85 - 0.03;
      if (sourcePixels && face.hairMask) {
        const sx = Math.min(W - 1, Math.floor(ix));
        const sy = Math.min(Hh - 1, Math.floor(iy));
        const si = sy * W + sx;
        if (face.hairMask[si] > 0.62) {
          const p = si * 4;
          const srcL = (0.299 * sourcePixels[p] + 0.587 * sourcePixels[p + 1] + 0.114 * sourcePixels[p + 2]) / 255;
          L += clamp((srcL - sourceHairLight) / 0.24, -0.4, 0.4) * 0.08;
        }
      }
      if (isMen && st.texture !== "buzz") {
        // Fine anisotropic grain gives the solid hair mass the same comb direction as its strands.
        const flow = st.flow(S.U, S.V);
        const fl = Math.hypot(flow[0], flow[1]) || 1;
        const along = (S.U * flow[0] + S.V * flow[1]) / fl;
        const across = (S.U * -flow[1] + S.V * flow[0]) / fl;
        const clumps = vnoise(across * 64, along * 25) - 0.5;
        const fibers = vnoise(across * 190, along * 52) - 0.5;
        L += clumps * 0.075 + fibers * 0.03;
      }
      const c = colorAt(L);
      bd[i * 4] = c[0];
      bd[i * 4 + 1] = c[1];
      bd[i * 4 + 2] = c[2];
      // soft, translucent edges – the strands themselves define the silhouette
      const edge = st.texture === "curly" || st.texture === "coily" ? 0.55 + 0.45 * smooth(0, 0.06, d) : smooth(0.004, 0.05, d) * 0.92 + 0.08 * smooth(0, 0.01, d);
      bd[i * 4 + 3] = 255 * m * baseAlpha * fadeAt(S.U, S.V) * edge;
    }
  const baseC = makeCanvas(mw, mh);
  baseC.getContext("2d")!.putImageData(baseImg, 0, 0);

  // ---------- cast shadow onto skin ----------
  {
    const sm = makeCanvas(Math.max(2, mw / 8), Math.max(2, mh / 8));
    const sx = sm.getContext("2d")!;
    sx.drawImage(mc, 0, 0, sm.width, sm.height);
    sx.globalCompositeOperation = "source-in";
    sx.fillStyle = "rgb(45,28,20)";
    sx.fillRect(0, 0, sm.width, sm.height);
    const tmp = makeCanvas(W, Hh);
    const tx = tmp.getContext("2d")!;
    tx.imageSmoothingQuality = "high";
    const off = fr.dirToImg(0.15, 1);
    tx.drawImage(sm, off.x * s * 0.05, off.y * s * 0.05, W, Hh);
    tx.globalCompositeOperation = "destination-out";
    tx.drawImage(mc, 0, 0, W, Hh);
    ctx.save();
    ctx.clip(facePath);
    ctx.globalCompositeOperation = "multiply";
    ctx.globalAlpha = st.texture === "buzz" ? 0.15 : 0.5 * Math.min(1, (st.baseAlpha ?? 1) + 0.2);
    ctx.drawImage(tmp, 0, 0);
    ctx.restore();
  }
  ctx.save();
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(baseC, 0, 0, W, Hh);
  ctx.restore();

  // ---------- strands ----------
  const px = Math.max(isMen ? 0.5 : 0.55, s / (isMen ? 300 : 270)) * (o.lineBoost ?? 1);
  const NB = 24;
  type Bucket = { path: Path2D; n: number };
  const mkBuckets = () => Array.from({ length: NB * 3 }, () => ({ path: new Path2D(), n: 0 }) as Bucket);
  const buckets = mkBuckets();
  const hiBuckets = mkBuckets();
  const widths = isMen ? [0.42, 0.68, 0.96] : [0.5, 0.8, 1.15];

  // area estimate
  let area = 0;
  for (let i = 0; i < mw * mh; i++) if (M[i] > 0.5) area++;
  const areaIso = area / (ms * ms * s * fr.sx);
  const q = clamp(o.quality, 0.1, 1.5);

  const flowAt = (x: number, y: number, U: number, V: number): P => {
    let f: [number, number];
    if (st.bun && inEllipse(U, V, st.bun)) {
      const dx = (U - st.bun.U) * 0.38,
        dy = V - st.bun.V;
      f = [-dy, dx];
    } else if (st.bangsFlow && bAt(x, y) > 0.5) f = st.bangsFlow(U, V);
    else f = st.flow(U, V);
    return fr.dirToImg(f[0], f[1]);
  };

  const step = s * (st.texture === "buzz" ? 0.012 : 0.024);
  const addPoly = (bk: Bucket[], idx: number, pts: P[]) => {
    if (pts.length < 2) return;
    const b = bk[idx];
    b.path.moveTo(pts[0].x, pts[0].y);
    for (let i = 1; i < pts.length; i++) b.path.lineTo(pts[i].x, pts[i].y);
    b.n++;
  };

  if (st.texture === "curly" || st.texture === "coily") {
    const coily = st.texture === "coily";
    const n = Math.round(areaIso * (coily ? 2300 : 1300) * st.density * q);
    for (let c = 0; c < n; c++) {
      let x = 0,
        y = 0,
        ok = false;
      for (let t = 0; t < 12 && !ok; t++) {
        x = rnd() * W;
        y = rnd() * Hh;
        ok = mAt(x, y) > 0.5;
      }
      if (!ok) continue;
      const L0 = fr.toLocal({ x, y });
      const S = toStyle(L0.U, L0.V);
      if (rnd() > fadeAt(S.U, S.V)) continue;
      const dir = flowAt(x, y, S.U, S.V);
      const perp = { x: -dir.y, y: dir.x };
      const r = (st.curl ?? 0.04) * s * (0.45 + rnd() * 1.0);
      const pitch = r * (0.7 + rnd() * 0.6);
      const turns = 0.8 + rnd() * (coily ? 1.6 : 2.2);
      const ph = rnd() * Math.PI * 2;
      const pts: P[] = [];
      for (let t = 0; t < turns * Math.PI * 2; t += 0.38) {
        const curlR = r * (1 + 0.13 * Math.sin(t * 0.73 + ph * 1.7) + 0.055 * Math.sin(t * 2.1 - ph));
        const p = {
          x: x + dir.x * (t / (Math.PI * 2)) * pitch + perp.x * curlR * Math.sin(t + ph) + dir.x * curlR * 0.55 * Math.cos(t + ph),
          y: y + dir.y * (t / (Math.PI * 2)) * pitch + perp.y * curlR * Math.sin(t + ph) + dir.y * curlR * 0.55 * Math.cos(t + ph),
        };
        if (mAt(p.x, p.y) < 0.08 && pts.length > 2) break;
        pts.push(p);
      }
      const d = dAt(x, y);
      const L = light(S.U, S.V, d) + (vnoise(x / (s * 0.13), y / (s * 0.13)) - 0.5) * 0.42 + (rnd() - 0.5) * 0.12 - 0.02;
      const li = Math.max(0, Math.min(NB - 1, Math.floor(clamp(L) * NB)));
      const wi = rnd() < 0.3 ? 2 : rnd() < 0.6 ? 1 : 0;
      addPoly(buckets, li * 3 + wi, pts);
    }
  } else {
    const isBuzz = st.texture === "buzz";
    const clumps = Math.round(areaIso * (isBuzz ? 2600 : isMen ? 590 : 470) * st.density * q);
    const perClump = isBuzz ? 1 : isMen ? 3 : 4;
    const maxSteps = Math.max(3, Math.round((st.strandLen * s) / step));
    const messy = st.messy ?? 0;
    for (let c = 0; c < clumps; c++) {
      let x = 0,
        y = 0,
        ok = false;
      for (let t = 0; t < 12 && !ok; t++) {
        x = rnd() * W;
        y = rnd() * Hh;
        ok = mAt(x, y) > 0.55;
      }
      if (!ok) continue;
      const L0 = fr.toLocal({ x, y });
      const S0 = toStyle(L0.U, L0.V);
      const fa = fadeAt(S0.U, S0.V);
      if (rnd() > fa * (isBuzz ? 1 : 1)) continue;
      // trace centerline
      const bend = (rnd() - 0.5) * (st.length === "Short" ? 0.32 : 0.18) + (rnd() - 0.5) * messy;
      const wob = rnd() * 6.28;
      const lenK = (0.5 + rnd() * 0.7) * (st.fade ? 0.5 + 0.5 * fa : 1);
      const steps = Math.max(2, Math.round(maxSteps * lenK));
      const line: P[] = [{ x, y }];
      const Vs: number[] = [S0.V];
      for (const sign of [1, -1]) {
        let cx = x,
          cy = y,
          pdx = 0,
          pdy = 0;
        const arr: P[] = [];
        const arrV: number[] = [];
        for (let k = 0; k < steps / 2; k++) {
          const Lk = fr.toLocal({ x: cx, y: cy });
          const Sk = toStyle(Lk.U, Lk.V);
          const f = flowAt(cx, cy, Sk.U, Sk.V);
          let dx = f.x,
            dy = f.y;
          const a = bend * sign + messy * 0.6 * Math.sin(k * 0.7 + wob);
          const ca = Math.cos(a),
            sa = Math.sin(a);
          const rx = dx * ca - dy * sa,
            ry = dx * sa + dy * ca;
          dx = rx;
          dy = ry;
          if (k === 0) {
            if (sign < 0) {
              dx = -dx;
              dy = -dy;
            }
          } else if (dx * pdx + dy * pdy < 0) {
            dx = -dx;
            dy = -dy;
          }
          pdx = dx;
          pdy = dy;
          cx += dx * step;
          cy += dy * step;
          const m = mAt(cx, cy);
          if (m < 0.1) {
            if (rnd() < 0.5) {
              arr.push({ x: cx - dx * step * 0.5, y: cy - dy * step * 0.5 });
              arrV.push(Sk.V);
            }
            break;
          }
          arr.push({ x: cx, y: cy });
          arrV.push(Sk.V);
        }
        if (sign > 0) {
          line.push(...arr);
          Vs.push(...arrV);
        } else {
          line.unshift(...arr.reverse());
          Vs.unshift(...arrV.reverse());
        }
      }
      if (line.length < 2) continue;
      const n = line.length;
      const normals: P[] = line.map((_, i) => {
        const a = line[Math.max(0, i - 1)],
          b = line[Math.min(n - 1, i + 1)];
        const dx = b.x - a.x,
          dy = b.y - a.y;
        const l = Math.hypot(dx, dy) || 1;
        return { x: -dy / l, y: dx / l };
      });
      const wave = st.wave;
      const mid = line[n >> 1];
      const Lm = fr.toLocal(mid);
      const Sm = toStyle(Lm.U, Lm.V);
      const dmid = dAt(mid.x, mid.y);
      const wph = Sm.U * 2.4 + (rnd() - 0.5) * 1.1;
      const clumpW = s * (isBuzz ? 0 : isMen ? 0.016 + rnd() * 0.014 : 0.028 + rnd() * 0.02);
      for (let k = 0; k < perClump; k++) {
        const off = (rnd() - 0.5) * clumpW;
        const jit = rnd() * 6.28;
        const pts: P[] = [];
        const hiPts: P[][] = [];
        let curHi: P[] | null = null;
        for (let i = 0; i < n; i++) {
          const t = i / (n - 1);
          let o2 = off * (1 - 0.55 * Math.abs(2 * t - 1)) + Math.sin(i * 0.9 + jit) * s * 0.0025;
          let wv = 0;
          if (wave) {
            const env = smooth(wave.start, wave.start + 0.25, Vs[i]);
            wv = wave.amp * s * Math.sin(Math.PI * 2 * wave.freq * Vs[i] + wph) * env;
            o2 += wv;
          }
          const p = { x: line[i].x + normals[i].x * o2, y: line[i].y + normals[i].y * o2 };
          pts.push(p);
          // highlight segments
          if (!isBuzz) {
            const Lp = fr.toLocal(line[i]);
            const Sp = toStyle(Lp.U, Lp.V);
            let hl = light(Sp.U, Sp.V, dAt(line[i].x, line[i].y));
            if (wave) {
              const env = smooth(wave.start, wave.start + 0.25, Vs[i]);
              hl += 0.12 * sheen * env * Math.cos(Math.PI * 2 * wave.freq * Vs[i] + wph);
            }
            if (hl > 0.62 + rnd() * 0.08) {
              if (!curHi) {
                curHi = [];
                hiPts.push(curHi);
              }
              curHi.push(p);
            } else curHi = null;
          }
        }
        const L = light(Sm.U, Sm.V, dmid) + (rnd() - 0.5) * 0.16 - (isBuzz ? 0.18 : 0);
        const li = Math.max(0, Math.min(NB - 1, Math.floor(clamp(L) * NB)));
        const wi = isBuzz ? 0 : rnd() < 0.2 ? 2 : rnd() < 0.55 ? 1 : 0;
        addPoly(buckets, li * 3 + wi, pts);
        for (const hp of hiPts) {
          if (hp.length < 2) continue;
          const Lh = fr.toLocal(hp[0]);
          const Sh = toStyle(Lh.U, Lh.V);
          const hv = light(Sh.U, Sh.V, dAt(hp[0].x, hp[0].y)) + 0.12 + rnd() * 0.15;
          const hi = Math.max(0, Math.min(NB - 1, Math.floor(clamp(hv) * NB)));
          addPoly(hiBuckets, hi * 3 + (rnd() < 0.5 ? 0 : 1), hp);
        }
      }
    }
    // flyaways
    if (!isBuzz) {
      const nf = Math.round(areaIso * 12 * q * (1 + messy));
      for (let c = 0; c < nf; c++) {
        let x = 0,
          y = 0,
          ok = false;
        for (let t = 0; t < 30 && !ok; t++) {
          x = rnd() * W;
          y = rnd() * Hh;
          const d = dAt(x, y);
          ok = d > 0.003 && d < 0.035 && bAt(x, y) < 0.5;
        }
        if (!ok) continue;
        const L0 = fr.toLocal({ x, y });
        const S = toStyle(L0.U, L0.V);
        if (S.V > 0.15 && st.length !== "Long") continue;
        let f = flowAt(x, y, S.U, S.V);
        const pts: P[] = [{ x, y }];
        let a = (rnd() - 0.5) * 1.2;
        const len = 4 + Math.floor(rnd() * 6);
        const flyStep = Math.max(0.7, step * 0.22);
        for (let k = 0; k < len; k++) {
          a += (rnd() - 0.5) * 0.35;
          const dx = f.x * Math.cos(a) - f.y * Math.sin(a),
            dy = f.x * Math.sin(a) + f.y * Math.cos(a);
          x += dx * flyStep;
          y += dy * flyStep;
          pts.push({ x, y });
          if (k % 3 === 2) {
            const Lk = fr.toLocal({ x, y });
            const Sk = toStyle(Lk.U, Lk.V);
            f = flowAt(x, y, Sk.U, Sk.V);
          }
        }
        addPoly(hiBuckets, Math.floor(NB * 0.55) * 3, pts);
      }
    }
  }

  // ---------- draw ----------
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const drawB = (bk: Bucket[], alphaBase: number, wMul: number) => {
    for (let li = 0; li < NB; li++)
      for (let wi = 0; wi < 3; wi++) {
        const b = bk[li * 3 + wi];
        if (!b.n) continue;
        const c = colorAt((li + 0.5) / NB);
        ctx.strokeStyle = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
        ctx.lineWidth = px * widths[wi] * wMul;
        ctx.globalAlpha = alphaBase * (wi === 2 ? 0.75 : 1);
        ctx.stroke(b.path);
      }
  };
  if (st.texture === "buzz") drawB(buckets, 0.42, 0.9);
  else if (st.texture === "curly" || st.texture === "coily") drawB(buckets, 0.7, st.texture === "coily" ? 0.75 : 0.95);
  else {
    drawB(buckets, 0.55, 1);
    drawB(hiBuckets, 0.22, 0.7);
  }
  ctx.restore();
}
