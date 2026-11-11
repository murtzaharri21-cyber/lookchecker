import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, LockKeyhole, Sparkles } from "lucide-react";
import { HarmonyChart } from "@/components/harmony-chart";
import { ReportDetails } from "@/components/report-details";
import { sampleReport } from "@/lib/face-analysis";
import { createSocialMetadata } from "@/lib/seo";

const description = "Explore an example analysis of facial symmetry, proportions, shape, and personalized style suggestions.";
export const metadata: Metadata = {
  title: "Sample Report",
  description,
  alternates: { canonical: "/sample-report" },
  ...createSocialMetadata("Sample Report", description, "/sample-report", "website", {
    image: "/images/face-report-concept.webp",
    alt: "Illustrative face report concept",
  }),
};

export default function SampleReportPage() {
  return <main>
    <section className="border-b border-[#E2E9E6] bg-[#f6f0ef]"><div className="mx-auto max-w-[1160px] px-5 pb-13 pt-10 sm:px-8 sm:pb-18"><nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-[#514a50]"><Link href="/" className="hover:text-[#0F766E]">Home</Link><ChevronRight size={12} /><span>Sample report</span></nav><div className="mt-10 grid items-center gap-9 md:grid-cols-[1fr_.8fr] md:gap-15"><div><span className="section-kicker">A report, opened up</span><h1 className="mt-3 font-heading text-[clamp(54px,6vw,76px)] leading-[.99] tracking-[-.04em]">More than meets<br />the <em className="font-normal text-[#0F766E]">eye.</em></h1><p className="mt-5 max-w-[545px] text-[15px] leading-[1.85] text-[#71676e]">Explore a complete example report. See the measurements, what they mean, and the small ideas that can help you make them your own.</p><div className="mt-7 flex flex-wrap items-center gap-3"><Link href="/tools/full-analysis" className="btn-primary">Make my own report <ArrowUpRight size={15} /></Link><span className="inline-flex items-center gap-1 text-[11px] text-[#0F766E]"><LockKeyhole size={13} /> Free private preview</span></div></div><div className="relative mx-auto w-full max-w-[430px] rounded-xl border border-[#e6deda] bg-white p-5 shadow-[0_22px_55px_rgba(59,37,45,.08)]"><div className="mb-3 flex items-center justify-between"><span className="font-heading text-[19px]">Look Checker</span><span className="rounded-full bg-[#EAF5F3] px-2.5 py-1 text-[10px] font-medium text-[#0F766E]">Sample data</span></div><div className="relative flex items-center gap-3 overflow-hidden rounded-lg bg-[#EAF5F3] pr-3"><div className="relative h-[155px] w-[125px] shrink-0 overflow-hidden"><Image src="/images/hero-portrait.webp" alt="Illustrative portrait used for sample report" fill sizes="125px" className="object-cover" /></div><div className="text-[#1b1b1e]"><p className="text-[10px] text-[#514a50]">Proportion reading</p><p className="mt-0.5 font-heading text-[58px] leading-none">86<span className="text-[23px] text-[#514a50]">/100</span></p><p className="mt-2 text-[11px] text-[#626a68]">Oval face · eye framing</p></div></div><div className="mt-1"><HarmonyChart report={sampleReport} compact /></div></div></div></div></section>
    <section className="mx-auto max-w-[1160px] px-5 py-16 sm:px-8 sm:py-21"><div className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-[#E2E9E6] pb-5"><div><p className="section-kicker">Inside the report</p><h2 className="mt-2 font-heading text-[38px] leading-tight">Sample measurements, explained.</h2></div><span className="inline-flex items-center gap-1 text-[11px] text-[#514a50]"><Sparkles size={13} /> Example data throughout</span></div><ReportDetails report={sampleReport} sample /></section>
    <section className="bg-[#EAF5F3] text-[#1b1b1e]"><div className="mx-auto flex max-w-[1160px] flex-col justify-between gap-6 px-5 py-14 sm:px-8 md:flex-row md:items-center"><div><h2 className="font-heading text-[38px] leading-[1.05]">Now, what does your face say?</h2><p className="mt-2 text-[13px] text-[#626a68]">Bring your own photo. Your free scan happens right in your browser.</p></div><Link href="/tools/attractiveness" className="btn-primary">Try a free scan <ArrowRight size={15} /></Link></div></section>
  </main>;
}
