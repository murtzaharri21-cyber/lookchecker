import { IDX, catmull, centroid, clamp, lerpP, pick, polyPath, scalePoly, seeded, smooth, type Frame } from "./geom";
import { hexToRgb, makeCanvas, shade } from "./imageOps";
import type { FaceData, P } from "./vision";

export interface BeardStyle {
  id: string;
  name: string;
  tags: string[];
  tcMax: number; // 0..1 portion of jaw covered (1 = ear to ear)
  fin: (tc: number) => number; // inner fraction toward mouth (0 jaw .. 1 nose)
  fout: (tc: number) => number; // extension beyond jaw
  mustache: number; // 0 none, 1 full
  mustacheGap?: boolean; // floating mustache (not connected)
  connect?: number; // drop of mustache corners toward chin (0..1)
  length: number; // hair length (s units)
  density: number;
  stubble?: boolean;
  opacity: number;
  pointed?: number;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const BEARDS: BeardStyle[] = [
  {
    id: "stubble", name: "Designer Stubble", tags: ["Oval", "Round", "Square", "Heart", "Diamond", "Oblong"], tcMax: 1,
    fin: (tc) => lerp(0.68, 0.24, smooth(0.15, 0.9, tc)) - 0.12 * smooth(0.85, 1, tc), fout: (tc) => lerp(0.05, 0.02, tc),
    mustache: 1, connect: 1, length: 0.014, density: 1, stubble: true, opacity: 0.55,
  },
  {
    id: "short-boxed", name: "Short Boxed Beard", tags: ["Round", "Oval", "Oblong", "Diamond"], tcMax: 1,
    fin: (tc) => lerp(0.7, 0.24, smooth(0.15, 0.9, tc)) - 0.12 * smooth(0.85, 1, tc), fout: (tc) => lerp(0.1, 0.035, tc),
    mustache: 1, connect: 1, length: 0.045, density: 1, opacity: 0.85,
  },
  {
    id: "full", name: "Full Beard", tags: ["Round", "Oval", "Oblong", "Heart", "Diamond"], tcMax: 1,
    fin: (tc) => lerp(0.72, 0.32, smooth(0.15, 0.9, tc)) - 0.15 * smooth(0.85, 1, tc), fout: (tc) => lerp(0.3, 0.05, smooth(0, 0.8, tc)),
    mustache: 1, connect: 1, length: 0.085, density: 1.1, opacity: 0.95, pointed: 0.1,
  },
  {
    id: "goatee", name: "Classic Goatee", tags: ["Round", "Square", "Oval"], tcMax: 0.3,
    fin: () => 0.72, fout: (tc) => lerp(0.1, 0.02, tc / 0.3), mustache: 0, length: 0.04, density: 1, opacity: 0.85,
  },
  {
    id: "circle", name: "Circle Beard", tags: ["Square", "Round", "Oval", "Oblong"], tcMax: 0.36,
    fin: () => 0.72, fout: (tc) => lerp(0.08, 0.0, tc / 0.36), mustache: 1, connect: 1, length: 0.035, density: 1, opacity: 0.85,
  },
  {
    id: "van-dyke", name: "Van Dyke", tags: ["Round", "Square", "Oval", "Heart"], tcMax: 0.24,
    fin: () => 0.7, fout: (tc) => lerp(0.16, 0.0, tc / 0.24), mustache: 1, mustacheGap: true, length: 0.05, density: 1, opacity: 0.85, pointed: 0.3,
  },
  {
    id: "balbo", name: "Balbo", tags: ["Round", "Oval", "Heart", "Square"], tcMax: 0.5,
    fin: (tc) => lerp(0.72, 0.42, smooth(0.2, 0.5, tc)), fout: (tc) => lerp(0.08, 0.0, tc / 0.5), mustache: 1, mustacheGap: true, length: 0.04, density: 1, opacity: 0.85,
  },
  {
    id: "chin-strap", name: "Chin Strap", tags: ["Round", "Oval", "Square"], tcMax: 1,
    fin: (tc) => 0.11 + 0.05 * (1 - tc), fout: () => 0.035, mustache: 0, length: 0.025, density: 1, opacity: 0.85,
  },
  {
    id: "anchor", name: "Anchor + Mustache", tags: ["Square", "Oblong", "Oval"], tcMax: 0.42,
    fin: (tc) => lerp(0.62, 0.22, smooth(0.15, 0.42, tc)), fout: (tc) => lerp(0.12, 0.0, tc / 0.42), mustache: 1, mustacheGap: true, length: 0.04, density: 1, opacity: 0.85, pointed: 0.2,
  },
  {
    id: "mustache", name: "Chevron Mustache", tags: ["Oval", "Oblong", "Diamond", "Heart"], tcMax: 0,
    fin: () => 0, fout: () => 0, mustache: 1, mustacheGap: true, length: 0.04, density: 1.1, opacity: 0.9,
  },
  {
    id: "heavy-stubble", name: "Heavy Stubble", tags: ["Oval", "Square", "Round", "Diamond", "Oblong"], tcMax: 1,
    fin: (tc) => lerp(0.66, 0.25, smooth(0.15, 0.9, tc)) - 0.1 * smooth(0.85, 1, tc), fout: (tc) => lerp(0.035, 0.015, tc),
    mustache: 1, connect: 1, length: 0.022, density: 1.28, stubble: true, opacity: 0.68,
  },
  {
    id: "anchor-short", name: "Short Anchor", tags: ["Round", "Square", "Oval", "Heart"], tcMax: 0.38,
    fin: (tc) => lerp(0.66, 0.25, smooth(0.12, 0.38, tc)), fout: (tc) => lerp(0.1, 0, tc / 0.38),
    mustache: 1, mustacheGap: true, length: 0.032, density: 1.08, opacity: 0.86, pointed: 0.16,
  },
  {
    id: "extended-goatee", name: "Extended Goatee", tags: ["Round", "Square", "Oval", "Oblong"], tcMax: 0.42,
    fin: (tc) => lerp(0.76, 0.48, smooth(0.18, 0.42, tc)), fout: (tc) => lerp(0.13, 0.015, tc / 0.42),
    mustache: 1, mustacheGap: true, length: 0.045, density: 1.04, opacity: 0.88, pointed: 0.22,
  },
  {
    id: "horseshoe", name: "Horseshoe Mustache", tags: ["Oval", "Round", "Square", "Oblong"], tcMax: 0,
    fin: () => 0, fout: () => 0, mustache: 1, mustacheGap: true, length: 0.045, density: 1.14, opacity: 0.9,
  },
  {
    id: "long-full", name: "Long Full Beard", tags: ["Oval", "Round", "Heart", "Diamond"], tcMax: 1,
    fin: (tc) => lerp(0.72, 0.34, smooth(0.15, 0.88, tc)) - 0.12 * smooth(0.85, 1, tc), fout: (tc) => lerp(0.36, 0.06, smooth(0, 0.8, tc)),
    mustache: 1, connect: 1, length: 0.12, density: 1.08, opacity: 0.93, pointed: 0.12,
  },
];

export const BEARD_COLORS = [
  { name: "Black", hex: "#16110e" },
  { name: "Dark Brown", hex: "#33241a" },
  { name: "Brown", hex: "#5a3c26" },
  { name: "Light Brown", hex: "#8a623d" },
  { name: "Ginger", hex: "#9c4f25" },
  { name: "Blonde", hex: "#b99560" },
  { name: "Salt & Pepper", hex: "#6f6a66" },
  { name: "Grey", hex: "#a5a29f" },
];

export function renderBeard(ctx: CanvasRenderingContext2D, face: FaceData, fr: Frame, st: BeardStyle, color: string, quality = 1, intensity = 1, seed = 3) {
  const lm = face.lm;
  const W = face.width,
    H = face.height,
    s = fr.s,
    sx = fr.sx;
  const rnd = seeded(seed * 104729 + st.id.length * 17);
  const ms = Math.min(1, (quality < 0.5 ? 360 : 900) / Math.max(W, H));
  const mw = Math.round(W * ms),
    mh = Math.round(H * ms);
  const mc = makeCanvas(mw, mh);
  const mx = mc.getContext("2d", { willReadFrequently: true })!;
  mx.setTransform(ms, 0, 0, ms, 0, 0);
  mx.fillStyle = "#fff";

  const C = lerpP(lm[2], lm[0], 0.2); // between nose base and upper lip
  const jaw = catmull(pick(lm, IDX.jaw), false, 6);
  const nJ = jaw.length;

  if (st.tcMax > 0) {
    const t0 = 0.5 - st.tcMax / 2,
      t1 = 0.5 + st.tcMax / 2;
    const outer: P[] = [],
      inner: P[] = [];
    const N = 80;
    for (let k = 0; k <= N; k++) {
      const t = t0 + ((t1 - t0) * k) / N;
      const fi = t * (nJ - 1);
      const i0 = Math.floor(fi),
        i1 = Math.min(nJ - 1, i0 + 1);
      const J = lerpP(jaw[i0], jaw[i1], fi - i0);
      const tc = Math.abs(2 * t - 1);
      let fo = st.fout(tc);
      if (st.pointed) fo += st.pointed * Math.exp(-(tc * tc) / 0.02);
      outer.push({ x: J.x + (J.x - C.x) * fo, y: J.y + (J.y - C.y) * fo });
      inner.push(lerpP(J, C, clamp(st.fin(tc), 0, 0.95)));
    }
    // sideburns up to temple for full coverage
    if (st.tcMax >= 1) {
      const sbL = lerpP(lm[127], lm[234], 0.1),
        sbR = lerpP(lm[356], lm[454], 0.1);
      const sbLi = lerpP(sbL, fr.toImg(0, 0.4), 0.09),
        sbRi = lerpP(sbR, fr.toImg(0, 0.4), 0.09);
      const poly = [sbL, ...outer, sbR, sbRi, ...inner.slice().reverse(), sbLi];
      mx.fill(polyPath(catmull(poly, true, 2)));
    } else {
      mx.fill(polyPath([...outer, ...inner.slice().reverse()]));
    }
  }
  // remove lips (with a small margin)
  const lips = pick(lm, IDX.lipsOuter);
  const lc = centroid(lips);
  mx.globalCompositeOperation = "destination-out";
  mx.fill(polyPath(catmull(scalePoly(lips, 1.1, lc), true, 4)));
  mx.globalCompositeOperation = "source-over";

  // mustache
  if (st.mustache > 0) {
    const up = pick(lm, IDX.upperLipTop);
    const nose = lm[2];
    const bottom = up.map((p) => lerpP(p, nose, 0.06));
    const lipW = Math.hypot(up[up.length - 1].x - up[0].x, up[up.length - 1].y - up[0].y);
    const top = up.map((p, i) => {
      const tt = i / (up.length - 1);
      const off = (tt - 0.5) * lipW * 1.02;
      const base = { x: nose.x + fr.ux.x * off, y: nose.y + fr.ux.y * off };
      return lerpP(p, base, 0.82 - 0.25 * Math.pow(Math.abs(tt - 0.5) * 2, 2));
    });
    const extL = { x: up[0].x - fr.ux.x * sx * 0.06 + fr.uy.x * s * 0.05, y: up[0].y - fr.ux.y * sx * 0.06 + fr.uy.y * s * 0.05 };
    const extR = { x: up[up.length - 1].x + fr.ux.x * sx * 0.06 + fr.uy.x * s * 0.05, y: up[up.length - 1].y + fr.ux.y * sx * 0.06 + fr.uy.y * s * 0.05 };
    const poly: P[] = [extL, ...top, extR, ...bottom.slice().reverse()];
    mx.fill(polyPath(catmull(poly, true, 4)));
    if (st.connect) {
      // connectors from mouth corners to chin
      for (const [ci, side] of [
        [61, -1],
        [291, 1],
      ] as const) {
        const corner = lm[ci];
        const chinPt = lerpP(lm[side < 0 ? 176 : 400], lm[152], 0.3);
        const wv = { x: fr.ux.x * sx * 0.07 * side, y: fr.ux.y * sx * 0.07 * side };
        mx.fill(
          polyPath(
            catmull(
              [
                { x: corner.x - wv.x * 0.3, y: corner.y - wv.y * 0.3 },
                { x: corner.x + wv.x, y: corner.y + wv.y },
                { x: chinPt.x + wv.x, y: chinPt.y + wv.y },
                { x: chinPt.x - wv.x * 0.6, y: chinPt.y - wv.y * 0.6 },
              ],
              true,
              4,
            ),
          ),
        );
      }
      mx.globalCompositeOperation = "destination-out";
      mx.fill(polyPath(catmull(scalePoly(lips, 1.06, lc), true, 4)));
      mx.globalCompositeOperation = "source-over";
    }
  }
  // feather the mask
  const fm = makeCanvas(mw / 6, mh / 6);
  fm.getContext("2d")!.drawImage(mc, 0, 0, fm.width, fm.height);
  const feather = makeCanvas(mw, mh);
  const fx = feather.getContext("2d", { willReadFrequently: true })!;
  fx.imageSmoothingQuality = "high";
  fx.drawImage(fm, 0, 0, mw, mh);
  fx.globalAlpha = 0.3;
  fx.drawImage(mc, 0, 0);
  const fd = fx.getImageData(0, 0, mw, mh).data;
  const M = new Float32Array(mw * mh);
  let area = 0;
  for (let i = 0; i < mw * mh; i++) {
    M[i] = fd[i * 4 + 3] / 255;
    if (M[i] > 0.3) area++;
  }
  const mAt = (x: number, y: number) => {
    const a = (x * ms) | 0,
      b = (y * ms) | 0;
    if (a < 0 || b < 0 || a >= mw || b >= mh) return 0;
    return M[b * mw + a];
  };

  // restrict beard to face + neck (never onto background)
  const clipP = new Path2D();
  clipP.addPath(polyPath(catmull(scalePoly(pick(lm, IDX.faceOval), 1.01), true, 4)));
  {
    const jl = lm[172],
      jr = lm[397];
    const dn = { x: fr.uy.x * fr.H * 0.45, y: fr.uy.y * fr.H * 0.45 };
      const inL = { x: fr.ux.x * sx * 0.12, y: fr.ux.y * sx * 0.12 };
    clipP.addPath(
      polyPath([
        { x: jl.x + inL.x, y: jl.y + inL.y },
        { x: jr.x - inL.x, y: jr.y - inL.y },
        { x: jr.x - inL.x * 1.6 + dn.x, y: jr.y - inL.y * 1.6 + dn.y },
        { x: jl.x + inL.x * 1.6 + dn.x, y: jl.y + inL.y * 1.6 + dn.y },
      ]),
    );
  }
  ctx.save();
  ctx.clip(clipP);
  // base shadow (skin under hair darkens)
  const colored = makeCanvas(mw, mh);
  const cx = colored.getContext("2d")!;
  cx.drawImage(feather, 0, 0);
  cx.globalCompositeOperation = "source-in";
  const baseColor = st.stubble ? shade(color, -0.1) : color;
  const yawStrength = smooth(0.12, 1.0, Math.abs(fr.pose.yaw));
  const farU = fr.pose.yaw >= 0 ? 1 : -1;
  const far = fr.toImg(farU, 0);
  const near = fr.toImg(-farU, 0);
  const depth = cx.createLinearGradient(far.x * ms, far.y * ms, near.x * ms, near.y * ms);
  depth.addColorStop(0, shade(baseColor, -0.12 * yawStrength));
  depth.addColorStop(0.65, baseColor);
  depth.addColorStop(1, baseColor);
  cx.fillStyle = depth;
  cx.fillRect(0, 0, mw, mh);
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = (st.stubble ? 0.4 : 0.5) * st.opacity * intensity;
  ctx.drawImage(colored, 0, 0, W, H);
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = (st.stubble ? 0.06 : 0.16) * st.opacity * intensity;
  ctx.drawImage(colored, 0, 0, W, H);
  ctx.restore();

  // hairs
  const areaIso = area / (ms * ms * s * sx);
  const n = Math.round(areaIso * (st.stubble ? 12000 : 14000) * st.density * quality);
  const px = Math.max(0.5, s / 300);
  const NB = 10;
  const paths = Array.from({ length: NB }, () => new Path2D());
  const counts = new Array(NB).fill(0);
  const mouthV = fr.toLocal(lm[13]).V;
  const noseV = fr.toLocal(lm[2]).V;
  for (let k = 0; k < n; k++) {
    const x = rnd() * W,
      y = rnd() * H;
    const m = mAt(x, y);
    if (m < 0.05 || rnd() > Math.pow(m, 1.3)) continue;
    const L = fr.toLocal({ x, y });
    let dU: number, dV: number;
    if (L.V > noseV - 0.02 && L.V < mouthV + 0.01 && Math.abs(L.U) < 0.42) {
      dU = Math.sign(L.U) * (0.25 + Math.abs(L.U) * 1.6);
      dV = 1;
    } else {
      dU = L.U * 0.3;
      dV = 1;
    }
    let dir = fr.dirToImg(dU * 0.4, dV * 0.38);
    const a = (rnd() - 0.5) * (st.stubble ? 1.6 : 0.7);
    dir = { x: dir.x * Math.cos(a) - dir.y * Math.sin(a), y: dir.x * Math.sin(a) + dir.y * Math.cos(a) };
    const len = st.length * s * (0.5 + rnd() * 0.9) * (0.55 + 0.45 * m);
    const curl = (rnd() - 0.5) * 0.9;
    const p0 = { x, y };
    const p1 = { x: x + dir.x * len * 0.5 - dir.y * len * curl * 0.25, y: y + dir.y * len * 0.5 + dir.x * len * curl * 0.25 };
    const p2 = { x: x + dir.x * len, y: y + dir.y * len };
    const li = Math.min(NB - 1, Math.floor(rnd() * rnd() * NB * 1.2 + (L.V > 1.0 ? 1 : 0)));
    paths[li].moveTo(p0.x, p0.y);
    paths[li].quadraticCurveTo(p1.x, p1.y, p2.x, p2.y);
    counts[li]++;
  }
  const rgb = hexToRgb(color);
  ctx.save();
  ctx.lineCap = "round";
  for (let i = 0; i < NB; i++) {
    if (!counts[i]) continue;
    const t = i / (NB - 1);
    const k = -0.45 + t * 0.85;
    const c = k < 0 ? rgb.map((v) => v * (1 + k)) : rgb.map((v) => v + (255 - v) * k * 0.6);
    ctx.strokeStyle = `rgb(${c[0] | 0},${c[1] | 0},${c[2] | 0})`;
    ctx.lineWidth = px * (st.stubble ? 0.8 : 0.6 + (1 - t) * 0.45);
    ctx.globalAlpha = (st.stubble ? 0.5 : 0.55) * intensity * (i > 6 ? 0.55 : 1);
    ctx.stroke(paths[i]);
  }
  ctx.restore();
  ctx.restore();
}
