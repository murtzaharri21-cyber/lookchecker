export type RGB = [number, number, number];

export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export const rgbToHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");

export function shade(hex: string, k: number): string {
  // k<0 darker, k>0 lighter
  const [r, g, b] = hexToRgb(hex);
  if (k < 0) return rgbToHex(r * (1 + k), g * (1 + k), b * (1 + k));
  return rgbToHex(r + (255 - r) * k, g + (255 - g) * k, b + (255 - b) * k);
}
export function mixHex(a: string, b: string, t: number) {
  const A = hexToRgb(a),
    B = hexToRgb(b);
  return rgbToHex(A[0] + (B[0] - A[0]) * t, A[1] + (B[1] - A[1]) * t, A[2] + (B[2] - A[2]) * t);
}

const srgb2lin = (c: number) => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
export function rgbToLab(r: number, g: number, b: number): [number, number, number] {
  const R = srgb2lin(r),
    G = srgb2lin(g),
    B = srgb2lin(b);
  let x = (R * 0.4124 + G * 0.3576 + B * 0.1805) / 0.95047;
  let y = R * 0.2126 + G * 0.7152 + B * 0.0722;
  let z = (R * 0.0193 + G * 0.1192 + B * 0.9505) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  x = f(x);
  y = f(y);
  z = f(z);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}

/** separable box blur on a single float channel, repeated for gaussian approx */
export function blurChannel(src: Float32Array, w: number, h: number, r: number, passes = 2): Float32Array {
  r = Math.max(1, Math.round(r));
  let a = src.slice();
  const b = new Float32Array(w * h);
  for (let p = 0; p < passes; p++) {
    // horizontal
    for (let y = 0; y < h; y++) {
      let acc = 0;
      const row = y * w;
      for (let x = -r; x <= r; x++) acc += a[row + Math.min(w - 1, Math.max(0, x))];
      for (let x = 0; x < w; x++) {
        b[row + x] = acc / (2 * r + 1);
        acc += a[row + Math.min(w - 1, x + r + 1)] - a[row + Math.max(0, x - r)];
      }
    }
    // vertical
    for (let x = 0; x < w; x++) {
      let acc = 0;
      for (let y = -r; y <= r; y++) acc += b[Math.min(h - 1, Math.max(0, y)) * w + x];
      for (let y = 0; y < h; y++) {
        a[y * w + x] = acc / (2 * r + 1);
        acc += b[Math.min(h - 1, y + r + 1) * w + x] - b[Math.max(0, y - r) * w + x];
      }
    }
  }
  return a;
}

export function makeCanvas(w: number, h: number) {
  const c = document.createElement("canvas");
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

/**
 * Removes the original hair using a soft segmentation mask and push-pull inpainting,
 * reconstructing plausible background/skin in its place.
 * protect: alpha mask (w*h, 0..255) of areas that must never be altered (face skin)
 */
export function removeHair(img: ImageData, hairMask: Float32Array, protect: Uint8ClampedArray | null, strength = 1, noSource: Uint8ClampedArray | null = null) {
  const { width: w, height: h, data } = img;
  const sc = Math.min(1, 420 / Math.max(w, h));
  const sw = Math.max(2, Math.round(w * sc)),
    sh = Math.max(2, Math.round(h * sc));
  // full res soft mask (dilated)
  const soft = new Float32Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const m = hairMask[i];
    let a = m < 0.06 ? 0 : m > 0.45 ? 1 : (m - 0.06) / 0.39;
    if (protect) a *= 1 - protect[i] / 255;
    soft[i] = a;
  }
  const dil = blurChannel(soft, w, h, Math.max(2, Math.round(Math.max(w, h) * 0.006)), 2);
  for (let i = 0; i < w * h; i++) {
    let a = Math.max(soft[i], Math.min(1, dil[i] * 1.6));
    if (protect) a *= 1 - protect[i] / 255;
    soft[i] = a * strength;
  }
  // downsample color + weights
  const levels: { w: number; h: number; c: Float32Array; wt: Float32Array }[] = [];
  const c0 = new Float32Array(sw * sh * 3),
    w0 = new Float32Array(sw * sh);
  const cnt = new Float32Array(sw * sh);
  for (let y = 0; y < h; y++) {
    const sy = Math.min(sh - 1, Math.floor(y * sc));
    for (let x = 0; x < w; x++) {
      const sx = Math.min(sw - 1, Math.floor(x * sc));
      const si = sy * sw + sx,
        i = y * w + x;
      const known = soft[i] < 0.05 && (!noSource || noSource[i] < 100) && hairMask[i] < 0.1 ? 1 : 0;
      c0[si * 3] += data[i * 4] * known;
      c0[si * 3 + 1] += data[i * 4 + 1] * known;
      c0[si * 3 + 2] += data[i * 4 + 2] * known;
      w0[si] += known;
      cnt[si] += 1;
    }
  }
  for (let i = 0; i < sw * sh; i++) {
    if (w0[i] > 0) {
      const f = 1 / w0[i];
      c0[i * 3] *= f;
      c0[i * 3 + 1] *= f;
      c0[i * 3 + 2] *= f;
    }
    w0[i] = w0[i] / cnt[i] > 0.6 ? 1 : 0;
    c0[i * 3] *= w0[i];
    c0[i * 3 + 1] *= w0[i];
    c0[i * 3 + 2] *= w0[i];
  }
  levels.push({ w: sw, h: sh, c: c0, wt: w0 });
  // pull
  while (levels[levels.length - 1].w > 1 || levels[levels.length - 1].h > 1) {
    const L = levels[levels.length - 1];
    const nw = Math.max(1, Math.ceil(L.w / 2)),
      nh = Math.max(1, Math.ceil(L.h / 2));
    const c = new Float32Array(nw * nh * 3),
      wt = new Float32Array(nw * nh);
    for (let y = 0; y < L.h; y++)
      for (let x = 0; x < L.w; x++) {
        const i = y * L.w + x,
          j = (y >> 1) * nw + (x >> 1);
        c[j * 3] += L.c[i * 3];
        c[j * 3 + 1] += L.c[i * 3 + 1];
        c[j * 3 + 2] += L.c[i * 3 + 2];
        wt[j] += L.wt[i];
      }
    for (let j = 0; j < nw * nh; j++)
      if (wt[j] > 1) {
        const f = 1 / wt[j];
        c[j * 3] *= f;
        c[j * 3 + 1] *= f;
        c[j * 3 + 2] *= f;
        wt[j] = 1;
      }
    levels.push({ w: nw, h: nh, c, wt });
  }
  // push
  for (let l = levels.length - 2; l >= 0; l--) {
    const F = levels[l],
      C = levels[l + 1];
    for (let y = 0; y < F.h; y++)
      for (let x = 0; x < F.w; x++) {
        const i = y * F.w + x;
        const wf = F.wt[i];
        if (wf >= 1) continue;
        // bilinear sample of coarse (normalized: coarse is fully filled with wt=1 after push)
        const cx = Math.min(C.w - 1, Math.max(0, (x - 0.5) / 2)),
          cy = Math.min(C.h - 1, Math.max(0, (y - 0.5) / 2));
        const x0 = Math.floor(cx),
          y0 = Math.floor(cy),
          x1 = Math.min(C.w - 1, x0 + 1),
          y1 = Math.min(C.h - 1, y0 + 1);
        const fx = cx - x0,
          fy = cy - y0;
        for (let k = 0; k < 3; k++) {
          const v =
            (C.c[(y0 * C.w + x0) * 3 + k] * (1 - fx) + C.c[(y0 * C.w + x1) * 3 + k] * fx) * (1 - fy) +
            (C.c[(y1 * C.w + x0) * 3 + k] * (1 - fx) + C.c[(y1 * C.w + x1) * 3 + k] * fx) * fy;
          F.c[i * 3 + k] = F.c[i * 3 + k] + (1 - wf) * v;
        }
        F.wt[i] = 1;
      }
  }
  // smooth the small fill result slightly
  const L0 = levels[0];
  const ch = [0, 1, 2].map((k) => {
    const a = new Float32Array(sw * sh);
    for (let i = 0; i < sw * sh; i++) a[i] = L0.c[i * 3 + k];
    return blurChannel(a, sw, sh, 1, 1);
  });
  // upsample bilinear & blend
  let seed = 1234567;
  const rnd = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return ((seed >>> 0) % 1000) / 1000 - 0.5;
  };
  for (let y = 0; y < h; y++) {
    const fyy = Math.min(sh - 1, Math.max(0, y * sc - 0.5));
    const y0 = Math.floor(fyy),
      y1 = Math.min(sh - 1, y0 + 1),
      fy = fyy - y0;
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      const a = soft[i];
      if (a <= 0.003) continue;
      const fxx = Math.min(sw - 1, Math.max(0, x * sc - 0.5));
      const x0 = Math.floor(fxx),
        x1 = Math.min(sw - 1, x0 + 1),
        fx = fxx - x0;
      const n = rnd() * 6;
      for (let k = 0; k < 3; k++) {
        const C = ch[k];
        const v = (C[y0 * sw + x0] * (1 - fx) + C[y0 * sw + x1] * fx) * (1 - fy) + (C[y1 * sw + x0] * (1 - fx) + C[y1 * sw + x1] * fx) * fy + n;
        data[i * 4 + k] = data[i * 4 + k] * (1 - a) + v * a;
      }
    }
  }
}

/** Natural hair recolor preserving texture and highlights */
export function recolorHair(img: ImageData, hairMask: Float32Array, target: RGB, intensity: number, protect: Uint8ClampedArray | null) {
  const { data, width: w, height: h } = img;
  let sum = 0,
    n = 0;
  for (let i = 0; i < w * h; i++) {
    if (hairMask[i] > 0.6) {
      sum += 0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2];
      n++;
    }
  }
  if (n < 50) return;
  const meanL = Math.max(8, sum / n);
  const tL = 0.299 * target[0] + 0.587 * target[1] + 0.114 * target[2];
  const contrast = tL > meanL ? 0.75 : 1;
  for (let i = 0; i < w * h; i++) {
    let a = hairMask[i];
    if (a < 0.08) continue;
    a = Math.min(1, (a - 0.08) / 0.55);
    if (protect) a *= 1 - protect[i] / 255;
    a *= intensity;
    const r = data[i * 4],
      g = data[i * 4 + 1],
      b = data[i * 4 + 2];
    const L = 0.299 * r + 0.587 * g + 0.114 * b;
    const ratio = Math.pow(L / meanL, contrast);
    for (let k = 0; k < 3; k++) {
      let v = target[k] * ratio;
      if (v > 235) v = 235 + (v - 235) * 0.25; // soft roll-off
      const orig = data[i * 4 + k];
      data[i * 4 + k] = orig + (Math.min(255, v) - orig) * a;
    }
  }
}

/** Edge-aware skin smoothing (foundation / retouch) restricted to alpha mask */
export function smoothSkin(img: ImageData, mask: Uint8ClampedArray, strength: number, radius: number, tint?: RGB, tintAmt = 0) {
  const { data, width: w, height: h } = img;
  // bbox of mask
  let x0 = w,
    y0 = h,
    x1 = 0,
    y1 = 0;
  for (let y = 0; y < h; y += 2)
    for (let x = 0; x < w; x += 2)
      if (mask[y * w + x] > 0) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  if (x1 <= x0 || y1 <= y0) return;
  const pad = Math.ceil(radius * 2);
  x0 = Math.max(0, x0 - pad);
  y0 = Math.max(0, y0 - pad);
  x1 = Math.min(w - 1, x1 + pad);
  y1 = Math.min(h - 1, y1 + pad);
  const bw = x1 - x0 + 1,
    bh = y1 - y0 + 1;
  const chans = [0, 1, 2].map(() => new Float32Array(bw * bh));
  for (let y = 0; y < bh; y++)
    for (let x = 0; x < bw; x++) {
      const i = ((y + y0) * w + x + x0) * 4;
      chans[0][y * bw + x] = data[i];
      chans[1][y * bw + x] = data[i + 1];
      chans[2][y * bw + x] = data[i + 2];
    }
  const bl = chans.map((c) => blurChannel(c, bw, bh, radius, 3));
  for (let y = 0; y < bh; y++)
    for (let x = 0; x < bw; x++) {
      const gi = (y + y0) * w + x + x0;
      const m = mask[gi] / 255;
      if (m <= 0) continue;
      const j = y * bw + x;
      const d = Math.abs(chans[0][j] - bl[0][j]) + Math.abs(chans[1][j] - bl[1][j]) + Math.abs(chans[2][j] - bl[2][j]);
      const edge = Math.exp(-(d * d) / 1800); // keep strong edges (features)
      const a = m * strength * (0.35 + 0.65 * edge);
      // Keep a little pore detail so smoothing does not turn skin into a flat blur.
      const detailKeep = Math.min(0.9, 1 - a + 0.12 * strength * m);
      for (let k = 0; k < 3; k++) {
        let v = bl[k][j] + (chans[k][j] - bl[k][j]) * detailKeep;
        if (tint && tintAmt > 0) v = v + (tint[k] * (v / 190) - v) * tintAmt * m * 0.35;
        data[gi * 4 + k] = v;
      }
    }
}
