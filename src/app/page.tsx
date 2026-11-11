import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, LockKeyhole } from "lucide-react";
import { HomeHero } from "@/components/home-hero";
import { HarmonyChart } from "@/components/harmony-chart";
import type { FaceReport } from "@/lib/face-analysis";
import { createSocialMetadata } from "@/lib/seo";
import { tools } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Free Attractiveness Check",
  description: "Explore facial features and proportions with free, private, browser-based face analysis. No account or photo upload required.",
  alternates: { canonical: "/" },
  ...createSocialMetadata(
    "Free Attractiveness Check",
    "Explore facial features and proportions with free, private, browser-based face analysis. No account or photo upload required.",
    "/",
    "website",
    { image: "/images/face-report-concept.webp", alt: "Illustrative face report concept" },
  ),
};

const toolActions: Record<string, string> = {
  "face-shape": "Find my shape",
  "attractiveness": "Explore my results",
  "symmetry": "Check my symmetry",
  "golden-ratio": "Measure my ratio",
  "jawline-score": "Score my jawline",
  "canthal-tilt": "Measure my tilt",
  "face-width-ratio": "Measure my ratio",
  "eye-spacing": "Measure my spacing",
  "facial-thirds": "Check my thirds",
  "face-rating": "Rate my face",
};

const sampleReport: FaceReport = {
  score: 86,
  shape: "Oval",
  symmetry: 88,
  golden: 84,
  thirds: 91,
  fifths: 86,
  eyes: 93,
  jaw: 80,
  brow: 78,
  tilt: 2.1,
  faceRatio: 1.46,
  eyeSpacing: 0.46,
  jawRatio: 0.78,
  midfaceRatio: 0.95,
  noseWidth: 0.26,
  mouthWidth: 0.42,
  eyeShape: "Almond",
  bestFeature: "Eye spacing",
  priority: "Jaw framing",
  advice: "Soft face-framing layers complement this face shape well.",
  hairstyles: ["Face-framing layers", "Soft waves", "Side part"],
};

export default function HomePage() {
  const featuredTools = tools.slice(0, 8);

  return (
    <main className="look-main">
      {/* ── Section 0: Hero ── */}
      <HomeHero />

      {/* ── Section 1: Visual previews ── */}
      <section className="border-t border-[#dce7e4] bg-white text-[#1b1b1e]">
        <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-16">
          <p className="section-kicker">A preview of the experience</p>
          <h2 className="section-title mt-3 max-w-[620px]">Explore the ideas behind your next look.</h2>
          <p className="section-copy mt-4 max-w-[650px]">
            These concept visuals offer a glimpse of beauty analysis and skin-care inspiration. They are illustrative artwork, not results produced by LookChecker.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <article className="overflow-hidden rounded-xl border border-[#E2E9E6] bg-[#fbfaf8]">
              <div className="relative aspect-[16/9] bg-[#f3e7df]">
                <Image
                  src="/images/face-report-concept.webp"
                  alt="Illustrative face report concept with a facial proportion overlay and sample measurements"
                  fill
                  loading="eager"
                  decoding="async"
                  sizes="(max-width: 768px) calc(100vw - 2.5rem), 560px"
                  className="object-cover"
                />
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="font-heading text-[25px]">Face report concept</h3>
                <p className="mt-2 text-[13px] leading-[1.7] text-[#626a68]">
                  The scores shown in this artwork are illustrative and are not an actual face-analysis result.
                </p>
                <Link
                  href="/sample-report"
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#245e58] underline decoration-[#a5bcb7] underline-offset-4 hover:text-[#0F766E]"
                >
                  Explore a sample report <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>

            <article className="overflow-hidden rounded-xl border border-[#E2E9E6] bg-[#fbfaf8]">
              <div className="relative aspect-[16/9] bg-[#f3e7df]">
                <Image
                  src="/images/skin-analysis-concept.webp"
                  alt="Illustrative skin analysis concept with sample cosmetic indicators and recommendations"
                  fill
                  loading="eager"
                  decoding="async"
                  sizes="(max-width: 768px) calc(100vw - 2.5rem), 560px"
                  className="object-cover"
                />
              </div>
              <div className="p-5 sm:p-6">
                <h3 className="font-heading text-[25px]">Skin-care concept</h3>
                <p className="mt-2 text-[13px] leading-[1.7] text-[#626a68]">
                  LookChecker’s skin check-in is self-guided. Photos are not automatically analyzed, and this tool does not diagnose skin conditions.
                </p>
                <Link
                  href="/tools/skin-analysis"
                  className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#245e58] underline decoration-[#a5bcb7] underline-offset-4 hover:text-[#0F766E]"
                >
                  Open the skin check-in <ArrowUpRight size={14} aria-hidden="true" />
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* ── Section 2: How It Works ── */}
      <section id="how-it-works" className="border-t border-[#dce7e4] bg-white text-[#1b1b1e]">
        <div className="mx-auto max-w-[1200px] px-5 py-14 sm:px-8 sm:py-16">
          <p className="text-[12px] font-semibold uppercase tracking-[.15em] text-[#0F766E]">How it works</p>
          <h2 className="mt-2 font-heading text-[37px] leading-[1.1] tracking-[-.025em] sm:text-[43px]">
            From a selfie to useful perspective.
          </h2>
          <div className="mt-9 grid gap-8 md:grid-cols-3 md:gap-9">
            {[
              {
                n: "01",
                title: "Choose a starting point",
                body: "Use a front-facing photo or take a selfie. The image stays in your browser.",
              },
              {
                n: "02",
                title: "Explore the measurements",
                body: "See how points around the eyes, outline, and jaw relate in this particular image.",
              },
              {
                n: "03",
                title: "Take what feels useful",
                body: "Review the context and styling ideas, then decide what—if anything—you want to try.",
              },
            ].map(({ n, title, body }) => (
              <div key={n} className="border-t border-[#dce7e4] pt-5">
                <span className="font-mono text-[12px] text-[#0F766E]">{n} / 03</span>
                <h3 className="mt-4 font-heading text-[26px] leading-tight text-[#1b1b1e]">{title}</h3>
                <p className="mt-2 max-w-[325px] text-[14px] leading-[1.8] text-[#68666c]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 3: Measurements with Context ── */}
      <section className="border-b border-[#e5e0dc] bg-[#fbfaf8]">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:gap-20">
          <div>
            <p className="section-kicker">A closer look at your features</p>
            <h2 className="section-title mt-3 max-w-[460px]">Measurements are more useful with context.</h2>
            <p className="section-copy mt-5 max-w-[470px]">
              A photo can show proportions, but it cannot define you. Use the measurements as one reference point while exploring your own preferences.
            </p>
            <div className="mt-7 divide-y divide-[#e6e1dc] border-y border-[#e6e1dc]">
              {[
                { n: "01", title: "The method", body: "Review which visible points contribute to a reading." },
                { n: "02", title: "The context", body: "Consider camera angle, lighting, and normal variation." },
                { n: "03", title: "Your choice", body: "Use any suggestions that fit your taste and routine." },
              ].map(({ n, title, body }) => (
                <div key={n} className="flex gap-5 py-4">
                  <span className="pt-1 font-mono text-[12px] text-[#514a50]">{n}</span>
                  <div>
                    <h3 className="font-heading text-[23px] leading-tight">{title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-[#514a50]">{body}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-baseline gap-3">
              <span className="font-heading text-[40px] leading-none">Always free</span>
              <span className="text-[13px] text-[#514a50]">no account, subscription, or payment</span>
            </div>
            <Link href="/tools/full-analysis" className="btn-primary mt-6">
              Preview my full report <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <p className="mt-3 text-[12px] leading-relaxed text-[#514a50]">Explore your complete report in your browser at no cost.</p>
            <Link
              href="/sample-report"
              className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#262328] underline decoration-[#b9b1b6] underline-offset-4 hover:text-[#0F766E]"
            >
              Explore a complete sample report <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>

          {/* Right side: Harmony chart card + Style portrait card */}
          <div className="grid items-stretch gap-4 sm:grid-cols-[1.3fr_.9fr] lg:gap-3">
            <div className="rounded-xl border border-[#E2E9E6] bg-white p-5 shadow-[0_18px_45px_rgba(54,36,39,.035)] sm:p-6">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-heading text-[23px]">Proportion overview</h3>
                  <p className="mt-0.5 text-[11px] text-[#514a50]">Illustrative values · sample analysis</p>
                </div>
                <span className="rounded-full bg-[#EAF5F3] px-2.5 py-1 text-[10px] font-medium text-[#0F766E]">Six measures</span>
              </div>
              <div className="py-4">
                <HarmonyChart report={sampleReport} />
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-[#eeeae5] pt-4">
                {[
                  ["Symmetry", sampleReport.symmetry],
                  ["Proportions", sampleReport.golden],
                  ["Eye framing", sampleReport.eyes],
                  ["Jaw", sampleReport.jaw],
                ].map(([label, val]) => (
                  <div key={label} className="flex justify-between gap-2 text-[12px]">
                    <span className="text-[#514a50]">{label}</span>
                    <span className="font-mono text-[#0F766E]">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col overflow-hidden rounded-xl border border-[#E2E9E6] bg-white shadow-[0_18px_45px_rgba(54,36,39,.035)]">
              <div className="p-5">
                <span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#0F766E]">Ideas to consider</span>
                <h3 className="mt-1.5 font-heading text-[22px] leading-tight">Your taste comes first.</h3>
                <p className="mt-2 text-[11px] leading-[1.7] text-[#514a50]">Use style suggestions as inspiration and adapt them to what feels like you.</p>
              </div>
              <div className="relative min-h-[225px] flex-1 bg-[#e2dcd5] sm:min-h-[285px]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt="Editorial portrait with a softly styled bob haircut"
                  loading="lazy"
                  src="/images/style-portrait.webp"
                  className="absolute inset-0 h-full w-full object-cover object-top"
                />
                <div className="absolute bottom-3 left-3 rounded-md bg-white/90 px-2.5 py-1.5 text-[10px] font-medium text-[#2b2528]">
                  Find a look that feels like you
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 4: Free Tools Grid ── */}
      <section id="free-tools" className="bg-[#F0F6F4] text-[#1b1b1e]">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[.15em] text-[#0F766E]">Free tools</p>
              <h2 className="mt-2 font-heading text-[clamp(37px,4vw,51px)] leading-tight tracking-[-.025em]">Get to know your face, for free.</h2>
              <p className="mt-3 max-w-[590px] text-[15px] leading-[1.8] text-[#626a68]">
                Real measurements, in your browser. No account, no upload, and no mystery about how the numbers are made.
              </p>
            </div>
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 border-b border-[#a5bcb7] pb-1 text-[13px] font-medium text-[#255b55] hover:border-[#0F766E]"
            >
              See all tools <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-11 grid gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {featuredTools.map((tool, i) => {
              const num = String(i + 1).padStart(2, "0");
              const action = toolActions[tool.slug] ?? tool.action ?? "Try it";
              return (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group block border-t border-[#cbdad6] pt-5 transition-colors hover:border-[#0F766E]"
                >
                  <span className="font-mono text-[11px] text-[#0F766E]">{num} / FREE</span>
                  <h3 className="mt-3 font-heading text-[26px] leading-tight">{tool.title}</h3>
                  <p className="mt-2 min-h-[76px] text-[13px] leading-[1.75] text-[#626a68]">{tool.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1 text-[12px] font-semibold text-[#245e58] underline decoration-[#a5bcb7] underline-offset-4 group-hover:decoration-[#0F766E]">
                    {action} <ArrowUpRight size={13} aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Section 5: Inside the Analysis ── */}
      <section className="bg-[#fbfaf8] text-[#1b1b1e]">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
          <p className="section-kicker">Inside the analysis</p>
          <h2 className="section-title mt-3 max-w-[560px]">Clear numbers, honest limits.</h2>
          <p className="section-copy mt-4 max-w-[560px]">
            Every result comes with what it measured and what it did not. No mystery, no inflated claims.
          </p>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {/* Card 1: Measurements */}
            <div className="rounded-xl border border-[#E2E9E6] bg-white p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-[25px]">Your measurements</h3>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#E8EFEC] pt-5">
                {[
                  { label: "Face shape", value: "Oval", sub: "natural outline" },
                  { label: "Canthal tilt", value: "+2.1°", sub: "slightly upturned" },
                  { label: "Eye spacing", value: "0.46", sub: "of face width" },
                  { label: "Jaw proportion", value: "0.78", sub: "jaw / cheekbone" },
                ].map(({ label, value, sub }) => (
                  <div key={label}>
                    <p className="text-[11px] text-[#514a50]">{label}</p>
                    <p className="mt-1 font-heading text-[29px] leading-none">{value}</p>
                    <p className="mt-1.5 text-[11px] text-[#514a50]">{sub}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 border-t border-[#E8EFEC] pt-4 text-[12px] leading-[1.7] text-[#514a50]">
                Clear measurements, plus an honest "not measured" when a front photo can't support a claim.
              </p>
            </div>

            {/* Card 2: Reference ranges */}
            <div className="rounded-xl border border-[#E2E9E6] bg-white p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-[25px]">Reference ranges</h3>
              </div>
              <div className="mt-5 space-y-6 border-t border-[#E8EFEC] pt-5">
                {[
                  { label: "Facial proportions", value: "1.46", pos: "62%" },
                  { label: "Eye spacing", value: "0.46", pos: "47%" },
                  { label: "Jaw taper", value: "0.78", pos: "55%" },
                ].map(({ label, value, pos }) => (
                  <div key={label}>
                    <div className="mb-2 flex justify-between gap-2 text-[12px]">
                      <span className="font-medium text-[#4d464c]">{label}</span>
                      <span className="font-mono text-[#0F766E]">{value}</span>
                    </div>
                    <div className="range-track" style={{ ["--position" as string]: pos }} />
                    <div className="mt-2 flex justify-between text-[10px] text-[#514a50]">
                      <span>Less</span><span>More</span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-[12px] leading-[1.7] text-[#514a50]">
                Your place in a reference band — not a judgement or an impossible ideal.
              </p>
            </div>

            {/* Card 3: Your next move */}
            <div className="rounded-xl border border-[#E2E9E6] bg-white p-6 sm:p-7">
              <h3 className="font-heading text-[25px]">Your next move</h3>
              <div className="mt-5 border-t border-[#E8EFEC] pt-5">
                <div className="flex items-start gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#f9e9ed] font-mono text-[12px] text-[#0F766E]">01</span>
                  <div>
                    <h4 className="font-heading text-[23px] leading-tight">Frame your features</h4>
                    <p className="mt-1 text-[12px] text-[#0F766E]">A simple styling experiment</p>
                  </div>
                </div>
                <p className="mt-5 text-[13px] leading-[1.8] text-[#625b62]">
                  Try soft face-framing layers to bring focus to the eyes while working with your natural proportions.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-[#E8EFEC] pt-5 text-[11px]">
                  {[["Effort", "Low"], ["First signal", "Immediately"], ["Cost", "Free to try"], ["Best for", "Oval faces"]].map(([k, v]) => (
                    <div key={k}>
                      <span className="block text-[#514a50]">{k}</span>
                      <strong className="mt-1 block font-medium">{v}</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 6: AI Beauty Studio ── */}
      <section className="overflow-hidden bg-[#f3eeec]">
        <div className="mx-auto grid max-w-[1200px] items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-[.88fr_1.12fr] md:gap-16 md:py-20">
          <div className="relative mx-auto aspect-[4/4.3] w-full max-w-[410px] overflow-hidden rounded-xl bg-[#ddd1c8] shadow-[0_25px_55px_rgba(54,36,39,.10)] md:mx-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Sample portrait used to preview beauty and hairstyle ideas in AI Beauty Studio"
              loading="lazy"
              src="/images/sample-woman.jpg"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
            <div className="absolute bottom-5 left-5 right-5 rounded-lg border border-white/35 bg-white/90 px-4 py-3">
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#0F766E]">AI Beauty Studio preview</p>
              <p className="mt-1 font-heading text-[21px] leading-tight text-[#242025]">Explore a look before you commit.</p>
            </div>
          </div>

          <div className="max-w-[510px]">
            <p className="section-kicker">Made for real life</p>
            <h2 className="section-title mt-3">Your features are the beginning of the story.</h2>
            <p className="section-copy mt-5">
              Discover what shapes and frames complement you, then make them your own. No perfect-face myth. Just genuinely useful context for the decisions you already make.
            </p>
            <div className="mt-7 space-y-3">
              {[
                "Style suggestions based on your face shape",
                "Measurements explained in plain language",
                "Practical ideas, never procedures",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-[13px] text-[#514a50]">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[#D2E7E3] text-[#0F766E]">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg>
                  </span>
                  {item}
                </div>
              ))}
            </div>
            <Link href="/tools/hairstyle-finder" className="btn-primary mt-8">
              Find hairstyles for my face <ArrowUpRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Section 7: Guides ── */}
      <section id="guides" className="border-y border-[#e8e3df] bg-[#fbfaf8]">
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="section-kicker">The reading room</p>
              <h2 className="section-title mt-2">A little more perspective.</h2>
              <p className="section-copy mt-3 max-w-[590px]">Beyond the numbers, practical guides to making sense of your features and your style.</p>
            </div>
            <ArrowDownRight size={33} strokeWidth={1} className="hidden text-[#0F766E] sm:block" aria-hidden="true" />
          </div>

          <h3 className="mt-10 font-heading text-[30px] leading-tight">Guides for every tool</h3>
          <p className="mt-2 max-w-[650px] text-[13px] leading-[1.8] text-[#71686f]">
            Explore how each Look Checker tool works, how to read its results, and what it can and cannot tell you.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { n: "01", title: "Face Shape", sub: "How to find your face shape", href: "/tools/face-shape#tool-guide-title" },
              { n: "02", title: "Attractiveness Test", sub: "How we measure harmony", href: "/tools/attractiveness#tool-guide-title" },
              { n: "03", title: "Symmetry Test", sub: "How symmetry is calculated", href: "/tools/symmetry#tool-guide-title" },
              { n: "04", title: "Golden Ratio", sub: "What the ratio actually means", href: "/tools/golden-ratio#tool-guide-title" },
              { n: "05", title: "Jawline Rating", sub: "How jaw proportion is scored", href: "/tools/jawline-score#tool-guide-title" },
              { n: "06", title: "Canthal Tilt", sub: "What your eye tilt reveals", href: "/tools/canthal-tilt#tool-guide-title" },
            ].map(({ n, title, sub, href }) => (
              <Link
                key={n}
                href={href}
                className="group flex min-h-[120px] items-start justify-between gap-4 rounded-lg border border-[#E2E9E6] bg-white p-5 transition-colors hover:border-[#9CCBC6] hover:bg-[#f8fbfa]"
              >
                <div>
                  <span className="font-mono text-[10px] text-[#0F766E]">{n} / TOOL GUIDE</span>
                  <h4 className="mt-2 font-heading text-[21px] leading-tight">{title}</h4>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#514a50]">{sub}</p>
                </div>
                <ArrowUpRight size={16} className="mt-1 shrink-0 text-[#0F766E]" aria-hidden="true" />
              </Link>
            ))}
          </div>

          <h3 className="mt-14 font-heading text-[30px] leading-tight">Recent articles</h3>
          <p className="mt-2 max-w-[650px] text-[13px] leading-[1.8] text-[#71686f]">Guides on features, style, and what a scan can and cannot tell you.</p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { tag: "Style", n: "01 / 04", title: "Hairstyles for your face shape", body: "Match a cut to your outline without over-thinking it.", href: "/guides/hairstyle-guide-for-face-shape", read: "4 min read" },
              { tag: "Features", n: "02 / 04", title: "Hairline photos: what one image can show", body: "Learn how to take a useful hairline photo and what visible hair coverage estimates actually measure.", href: "/guides/hairline-photo-guide", read: "5 min read" },
              { tag: "Everyday care", n: "03 / 04", title: "A realistic everyday glow-up guide", body: "Simple, sustainable changes that make a difference without a complicated routine.", href: "/guides/glow-up-tips", read: "3 min read" },
              { tag: "Eyewear", n: "04 / 04", title: "The right glasses for your face shape", body: "Find a flattering frame by balancing width, angles, and the fit on your actual face.", href: "/guides/glasses-for-face-shape", read: "4 min read" },
            ].map(({ tag, n, title, body, href, read }) => (
              <Link
                key={n}
                href={href}
                className="group flex min-h-[245px] flex-col rounded-xl border border-[#E2E9E6] bg-white p-6 transition-all hover:-translate-y-1 hover:border-[#9CCBC6] hover:shadow-[0_18px_32px_rgba(56,32,38,.06)] sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase tracking-[.13em] text-[#0F766E]">{tag}</span>
                  <span className="font-mono text-[11px] text-[#514a50]">{n}</span>
                </div>
                <h4 className="mt-6 max-w-[250px] font-heading text-[26px] leading-[1.12] tracking-[-.02em]">{title}</h4>
                <p className="mt-3 text-[12px] leading-[1.75] text-[#514a50]">{body}</p>
                <div className="mt-auto flex items-center justify-between border-t border-[#E8EFEC] pt-4 text-[11px] text-[#514a50]">
                  <span>{read}</span>
                  <span className="flex items-center gap-1 font-semibold text-[#0F766E]">
                    Read guide
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-1" aria-hidden="true"><path d="m9 18 6-6-6-6" /></svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 7: CTA Footer ── */}
      <section className="bg-[#EAF5F3] text-[#1b1b1e]">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[.14em] text-[#0F766E]">Always free</p>
            <h2 className="mt-3 font-heading text-[clamp(43px,5vw,65px)] leading-[1.03] tracking-[-.035em]">
              Curious about your features?
            </h2>
            <p className="mx-auto mt-5 max-w-[600px] text-[15px] leading-[1.8] text-[#626a68]">
              Every scan, tool, and report is free to use. No account, subscription, checkout, or surprise charges.
            </p>
            <Link href="/tools/attractiveness" className="btn-primary mt-7">
              Start my free analysis <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-[#68716f]">
              <LockKeyhole size={12} aria-hidden="true" /> Your photo stays on your device.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
