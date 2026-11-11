"use client";

import { useState } from "react";
import type { FaceReport } from "@/lib/face-analysis";
import { translateFeatureTerm, translateTool, translateToolOption, translateToolName, type ToolCopyKey } from "@/lib/tool-copy";
import { useLocale } from "@/lib/use-locale";

const featureDetails: Record<string, { title: string; value: (report: FaceReport) => string; context: (report: FaceReport) => string; suggestions: (report: FaceReport) => string[] }> = {
  "face-shape": {
    title: "Your face-shape reading",
    value: (report) => report.shape,
    context: (report) => `Estimated from a face-length-to-width ratio of ${report.faceRatio.toFixed(2)} and a jaw-to-cheekbone ratio of ${report.jawRatio.toFixed(2)}.`,
    suggestions: (report) => report.hairstyles.map((style) => `Consider ${style.toLowerCase()} if it fits your hair texture and personal taste.`),
  },
  attractiveness: {
    title: "Photo proportion reading",
    value: (report) => `${report.score}/100`,
    context: (report) => `A weighted summary of the photo's measured symmetry (${report.symmetry}), proportions (${report.golden}), facial thirds (${report.thirds}), fifths (${report.fifths}), eyes (${report.eyes}), and jaw (${report.jaw}).`,
    suggestions: () => ["Use consistent lighting, distance, and camera angle if comparing two photos.", "This number is not a measure of attractiveness, identity, or worth."],
  },
  "pretty-scale": {
    title: "Photo proportion snapshot",
    value: (report) => `${report.score}/100`,
    context: (report) => `The same six photo measurements: symmetry ${report.symmetry}, proportions ${report.golden}, facial thirds ${report.thirds}, fifths ${report.fifths}, eyes ${report.eyes}, and jaw ${report.jaw}.`,
    suggestions: () => ["There is no objective pretty scale; this result is only a summary of selected photo measurements.", "Camera angle, lens, lighting, and expression can change the readings."],
  },
  symmetry: {
    title: "Facial alignment reading",
    value: (report) => `${report.symmetry}/100`,
    context: () => "This compares twelve pairs of visible facial landmarks across the center line in this photo.",
    suggestions: () => ["Small left-to-right differences are normal.", "For a more consistent comparison, face the camera straight on with relaxed expression and even light."],
  },
  "golden-ratio": {
    title: "Face length-to-width ratio",
    value: (report) => report.faceRatio.toFixed(2),
    context: () => "Visible forehead-to-chin length divided by cheekbone width. This measurement does not establish a beauty ideal.",
    suggestions: () => ["Treat the value as a description of this photo, not a target to change.", "Head angle and camera distance can affect the estimate."],
  },
  "jawline-score": {
    title: "Front-view jaw proportion",
    value: (report) => `${report.jawRatio.toFixed(2)} · ${report.jaw}/100`,
    context: () => "Compares front-view jaw width with cheekbone width. It cannot measure a side-profile angle.",
    suggestions: () => ["This is a front-view proportion only; a selfie cannot reliably show jaw depth or gonial angle.", "If experimenting with styling, try hair length and framing that you personally enjoy."],
  },
  "canthal-tilt": {
    title: "Eye-corner angle",
    value: (report) => `${report.tilt > 0 ? "+" : ""}${report.tilt.toFixed(1)}°`,
    context: (report) => report.tilt > 2 ? "The outer eye corners appear slightly higher than the inner corners in this image." : report.tilt < -2 ? "The outer eye corners appear slightly lower than the inner corners in this image." : "The eye corners appear close to level in this image.",
    suggestions: () => ["The angle is a small photo-based estimate and can shift with expression, tilt, or camera position.", "Avoid treating one direction as better than another."],
  },
  "eye-shape": {
    title: "Visible eye-opening shape",
    value: (report) => report.eyeShape,
    context: () => "Estimated from the ratio of eye-opening width to height in this photo.",
    suggestions: () => ["This describes the visible eye opening, not a permanent or medical classification.", "Eyelid position, expression, and camera angle can affect the estimate."],
  },
  "facial-ratios": {
    title: "Facial measurements",
    value: () => "Photo ratios",
    context: () => "Relative distances measured between visible facial landmarks.",
    suggestions: () => ["Ratios are specific to this image; they do not represent real-world millimeters.", "Lighting, perspective, and head angle may affect the measurements."],
  },
  "hairstyle-finder": {
    title: "Hairline and hair coverage check",
    value: (report) => report.headHair?.appearance ?? "Hair detection unavailable",
    context: (report) => report.headHair?.length === "No hair"
      ? "No visible hair was detected above the scan’s detection threshold in the estimated head and crown regions. This image estimate is not a diagnosis."
      : report.headHair
        ? `The scan detected visible hair in ${report.headHair.visibleHairCoveragePercent}% of the estimated head zone and ${report.headHair.crownHairCoveragePercent}% of the crown zone. These image estimates are not a diagnosis.`
        : "Hair coverage could not be estimated from this photo.",
    suggestions: (report) => [
      ...(report.headHair?.hairlineOffsetPercent === null || report.headHair?.hairlineOffsetPercent === undefined
        ? ["The front hairline was not clear enough to measure in this photo."]
        : [`The estimated front hairline sits ${Math.abs(report.headHair.hairlineOffsetPercent)}% of face height ${report.headHair.hairlineOffsetPercent < 0 ? "above" : "below"} the forehead reference.`]),
      "A front-facing photo cannot show the crown or confirm hair loss; lighting, pose, styling, and image quality can affect this estimate.",
    ],
  },
  "eyebrow-mapping": {
    title: "Brow alignment",
    value: (report) => `${report.brow}/100`,
    context: () => "Compares the vertical positions of the two brow landmarks after accounting for eye-line angle.",
    suggestions: () => ["Use the reading as a mapping reference, not a symmetry target.", "If shaping brows, keep their natural growth and your preferred style in mind."],
  },
};

const makeupByShape: Record<string, string> = {
  Oval: "If you want balance, keep your natural proportions in focus; choose one feature—eyes or lips—to emphasize.",
  Round: "If you like a lifted effect, try softly blending blush outward across the cheek and keep the placement comfortable for you.",
  Square: "If you prefer a softer finish, diffuse blush edges rather than drawing sharp lines; defined looks work too if that is your style.",
  Heart: "If you want balance between upper and lower face, try a soft cheek color and choose either a defined eye or lip as your focal point.",
  Oblong: "If you want a more horizontal look, try blush placed across the cheek rather than extending it sharply upward.",
  Diamond: "If you want to emphasize the cheek area, use a light touch there and keep edges softly blended.",
};

function MakeupSuggestions({ report }: { report: FaceReport }) {
  const locale = useLocale();
  const copy = (key: ToolCopyKey, fallback: string) => translateTool(locale, key) === key ? fallback : translateTool(locale, key);
  const [finish, setFinish] = useState("everyday");
  const [palette, setPalette] = useState("personal");
  const finishDescription = finish === "defined"
    ? "For a more defined finish, build color gradually and keep edges blended."
    : finish === "playful"
      ? "For a playful finish, try one color accent at a time and choose shades you enjoy."
      : "For an everyday finish, start with light layers and add only what you like.";
  const paletteDescription = palette === "warm" ? "You selected warm-toned colors; try those you already enjoy." :
    palette === "cool" ? "You selected cool-toned colors; try those you already enjoy." :
      palette === "bright" ? "You selected brighter colors; you can keep the rest of the look simple or mix freely." :
        "Choose shades based on your preference; the tool does not infer skin tone or undertone.";
  const eyeTip = report.eyeShape === "Round"
    ? "Your photo reads as a round eye opening. If you want added length, softly extend shadow or liner outward."
    : report.eyeShape === "Elongated"
      ? "Your photo reads as an elongated eye opening. You can follow the natural lash line or experiment with a softly blended shape."
      : "Your photo reads as an almond eye opening. A fine line along the lash line or a softly blended shadow can follow its natural shape.";
  const tiltTip = report.tilt > 2
    ? "The eye-corner estimate angles slightly upward; follow the lash line or soften the outer edge as you prefer."
    : report.tilt < -2
      ? "The eye-corner estimate angles slightly downward; a softly lifted outer shadow is one optional way to vary the look."
      : "The eye-corner estimate is close to level; many liner and shadow placements can work—choose what you enjoy.";

  return <div className="space-y-5">
    <div className="grid gap-4 rounded-xl border border-[#E2E9E6] bg-white p-5 sm:grid-cols-2 sm:p-6">
      <label className="grid gap-2 text-[12px] font-medium text-[#4b514e]">{copy("makeupFinish", "Makeup finish")}
        <select value={finish} onChange={(event) => setFinish(event.target.value)} className="min-h-10 rounded-md border border-[#d7e2df] bg-white px-3 font-normal">
          <option value="everyday">{translateToolOption(locale, "Everyday and light")}</option><option value="defined">{translateToolOption(locale, "More defined")}</option><option value="playful">{translateToolOption(locale, "Playful and colorful")}</option>
        </select>
      </label>
      <label className="grid gap-2 text-[12px] font-medium text-[#4b514e]">{copy("colorPreference", "Color direction you prefer")}
        <select value={palette} onChange={(event) => setPalette(event.target.value)} className="min-h-10 rounded-md border border-[#d7e2df] bg-white px-3 font-normal">
          <option value="personal">{translateToolOption(locale, "I’ll choose my own")}</option><option value="warm">{translateToolOption(locale, "Warm tones")}</option><option value="cool">{translateToolOption(locale, "Cool tones")}</option><option value="bright">{translateToolOption(locale, "Bright colors")}</option>
        </select>
      </label>
    </div>
    <div className="grid gap-4 sm:grid-cols-2">
      <AdviceCard title={copy("faceShapeIdea", "Face-shape idea")} value={translateFeatureTerm(locale, report.shape)} text={makeupByShape[report.shape] ?? makeupByShape.Oval} />
      <AdviceCard title={copy("eyeShapeIdea", "Eye-shape idea")} value={translateFeatureTerm(locale, report.eyeShape)} text={eyeTip} />
      <AdviceCard title={copy("eyeCornerDetail", "Eye-corner detail")} value={`${report.tilt > 0 ? "+" : ""}${report.tilt.toFixed(1)}°`} text={tiltTip} />
      <AdviceCard title={copy("chosenStyle", "Your chosen style")} value={finish === "everyday" ? translateToolOption(locale, "Everyday and light") : finish === "defined" ? translateToolOption(locale, "More defined") : translateToolOption(locale, "Playful and colorful")} text={`${finishDescription} ${paletteDescription}`} />
    </div>
    <p className="rounded-md bg-[#F0F6F4] px-4 py-3 text-[11px] leading-relaxed text-[#596360]">These optional ideas use face and eye proportions only. The photo is analyzed on this device; skin tone, undertone, skin condition, and product suitability are not inferred.</p>
  </div>;
}

function AdviceCard({ title, value, text }: { title: string; value: string; text: string }) {
  return <section className="rounded-xl border border-[#dce7e4] bg-white p-5">
    <p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#0F766E]">{title}</p>
    <h3 className="mt-2 font-heading text-[24px] text-[#1b1b1e]">{value}</h3>
    <p className="mt-2 text-[12px] leading-[1.8] text-[#646d69]">{text}</p>
  </section>;
}

export function ToolResultDetails({ report, toolSlug }: { report: FaceReport; toolSlug: string }) {
  const locale = useLocale();
  const details = featureDetails[toolSlug];
  const focusedResult = toolSlug === "makeup-suggestions"
    ? <MakeupSuggestions report={report} />
    : details
      ? <section className="space-y-4 rounded-xl border border-[#dce7e4] bg-[#EAF5F3] p-5 sm:p-7">
        <div><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#0F766E]">{translateToolName(locale, toolSlug, details.title)}</p><h3 className="mt-2 font-heading text-[32px] leading-tight text-[#1b1b1e]">{translateFeatureTerm(locale, details.value(report))}</h3><p className="mt-2 text-[12px] leading-[1.8] text-[#596360]">{details.context(report)}</p></div>
        <ul className="space-y-2 border-t border-[#cbdad6] pt-4">{details.suggestions(report).map((item) => <li key={item} className="flex gap-2.5 text-[12px] leading-[1.8] text-[#4f5b58]"><span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#0F766E]" />{item}</li>)}</ul>
      </section>
      : null;
  if (!focusedResult) return null;
  return <section className="space-y-4">{focusedResult}</section>;
}
