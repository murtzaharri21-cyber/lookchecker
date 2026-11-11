"use client";

import { useState } from "react";
import { ChevronDown, CircleHelp, Compass, FileText, Scissors, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import type { FaceReport } from "@/lib/face-analysis";

const makeupNotes: Record<string, string> = {
  Oval: "Try placing emphasis where you prefer—eyes, cheeks, or lips. The face-shape estimate does not dictate a makeup placement.",
  Round: "If you like a lifted effect, blend cheek color softly outward. Treat placement as an experiment, not a correction.",
  Square: "For a softer effect, diffuse cheek-color edges; for a more defined look, keep the edges intentional. Both are style choices.",
  Heart: "You could try a softly blended cheek color and choose either eyes or lips as a focal point, if that balance appeals to you.",
  Oblong: "If you want a more horizontal effect, try blush across the cheek rather than extending it sharply upward.",
  Diamond: "If you want to emphasize the cheek area, use a light touch there and blend edges softly.",
};

const necklineNotes: Record<string, string> = {
  Oval: "Open, crew, or V necklines are options to try; the face reading cannot determine shoulder or neck proportions.",
  Round: "An open collar or V neckline can add a vertical line if that is a look you enjoy; comfort and occasion matter more.",
  Square: "A curved neckline can introduce a softer line, while a square neckline creates a deliberate geometric echo.",
  Heart: "A scoop or wider neckline is one option to balance an outfit visually; this is not inferred from shoulder measurements.",
  Oblong: "A crew or boat neckline can add a horizontal line if you want that effect.",
  Diamond: "Try an open or softly curved neckline if it suits your wardrobe; no body proportions were measured.",
};

function value(value: number, digits = 2) {
  return value.toFixed(digits);
}

function tiltDescription(tilt: number) {
  if (tilt > 2) return "Positive in this photo: outer eye corners estimate higher than inner corners.";
  if (tilt < -2) return "Negative in this photo: outer eye corners estimate lower than inner corners.";
  return "Near neutral in this photo: the corners estimate close to level.";
}

export function ComprehensiveEvaluation({ report }: { report: FaceReport }) {
  const thirds = report.facialThirds;
  const fifths = report.eyeGapToEyeWidth;
  return <section aria-labelledby="complete-evaluation-title" className="space-y-8 rounded-2xl border border-[#cbdad6] bg-white p-5 shadow-[0_16px_50px_rgba(33,55,49,.06)] sm:p-8">
    <header className="border-b border-[#dce7e4] pb-6">
      <p className="section-kicker">Combined photo evaluation</p>
      <h2 id="complete-evaluation-title" className="mt-2 font-heading text-[clamp(32px,4vw,44px)] leading-tight">Measurements, meaning, and practical options.</h2>
      <p className="mt-3 max-w-[760px] text-[13px] leading-[1.85] text-[#5f6965]">This detailed view brings together the measurements available from this front-facing photo and clearly marks what the scan cannot establish. Results are estimates, not clinical measurements or standards of beauty.</p>
    </header>

    <section aria-labelledby="structure-title">
      <SectionHeading icon={<Compass size={17} />} title="Structural photo measurements" id="structure-title" />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Metric title="Estimated outline" value={report.shape} explanation={`Face length-to-width ratio ${value(report.faceRatio)}; jaw-to-cheekbone ratio ${value(report.jawRatio)}.`} />
        <Metric title="Landmark alignment index" value={`${report.symmetry}/100`} explanation="A custom comparison of twelve paired landmark positions after correcting for eye-line angle. Not a clinical symmetry measurement." />
        <Metric title="Length-to-width reference" value={`${value(report.faceRatio)} · index ${report.golden}/100`} explanation="The index uses an internal reference near 1.48. The golden ratio is not a universal or evidence-based beauty target." />
        <Metric title="Upper / middle / lower thirds" value={thirds ? `${Math.round(thirds.upper * 100)} / ${Math.round(thirds.middle * 100)} / ${Math.round(thirds.lower * 100)}%` : `${report.thirds}/100 reference index`} explanation={thirds ? "Measured from forehead landmark to brow line, brow line to nose base, and nose base to chin; proportions are normalized to this image." : "This saved result does not contain the individual third proportions."} />
        <Metric title="Eye spacing reference" value={fifths === undefined ? `${report.fifths}/100 index` : `${value(fifths)} · index ${report.fifths}/100`} explanation="The ratio compares inter-eye gap with average eye width. This is not a complete five-equal-segments measurement of the whole face." />
        <Metric title="Eye opening" value={report.eyeShape} explanation={`Estimated eye spacing is ${value(report.eyeSpacing)} of face width; eye-corner angle is ${report.tilt > 0 ? "+" : ""}${value(report.tilt, 1)}°.`} />
        <Metric title="Canthal tilt estimate" value={`${report.tilt > 0 ? "+" : ""}${value(report.tilt, 1)}°`} explanation={tiltDescription(report.tilt)} />
        <Metric title="Front-view jaw proportion" value={`${value(report.jawRatio)} · index ${report.jaw}/100`} explanation="Jaw-width to cheekbone-width estimate. The index uses a reference ratio near 0.77; it is not a jaw-quality rating." />
        <Metric title="Brow alignment index" value={`${report.brow}/100`} explanation="Compares the vertical position of two brow landmarks only; it does not map ideal brow start, arch, or tail coordinates." />
      </div>
      <div className="mt-4 rounded-lg border border-[#dce7e4] bg-[#f4f8f6] p-4 text-[12px] leading-[1.8] text-[#58635f]">
        <strong className="font-semibold text-[#273330]">Not measured:</strong> gonial angle, jaw sharpness, chin depth, full facial fifths, brow start/arch/end coordinates, neck length, shoulder line, skin tone, and undertone. These need different views or measurements; the front-facing scan does not infer them.
      </div>
    </section>

    <section aria-labelledby="skin-title">
      <SectionHeading icon={<ShieldCheck size={17} />} title="Skin and image limits" id="skin-title" />
      <div className="mt-4 rounded-lg border border-[#dce7e4] bg-[#f7f9f8] p-4 text-[12px] leading-[1.8] text-[#58635f]">
        Skin texture, tone uniformity, spots, and skin conditions are <strong className="font-semibold text-[#273330]">not scored or diagnosed</strong> by this face-landmark scan. Exposure, compression, makeup, and lighting alter what a photo shows. The skin check-in uses your answers; it is not an automated skin-photo analysis. There is no objective “pretty scale.”
      </div>
    </section>

    <section aria-labelledby="style-title">
      <SectionHeading icon={<Scissors size={17} />} title="Personal style ideas" id="style-title" />
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-[#dce7e4] p-4 sm:p-5">
          <h3 className="font-heading text-[24px]">Haircuts to explore</h3>
          <p className="mt-1 text-[11px] leading-relaxed text-[#0F766E]">Starting ideas for the estimated {report.shape.toLowerCase()} outline—not a claim of mathematical optimization.</p>
          <ol className="mt-4 space-y-3">{report.hairstyles.map((style, index) => <li key={style} className="flex gap-3 text-[12px] leading-[1.7] text-[#515d58]"><span className="font-mono text-[10px] text-[#0F766E]">0{index + 1}</span><span><strong className="font-semibold text-[#252b28]">{style}.</strong> Ask a stylist how the length and upkeep work with your hair texture and routine.</span></li>)}</ol>
          <p className="mt-4 border-t border-[#e4ece9] pt-3 text-[11px] text-[#0F766E]">Parting and exact length cannot be determined as “best” from face ratios alone; try the options you personally like.</p>
        </div>
        <div className="rounded-lg border border-[#dce7e4] p-4 sm:p-5">
          <h3 className="font-heading text-[24px]">Makeup and outfit prompts</h3>
          <div className="mt-4 space-y-4 text-[12px] leading-[1.8] text-[#515d58]">
            <p><strong className="font-semibold text-[#252b28]">Makeup:</strong> {makeupNotes[report.shape] ?? makeupNotes.Oval} The eye-shape estimate is {report.eyeShape.toLowerCase()}; follow the lash line or adjust it softly to match your chosen effect.</p>
            <p><strong className="font-semibold text-[#252b28]">Color:</strong> the scan cannot identify sub-surface undertone or reliable skin contrast. Test colors in natural light and choose by your own preference.</p>
            <p><strong className="font-semibold text-[#252b28]">Neckline:</strong> {necklineNotes[report.shape] ?? necklineNotes.Oval} Shoulder width and neck length were not measured; use the dress-check tool’s comfort and occasion checklist to complete your choice.</p>
          </div>
        </div>
      </div>
      <div className="mt-4 rounded-lg bg-[#EAF5F3] p-4 text-[12px] leading-[1.8] text-[#4f5b58]">
        <strong className="font-semibold text-[#24302d]">Mirror perspective:</strong> the true-mirror tool flips a live preview horizontally in your browser. That can show the unmirrored orientation, but it cannot predict exactly how other people perceive you.
      </div>
    </section>

    <section aria-labelledby="roadmap-title">
      <SectionHeading icon={<Sparkles size={17} />} title="Low-pressure action plan" id="roadmap-title" />
      <ol className="mt-4 grid gap-3 sm:grid-cols-2">
        <PlanStep number="01 · Now" title="Make comparisons fair">If you want to compare photos, use the same camera distance, head position, relaxed expression, and soft lighting.</PlanStep>
        <PlanStep number="02 · Try" title="Pick one style experiment">Choose one haircut from the suggestions or one makeup placement to test; keep the parts of your look you already enjoy.</PlanStep>
        <PlanStep number="03 · Next" title="Complete your outfit check">Use the outfit checklist for comfort, weather, occasion, and personal preference. This scan did not measure your shoulders or neck.</PlanStep>
        <PlanStep number="04 · Over time" title="Keep only what works">Change one styling habit at a time and review it under similar conditions. No procedure, purchase, or appearance change is necessary.</PlanStep>
      </ol>
    </section>

    <p className="flex items-start gap-2 border-t border-[#dce7e4] pt-5 text-[11px] leading-[1.8] text-[#514a50]"><CircleHelp size={15} className="mt-0.5 shrink-0 text-[#0F766E]" />This is a styling and educational summary from one image. It is not a maxillofacial examination, medical assessment, validated attractiveness test, or substitute for advice from a qualified professional.</p>
  </section>;
}

export function CombinedReportDisclosure({ report }: { report: FaceReport }) {
  const [open, setOpen] = useState(true);
  return <div className="space-y-5">
    <button type="button" aria-expanded={open} aria-controls="combined-photo-evaluation" onClick={() => setOpen((previous) => !previous)} className="inline-flex min-h-10 items-center gap-2 rounded-md border border-[#a9c9c2] bg-white px-4 text-[12px] font-semibold text-[#245e58] hover:bg-[#f5faf8]">
      <FileText size={15} /> {open ? "Close combined report" : "Open detailed combined report"} <ChevronDown size={14} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
    </button>
    {open && <div id="combined-photo-evaluation"><ComprehensiveEvaluation report={report} /></div>}
  </div>;
}

function SectionHeading({ icon, title, id }: { icon: ReactNode; title: string; id: string }) {
  return <h3 id={id} className="flex scroll-mt-24 items-center gap-2 font-heading text-[27px] leading-tight text-[#1b1b1e]">{icon}{title}</h3>;
}

function Metric({ title, value, explanation }: { title: string; value: string; explanation: string }) {
  return <article className="rounded-lg border border-[#e0e9e6] bg-[#fbfcfb] p-4">
    <h4 className="text-[10px] font-semibold uppercase tracking-[.1em] text-[#64716c]">{title}</h4>
    <p className="mt-2 font-heading text-[24px] leading-tight text-[#1b1b1e]">{value}</p>
    <p className="mt-2 text-[11px] leading-[1.7] text-[#514a50]">{explanation}</p>
  </article>;
}

function PlanStep({ number, title, children }: { number: string; title: string; children: string }) {
  return <li className="rounded-lg border border-[#e0e9e6] bg-white p-4">
    <p className="font-mono text-[10px] text-[#0F766E]">{number}</p>
    <h4 className="mt-2 font-heading text-[21px] text-[#252b28]">{title}</h4>
    <p className="mt-1 text-[11px] leading-[1.75] text-[#514a50]">{children}</p>
  </li>;
}
