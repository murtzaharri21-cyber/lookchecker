export type Landmark = { x: number; y: number; z?: number };
export type HairLength = "No hair" | "Short hair" | "Long hair";
export type HeadHairAssessment = {
  length: HairLength;
  visibleHairCoveragePercent: number;
  crownHairCoveragePercent: number;
  hairlineOffsetPercent: number | null;
  hairlinePoints: Landmark[];
  appearance: "No visible hair detected" | "Possible visible thinning" | "No obvious sparse coverage detected";
};

export type FaceReport = {
  score: number;
  shape: string;
  symmetry: number;
  golden: number;
  thirds: number;
  fifths: number;
  eyes: number;
  jaw: number;
  brow: number;
  tilt: number;
  faceRatio: number;
  facialThirds?: { upper: number; middle: number; lower: number };
  eyeGapToEyeWidth?: number;
  eyeSpacing: number;
  jawRatio: number;
  midfaceRatio: number;
  noseWidth: number;
  mouthWidth: number;
  eyeShape: string;
  bestFeature: string;
  priority: string;
  advice: string;
  hairstyles: string[];
  headHair?: HeadHairAssessment;
};

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, value));
const rounded = (value: number) => Math.round(value * 100) / 100;

export function analyzeHeadHair(mask: Float32Array, landmarks: Landmark[], width: number, height: number): HeadHairAssessment {
  if (landmarks.length < 468 || width <= 0 || height <= 0 || mask.length !== width * height) {
    throw new Error("Hair length could not be estimated from this photo.");
  }

  const raw = (index: number) => ({ x: landmarks[index].x * width, y: landmarks[index].y * height });
  const leftEye = { x: (raw(33).x + raw(133).x) / 2, y: (raw(33).y + raw(133).y) / 2 };
  const rightEye = { x: (raw(362).x + raw(263).x) / 2, y: (raw(362).y + raw(263).y) / 2 };
  const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
  const origin = { x: (leftEye.x + rightEye.x) / 2, y: (leftEye.y + rightEye.y) / 2 };
  const local = (index: number) => {
    const point = raw(index);
    const dx = point.x - origin.x;
    const dy = point.y - origin.y;
    return {
      x: dx * Math.cos(angle) + dy * Math.sin(angle),
      y: -dx * Math.sin(angle) + dy * Math.cos(angle),
    };
  };

  const leftCheek = local(234);
  const rightCheek = local(454);
  const forehead = local(10);
  const chin = local(152);
  const faceWidth = Math.max(Math.abs(rightCheek.x - leftCheek.x), 1);
  const faceHeight = Math.max(Math.abs(chin.y - forehead.y), 1);
  const earReferenceY = (leftCheek.y + rightCheek.y) / 2 + faceHeight * 0.08;
  const left = Math.min(leftCheek.x, rightCheek.x) - faceWidth * 0.28;
  const right = Math.max(leftCheek.x, rightCheek.x) + faceWidth * 0.28;
  const crownTop = forehead.y - faceHeight * 0.38;
  const crownBottom = forehead.y + faceHeight * 0.08;
  const crownLeft = -faceWidth * 0.55;
  const crownRight = faceWidth * 0.55;
  const top = forehead.y - faceHeight * 0.42;
  const bottom = chin.y + faceHeight * 0.5;
  const hairLengthBottom = chin.y + faceHeight * 1.1;
  let headPixels = 0;
  let hairPixels = 0;
  let crownPixels = 0;
  let crownHairPixels = 0;
  let longHairPixels = 0;
  let longHairRegionPixels = 0;
  const hairlinePoints: Landmark[] = [];
  const hairlineLocalYs: number[] = [];
  const cosine = Math.cos(angle);
  const sine = Math.sin(angle);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = x - origin.x;
      const dy = y - origin.y;
      const localX = dx * cosine + dy * sine;
      const localY = -dx * sine + dy * cosine;
      const sideBand = Math.abs(localX) >= faceWidth * 0.39;
      const confidence = mask[y * width + x];

      const longRegion = sideBand && Math.abs(localX) <= faceWidth * 0.95
        && localY > earReferenceY && localY < hairLengthBottom;
      if (longRegion) {
        longHairRegionPixels++;
        if (confidence >= 0.35) longHairPixels++;
      }

      if (localX < left || localX > right || localY < top || localY > bottom) continue;
      const isHeadRegion = localY < forehead.y + faceHeight * 0.12 || (sideBand && localY < bottom);
      if (!isHeadRegion) continue;

      headPixels++;
      if (confidence >= 0.45) hairPixels++;

      if (localX >= crownLeft && localX <= crownRight && localY >= crownTop && localY <= crownBottom) {
        crownPixels++;
        if (confidence >= 0.45) crownHairPixels++;
      }
    }
  }

  const step = Math.max(1, Math.round(faceWidth / 100));
  for (let sample = -8; sample <= 8; sample++) {
    const localX = (sample / 8) * faceWidth * 0.46;
    const startY = forehead.y - faceHeight * 0.34;
    const endY = forehead.y + faceHeight * 0.14;
    let firstHairPoint: { x: number; y: number } | null = null;

    for (let localY = startY; localY <= endY; localY += step) {
      const imageX = Math.round(origin.x + localX * cosine - localY * sine);
      const imageY = Math.round(origin.y + localX * sine + localY * cosine);
      if (imageX < 0 || imageX >= width || imageY < 0 || imageY >= height) continue;
      if (mask[imageY * width + imageX] >= 0.45) {
        firstHairPoint = { x: imageX, y: imageY };
        break;
      }
    }

    if (firstHairPoint) {
      hairlinePoints.push({ x: firstHairPoint.x / width, y: firstHairPoint.y / height });
      const dx = firstHairPoint.x - origin.x;
      const dy = firstHairPoint.y - origin.y;
      hairlineLocalYs.push(-dx * sine + dy * cosine);
    }
  }

  const rawVisibleHairCoveragePercent = headPixels ? Math.round((hairPixels / headPixels) * 100) : 0;
  const rawCrownHairCoveragePercent = crownPixels ? Math.round((crownHairPixels / crownPixels) * 100) : 0;
  const noVisibleHair = !headPixels || !crownPixels || (rawCrownHairCoveragePercent < 8 && rawVisibleHairCoveragePercent < 20);
  const visibleHairCoveragePercent = noVisibleHair ? 0 : rawVisibleHairCoveragePercent;
  const crownHairCoveragePercent = noVisibleHair ? 0 : rawCrownHairCoveragePercent;
  const hairExtendsBelowJaw = longHairRegionPixels > 0 && longHairPixels / longHairRegionPixels >= 0.02;
  const substantialPulledBackHair = rawVisibleHairCoveragePercent >= 16 && rawCrownHairCoveragePercent >= 42;
  const length: HairLength = noVisibleHair
    ? "No hair"
    : hairExtendsBelowJaw || substantialPulledBackHair
      ? "Long hair"
      : "Short hair";
  const appearance = noVisibleHair
    ? "No visible hair detected"
    : visibleHairCoveragePercent < 38 || crownHairCoveragePercent < 30
      ? "Possible visible thinning"
      : "No obvious sparse coverage detected";
  const visibleHairlinePoints = noVisibleHair ? [] : hairlinePoints;
  const hairlineOffsetPercent = visibleHairlinePoints.length >= 4
    ? rounded(((hairlineLocalYs.reduce((total, y) => total + y, 0) / hairlineLocalYs.length - forehead.y) / faceHeight) * 100)
    : null;

  return {
    length,
    visibleHairCoveragePercent,
    crownHairCoveragePercent,
    hairlineOffsetPercent,
    hairlinePoints: visibleHairlinePoints,
    appearance,
  };
}

const styleByShape: Record<string, string[]> = {
  Oval: ["Soft layers", "Textured bob", "Classic middle part"],
  Round: ["Long face-framing layers", "Side part", "Volume at the crown"],
  Square: ["Soft curtain fringe", "Wavy layers", "Side-swept bob"],
  Heart: ["Chin-length bob", "Soft side fringe", "Collarbone layers"],
  Oblong: ["Curtain bangs", "Cheekbone-length layers", "Soft waves"],
  Diamond: ["Side-swept fringe", "Jaw-length bob", "Soft face-framing layers"],
};

export function analyzeFace(landmarks: Landmark[], imageWidth: number, imageHeight: number): FaceReport {
  if (landmarks.length < 468 || imageWidth <= 0 || imageHeight <= 0) {
    throw new Error("A complete face could not be measured. Try a clearer, front-facing photo.");
  }

  const raw = (index: number) => ({
    x: landmarks[index].x * imageWidth,
    y: landmarks[index].y * imageHeight,
  });
  const leftEye = { x: (raw(33).x + raw(133).x) / 2, y: (raw(33).y + raw(133).y) / 2 };
  const rightEye = { x: (raw(362).x + raw(263).x) / 2, y: (raw(362).y + raw(263).y) / 2 };
  const eyeLineAngle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
  const origin = { x: (leftEye.x + rightEye.x) / 2, y: (leftEye.y + rightEye.y) / 2 };
  const point = (index: number) => {
    const { x, y } = raw(index);
    const dx = x - origin.x;
    const dy = y - origin.y;
    return {
      x: dx * Math.cos(eyeLineAngle) + dy * Math.sin(eyeLineAngle),
      y: -dx * Math.sin(eyeLineAngle) + dy * Math.cos(eyeLineAngle),
    };
  };
  const distance = (a: number, b: number) => {
    const p = point(a);
    const q = point(b);
    return Math.hypot(p.x - q.x, p.y - q.y);
  };
  const faceWidth = Math.max(distance(234, 454), 1);
  const faceHeight = Math.max(distance(10, 152), 1);
  const jawWidth = distance(172, 397);
  const jawRatio = jawWidth / faceWidth;
  const faceRatio = faceHeight / faceWidth;
  const pupilDistance = landmarks.length > 473 ? distance(468, 473) : Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y);
  const eyeSpacing = pupilDistance / faceWidth;
  const leftEyeWidth = distance(33, 133);
  const rightEyeWidth = distance(362, 263);
  const eyeGap = distance(133, 362);
  const leftOpening = distance(159, 145);
  const rightOpening = distance(386, 374);
  const eyeOpeningRatio = ((leftEyeWidth + rightEyeWidth) / 2) / Math.max((leftOpening + rightOpening) / 2, 1);

  const midline = (point(1).x + point(4).x + point(152).x + point(168).x) / 4;
  const pairs: [number, number][] = [
    [33, 263], [133, 362], [70, 300], [105, 334], [61, 291], [93, 323],
    [172, 397], [234, 454], [129, 358], [159, 386], [145, 374], [136, 365],
  ];
  const pairError = ([left, right]: [number, number]) => {
    const a = point(left);
    const b = point(right);
    return Math.abs(a.x + b.x - 2 * midline) / faceWidth + Math.abs(a.y - b.y) / faceHeight * 0.7;
  };
  const symmetryError = pairs.reduce((total, pair) => total + pairError(pair), 0) / pairs.length;
  const symmetry = Math.round(clamp(100 - symmetryError * 510, 35, 98));
  const browError = ([70, 300] as [number, number]).map(point);
  const brow = Math.round(clamp(100 - (Math.abs(browError[0].y - browError[1].y) / faceHeight) * 620, 35, 98));

  const upperThird = Math.abs(point(168).y - point(10).y) / faceHeight;
  const middleThird = Math.abs(point(2).y - point(168).y) / faceHeight;
  const lowerThird = Math.abs(point(152).y - point(2).y) / faceHeight;
  const thirdTotal = upperThird + middleThird + lowerThird || 1;
  const thirds = Math.round(clamp(97 - (
    Math.abs(upperThird / thirdTotal - 0.30) +
    Math.abs(middleThird / thirdTotal - 0.36) +
    Math.abs(lowerThird / thirdTotal - 0.34)
  ) * 95, 35, 98));
  const eyeGapToEyeWidth = eyeGap / Math.max((leftEyeWidth + rightEyeWidth) / 2, 1);
  const fifths = Math.round(clamp(96 - Math.abs(eyeGapToEyeWidth - 1.05) * 38, 35, 98));
  const golden = Math.round(clamp(96 - Math.abs(faceRatio - 1.48) * 70, 35, 98));
  const jaw = Math.round(clamp(96 - Math.abs(jawRatio - 0.77) * 125, 35, 98));
  const outerLeft = point(33);
  const innerLeft = point(133);
  const innerRight = point(362);
  const outerRight = point(263);
  const tiltLeft = Math.atan2(innerLeft.y - outerLeft.y, innerLeft.x - outerLeft.x) * 180 / Math.PI;
  const tiltRight = Math.atan2(innerRight.y - outerRight.y, outerRight.x - innerRight.x) * 180 / Math.PI;
  const tilt = rounded((tiltLeft + tiltRight) / 2);
  const eyes = Math.round(clamp(96 - Math.abs(eyeSpacing - 0.46) * 95 - Math.abs(tilt - 3) * 1.1, 35, 98));
  const midfaceRatio = distance(168, 2) / faceHeight;
  const noseWidth = distance(129, 358) / faceWidth;
  const mouthWidth = distance(61, 291) / faceWidth;

  let shape = "Oval";
  if (faceRatio > 1.56) shape = "Oblong";
  else if (jawRatio > 0.88 && faceRatio < 1.53) shape = "Square";
  else if (jawRatio < 0.69) shape = "Heart";
  else if (faceRatio < 1.27) shape = "Round";
  else if (jawRatio < 0.74 && faceRatio > 1.41) shape = "Diamond";

  const eyeShape = eyeOpeningRatio > 3.3 ? "Elongated" : eyeOpeningRatio > 2.55 ? "Almond" : "Round";
  const score = Math.round(symmetry * 0.28 + golden * 0.18 + thirds * 0.14 + fifths * 0.13 + eyes * 0.14 + jaw * 0.13);
  const areas = [
    { name: "Facial symmetry", value: symmetry, advice: "For a more balanced photo, face the camera straight on in soft, even daylight." },
    { name: "Face proportions", value: golden, advice: "Try face-framing layers or a different part to play with how your proportions read." },
    { name: "Facial thirds", value: thirds, advice: "A fringe or a little volume near the cheekbones can change the visual balance of your face." },
    { name: "Eye framing", value: eyes, advice: "A subtle brow tidy-up can frame your eyes without changing what makes them yours." },
    { name: "Jaw framing", value: jaw, advice: "Experiment with hair length around your jawline to bring out your natural shape." },
    { name: "Facial fifths", value: fifths, advice: "Eyewear and eyebrow styling are an easy way to experiment with the frame around your eyes." },
  ];
  const ranked = [...areas].sort((a, b) => b.value - a.value);

  return {
    score, shape, symmetry, golden, thirds, fifths, eyes, jaw, brow,
    tilt, faceRatio: rounded(faceRatio), eyeSpacing: rounded(eyeSpacing),
    facialThirds: {
      upper: rounded(upperThird / thirdTotal),
      middle: rounded(middleThird / thirdTotal),
      lower: rounded(lowerThird / thirdTotal),
    },
    eyeGapToEyeWidth: rounded(eyeGapToEyeWidth),
    jawRatio: rounded(jawRatio), midfaceRatio: rounded(midfaceRatio),
    noseWidth: rounded(noseWidth), mouthWidth: rounded(mouthWidth),
    eyeShape, bestFeature: ranked[0].name, priority: ranked[ranked.length - 1].name,
    advice: ranked[ranked.length - 1].advice,
    hairstyles: styleByShape[shape],
  };
}

export const sampleReport: FaceReport = {
  score: 86, shape: "Oval", symmetry: 88, golden: 84, thirds: 91, fifths: 86,
  eyes: 93, jaw: 80, brow: 89, tilt: 2.1, faceRatio: 1.46, eyeSpacing: 0.46,
  jawRatio: 0.78, facialThirds: { upper: 0.30, middle: 0.36, lower: 0.34 }, eyeGapToEyeWidth: 1.05,
  midfaceRatio: 0.39, noseWidth: 0.24, mouthWidth: 0.38,
  eyeShape: "Almond", bestFeature: "Eye framing", priority: "Jaw framing",
  advice: "Experiment with hair length around your jawline to bring out your natural shape.",
  hairstyles: ["Soft layers", "Textured bob", "Classic middle part"],
};
