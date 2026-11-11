import { IDX, clamp, dist, makeFrame, pick, polyPath } from "./geom";
import { blurChannel, makeCanvas, rgbToHex, rgbToLab } from "./imageOps";
import { skinMask, type MakeupState } from "./makeup";
import type { FaceData, P } from "./vision";

export interface Metric {
  key: string;
  label: string;
  score: number; // 0..100 (higher = better)
  value: string;
  desc: string;
}

export interface SkinReport {
  toneHex: string;
  lab: [number, number, number];
  ita: number;
  depth: string;
  fitzpatrick: string;
  undertone: "Warm" | "Cool" | "Neutral";
  hue: number;
  wbGain: [number, number, number];
  metrics: Metric[];
  overall: number;
  skinType: "Oily" | "Dry" | "Combination" | "Normal";
  concerns: string[];
  routine: { step: string; product: string; why: string }[];
  maps: Record<"redness" | "shine" | "texture" | "spots", HTMLCanvasElement>;
  spots: P[]; // image coords
  box: { x: number; y: number; w: number; h: number };
  suggestions: MakeupSuggestion;
}

export interface MakeupSuggestion {
  foundation: { name: string; hex: string };
  concealer: { name: string; hex: string };
  lips: { name: string; hex: string }[];
  blush: { name: string; hex: string }[];
  eyes: { name: string; hex: string }[];
  metals: string;
  tips: string[];
  look: Partial<MakeupState>;
}

const median = (arr: number[]) => {
  if (!arr.length) return 0;
  const a = arr.slice().sort((x, y) => x - y);
  return a[Math.floor(a.length / 2)];
};
const trimmedMean = (arr: number[], k = 0.15) => {
  if (!arr.length) return 0;
  const a = arr.slice().sort((x, y) => x - y);
  const s = Math.floor(a.length * k),
    e = Math.ceil(a.length * (1 - k));
  let sum = 0;
  for (let i = s; i < e; i++) sum += a[i];
  return sum / Math.max(1, e - s);
};

export function analyzeSkin(src: HTMLCanvasElement, face: FaceData): SkinReport {
  const lm = face.lm;
  const fr = makeFrame(lm);
  // crop box
  let x0 = 1e9,
    y0 = 1e9,
    x1 = -1e9,
    y1 = -1e9;
  for (const p of lm) {
    x0 = Math.min(x0, p.x);
    y0 = Math.min(y0, p.y);
    x1 = Math.max(x1, p.x);
    y1 = Math.max(y1, p.y);
  }
  const pad = fr.s * 0.05;
  x0 = Math.max(0, Math.floor(x0 - pad));
  y0 = Math.max(0, Math.floor(y0 - pad));
  x1 = Math.min(face.width, Math.ceil(x1 + pad));
  y1 = Math.min(face.height, Math.ceil(y1 + pad));
  const bw = x1 - x0,
    bh = y1 - y0;
  const sc = Math.min(1.5, 190 / fr.s);
  const cw = Math.max(16, Math.round(bw * sc)),
    ch = Math.max(16, Math.round(bh * sc));
  const cc = makeCanvas(cw, ch);
  const cx = cc.getContext("2d", { willReadFrequently: true })!;
  cx.imageSmoothingQuality = "high";
  cx.drawImage(src, x0, y0, bw, bh, 0, 0, cw, ch);
  const img = cx.getImageData(0, 0, cw, ch).data;
  const slm = lm.map((p) => ({ x: (p.x - x0) * sc, y: (p.y - y0) * sc, z: p.z * sc }));
  const sface: FaceData = { lm: slm, width: cw, height: ch, hairMask: null };
  const sfr = makeFrame(slm);
  const maskA = skinMask(sface, 0.6);
  // exclude hair from mask
  if (face.hairMask) {
    for (let y = 0; y < ch; y++)
      for (let x = 0; x < cw; x++) {
        const gx = Math.min(face.width - 1, Math.round(x / sc + x0)),
          gy = Math.min(face.height - 1, Math.round(y / sc + y0));
        const hm = face.hairMask[gy * face.width + gx];
        if (hm > 0.35) maskA[y * cw + x] = 0;
      }
  }

  // --- white balance from sclera ---
  const ec = makeCanvas(cw, ch);
  const ex = ec.getContext("2d", { willReadFrequently: true })!;
  ex.fillStyle = "#fff";
  if (Math.abs(fr.pose.yaw) > 0.35) {
    // In a profile, the farther eye is often compressed or partly occluded;
    // use the larger visible sclera for white balance instead of mixing both.
    const visibleEye = dist(lm[33], lm[133]) >= dist(lm[263], lm[362]) ? IDX.eyeL : IDX.eyeR;
    ex.fill(polyPath(pick(slm, visibleEye)));
  } else {
    ex.fill(polyPath(pick(slm, IDX.eyeL)));
    ex.fill(polyPath(pick(slm, IDX.eyeR)));
  }
  const ed = ex.getImageData(0, 0, cw, ch).data;
  const sclera: number[][] = [];
  for (let i = 0; i < cw * ch; i++) {
    if (ed[i * 4 + 3] < 200) continue;
    const r = img[i * 4],
      g = img[i * 4 + 1],
      b = img[i * 4 + 2];
    const mx = Math.max(r, g, b),
      mn = Math.min(r, g, b);
    if (mx > 90 && (mx - mn) / mx < 0.28) sclera.push([r, g, b, r + g + b]);
  }
  let gain: [number, number, number] = [1, 1, 1];
  if (sclera.length > 12) {
    sclera.sort((a, b) => b[3] - a[3]);
    const top = sclera.slice(0, Math.max(6, Math.floor(sclera.length * 0.35)));
    const m = [0, 1, 2].map((k) => top.reduce((s, p) => s + p[k], 0) / top.length);
    const avg = (m[0] + m[1] + m[2]) / 3;
    gain = [clamp(avg / m[0], 0.88, 1.12), clamp(avg / m[1], 0.88, 1.12), clamp(avg / m[2], 0.88, 1.12)];
  }

  // --- Lab conversion ---
  const N = cw * ch;
  const L = new Float32Array(N),
    A = new Float32Array(N),
    Bc = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const [l, a, b] = rgbToLab(img[i * 4] * gain[0], img[i * 4 + 1] * gain[1], img[i * 4 + 2] * gain[2]);
    L[i] = l;
    A[i] = a;
    Bc[i] = b;
  }
  const r1 = Math.max(1, Math.round(cw / 260)),
    rS = Math.max(2, Math.round(cw / 70)),
    rL = Math.max(6, Math.round(cw / 16));
  const L1 = blurChannel(L, cw, ch, r1, 1);
  const LS = blurChannel(L, cw, ch, rS, 2);
  const LL = blurChannel(L, cw, ch, rL, 2);
  const AL = blurChannel(A, cw, ch, rL, 2);

  const eyeV = (sfr.toLocal(slm[159]).V + sfr.toLocal(slm[386]).V) / 2;
  const region = (x: number, y: number) => {
    const p = sfr.toLocal({ x, y });
    const au = Math.abs(p.U);
    return {
      U: p.U,
      V: p.V,
      forehead: p.V > 0.02 && p.V < eyeV - 0.17 && au < 0.6,
      cheek: au > 0.3 && au < 0.82 && p.V > eyeV + 0.1 && p.V < 0.78,
      tzone: (au < 0.2 && p.V > eyeV - 0.05 && p.V < 0.7) || (p.V > 0.02 && p.V < eyeV - 0.17 && au < 0.5),
      chin: p.V > 0.82 && au < 0.4,
      underEye: au > 0.18 && au < 0.68 && p.V > eyeV + 0.035 && p.V < eyeV + 0.12,
      cheekRef: au > 0.3 && au < 0.65 && p.V > eyeV + 0.17 && p.V < eyeV + 0.28,
    };
  };

  const tL: number[] = [],
    tA: number[] = [],
    tB: number[] = [],
    rgbS: number[][] = [];
  let evenAcc = 0,
    evenN = 0,
    texAcc = 0,
    texN = 0,
    redN = 0,
    shineT = 0,
    shineTN = 0,
    shineC = 0,
    shineCN = 0,
    lineAcc = 0,
    lineN = 0,
    chromaAcc = 0;
  const ueL: number[] = [],
    ckL: number[] = [];
  const redMap = new Float32Array(N),
    shineMap = new Float32Array(N),
    texMap = new Float32Array(N),
    darkMap = new Uint8Array(N);
  let meanA = 0,
    meanAN = 0;
  for (let i = 0; i < N; i++)
    if (maskA[i] > 200) {
      meanA += A[i];
      meanAN++;
    }
  meanA /= Math.max(1, meanAN);

  for (let y = 1; y < ch - 1; y++)
    for (let x = 1; x < cw - 1; x++) {
      const i = y * cw + x;
      const R = region(x, y);
      if (R.underEye) ueL.push(LS[i]);
      if (R.cheekRef) ckL.push(LS[i]);
      const m = maskA[i] / 255;
      if (m < 0.75) continue;
      if (R.cheek || R.forehead) {
        tL.push(L[i]);
        tA.push(A[i]);
        tB.push(Bc[i]);
        rgbS.push([img[i * 4], img[i * 4 + 1], img[i * 4 + 2]]);
      }
      const ev = LS[i] - LL[i];
      evenAcc += ev * ev;
      evenN++;
      const tx = Math.abs(L1[i] - LS[i]);
      texAcc += tx;
      texN++;
      texMap[i] = tx;
      chromaAcc += Math.hypot(A[i], Bc[i]);
      const red = A[i] - Math.max(meanA, AL[i] - 1);
      if (red > 3.5) {
        redN++;
        redMap[i] = clamp((red - 3.5) / 8);
      }
      const spec = L[i] - LL[i];
      const chroma = Math.hypot(A[i], Bc[i]);
      const isShine = spec > 6 && chroma < 24 ? clamp((spec - 6) / 10) : 0;
      shineMap[i] = isShine;
      if (R.tzone) {
        shineT += isShine;
        shineTN++;
      } else if (R.cheek) {
        shineC += isShine;
        shineCN++;
      }
      if (R.forehead) {
        lineAcc += Math.abs(L1[i - cw] + L1[i + cw] - 2 * L1[i]) - Math.abs(L1[i - 1] + L1[i + 1] - 2 * L1[i]) * 0.6;
        lineN++;
      }
      if (L1[i] - LS[i] < -4.5 && m > 0.9) darkMap[i] = 1;
    }

  // spots: connected components of dark map
  const spots: P[] = [];
  const seen = new Uint8Array(N);
  const minA = Math.max(2, (cw / 300) ** 2 * 3),
    maxA = (cw / 300) ** 2 * 260;
  for (let i = 0; i < N; i++) {
    if (!darkMap[i] || seen[i]) continue;
    const stack = [i];
    seen[i] = 1;
    let cnt = 0,
      sx = 0,
      sy = 0;
    while (stack.length) {
      const j = stack.pop()!;
      cnt++;
      const jx = j % cw,
        jy = (j / cw) | 0;
      sx += jx;
      sy += jy;
      for (const nb of [j - 1, j + 1, j - cw, j + cw]) {
        if (nb >= 0 && nb < N && darkMap[nb] && !seen[nb]) {
          seen[nb] = 1;
          stack.push(nb);
        }
      }
    }
    if (cnt >= minA && cnt <= maxA) {
      const px = sx / cnt,
        py = sy / cnt;
      const R = region(px, py);
      if (R.underEye) continue;
      spots.push({ x: px / sc + x0, y: py / sc + y0 });
    }
  }

  // --- tone ---
  const Lm = trimmedMean(tL, 0.2),
    Am = median(tA),
    Bm = median(tB);
  const rgbAvg = [0, 1, 2].map((k) => trimmedMean(rgbS.map((p) => p[k]), 0.2));
  const toneHex = rgbToHex(rgbAvg[0], rgbAvg[1], rgbAvg[2]);
  const ita = (Math.atan2(Lm - 50, Bm) * 180) / Math.PI;
  let depth: string, fitz: string;
  if (ita > 55) {
    depth = "Very Light";
    fitz = "I";
  } else if (ita > 41) {
    depth = "Light";
    fitz = "II";
  } else if (ita > 28) {
    depth = "Light-Medium";
    fitz = "III";
  } else if (ita > 10) {
    depth = "Medium / Tan";
    fitz = "IV";
  } else if (ita > -30) {
    depth = "Deep";
    fitz = "V";
  } else {
    depth = "Very Deep";
    fitz = "VI";
  }
  const hue = (Math.atan2(Bm, Am) * 180) / Math.PI;
  const undertone: SkinReport["undertone"] = hue < 52 ? "Cool" : hue > 61 ? "Warm" : "Neutral";

  // --- metrics ---
  const evenStd = Math.sqrt(evenAcc / Math.max(1, evenN));
  const tex = texAcc / Math.max(1, texN);
  const redFrac = redN / Math.max(1, evenN);
  const shineTF = shineT / Math.max(1, shineTN),
    shineCF = shineC / Math.max(1, shineCN);
  const shineAll = (shineT + shineC) / Math.max(1, shineTN + shineCN);
  const dcDiff = median(ckL) - median(ueL);
  const lines = lineAcc / Math.max(1, lineN);
  const chroma = chromaAcc / Math.max(1, evenN);
  const spotDensity = spots.length;

  const sc100 = (v: number) => Math.round(clamp(v, 5, 99));
  const evenScore = sc100(100 - (evenStd - 2.0) * 14);
  const texScore = sc100(100 - (tex - 0.6) * 38);
  const redScore = sc100(100 - redFrac * 260);
  const oilScore = sc100(100 - shineAll * 900);
  const dcScore = sc100(100 - (dcDiff - 2) * 5.5);
  const spotScore = sc100(100 - spotDensity * 3.2);
  const lineScore = sc100(92 - lines * 55);
  const radScore = sc100(55 + (evenScore - 60) * 0.35 + (redScore - 60) * 0.15 + (chroma - 16) * 1.2 + (texScore - 60) * 0.2);

  const metrics: Metric[] = [
    { key: "even", label: "Tone Evenness", score: evenScore, value: `σ ${evenStd.toFixed(2)} ΔL`, desc: "Uniformity of pigmentation across the face (hyperpigmentation, patchiness)." },
    { key: "texture", label: "Smoothness / Pores", score: texScore, value: `${tex.toFixed(2)} HF energy`, desc: "Fine-scale texture energy – visible pores, roughness and bumps." },
    { key: "redness", label: "Redness Control", score: redScore, value: `${(redFrac * 100).toFixed(1)}% area`, desc: "Areas with elevated a* (red) channel – irritation, rosacea or sensitivity." },
    { key: "oil", label: "Oil Balance", score: oilScore, value: `${(shineAll * 100).toFixed(1)}% shine`, desc: "Specular highlights on skin surface, mostly in the T-zone." },
    { key: "spots", label: "Clarity (Spots)", score: spotScore, value: `${spotDensity} detected`, desc: "Small local dark marks – blemishes, acne marks, sun spots, moles." },
    { key: "dark", label: "Under-Eye Brightness", score: dcScore, value: `ΔL ${dcDiff.toFixed(1)}`, desc: "Luminance drop under the eyes compared with the cheeks (dark circles)." },
    { key: "lines", label: "Firmness (Fine Lines)", score: lineScore, value: `${lines.toFixed(2)} idx`, desc: "Horizontal line energy on the forehead – fine lines and creases." },
    { key: "radiance", label: "Radiance", score: radScore, value: `C* ${chroma.toFixed(1)}`, desc: "Overall luminosity & healthy color vibrancy of the complexion." },
  ];
  const overall = Math.round(
    evenScore * 0.16 + texScore * 0.14 + redScore * 0.12 + oilScore * 0.1 + spotScore * 0.14 + dcScore * 0.1 + lineScore * 0.1 + radScore * 0.14,
  );
  let skinType: SkinReport["skinType"] = "Normal";
  if (shineAll > 0.045) skinType = "Oily";
  else if (shineTF > 0.02 && shineTF > shineCF * 2.2) skinType = "Combination";
  else if (shineAll < 0.008 && texScore < 65) skinType = "Dry";

  const concerns: string[] = [];
  const sorted = metrics.slice().sort((a, b) => a.score - b.score);
  for (const m of sorted.slice(0, 3)) if (m.score < 75) concerns.push(m.label);

  // --- routine ---
  const routine: SkinReport["routine"] = [];
  routine.push({
    step: "Cleanse",
    product: skinType === "Oily" || skinType === "Combination" ? "Gel cleanser with 0.5–2% salicylic acid" : skinType === "Dry" ? "Creamy, non-foaming ceramide cleanser" : "Gentle pH-balanced cleanser",
    why: `Matched to your ${skinType.toLowerCase()} skin pattern.`,
  });
  if (redScore < 70) routine.push({ step: "Calm", product: "Niacinamide 5% + centella / azelaic acid serum", why: "Reduces visible redness and strengthens the barrier." });
  if (evenScore < 72 || spotScore < 72) routine.push({ step: "Brighten", product: "Vitamin C (L-ascorbic 10–15%) in the morning", why: "Fades dark spots and evens out tone." });
  if (texScore < 70 || lineScore < 70) routine.push({ step: "Renew", product: "Retinoid (retinal / adapalene) 2–3× per week at night", why: "Refines pores, smooths texture and softens fine lines." });
  if (dcScore < 70) routine.push({ step: "Eye care", product: "Caffeine + peptide eye cream", why: "Brightens and de-puffs the under-eye area." });
  routine.push({
    step: "Moisturize",
    product: skinType === "Oily" ? "Oil-free gel moisturizer with hyaluronic acid" : skinType === "Dry" ? "Rich cream with ceramides & squalane" : "Lightweight lotion with ceramides",
    why: "Keeps the skin barrier healthy and hydrated.",
  });
  routine.push({ step: "Protect", product: `Broad-spectrum SPF 50${fitz <= "III" ? " (high UVA)" : " (tint-free, no white cast)"}`, why: "Prevents pigmentation, redness and premature aging." });

  // --- maps ---
  const mkMap = (vals: Float32Array, col: [number, number, number], gainK = 1) => {
    const c = makeCanvas(cw, ch);
    const x = c.getContext("2d")!;
    const id = x.createImageData(cw, ch);
    const sm = blurChannel(vals, cw, ch, Math.max(1, Math.round(cw / 150)), 1);
    for (let i = 0; i < N; i++) {
      const v = clamp(sm[i] * gainK) * (maskA[i] / 255);
      id.data[i * 4] = col[0];
      id.data[i * 4 + 1] = col[1];
      id.data[i * 4 + 2] = col[2];
      id.data[i * 4 + 3] = v * 220;
    }
    x.putImageData(id, 0, 0);
    return c;
  };
  const texN2 = new Float32Array(N);
  for (let i = 0; i < N; i++) texN2[i] = clamp((texMap[i] - 0.8) / 2.5);
  const darkF = new Float32Array(N);
  for (let i = 0; i < N; i++) darkF[i] = darkMap[i];
  const maps = {
    redness: mkMap(redMap, [255, 40, 60], 1.6),
    shine: mkMap(shineMap, [80, 200, 255], 1.8),
    texture: mkMap(texN2, [255, 190, 40], 1.4),
    spots: mkMap(darkF, [190, 80, 255], 2.5),
  };

  const report: SkinReport = {
    toneHex,
    lab: [Lm, Am, Bm],
    ita,
    depth,
    fitzpatrick: fitz,
    undertone,
    hue,
    wbGain: gain,
    metrics,
    overall,
    skinType,
    concerns,
    routine,
    maps,
    spots,
    box: { x: x0, y: y0, w: bw, h: bh },
    suggestions: suggestMakeup(undertone, fitz, toneHex, rgbAvg),
  };
  return report;
}

function suggestMakeup(under: SkinReport["undertone"], fitz: string, toneHex: string, rgb: number[]): MakeupSuggestion {
  const deep = fitz >= "V",
    light = fitz <= "II";
  const depthWord = light ? "Fair" : fitz === "III" ? "Light-Medium" : fitz === "IV" ? "Medium-Tan" : deep ? "Deep" : "Medium";
  const ut = under === "Warm" ? "W" : under === "Cool" ? "C" : "N";
  const foundHex = rgbToHex(rgb[0] * 1.02 + 4, rgb[1] * 1.02 + 3, rgb[2] * 1.0 + 2);
  const concHex = rgbToHex(rgb[0] + (255 - rgb[0]) * 0.18, rgb[1] + (255 - rgb[1]) * 0.16, rgb[2] + (255 - rgb[2]) * 0.1);
  const sets = {
    Warm: {
      lips: light
        ? [["Peachy Nude", "#d38c76"], ["Coral", "#e0705a"], ["Warm Rose", "#b9665e"], ["Brick Red", "#9e3a2a"]]
        : deep
          ? [["Caramel Nude", "#9a5a3e"], ["Burnt Orange", "#b5482a"], ["Brick", "#86301f"], ["Chocolate Berry", "#5c2422"]]
          : [["Terracotta", "#b35b43"], ["Coral Red", "#cf4a3a"], ["Toasted Nude", "#a8695a"], ["Brick Red", "#8f2f24"]],
      blush: [["Peach", "#eb9a7c"], ["Apricot", "#e08a5f"], ["Terracotta", "#c46b4f"]],
      eyes: [["Bronze", "#a0682f"], ["Gold", "#c49a4a"], ["Copper", "#b0603a"], ["Olive", "#6a6a3a"]],
      metals: "Gold, brass & rose-gold jewelry flatter you most.",
    },
    Cool: {
      lips: light
        ? [["Rosy Pink", "#c9707f"], ["Mauve", "#a86a7a"], ["Blue-Red", "#b0182f"], ["Raspberry", "#a32456"]]
        : deep
          ? [["Plum", "#6b2846"], ["Deep Berry", "#7a1f3d"], ["Wine", "#5a1626"], ["Fuchsia", "#b0306a"]]
          : [["Berry", "#8e2c4a"], ["Rose", "#b25a6c"], ["Cherry Red", "#a8172e"], ["Mauve", "#9a6070"]],
      blush: [["Cool Pink", "#ec98aa"], ["Rose", "#d27587"], ["Berry", "#b9607a"]],
      eyes: [["Taupe", "#8a7a72"], ["Plum", "#6a3d55"], ["Navy", "#2f3b5c"], ["Silver", "#a9aab3"]],
      metals: "Silver, platinum & white gold complement your skin.",
    },
    Neutral: {
      lips: light
        ? [["Dusty Rose", "#c08080"], ["Soft Nude", "#c48b7f"], ["True Red", "#b3142a"], ["Rosewood", "#9d5a5a"]]
        : deep
          ? [["Rosewood", "#7d3a38"], ["Mulberry", "#6e2440"], ["Warm Berry", "#8a2b3a"], ["Cocoa Nude", "#8a5848"]]
          : [["Rosewood", "#a65c5c"], ["Dusty Pink", "#c27a82"], ["Classic Red", "#b01e2e"], ["Nude Mauve", "#a8746e"]],
      blush: [["Soft Rose", "#e08f86"], ["Mauve", "#c47f86"], ["Warm Pink", "#df8b84"]],
      eyes: [["Champagne", "#d4b48a"], ["Mocha", "#7d5a4e"], ["Rose Gold", "#c48a7a"], ["Charcoal", "#3a3638"]],
      metals: "Both gold and silver work – mix metals freely.",
    },
  }[under];
  const toObj = (a: string[][]) => a.map(([name, hex]) => ({ name, hex }));
  const tips: string[] = [
    `Your undertone reads ${under.toLowerCase()} (hue ${ut}); choose foundation labelled “${ut}” or “${under}”.`,
    light ? "Sheer, buildable formulas look most natural on fair skin." : deep ? "Rich, highly-pigmented shades will look vibrant and true on your skin." : "Satin finishes and medium coverage suit your depth beautifully.",
    under === "Warm" ? "Avoid icy pinks & grey-toned nudes – they can look ashy." : under === "Cool" ? "Avoid orange-based corals and yellow bronzers – they can look muddy." : "You can wear both warm and cool shades – lean toward muted, balanced tones.",
  ];
  const look: Partial<MakeupState> = {
    foundation: 0.5,
    foundationTint: foundHex,
    lipColor: sets.lips[0][1],
    lip: 0.6,
    lipFinish: "satin",
    blushColor: sets.blush[0][1],
    blush: 0.45,
    shadowColor: sets.eyes[0][1],
    shadow: 0.5,
    liner: 0.5,
    wing: 0.45,
    lashes: 0.7,
    brow: 0.4,
    contour: 0.35,
    highlight: 0.4,
  };
  void toneHex;
  return {
    foundation: { name: `${depthWord} ${ut}`, hex: foundHex },
    concealer: { name: `${depthWord} ${ut} +1 shade lighter`, hex: concHex },
    lips: toObj(sets.lips),
    blush: toObj(sets.blush),
    eyes: toObj(sets.eyes),
    metals: sets.metals,
    tips,
    look,
  };
}
