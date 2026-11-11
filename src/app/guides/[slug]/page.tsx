import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ArrowUpRight, ChevronRight, Clock3, Sparkles } from "lucide-react";
import { getGuide, guides } from "@/lib/site-data";
import { createSocialMetadata, siteUrl } from "@/lib/seo";

export function generateStaticParams() { return guides.map(({ slug }) => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return { title: "Guide" };
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    ...createSocialMetadata(guide.title, guide.description, `/guides/${guide.slug}`, "article"),
  };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  const related = guides.filter(({ slug }) => slug !== guide.slug);
  const references = guide.slug === "glow-up-tips"
    ? [{ label: "American Academy of Dermatology: skin care on a budget", href: "https://www.aad.org/public/everyday-care/skin-care-basics/care/skin-care-budget" }]
    : guide.slug === "glasses-for-face-shape"
      ? [{ label: "U.S. Food and Drug Administration: sunglasses and UV protection", href: "https://www.fda.gov/consumers/consumer-updates/tips-stay-safe-sun-sunscreen-sunglasses" }]
      : [];
  const guideStructuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    articleSection: guide.category,
    articleBody: guide.sections
      .map((section) => [section.title, ...section.paragraphs, ...(section.bullets ?? [])].join("\n"))
      .join("\n\n"),
    mainEntityOfPage: new URL(`/guides/${guide.slug}`, siteUrl).toString(),
    author: { "@id": new URL("/#organization", siteUrl).toString() },
    publisher: { "@id": new URL("/#organization", siteUrl).toString() },
  };
  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(guideStructuredData).replace(/</g, "\\u003c") }} />
    <section className="border-b border-[#E2E9E6] bg-[#f7f2f1]"><div className="mx-auto max-w-[1100px] px-5 pb-14 pt-10 sm:px-8 sm:pb-19"><nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-[#0F766E]"><Link href="/" className="hover:text-[#0F766E]">Home</Link><ChevronRight size={12} /><Link href="/#guides" className="hover:text-[#0F766E]">Guides</Link><ChevronRight size={12} /><span>{guide.category}</span></nav><div className="mt-12 max-w-[780px]"><p className="section-kicker">The reading room / {guide.category}</p><h1 className="mt-3 font-heading text-[clamp(52px,6vw,79px)] leading-[1.02] tracking-[-.035em]">{guide.title}<span className="text-[#0F766E]">.</span></h1><p className="mt-5 max-w-[650px] text-[16px] leading-[1.8] text-[#71686f]">{guide.description}</p><div className="mt-7 flex items-center gap-2 border-t border-[#e2d9d6] pt-5 text-[11px] text-[#0F766E]"><Clock3 size={14} /> {guide.readTime}<span className="mx-1">Â·</span> A guide from Look Checker</div></div></div></section>
    <div className="mx-auto grid max-w-[1100px] gap-10 px-5 py-15 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,680px)_1fr] lg:gap-16"><article className="space-y-12">{guide.sections.map((section, index) => <section key={section.title}><div className="flex gap-4 border-t border-[#e6dfda] pt-6"><span className="pt-1 font-mono text-[11px] text-[#0F766E]">0{index + 1}</span><div><h2 className="font-heading text-[35px] leading-[1.1] tracking-[-.02em]">{section.title}</h2><div className="mt-5 space-y-4">{section.paragraphs.map((paragraph) => <p key={paragraph} className="text-[14px] leading-[1.95] text-[#5f575e]">{paragraph}</p>)}</div>{section.bullets && <ul className="mt-5 space-y-3 rounded-xl border border-[#E2E9E6] bg-white p-6">{section.bullets.map((bullet) => <li key={bullet} className="flex gap-2.5 text-[13px] leading-[1.75] text-[#5f575e]"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#16877D]" />{bullet}</li>)}</ul>}</div></div></section>)}{references.length > 0 && <section className="border-t border-[#E2E9E6] pt-6"><h2 className="font-heading text-[25px]">Further reading</h2><ul className="mt-3 space-y-2">{references.map((reference) => <li key={reference.href}><a className="text-[13px] text-[#0F766E] underline underline-offset-2" href={reference.href} target="_blank" rel="noreferrer">{reference.label}</a></li>)}</ul></section>}</article><aside><div className="sticky top-24 rounded-xl border border-[#D2E7E3] bg-[#F0F8F7] p-6"><Sparkles size={23} strokeWidth={1.5} className="text-[#0F766E]" /><h2 className="mt-4 font-heading text-[27px] leading-tight">Make it personal.</h2><p className="mt-3 text-[12px] leading-[1.8] text-[#74676f]">Your face shape and proportions are yours. Find them with a free private photo analysis.</p><Link href="/tools/face-shape" className="btn-primary mt-6 w-full !min-h-[44px] !text-[12px]">Find my face shape <ArrowRight size={14} /></Link><p className="mt-3 text-center text-[10px] text-[#0F766E]">No account. No photo upload.</p></div></aside></div>
    <section className="border-t border-[#e8e2de] bg-[#f7f3f1]"><div className="mx-auto max-w-[1100px] px-5 py-13 sm:px-8"><p className="section-kicker">More to explore</p><h2 className="mt-1 font-heading text-[32px]">Keep reading.</h2><div className="mt-6 grid gap-4 sm:grid-cols-2">{related.map((item) => <Link href={`/guides/${item.slug}`} key={item.slug} className="group rounded-lg border border-[#E2E9E6] bg-white p-6 hover:border-[#9CCBC6]"><span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#0F766E]">{item.category}</span><h3 className="mt-3 font-heading text-[26px] leading-tight">{item.title}</h3><p className="mt-2 text-[11px] leading-[1.8] text-[#514a50]">{item.description}</p><span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F766E]">Read guide <ArrowUpRight size={12} /></span></Link>)}</div></div></section>
  </main>;
}
