import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import type { ToolGuide as ToolGuideContent } from "@/lib/tool-guides";
import { siteUrl } from "@/lib/seo";

export function ToolGuide({ guide, toolSlug }: { guide: ToolGuideContent; toolSlug: string }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": new URL(`/tools/${toolSlug}`, siteUrl).toString(),
    },
    publisher: { "@type": "Organization", name: "Look Checker" },
  };

  return <section className="border-t border-[#E2E9E6] bg-white" aria-labelledby="tool-guide-title">
    <article className="mx-auto max-w-[900px] px-5 py-15 sm:px-8 sm:py-20">
      <header className="mb-10 border-b border-[#E2E9E6] pb-7">
        <p className="section-kicker">Look Checker guide</p>
        <h2 id="tool-guide-title" className="mt-2 font-heading text-[clamp(32px,4vw,46px)] leading-tight">{guide.title}</h2>
        <p className="mt-4 max-w-[720px] text-[14px] leading-[1.9] text-[#6d646c]">{guide.description}</p>
        {toolSlug === "hairstyle-finder" && <Link href="/guides/hairline-check" className="mt-5 flex max-w-[720px] flex-wrap items-center justify-between gap-3 rounded-lg border border-[#D2E7E3] bg-[#F0F8F7] px-4 py-3 text-[12px] text-[#245e58] transition-colors hover:border-[#9CCBC6]"><span className="font-medium">A clearer hairline check starts with a better photo—and knowing what one image can’t tell you.</span><span className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#0F766E]">Read the full guide <ArrowUpRight size={13} /></span></Link>}
      </header>
      <div className="space-y-10">
        {guide.sections.map((section, index) => <section key={section.title} className="grid gap-4 border-b border-[#E2E9E6] pb-8 last:border-0 sm:grid-cols-[56px_1fr]">
          <span aria-hidden="true" className="font-mono text-[11px] text-[#0F766E]">0{index + 1}</span>
          <div>
            <h3 className="font-heading text-[27px] leading-tight text-[#1b1b1e]">{section.title}</h3>
            <div className="mt-4 space-y-4">{section.paragraphs.map((paragraph) => <p key={paragraph} className="text-[13px] leading-[1.95] text-[#5f575e]">{paragraph}</p>)}</div>
            {section.bullets && <ul className="mt-4 space-y-3 rounded-lg border border-[#E2E9E6] bg-[#fbfaf8] p-5">{section.bullets.map((bullet) => <li key={bullet} className="flex gap-2.5 text-[12px] leading-[1.8] text-[#5f575e]"><span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#16877D]" />{bullet}</li>)}</ul>}
          </div>
        </section>)}
      </div>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#D2E7E3] bg-[#F0F8F7] p-5 sm:p-6">
        <div><p className="font-heading text-[23px]">Ready to explore your result?</p><p className="mt-1 text-[11px] leading-relaxed text-[#64716c]">Use this free tool in your browser. No account or photo upload required.</p></div>
        <Link href={`/tools/${toolSlug}#tool`} className="btn-primary !min-h-[42px] !px-4 !text-[11px]">Try this tool <ArrowRight size={14} /></Link>
      </div>
    </article>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
  </section>;
}
