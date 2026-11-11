export type HairstyleCategory =
  | "all"
  | "long"
  | "short"
  | "bald"
  | "retro"
  | "curly"
  | "straight"
  | "footballer";

export interface HairstyleDefinition {
  id: string;
  label: string;
  category: HairstyleCategory;
  length: "bald" | "short" | "medium" | "long";
  description: string;
  tag: string;
  image?: string;
  scaleFace?: number;
  anchorHairlineY?: number;
  hairTopY?: number;
  offsetY?: number;
  crownLift?: number;
  isBald?: boolean;
  isBuzz?: boolean;
  defaultFlipped?: boolean;
}

export interface HairShade {
  id: string;
  label: string;
  color: string;
  highlight: string;
  shadow: string;
  root: string;
  sheen: string;
}

export interface HairFitParams {
  offsetY: number;
  offsetX: number;
  scale: number;
  volume: number;
  length: number;
  flipped: boolean;
  gloss: number;
  highlightIntensity: number;
  rootDepth: number;
}

export interface NormalizedLandmark {
  x: number;
  y: number;
  z?: number;
}

export interface HeadGeometry {
  eyeCenter: { x: number; y: number };
  eyeAngle: number;
  eyeDistance: number;
  foreheadApex: { x: number; y: number };
  faceWidth: number;
  faceHeight: number;
  cranialApex: { x: number; y: number };
  leftTemple: { x: number; y: number };
  rightTemple: { x: number; y: number };
  leftCheek: { x: number; y: number };
  rightCheek: { x: number; y: number };
  chin: { x: number; y: number };
  yaw: number;
  pitch: number;
  eyeToForehead: number;
  eyeToChin: number;
  skinTone?: { r: number; g: number; b: number };
}

export const defaultFitParams: HairFitParams = {
  offsetY: 0,
  offsetX: 0,
  scale: 1.0,
  volume: 1.0,
  length: 1.0,
  flipped: false,
  gloss: 0.7,
  highlightIntensity: 0.65,
  rootDepth: 0.8,
};

export const hairShades: HairShade[] = [
  {
    id: "jet-black",
    label: "Jet Black",
    color: "#151419",
    shadow: "#0b0a0e",
    root: "#060507",
    highlight: "#34303e",
    sheen: "#5c576b",
  },
  {
    id: "espresso",
    label: "Dark Espresso",
    color: "#281b15",
    shadow: "#190f0b",
    root: "#0e0806",
    highlight: "#5a3c30",
    sheen: "#855c4d",
  },
  {
    id: "rich-chocolate",
    label: "Rich Chocolate",
    color: "#442618",
    shadow: "#2a150c",
    root: "#190b05",
    highlight: "#7e4a30",
    sheen: "#ad6a4a",
  },
  {
    id: "honey-bronde",
    label: "Honey Bronde",
    color: "#724f31",
    shadow: "#422a16",
    root: "#28180a",
    highlight: "#b48557",
    sheen: "#dfbe94",
  },
  {
    id: "golden-honey",
    label: "Golden Blonde",
    color: "#aa7a3e",
    shadow: "#61411a",
    root: "#3a250a",
    highlight: "#dfba7e",
    sheen: "#f7e3ba",
  },
  {
    id: "caramel-auburn",
    label: "Warm Auburn",
    color: "#6b2c16",
    shadow: "#3d170a",
    root: "#240c04",
    highlight: "#b15833",
    sheen: "#de855d",
  },
  {
    id: "copper-ginger",
    label: "Copper Ginger",
    color: "#97401c",
    shadow: "#57210c",
    root: "#341205",
    highlight: "#e37446",
    sheen: "#f5a785",
  },
  {
    id: "cherry-cola",
    label: "Cherry Cola",
    color: "#42101b",
    shadow: "#24070e",
    root: "#140307",
    highlight: "#7e2236",
    sheen: "#af465e",
  },
  {
    id: "platinum-ice",
    label: "Nordic Platinum",
    color: "#d8d4c9",
    shadow: "#7e786b",
    root: "#3f3a31",
    highlight: "#f4f1e9",
    sheen: "#ffffff",
  },
  {
    id: "silver-smoke",
    label: "Titanium Silver",
    color: "#8c8b92",
    shadow: "#4e4c54",
    root: "#2d2c31",
    highlight: "#cfcfd6",
    sheen: "#f2f2f7",
  },
];

export function generateShadeFromHex(hex: string, label = "Custom"): HairShade {
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split("").map((x) => x + x).join("");
  const num = parseInt(c, 16) || 0;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;

  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    if (max === rn) h = (gn - bn) / d + (gn < bn ? 6 : 0);
    else if (max === gn) h = (bn - rn) / d + 2;
    else h = (rn - gn) / d + 4;
    h = h * 60;
  }

  const hslToRgbStr = (hue: number, sat: number, light: number) => {
    hue = ((hue % 360) + 360) % 360;
    const ch = (1 - Math.abs(2 * light - 1)) * sat;
    const xh = ch * (1 - Math.abs(((hue / 60) % 2) - 1));
    const mh = light - ch / 2;
    let ro = 0, go = 0, bo = 0;
    if (hue < 60) { ro = ch; go = xh; bo = 0; }
    else if (hue < 120) { ro = xh; go = ch; bo = 0; }
    else if (hue < 180) { ro = 0; go = ch; bo = xh; }
    else if (hue < 240) { ro = 0; go = xh; bo = ch; }
    else if (hue < 300) { ro = xh; go = 0; bo = ch; }
    else { ro = ch; go = 0; bo = xh; }
    return `rgb(${Math.round((ro + mh) * 255)},${Math.round((go + mh) * 255)},${Math.round((bo + mh) * 255)})`;
  };

  return {
    id: "custom-" + hex.replace("#", ""),
    label,
    color: hex,
    root: hslToRgbStr(h, Math.max(0, s * 0.85), Math.max(0.03, l * 0.35)),
    shadow: hslToRgbStr(h, s, Math.max(0.05, l * 0.6)),
    highlight: hslToRgbStr((h + 4) % 360, Math.min(1, s * 1.08), Math.min(0.92, l * 1.35 + 0.08)),
    sheen: hslToRgbStr((h + 6) % 360, Math.max(0, s * 0.8), Math.min(0.97, l * 1.6 + 0.15)),
  };
}

export function sampleSkinToneFromImage(
  image: HTMLImageElement,
  geo: HeadGeometry,
): { r: number; g: number; b: number } {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { r: 215, g: 175, b: 150 };

    ctx.drawImage(image, 0, 0);
    const sx = Math.round(geo.foreheadApex.x * 0.5 + geo.eyeCenter.x * 0.5);
    const sy = Math.round(geo.foreheadApex.y * 0.5 + geo.eyeCenter.y * 0.5);
    const radius = 10;
    const imgData = ctx.getImageData(
      Math.max(0, sx - radius),
      Math.max(0, sy - radius),
      radius * 2,
      radius * 2,
    );

    let r = 0, g = 0, b = 0, count = 0;
    for (let i = 0; i < imgData.data.length; i += 4) {
      r += imgData.data[i];
      g += imgData.data[i + 1];
      b += imgData.data[i + 2];
      count++;
    }
    if (count > 0) {
      return {
        r: Math.round(r / count),
        g: Math.round(g / count),
        b: Math.round(b / count),
      };
    }
  } catch {
    // Fallback
  }
  return { r: 215, g: 175, b: 150 };
}

// Extract exact anatomical head geometry from 468/478 MediaPipe landmarks
export function extractHeadGeometry(
  landmarks: NormalizedLandmark[],
  width: number,
  height: number,
): HeadGeometry {
  const p = (idx: number) => ({
    x: landmarks[idx].x * width,
    y: landmarks[idx].y * height,
  });

  const leftEyeOuter = p(33);
  const leftEyeInner = p(133);
  const rightEyeOuter = p(263);
  const rightEyeInner = p(362);

  const leftEye = { x: (leftEyeOuter.x + leftEyeInner.x) / 2, y: (leftEyeOuter.y + leftEyeInner.y) / 2 };
  const rightEye = { x: (rightEyeOuter.x + rightEyeInner.x) / 2, y: (rightEyeOuter.y + rightEyeInner.y) / 2 };
  const eyeCenter = { x: (leftEye.x + rightEye.x) / 2, y: (leftEye.y + rightEye.y) / 2 };

  const eyeAngle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
  const eyeDistance = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y);

  const foreheadApex = p(10);
  const chin = p(152);
  const leftCheek = p(234);
  const rightCheek = p(454);
  const leftTemple = p(21);
  const rightTemple = p(251);
  const noseTip = p(1);

  // 2D Screen Coordinate Unit Vectors (+Y goes down):
  const vx = Math.cos(eyeAngle);
  const vy = Math.sin(eyeAngle);
  // vUp: (vy, -vx) points UPWARDS towards forehead & crown (-Y)
  const vUpX = vy;
  const vUpY = -vx;
  // vDown: (-vy, vx) points DOWNWARDS towards chin (+Y)
  const vDownX = -vy;
  const vDownY = vx;

  // Vector from eyeCenter to foreheadApex:
  const dForeheadX = foreheadApex.x - eyeCenter.x;
  const dForeheadY = foreheadApex.y - eyeCenter.y;
  // Dot product with vUp (strictly positive):
  const eyeToForehead = Math.max(
    dForeheadX * vUpX + dForeheadY * vUpY,
    eyeDistance * 0.75,
  );

  // Vector from eyeCenter to chin:
  const dChinX = chin.x - eyeCenter.x;
  const dChinY = chin.y - eyeCenter.y;
  // Dot product with vDown (strictly positive):
  const eyeToChin = Math.max(
    dChinX * vDownX + dChinY * vDownY,
    eyeDistance * 0.95,
  );

  const faceWidth = Math.max(
    Math.hypot(rightCheek.x - leftCheek.x, rightCheek.y - leftCheek.y),
    eyeDistance * 1.85,
  );
  const faceHeight = eyeToForehead + eyeToChin;

  // Cranial apex (top of skull dome): sits ~0.55x eyeToForehead above forehead apex along vUp
  const cranialApex = {
    x: foreheadApex.x + vUpX * (eyeToForehead * 0.55),
    y: foreheadApex.y + vUpY * (eyeToForehead * 0.55),
  };

  // 3D Yaw (-1 to 1)
  const noseVectorX = noseTip.x - leftEye.x;
  const noseVectorY = noseTip.y - leftEye.y;
  const projectedNose = (noseVectorX * vx + noseVectorY * vy) / Math.max(eyeDistance, 1);
  const yaw = Math.max(-1, Math.min(1, (projectedNose - 0.5) * 2.2));

  // Pitch (tilt up/down)
  const pitch = eyeToForehead / Math.max(eyeToChin, 1) - 0.72;

  return {
    eyeCenter,
    eyeAngle,
    eyeDistance,
    foreheadApex,
    faceWidth,
    faceHeight,
    cranialApex,
    leftTemple,
    rightTemple,
    leftCheek,
    rightCheek,
    chin,
    yaw,
    pitch,
    eyeToForehead,
    eyeToChin,
  };
}

// ==========================================
// REAL PHOTOGRAPHIC HAIRSTYLES (100% Client-side, Real Hair Texture)
// ==========================================

export const hairstyles: HairstyleDefinition[] = [
  // 1. LONG HAIR
  {
    id: "curtain-layers",
    label: "Curtain Fringe & Waves",
    category: "long",
    length: "long",
    description: "Parted eyebrow-skimming curtain bangs with flowing long layers past the shoulders in silky waves.",
    tag: "Trending",
    image: "/images/hairstyles/curtain-layers.webp",
    scaleFace: 1.85,
    anchorHairlineY: 0.28,
    hairTopY: 0.05,
    offsetY: -0.15,
  },
  {
    id: "glamour-waves",
    label: "Glamour Blowout Waves",
    category: "long",
    length: "long",
    description: "Full-bodied voluminous salon blowout with dimensional sweeping waves cascading past collarbones.",
    tag: "Red Carpet",
    image: "/images/hairstyles/curtain-layers.webp",
    scaleFace: 1.95,
    anchorHairlineY: 0.26,
    hairTopY: 0.04,
    offsetY: -0.18,
    defaultFlipped: true,
  },

  // 2. STRAIGHT HAIR
  {
    id: "glass-straight",
    label: "Glass Sleek Straight",
    category: "straight",
    length: "long",
    description: "Ultra-silky mirror-shine pin-straight hair with a crisp center part framing the jawline.",
    tag: "Editorial",
    image: "/images/hairstyles/glass-straight.webp",
    scaleFace: 1.68,
    anchorHairlineY: 0.22,
    hairTopY: 0.05,
    offsetY: -0.18,
  },
  {
    id: "straight-lob",
    label: "Sleek Straight Lob",
    category: "straight",
    length: "medium",
    description: "Modern shoulder-grazing straight long bob with polished center part and razor-sharp perimeter.",
    tag: "Clean Chic",
    image: "/images/hairstyles/glass-straight.webp",
    scaleFace: 1.62,
    anchorHairlineY: 0.22,
    hairTopY: 0.05,
    offsetY: -0.14,
  },

  // 3. SHORT HAIR
  {
    id: "french-bob",
    label: "French Chic Bob",
    category: "short",
    length: "short",
    description: "Chin-length blunt cut with soft inward curve framing the cheekbones and delicate brow-skimming fringe.",
    tag: "Parisian",
    image: "/images/hairstyles/french-bob.webp",
    scaleFace: 1.82,
    anchorHairlineY: 0.32,
    hairTopY: 0.07,
    offsetY: -0.10,
  },
  {
    id: "classic-crop",
    label: "Classic Clean Crop",
    category: "short",
    length: "short",
    description: "Sharp, masculine tapered crop with clean temple transitions and subtle textured fringe.",
    tag: "Timeless",
    image: "/images/hairstyles/footballer-crop.webp",
    scaleFace: 1.40,
    anchorHairlineY: 0.36,
    hairTopY: 0.08,
    offsetY: -0.04,
  },

  // 4. CURLY HAIR
  {
    id: "spiral-curls",
    label: "Defined Spiral Curls",
    category: "curly",
    length: "medium",
    description: "Bouncy shoulder-length corkscrew spiral curls with rich definition, dynamic volume, and natural shine.",
    tag: "Voluminous",
    image: "/images/hairstyles/spiral-curls.webp",
    scaleFace: 2.05,
    anchorHairlineY: 0.32,
    hairTopY: 0.06,
    offsetY: -0.12,
  },

  // 5. RETRO / OLD STYLE
  {
    id: "retro-shag",
    label: "70s Feathered Shag",
    category: "retro",
    length: "medium",
    description: "Iconic 1970s rock and roll layered shag with winged feathered sides and curtain fringe.",
    tag: "Vintage Rock",
    image: "/images/hairstyles/retro-shag.webp",
    scaleFace: 2.10,
    anchorHairlineY: 0.34,
    hairTopY: 0.05,
    offsetY: -0.10,
  },
  {
    id: "vintage-greaser",
    label: "50s Greaser Pompadour",
    category: "retro",
    length: "short",
    description: "Classic 1950s rockabilly quiff with high crown volume, side taper, and sleek pomade comb-over.",
    tag: "Golden Era",
    image: "/images/hairstyles/footballer-cr7.webp",
    scaleFace: 1.48,
    anchorHairlineY: 0.28,
    hairTopY: 0.07,
    offsetY: -0.08,
  },

  // 6. FOOTBALLER HAIRSTYLES
  {
    id: "footballer-crop",
    label: "High Skin Fade Crop",
    category: "footballer",
    length: "short",
    description: "Modern Premier League footballer haircut with a razor-sharp high drop fade and textured matte crop on top.",
    tag: "Premier League",
    image: "/images/hairstyles/footballer-crop.webp",
    scaleFace: 1.45,
    anchorHairlineY: 0.36,
    hairTopY: 0.08,
    offsetY: -0.05,
  },
  {
    id: "footballer-cr7",
    label: "CR7 Slick Razor Part",
    category: "footballer",
    length: "short",
    description: "Signature football icon comb-over with crisp razor-cut hard part, pomade shine, and skin drop fade.",
    tag: "Iconic",
    image: "/images/hairstyles/footballer-cr7.webp",
    scaleFace: 1.42,
    anchorHairlineY: 0.30,
    hairTopY: 0.08,
    offsetY: -0.06,
  },

  // 7. NO HAIR (BALD & BUZZ FADE)
  {
    id: "smooth-bald",
    label: "Smooth Shaved Head",
    category: "bald",
    length: "bald",
    description: "Clean razor-shaved scalp seamlessly contoured to your skull dome using your exact natural forehead skin tone.",
    tag: "Clean Shaven",
    isBald: true,
  },
  {
    id: "buzz-fade",
    label: "Military Buzz Stubble",
    category: "bald",
    length: "short",
    description: "Ultra-sharp military high-and-tight fade with realistic micro-stubble grain and tapered temples.",
    tag: "Sharp Stubble",
    isBuzz: true,
  },
];

// ==========================================
// IMAGE CACHING & RENDERING ENGINE
// ==========================================

const imageCache = new Map<string, HTMLImageElement>();
const tintedCanvasCache = new Map<string, HTMLCanvasElement>();

export function getCachedImage(src: string): HTMLImageElement | null {
  const cached = imageCache.get(src);
  if (cached && cached.complete && cached.naturalWidth > 0) {
    return cached;
  }
  return null;
}

export function preloadImage(src: string, onLoaded?: () => void): void {
  if (imageCache.has(src)) return;
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = src;
  img.onload = () => {
    imageCache.set(src, img);
    onLoaded?.();
  };
}

export function preloadAllHairstyleImages(onProgress?: () => void): void {
  for (const style of hairstyles) {
    if (style.image) {
      preloadImage(style.image, onProgress);
    }
  }
}

function hashStrand(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

// Generate salon-tinted hair canvas with color, depth, and sheen
function getTintedHairCanvas(
  rawImg: HTMLImageElement,
  shade: HairShade,
  style: HairstyleDefinition,
  fit: HairFitParams,
): HTMLCanvasElement {
  const cacheKey = `${style.id}-${shade.id}-${fit.gloss.toFixed(2)}-${fit.rootDepth.toFixed(2)}-${fit.highlightIntensity.toFixed(2)}`;
  const cached = tintedCanvasCache.get(cacheKey);
  if (cached) return cached;

  const canvas = document.createElement("canvas");
  canvas.width = rawImg.naturalWidth;
  canvas.height = rawImg.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  // 1. Draw base authentic real hair
  ctx.drawImage(rawImg, 0, 0);

  // If default espresso and neutral gloss, we can use raw texture directly
  if (shade.id !== "espresso" || fit.gloss !== 0.7 || fit.highlightIntensity !== 0.65) {
    // 2. Salon Dye Tinting (Color Blend mode preserves all natural strand fibers and luminance)
    ctx.save();
    ctx.globalCompositeOperation = "color";
    ctx.fillStyle = shade.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // 3. Shadow / Root depth gradient
    ctx.save();
    ctx.globalCompositeOperation = "multiply";
    const topY = canvas.height * (style.hairTopY ?? 0.05);
    const hairlineY = canvas.height * (style.anchorHairlineY ?? 0.3);
    const rootGrad = ctx.createLinearGradient(canvas.width * 0.5, topY, canvas.width * 0.5, hairlineY);
    rootGrad.addColorStop(0, shade.root);
    rootGrad.addColorStop(0.65, shade.shadow);
    rootGrad.addColorStop(1, "rgba(255, 255, 255, 1)");
    ctx.fillStyle = rootGrad;
    ctx.globalAlpha = Math.min(1.0, 0.45 * fit.rootDepth);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // 4. Highlight sheen
    if (fit.gloss > 0.1 || fit.highlightIntensity > 0.2) {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const sheenGrad = ctx.createLinearGradient(
        canvas.width * 0.2,
        topY + (hairlineY - topY) * 0.5,
        canvas.width * 0.8,
        topY + (hairlineY - topY) * 0.5,
      );
      sheenGrad.addColorStop(0, "rgba(0, 0, 0, 0)");
      sheenGrad.addColorStop(0.3, shade.highlight);
      sheenGrad.addColorStop(0.5, shade.sheen);
      sheenGrad.addColorStop(0.7, shade.highlight);
      sheenGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = sheenGrad;
      ctx.globalAlpha = Math.min(0.55, 0.35 * fit.gloss * fit.highlightIntensity);
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();
    }

    // 5. Destination-in: Restore original transparent alpha silhouette
    ctx.save();
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(rawImg, 0, 0);
    ctx.restore();
  }

  tintedCanvasCache.set(cacheKey, canvas);
  return canvas;
}

// Draw realistic scalp dome for bald & buzz cuts
function drawRealisticScalpDome(
  ctx: CanvasRenderingContext2D,
  geo: HeadGeometry,
  fit: HairFitParams,
  buzzShade: HairShade | null,
) {
  ctx.save();

  const skin = geo.skinTone ?? { r: 215, g: 175, b: 150 };
  const lightSkin = `rgb(${Math.min(255, Math.round(skin.r * 1.15))}, ${Math.min(255, Math.round(skin.g * 1.15))}, ${Math.min(255, Math.round(skin.b * 1.15))})`;
  const baseSkin = `rgb(${skin.r}, ${skin.g}, ${skin.b})`;
  const shadowSkin = `rgb(${Math.max(0, Math.round(skin.r * 0.78))}, ${Math.max(0, Math.round(skin.g * 0.76))}, ${Math.max(0, Math.round(skin.b * 0.74))})`;

  const vx = Math.cos(geo.eyeAngle);
  const vy = Math.sin(geo.eyeAngle);
  const vUpX = vy;
  const vUpY = -vx;

  const cranialTop = {
    x: geo.foreheadApex.x + vUpX * (geo.eyeToForehead * 0.65 * fit.scale),
    y: geo.foreheadApex.y + vUpY * (geo.eyeToForehead * 0.65 * fit.scale),
  };

  const leftTemple = {
    x: geo.leftTemple.x - vx * (geo.faceWidth * 0.05),
    y: geo.leftTemple.y - vy * (geo.faceWidth * 0.05),
  };

  const rightTemple = {
    x: geo.rightTemple.x + vx * (geo.faceWidth * 0.05),
    y: geo.rightTemple.y + vy * (geo.faceWidth * 0.05),
  };

  ctx.beginPath();
  ctx.moveTo(leftTemple.x, leftTemple.y);
  ctx.bezierCurveTo(
    leftTemple.x + vUpX * (geo.eyeToForehead * 0.5),
    leftTemple.y + vUpY * (geo.eyeToForehead * 0.5),
    cranialTop.x - vx * (geo.faceWidth * 0.25),
    cranialTop.y - vy * (geo.faceWidth * 0.25),
    cranialTop.x,
    cranialTop.y,
  );
  ctx.bezierCurveTo(
    cranialTop.x + vx * (geo.faceWidth * 0.25),
    cranialTop.y + vy * (geo.faceWidth * 0.25),
    rightTemple.x + vUpX * (geo.eyeToForehead * 0.5),
    rightTemple.y + vUpY * (geo.eyeToForehead * 0.5),
    rightTemple.x,
    rightTemple.y,
  );
  ctx.quadraticCurveTo(geo.foreheadApex.x, geo.foreheadApex.y, leftTemple.x, leftTemple.y);
  ctx.closePath();

  const grad = ctx.createRadialGradient(
    cranialTop.x,
    cranialTop.y + (geo.foreheadApex.y - cranialTop.y) * 0.35,
    geo.faceWidth * 0.1,
    cranialTop.x,
    cranialTop.y + (geo.foreheadApex.y - cranialTop.y) * 0.45,
    geo.faceWidth * 0.65,
  );
  grad.addColorStop(0, lightSkin);
  grad.addColorStop(0.5, baseSkin);
  grad.addColorStop(1, shadowSkin);

  ctx.fillStyle = grad;
  ctx.fill();

  if (buzzShade) {
    ctx.save();
    ctx.clip();
    const stubbleColor = buzzShade.shadow;
    ctx.fillStyle = stubbleColor;
    const numDots = 2800;

    for (let i = 0; i < numDots; i++) {
      const u = hashStrand(i * 19.3);
      const v = hashStrand(i * 47.7);
      const px = leftTemple.x + (rightTemple.x - leftTemple.x) * u + (hashStrand(i * 3.1) - 0.5) * 8;
      const py = cranialTop.y + (geo.foreheadApex.y - cranialTop.y) * v + (hashStrand(i * 7.7) - 0.5) * 8;
      const dotAlpha = 0.45 + hashStrand(i * 11) * 0.45;
      ctx.globalAlpha = dotAlpha;
      ctx.beginPath();
      ctx.arc(px, py, 0.9, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  } else {
    // Realistic specular scalp shine
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.fillStyle = "rgba(255, 255, 255, 0.32)";
    ctx.beginPath();
    ctx.ellipse(
      cranialTop.x,
      cranialTop.y + (geo.foreheadApex.y - cranialTop.y) * 0.28,
      geo.faceWidth * 0.22,
      geo.faceWidth * 0.12,
      geo.eyeAngle,
      0,
      Math.PI * 2,
    );
    ctx.filter = "blur(12px)";
    ctx.fill();
    ctx.restore();
  }

  ctx.restore();
}

// Soft contact shadow underneath hairline onto forehead
function drawForeheadContactShadow(
  ctx: CanvasRenderingContext2D,
  geo: HeadGeometry,
  fit: HairFitParams,
) {
  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  const shadowOpacity = 0.18 * fit.rootDepth;
  ctx.fillStyle = `rgba(20, 14, 12, ${shadowOpacity.toFixed(3)})`;

  const vx = Math.cos(geo.eyeAngle);
  const vy = Math.sin(geo.eyeAngle);
  const vUpX = vy;
  const vUpY = -vx;

  const shadowApex = {
    x: geo.foreheadApex.x - vUpX * 12,
    y: geo.foreheadApex.y - vUpY * 12,
  };

  ctx.beginPath();
  ctx.moveTo(geo.leftTemple.x, geo.leftTemple.y);
  ctx.quadraticCurveTo(shadowApex.x, shadowApex.y, geo.rightTemple.x, geo.rightTemple.y);
  ctx.quadraticCurveTo(geo.foreheadApex.x + vUpX * 18, geo.foreheadApex.y + vUpY * 18, geo.leftTemple.x, geo.leftTemple.y);
  ctx.closePath();

  ctx.filter = "blur(8px)";
  ctx.fill();
  ctx.restore();
}

// ==========================================
// MASTER CANVAS RENDERER ENTRY POINT
// ==========================================

export function renderHairstyleToCanvas(
  ctx: CanvasRenderingContext2D,
  geo: HeadGeometry,
  style: HairstyleDefinition,
  shade: HairShade,
  fit: HairFitParams,
  canvasWidth: number,
  canvasHeight: number,
  onImageLoaded?: () => void,
): void {
  ctx.save();

  // 1. Check Bald / Buzz styles
  if (style.isBald) {
    drawRealisticScalpDome(ctx, geo, fit, null);
    ctx.restore();
    return;
  }
  if (style.isBuzz) {
    drawRealisticScalpDome(ctx, geo, fit, shade);
    ctx.restore();
    return;
  }

  // 2. Real Photographic Hair Asset Rendering
  if (style.image) {
    const rawImg = getCachedImage(style.image);
    if (!rawImg) {
      // Trigger preload and notify caller when ready
      preloadImage(style.image, () => {
        onImageLoaded?.();
      });
      ctx.restore();
      return;
    }

    // Anatomical Coordinate Vectors
    const vx = Math.cos(geo.eyeAngle);
    const vy = Math.sin(geo.eyeAngle);
    // vUp: (vy, -vx) points UPWARDS towards cranium
    const vUpX = vy;
    const vUpY = -vx;

    const anchorYRatio = style.anchorHairlineY ?? 0.3;
    const baseScale = style.scaleFace ?? 1.7;
    const targetWidth = geo.faceWidth * baseScale * fit.scale * fit.volume;
    const targetHeight = targetWidth * (rawImg.naturalHeight / rawImg.naturalWidth) * fit.length;

    // Head-fitting anchor: Forehead apex (Landmark 10) adjusted by style offset and fit adjustments
    const offsetDistanceY = geo.eyeToForehead * (style.offsetY ?? 0) + (fit.offsetY * geo.eyeToForehead * 0.4);
    const offsetDistanceX = geo.faceWidth * (fit.offsetX * 0.25);

    const anchorTargetX = geo.foreheadApex.x + vUpX * offsetDistanceY + vx * offsetDistanceX;
    const anchorTargetY = geo.foreheadApex.y + vUpY * offsetDistanceY + vy * offsetDistanceX;

    // Contact shadow onto forehead
    drawForeheadContactShadow(ctx, geo, fit);

    // Get salon shade tinted hair canvas
    const tintedCanvas = getTintedHairCanvas(rawImg, shade, style, fit);

    // Transform and composite directly on the head
    ctx.save();
    ctx.translate(anchorTargetX, anchorTargetY);
    ctx.rotate(geo.eyeAngle);

    const isFlipped = style.defaultFlipped ? !fit.flipped : fit.flipped;
    if (isFlipped) {
      ctx.scale(-1, 1);
    }

    const drawX = -targetWidth * 0.5;
    const drawY = -targetHeight * anchorYRatio;

    ctx.drawImage(tintedCanvas, drawX, drawY, targetWidth, targetHeight);
    ctx.restore();
  }

  ctx.restore();
}
