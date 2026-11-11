"use client";

import { ArrowRight, Check, Eye, Lightbulb, ScanFace, Sparkles } from "lucide-react";
import { HarmonyChart } from "@/components/harmony-chart";
import type { FaceReport } from "@/lib/face-analysis";
import { translateFeatureTerm, translateTool, type ToolCopyKey } from "@/lib/tool-copy";
import { useLocale } from "@/lib/use-locale";

const descriptions: Record<string, string> = {
  Symmetry: "How matching features align from one side to the other.",
  Proportions: "Face length compared with your cheekbone width.",
  Thirds: "How your visible upper, middle, and lower face divide.",
  Fifths: "The relationship between eye widths and the space between them.",
  Eyes: "Eye spacing and the angle of the eye corners.",
  Jaw: "How the lower face tapers relative to cheekbone width.",
};

export function ReportDetails({ report, sample = false }: { report: FaceReport; sample?: boolean }) {
  const locale = useLocale();
  const copy = (key: ToolCopyKey, fallback: string) => translateTool(locale, key) === key ? fallback : translateTool(locale, key);
  const dimensions = [
    { name: "Symmetry", label: copy("metricSymmetry", "Symmetry"), value: report.symmetry },
    { name: "Proportions", label: copy("metricProportions", "Proportions"), value: report.golden },
    { name: "Thirds", label: copy("metricThirds", "Thirds"), value: report.thirds },
    { name: "Fifths", label: copy("metricFifths", "Fifths"), value: report.fifths },
    { name: "Eyes", label: copy("metricEyes", "Eyes"), value: report.eyes },
    { name: "Jaw", label: copy("metricJaw", "Jaw"), value: report.jaw },
  ];
  const ratios = [
    { label: "Face length-to-width", value: report.faceRatio.toFixed(2), note: "visible forehead to chin / cheekbone width" },
    { label: "Pupil spacing", value: report.eyeSpacing.toFixed(2), note: "as a fraction of face width" },
    { label: "Jaw-to-cheekbone", value: report.jawRatio.toFixed(2), note: "front-view jaw taper" },
    { label: "Midface length", value: report.midfaceRatio.toFixed(2), note: "as a fraction of face height" },
    { label: "Canthal tilt", value: `${report.tilt > 0 ? "+" : ""}${report.tilt.toFixed(1)}°`, note: "average eye-corner angle" },
    { label: "Brow balance", value: `${report.brow}/100`, note: "brow position on each side" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="scan-result-card p-5"><span className="flex items-center gap-2 text-[11px] font-medium text-[#514a50]"><Sparkles size={14} className="text-[#0F766E]" /> {copy("featureStandout", "Standout feature")}</span><p className="mt-3 font-heading text-[23px] leading-tight">{report.bestFeature}</p><p className="mt-1.5 text-[11px] leading-relaxed text-[#514a50]">A proportion worth appreciating.</p></div>
        <div className="scan-result-card p-5"><span className="flex items-center gap-2 text-[11px] font-medium text-[#514a50]"><Lightbulb size={14} className="text-[#0F766E]" /> {copy("nextArea", "Your next area")}</span><p className="mt-3 font-heading text-[23px] leading-tight">{report.priority}</p><p className="mt-1.5 text-[11px] leading-relaxed text-[#514a50]">A place to experiment, not a flaw.</p></div>
        <div className="scan-result-card p-5"><span className="flex items-center gap-2 text-[11px] font-medium text-[#514a50]"><ScanFace size={14} className="text-[#0F766E]" /> {copy("visibleShape", "Visible face shape")}</span><p className="mt-3 font-heading text-[23px] leading-tight">{translateFeatureTerm(locale, report.shape)}</p><p className="mt-1.5 text-[11px] leading-relaxed text-[#514a50]">Based on face length and taper.</p></div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[.9fr_1.1fr]">
        <div className="scan-result-card p-5 sm:p-7"><div className="flex items-center justify-between"><div><span className="section-kicker !text-[10px]">Your face, mapped</span><h3 className="mt-1 font-heading text-[27px]">{copy("harmonyProfile", "Harmony profile")}</h3></div><Eye size={18} className="text-[#0F766E]" /></div><div className="mt-3"><HarmonyChart report={report} compact /></div><p className="mt-3 text-center text-[11px] leading-relaxed text-[#514a50]">Each spoke describes a measured relationship, not a beauty ideal.</p></div>
        <div className="scan-result-card p-5 sm:p-7"><span className="section-kicker !text-[10px]">Six dimensions</span><h3 className="mt-1 font-heading text-[27px]">{copy("behindNumbers", "Behind the numbers")}</h3><div className="mt-5 divide-y divide-[#eeeae5] border-t border-[#eeeae5]">{dimensions.map((dimension) => <div key={dimension.name} className="grid grid-cols-[1fr_50px] items-center gap-4 py-3.5"><div><div className="flex justify-between gap-2"><span className="text-[12px] font-medium text-[#3e373d]">{dimension.label}</span><span className="font-mono text-[11px] text-[#0F766E]">{dimension.value}</span></div><div className="mt-2.5 h-[5px] overflow-hidden rounded-full bg-[#f2edeb]"><div className="h-full rounded-full bg-[#16877D]" style={{ width: `${dimension.value}%` }} /></div><p className="mt-1.5 text-[10px] leading-relaxed text-[#514a50]">{descriptions[dimension.name]}</p></div></div>)}</div></div>
      </div>

      <div className="scan-result-card p-5 sm:p-7"><div className="flex items-end justify-between gap-3"><div><span className="section-kicker !text-[10px]">In proportion</span><h3 className="mt-1 font-heading text-[27px]">The closer look</h3></div><span className="hidden text-[11px] text-[#514a50] sm:block">Measured from one front-facing photo</span></div><div className="mt-5 grid gap-x-8 sm:grid-cols-2 xl:grid-cols-3">{ratios.map((ratio) => <div key={ratio.label} className="flex items-start justify-between gap-4 border-t border-[#eeeae5] py-4"><div><p className="text-[12px] font-medium text-[#443d43]">{ratio.label}</p><p className="mt-1 text-[10px] leading-relaxed text-[#514a50]">{ratio.note}</p></div><span className="shrink-0 font-heading text-[22px] leading-none text-[#0F766E]">{ratio.value}</span></div>)}</div><div className="mt-1 rounded-md bg-[#faf7f5] px-4 py-3 text-[11px] leading-relaxed text-[#514a50]">Not scored from a front photo: nose projection, chin depth, and side-profile jaw angle. We don’t guess what this photo can’t show.</div></div>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
        <div className="rounded-xl border border-[#D2E7E3] bg-[#F0F8F7] p-5 sm:p-7"><span className="section-kicker !text-[10px]">{copy("firstStep", "Your first step")}</span><h3 className="mt-2 font-heading text-[30px] leading-tight">{copy("smallChange", "A small change, your way.")}</h3><p className="mt-3 text-[13px] leading-[1.8] text-[#62565d]">{report.advice}</p><div className="mt-7 flex items-center gap-2 border-t border-[#D2E7E3] pt-4 text-[11px] text-[#514a50]"><Check size={15} className="text-[#0F766E]" /> No procedures. No impossible promises.</div></div>
        <div className="scan-result-card p-5 sm:p-7"><span className="section-kicker !text-[10px]">{copy("styleNotes", "Style notes")}</span><h3 className="mt-2 font-heading text-[30px] leading-tight">{copy("looksToExplore", "Looks to explore.")}</h3><p className="mt-2 text-[12px] leading-relaxed text-[#514a50]">A few starting ideas for your {translateFeatureTerm(locale, report.shape).toLowerCase()} face shape:</p><div className="mt-4 divide-y divide-[#eeeae5] border-y border-[#eeeae5]">{report.hairstyles.map((style, index) => <div key={style} className="flex items-center justify-between py-2.5 text-[12px] text-[#463e44]"><span><span className="mr-3 font-mono text-[10px] text-[#0F766E]">0{index + 1}</span>{style}</span><ArrowRight size={13} className="text-[#0F766E]" /></div>)}</div><p className="mt-3 text-[10px] leading-relaxed text-[#0F766E]">Your texture, comfort, and personal taste matter more than any face-shape guide.</p></div>
      </div>
      {sample && <p className="text-center text-[11px] leading-relaxed text-[#514a50]">This is an example report using illustrative measurements, not a real person’s private results.</p>}
    </div>
  );
}
