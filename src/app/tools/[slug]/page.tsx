import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check, ChevronRight, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { ScanExperience } from "@/components/scan-experience";
import { ToolGuide } from "@/components/tool-guide";
import { LocalizedToolName } from "@/components/localized-tool-name";
import { ToolPageHeading } from "@/components/tool-page-heading";
import { ToolText } from "@/components/tool-text";
import { AppearanceChecker } from "@/components/appearance-checker";
import { HairstyleTryOn } from "@/components/hairstyle-try-on";
import { TrueMirror } from "@/components/true-mirror";
import { getTool, tools, type ToolDefinition } from "@/lib/site-data";
import { toolGuides } from "@/lib/tool-guides";
import { createSocialMetadata, siteUrl } from "@/lib/seo";

const fullTool: ToolDefinition = {
  slug: "full-analysis",
  title: "Your Complete Face Analysis",
  eyebrow: "Complete face analysis",
  description: "Review facial shape, symmetry, ratios, and styling suggestions side by side in a single browser-based report preview.",
  action: "Create my report",
  metric: "Complete face report",
  formula: "A weighted combination of symmetry (28%), face proportions (18%), thirds (14%), fifths (13%), eyes (14%), and jaw taper (13%).",
  detail: "Every measurement and styling suggestion is included at no cost. There are no paid features, subscriptions, or checkout.",
};

export function generateStaticParams() {
  return [...tools.map(({ slug }) => ({ slug })), { slug: "full-analysis" }];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = slug === "full-analysis" ? fullTool : getTool(slug);
  const guide = toolGuides[slug];
  const thumbnail = slug === "skin-analysis"
    ? { image: "/images/skin-analysis-concept.webp", alt: "Illustrative skin analysis concept" }
    : slug === "attractiveness" || slug === "full-analysis"
      ? { image: "/images/face-report-concept.webp", alt: "Illustrative face report concept" }
      : undefined;
  return {
    title: tool?.title ?? "Face analysis tool",
    description: guide?.description ?? tool?.description,
    keywords: guide?.keywords,
    alternates: { canonical: `/tools/${slug}` },
    ...createSocialMetadata(
      tool?.title ?? "Face analysis tool",
      guide?.description ?? tool?.description ?? "",
      `/tools/${slug}`,
      "website",
      thumbnail,
    ),
  };
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const full = slug === "full-analysis";
  const tool = full ? fullTool : getTool(slug);
  if (!tool) notFound();
  const guide = toolGuides[slug];
  if (!guide) notFound();
  const mirror = slug === "true-mirror";
  const related = tools.filter((item) => item.slug !== slug).slice(slug === "attractiveness" ? 0 : 1, slug === "attractiveness" ? 3 : 4);
  const faqs: [string, string][] = slug === "hairstyle-finder"
    ? [
      ["What does the Hair & Hairline Check measure?", "It estimates visible hair coverage in head and crown regions and traces the front hairline when visible. The percentages describe pixels in this photo; they do not count individual hairs or diagnose hair loss."],
      ["Can one photo tell me if I am going bald?", "No. A single front-facing photo cannot confirm hair loss or show the full crown. Lighting, hairstyle, angle, and image quality can affect the estimate. If you are concerned about persistent changes, consult a qualified healthcare professional."],
      ["How can I get a clearer hairline estimate?", "Use an evenly lit, unfiltered photo with your forehead and front hairline visible. Keep the camera at eye level and avoid hats, shadows, and hair covering the hairline."],
      ["Does my photo leave my device?", "No. Image analysis runs locally in your browser. Your photo is not uploaded or saved by Look Checker."],
      ["Do I need an account?", "No. The check works in your browser without signing up."],
    ]
    : slug === "hairstyle-try-on"
    ? [
      ["Does the hairstyle preview change my photo?", "It renders a realistic, multi-layered hairstyle simulation fitted to your facial structure and head proportions. It runs 100% on your device and does not upload your image."],
      ["Does my photo leave my device?", "No. Your photo is processed locally in your browser using client-side AI landmark mapping. No photo or data is ever uploaded to any server or external API."],
      ["Can I adjust the fit to match my hairline?", "Yes! You have full precision controls to nudge hairline height, adjust head scale, crown volume, hair length, and parting mirror flip."],
      ["Do I need an account?", "No. The hairstyle try-on works completely free in your browser with no account or signup required."],
    ]
    : tool.mode === "skin"
    ? [
      ["What happens after I upload a photo?", "The photo appears as a private visual reference, followed by a brief check-in reply based on your selected answers. The image itself is not automatically analyzed or used to diagnose skin."],
        ["Does the photo leave my device?", "No. The selected image is displayed locally in your browser and is not uploaded."],
        ["Is this medical advice?", "No. This is general cosmetic information, not diagnosis or treatment. Ask a qualified professional about persistent or concerning skin changes."],
        ["Do I need an account?", "No. The check-in works without signing up, and your selections stay in your browser."],
      ]
    : tool.mode === "outfit"
      ? [
        ["Do I need to upload an outfit photo?", "A photo is optional and appears only as a local visual reference. The tool does not automatically identify clothes, assess fit, or rate the image."],
        ["What happens after I add a photo?", "You’ll see a short outfit check-in based on your selected occasion and priority. The image is not analyzed; use the checklist to consider comfort, movement, and weather."],
        ["Does my photo leave my device?", "No. Your photo stays in your browser and is not uploaded."],
        ["How are the suggestions chosen?", "They reflect the options and checklist items you select. The tool does not judge your body or tell you what you should wear."],
          ["Do I need an account?", "No. Your checklist runs in your browser without signing up."],
        ]
      : tool.mode === "glow-up"
        ? [
            ["Do I need a photo?", "No. Choose a focus and a time budget; the planner builds a small checklist from those choices."],
            ["Are procedures or purchases recommended?", "No. The ideas focus on optional everyday styling and grooming using what feels comfortable for you."],
            ["Do I need an account?", "No. The planner works in your browser without signing up."],
          ]
        : mirror
          ? [
              ["Is my camera feed recorded or uploaded?", "No. The live camera preview stays in your browser and stops when you close the tool or click Stop."],
              ["What does the true-view toggle do?", "It flips the live preview between mirrored and unmirrored orientation. It does not change or assess your appearance."],
              ["Do I need an account?", "No. The live mirror works without signing up."],
            ]
          : [
              ["Does my photo leave my device?", "No. The face scan runs in your browser. Your photo and measurements stay in the current tab and are not uploaded or saved by Look Checker."],
              [slug === "attractiveness" || slug === "pretty-scale" ? "Is this a beauty rating?" : `What does ${tool.title.toLowerCase()} measure?`, slug === "attractiveness" || slug === "pretty-scale" ? "No. The number summarizes selected photo measurements; it is not a rating of attractiveness or personal worth." : `${tool.detail} Results are estimates from one photo, not a judgement of you.`],
              ["Do I need an account?", "No. Every free tool works without signing up. Scan results are not saved and are cleared when you reset the scan or leave the page."],
              ["Is this medical advice?", "No. This tool provides general photo-based measurements or styling ideas and does not diagnose health conditions."],
            ];
  const toolStructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": new URL(`/tools/${slug}#application`, siteUrl).toString(),
        name: tool.title,
        description: tool.description,
        url: new URL(`/tools/${slug}`, siteUrl).toString(),
        applicationCategory: "LifestyleApplication",
        operatingSystem: "Any",
        isAccessibleForFree: true,
        provider: { "@id": new URL("/#organization", siteUrl).toString() },
      },
      {
        "@type": "FAQPage",
        "@id": new URL(`/tools/${slug}#faq`, siteUrl).toString(),
        mainEntity: faqs.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      },
    ],
  };

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolStructuredData).replace(/</g, "\\u003c") }} />
    <section className="border-b border-[#E2E9E6] bg-[#f7f3f1]"><div className="mx-auto max-w-[1160px] px-5 pb-11 pt-11 sm:px-8 sm:pb-15 sm:pt-14"><nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-[#514a50]"><Link href="/" className="hover:text-[#0F766E]"><ToolText copyKey="home">Home</ToolText></Link><ChevronRight size={12} /><Link href="/tools" className="hover:text-[#0F766E]"><ToolText copyKey="tools">Free tools</ToolText></Link><ChevronRight size={12} /><span className="text-[#4c444a]"><LocalizedToolName slug={slug} fallback={tool.title} /></span></nav><div className="mt-9 flex flex-wrap items-end justify-between gap-5"><ToolPageHeading slug={slug} title={tool.title} eyebrow={tool.eyebrow} description={tool.description} mode={tool.mode} full={full} /><span className="inline-flex items-center gap-1.5 rounded-full border border-[#e7d5da] bg-white px-3 py-2 text-[11px] font-medium text-[#286D68]"><LockKeyhole size={13} /> <ToolText copyKey={mirror ? "privateCamera" : "freeDevice"}>{mirror ? "Private live camera" : "Free · on your device"}</ToolText></span></div></div></section>
    <section id="tool" className="bg-[#fbfaf8] pt-10 sm:pt-13">{slug === "hairstyle-try-on" ? <div className="mx-auto max-w-[1100px] px-5 pb-16 sm:px-8 sm:pb-20"><HairstyleTryOn /></div> : tool.mode ? <div className="mx-auto max-w-[1000px] px-5 pb-16 sm:px-8 sm:pb-20"><AppearanceChecker tool={tool} /></div> : mirror ? <TrueMirror /> : <ScanExperience tool={tool} full={full} />}</section>
    {!tool.mode && <section className="border-t border-[#E2E9E6] bg-white"><div className="mx-auto grid max-w-[1160px] gap-10 px-5 py-17 sm:px-8 sm:py-20 lg:grid-cols-[.85fr_1.15fr] lg:gap-20"><div><p className="section-kicker"><ToolText copyKey="method">The method</ToolText></p><h2 className="section-title mt-2"><ToolText copyKey="methodTitle">The measure behind the meaning.</ToolText></h2><p className="section-copy mt-4 max-w-[425px]"><ToolText copyKey="methodIntro">No secret formula or mysterious upload. We believe you should know exactly what your result is based on.</ToolText></p><div className="mt-7 flex items-start gap-3 rounded-lg border border-[#e4d8da] bg-[#F0F8F7] p-4"><ShieldCheck size={19} className="mt-0.5 shrink-0 text-[#0F766E]" /><p className="text-[12px] leading-[1.75] text-[#665b63]">{mirror ? "The mirror runs entirely in your browser. Camera frames are not recorded, uploaded, or saved." : slug === "hairstyle-try-on" ? "Your photo stays on your device. Landmarks align cranial volume, tilt, and hairline locally in your browser with zero external APIs." : <ToolText copyKey="photoPrivacy">The free scan maps facial landmarks in your browser. Your photo never goes to our server. Saving measurements is always optional.</ToolText>}</p></div></div><div className="space-y-4"><div className="rounded-xl border border-[#E2E9E6] bg-[#fbfaf8] p-6"><span className="font-mono text-[11px] text-[#0F766E]">01 / <ToolText copyKey="measurement">THE MEASUREMENT</ToolText></span><h3 className="mt-3 font-heading text-[25px]">{tool.metric}</h3><p className="mt-2 text-[13px] leading-[1.8] text-[#6e666d]">{tool.formula}</p></div><div className="rounded-xl border border-[#E2E9E6] bg-[#fbfaf8] p-6"><span className="font-mono text-[11px] text-[#0F766E]">02 / <ToolText copyKey="howToRead">HOW TO READ IT</ToolText></span><h3 className="mt-3 font-heading text-[25px]"><ToolText copyKey="contextMatters">Context is everything.</ToolText></h3><p className="mt-2 text-[13px] leading-[1.8] text-[#6e666d]">{tool.detail}</p></div><div className="rounded-xl border border-[#E2E9E6] bg-[#fbfaf8] p-6"><span className="font-mono text-[11px] text-[#0F766E]">03 / <ToolText copyKey="betterPhoto">A BETTER PHOTO</ToolText></span><h3 className="mt-3 font-heading text-[25px]"><ToolText copyKey="consistentConditions">Keep conditions consistent.</ToolText></h3><p className="mt-2 text-[13px] leading-[1.8] text-[#6e666d]">{slug === "hairstyle-try-on" ? "A front-facing portrait centered in good lighting gives the AI landmark detector the clearest view of your head shape, facial proportions, and hairline." : "Face the camera, use soft daylight, hold a neutral expression, and leave a little room around your face. Results can change when your angle or lighting changes."}</p></div></div></div></section>}
    <ToolGuide guide={guide} toolSlug={slug} />
    <section className="border-t border-[#E2E9E6] bg-[#f8f5f3]"><div className="mx-auto max-w-[1160px] px-5 py-15 sm:px-8 sm:py-18"><p className="section-kicker"><ToolText copyKey="goodToKnow">Good to know</ToolText></p><h2 className="mt-2 font-heading text-[34px] leading-tight"><ToolText copyKey="faqTitle">Frequently asked questions.</ToolText></h2><div className="mt-7 max-w-[820px] divide-y divide-[#E2E9E6] border-y border-[#E2E9E6]">{faqs.map(([question, answer]) => <details key={question} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[14px] font-medium text-[#393139]"><span>{question}</span><span className="text-[22px] font-light leading-none text-[#0F766E] group-open:rotate-45">+</span></summary><p className="max-w-[690px] pb-1 pt-3 text-[12px] leading-[1.9] text-[#514a50]">{answer}</p></details>)}</div></div></section>
    <section className="border-t border-[#E2E9E6] bg-white"><div className="mx-auto max-w-[1160px] px-5 py-15 sm:px-8 sm:py-18"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="section-kicker"><ToolText copyKey="stayCurious">Stay curious</ToolText></p><h2 className="mt-2 font-heading text-[34px] leading-tight"><ToolText copyKey="exploreAngle">Explore another angle.</ToolText></h2></div><Link href="/tools" className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#0F766E] hover:underline"><ToolText copyKey="allTools">See all tools</ToolText> <ArrowUpRight size={14} /></Link></div><div className="mt-7 grid gap-4 sm:grid-cols-3">{related.map((item) => <Link href={`/tools/${item.slug}`} key={item.slug} className="group rounded-lg border border-[#E8EFEC] bg-[#fbfaf8] p-5 transition-colors hover:border-[#9CCBC6]"><Sparkles size={17} className="text-[#0F766E]" /><h3 className="mt-3 font-heading text-[23px]"><LocalizedToolName slug={item.slug} fallback={item.title} /></h3><p className="mt-1 text-[11px] leading-relaxed text-[#514a50]">{item.description}</p><span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F766E]">Try it <ArrowRight size={12} className="group-hover:translate-x-0.5" /></span></Link>)}</div></div></section>
  </main>;
}
