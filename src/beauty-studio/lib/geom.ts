import type { LP, P } from "./vision";

export const IDX = {
  faceOval: [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109],
  lipsOuter: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146],
  lipsInner: [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95],
  upperLipTop: [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291],
  // image-left eye (subject's right)
  eyeL: [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246],
  eyeLUpper: [33, 246, 161, 160, 159, 158, 157, 173, 133],
  eyeLLower: [33, 7, 163, 144, 145, 153, 154, 155, 133],
  eyeR: [263, 249, 390, 373, 374, 380, 381, 382, 362, 398, 384, 385, 386, 387, 388, 466],
  eyeRUpper: [263, 466, 388, 387, 386, 385, 384, 398, 362],
  eyeRLower: [263, 249, 390, 373, 374, 380, 381, 382, 362],
  browL: [70, 63, 105, 66, 107, 55, 65, 52, 53, 46],
  browLUpper: [70, 63, 105, 66, 107],
  browLLower: [46, 53, 52, 65, 55],
  browR: [300, 293, 334, 296, 336, 285, 295, 282, 283, 276],
  browRUpper: [300, 293, 334, 296, 336],
  browRLower: [276, 283, 282, 295, 285],
  // jaw from image-left ear to image-right ear via chin
  jaw: [234, 93, 132, 58, 172, 136, 150, 149, 176, 148, 152, 377, 400, 378, 379, 365, 397, 288, 361, 323, 454],
  noseL: [98, 97, 2, 326, 327],
};

export const dist = (a: P, b: P) => Math.hypot(a.x - b.x, a.y - b.y);
export const mid = (a: P, b: P): P => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
export const lerpP = (a: P, b: P, t: number): P => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
export const centroid = (pts: P[]): P => {
  let x = 0,
    y = 0;
  for (const p of pts) {
    x += p.x;
    y += p.y;
  }
  return { x: x / pts.length, y: y / pts.length };
};

export interface Frame {
  o: P;
  ux: P;
  uy: P;
  s: number; // stable face scale, estimated from cheek width and face height (pixels)
  sx: number; // apparent horizontal half-width, kept from collapsing in profile views
  H: number; // forehead(10) -> chin(152) length along uy (pixels)
  hairWidthScale: number; // automatic hairstyle width correction from forehead and temple proportions
  angle: number;
  pose: { yaw: number; pitch: number; roll: number };
  toImg: (U: number, V: number) => P; // normalized face coords → image
  toLocal: (p: P) => { U: number; V: number };
  dirToImg: (dU: number, dV: number) => P;
}

export function makeFrame(lm: LP[]): Frame {
  const eL = mid(lm[33], lm[133]);
  const eR = mid(lm[263], lm[362]);
  const cheekAxis = { x: lm[454].x - lm[234].x, y: lm[454].y - lm[234].y };
  const cheekWidth = Math.hypot(cheekAxis.x, cheekAxis.y);
  const dist3 = (a: LP, b: LP) => Math.hypot(dist(a, b), a.z - b.z);
  const pairYaw = (a: LP, b: LP) => Math.atan2(b.z - a.z, Math.max(1, dist(a, b)));
  const eyeCenterL = { ...eL, z: (lm[33].z + lm[133].z) / 2 };
  const eyeCenterR = { ...eR, z: (lm[263].z + lm[362].z) / 2 };
  const yaw = clamp(
    pairYaw(lm[234], lm[454]) * 0.55 +
      pairYaw(eyeCenterL, eyeCenterR) * 0.3 +
      pairYaw(lm[127], lm[356]) * 0.15,
    -1.45,
    1.45,
  );
  const eyeAxis = { x: eR.x - eL.x, y: eR.y - eL.y };
  const eyeLength = Math.hypot(eyeAxis.x, eyeAxis.y);
  const cheekLength = Math.hypot(cheekAxis.x, cheekAxis.y);
  const eyeUnit = eyeLength > 1e-6 ? { x: eyeAxis.x / eyeLength, y: eyeAxis.y / eyeLength } : null;
  const cheekUnit = cheekLength > 1e-6 ? { x: cheekAxis.x / cheekLength, y: cheekAxis.y / cheekLength } : null;
  if (eyeUnit && cheekUnit && eyeUnit.x * cheekUnit.x + eyeUnit.y * cheekUnit.y < 0) {
    eyeUnit.x *= -1;
    eyeUnit.y *= -1;
  }
  // The eye line is precise in front views; cheek landmarks are more stable
  // when perspective compresses the far eye in an angled or profile view.
  const cheekWeight = smooth(0.12, 0.9, Math.abs(yaw));
  const axisX = (eyeUnit?.x ?? cheekUnit?.x ?? 1) * (1 - cheekWeight) + (cheekUnit?.x ?? eyeUnit?.x ?? 1) * cheekWeight;
  const axisY = (eyeUnit?.y ?? cheekUnit?.y ?? 0) * (1 - cheekWeight) + (cheekUnit?.y ?? eyeUnit?.y ?? 0) * cheekWeight;
  let ux = { x: axisX, y: axisY };
  const n = Math.hypot(ux.x, ux.y);
  ux = n > 1e-6 ? { x: ux.x / n, y: ux.y / n } : { x: 1, y: 0 };
  let uy = { x: -ux.y, y: ux.x };
  const cheekMid = mid(lm[234], lm[454]);
  const chinAxis = { x: lm[152].x - cheekMid.x, y: lm[152].y - cheekMid.y };
  if (chinAxis.x * uy.x + chinAxis.y * uy.y < 0) {
    ux = { x: -ux.x, y: -ux.y };
    uy = { x: -uy.x, y: -uy.y };
  }
  const measuredHalfWidth = cheekWidth / 2;
  const measuredHeight = dist(lm[10], lm[152]);
  const cheekWidth3d = dist3(lm[234], lm[454]);
  const halfWidth3d = cheekWidth3d / 2;
  const templeRatio = dist3(lm[127], lm[356]) / Math.max(1, cheekWidth3d);
  const foreheadRatio = dist3(lm[54], lm[284]) / Math.max(1, cheekWidth3d);
  const headRatio = clamp(Math.max(templeRatio, foreheadRatio), 0.72, 1.18);
  const hairWidthScale = clamp(1 + (headRatio - 0.9) * 0.45, 0.9, 1.12);
  // In a profile, the projected cheek-to-cheek width shrinks sharply even
  // though the three-dimensional width remains useful for stable sizing.
  const faceHeight3d = dist3(lm[10], lm[152]);
  const s = Math.max(measuredHalfWidth, halfWidth3d, faceHeight3d / 1.85, measuredHeight / 1.85);
  const sx = Math.max(measuredHalfWidth, halfWidth3d * Math.max(0.28, Math.cos(yaw)), s * 0.36);
  // origin: projection of mid-face axis to landmark 10
  const cMid = cheekMid;
  const t10 = { x: lm[10].x - cMid.x, y: lm[10].y - cMid.y };
  const o = { x: cMid.x + uy.x * (t10.x * uy.x + t10.y * uy.y), y: cMid.y + uy.y * (t10.x * uy.x + t10.y * uy.y) };
  const c = { x: lm[152].x - o.x, y: lm[152].y - o.y };
  const H = Math.max(s * 1.6, c.x * uy.x + c.y * uy.y);
  const topToChin = { x: lm[152].x - lm[10].x, y: lm[152].y - lm[10].y };
  const pitch = Math.atan2(lm[152].z - lm[10].z, Math.max(1, Math.hypot(topToChin.x, topToChin.y)));
  const roll = Math.atan2(ux.y, ux.x);
  const toImg = (U: number, V: number): P => ({
    x: o.x + ux.x * U * sx + uy.x * V * H,
    y: o.y + ux.y * U * sx + uy.y * V * H,
  });
  const toLocal = (p: P) => {
    const dx = p.x - o.x,
      dy = p.y - o.y;
    return { U: (dx * ux.x + dy * ux.y) / sx, V: (dx * uy.x + dy * uy.y) / H };
  };
  const dirToImg = (dU: number, dV: number): P => {
    const x = ux.x * dU * sx + uy.x * dV * H;
    const y = ux.y * dU * sx + uy.y * dV * H;
    const l = Math.hypot(x, y) || 1;
    return { x: x / l, y: y / l };
  };
  return { o, ux, uy, s, sx, H, hairWidthScale, angle: roll, pose: { yaw, pitch, roll }, toImg, toLocal, dirToImg };
}

export const pick = (lm: LP[], idx: number[]): P[] => idx.map((i) => ({ x: lm[i].x, y: lm[i].y }));

export function polyPath(pts: P[], close = true): Path2D {
  const p = new Path2D();
  pts.forEach((q, i) => (i ? p.lineTo(q.x, q.y) : p.moveTo(q.x, q.y)));
  if (close) p.closePath();
  return p;
}

/** Closed Catmull-Rom spline sampled into points */
export function catmull(pts: P[], closed = true, seg = 8): P[] {
  const out: P[] = [];
  const n = pts.length;
  const get = (i: number) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = get(i - 1),
      p1 = get(i),
      p2 = get(i + 1),
      p3 = get(i + 2);
    for (let k = 0; k < seg; k++) {
      const t = k / seg,
        t2 = t * t,
        t3 = t2 * t;
      out.push({
        x: 0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
        y: 0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3),
      });
    }
  }
  if (!closed) out.push(pts[n - 1]);
  return out;
}

export function smoothPath(pts: P[], closed = true): Path2D {
  return polyPath(catmull(pts, closed, 10), closed);
}

/** expand polygon from its centroid */
export function scalePoly(pts: P[], k: number, c = centroid(pts)): P[] {
  return pts.map((p) => ({ x: c.x + (p.x - c.x) * k, y: c.y + (p.y - c.y) * k }));
}

export function seeded(seed: number) {
  let s = seed >>> 0 || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 1000000) / 1000000;
  };
}

/* ---------------- face shape ---------------- */
export type FaceShape = "Oval" | "Round" | "Square" | "Heart" | "Oblong" | "Diamond";

export interface FaceShapeResult {
  shape: FaceShape;
  scores: Record<FaceShape, number>;
  metrics: { lengthToWidth: number; foreheadRatio: number; jawRatio: number; chinRatio: number; jawAngle: number };
}

export function analyzeFaceShape(lm: LP[]): FaceShapeResult {
  const dist3 = (a: LP, b: LP) => Math.hypot(dist(a, b), a.z - b.z);
  const cheek = Math.max(1, dist3(lm[234], lm[454]));
  const forehead = dist3(lm[54], lm[284]);
  const jaw = dist3(lm[172], lm[397]);
  const chin = dist3(lm[149], lm[378]);
  const length = dist3(lm[10], lm[152]) * 1.12; // landmark 10 sits slightly below the hairline
  const ltw = length / cheek;
  const fr = forehead / cheek;
  const jr = jaw / cheek;
  const cr = chin / cheek;
  const v1 = { x: lm[234].x - lm[172].x, y: lm[234].y - lm[172].y, z: lm[234].z - lm[172].z };
  const v2 = { x: lm[152].x - lm[172].x, y: lm[152].y - lm[172].y, z: lm[152].z - lm[172].z };
  const cosAngle = (v1.x * v2.x + v1.y * v2.y + v1.z * v2.z) / Math.max(1e-6, Math.hypot(v1.x, v1.y, v1.z) * Math.hypot(v2.x, v2.y, v2.z));
  const ang = (Math.acos(Math.max(-1, Math.min(1, cosAngle))) * 180) / Math.PI;
  const g = (x: number, m: number, sd: number) => Math.exp(-((x - m) ** 2) / (2 * sd * sd));
  const raw: Record<FaceShape, number> = {
    Oval: g(ltw, 1.42, 0.08) * g(jr, 0.78, 0.06) * g(fr, 0.78, 0.07),
    Round: g(ltw, 1.22, 0.08) * g(jr, 0.82, 0.07) * g(ang, 140, 10),
    Square: g(ltw, 1.27, 0.09) * g(jr, 0.9, 0.06) * g(ang, 125, 10),
    Heart: g(ltw, 1.38, 0.1) * g(fr, 0.86, 0.06) * g(jr, 0.72, 0.06) * g(cr, 0.32, 0.08),
    Oblong: g(ltw, 1.62, 0.09) * g(jr, 0.82, 0.08),
    Diamond: g(ltw, 1.45, 0.1) * g(fr, 0.68, 0.05) * g(jr, 0.72, 0.06),
  };
  const sum = Object.values(raw).reduce((a, b) => a + b, 0) || 1;
  const scores = Object.fromEntries(Object.entries(raw).map(([k, v]) => [k, Math.round((v / sum) * 100)])) as Record<FaceShape, number>;
  const shape = (Object.keys(raw) as FaceShape[]).reduce((a, b) => (raw[a] >= raw[b] ? a : b));
  return { shape, scores, metrics: { lengthToWidth: ltw, foreheadRatio: fr, jawRatio: jr, chinRatio: cr, jawAngle: ang } };
}
