import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { beautyStudioGuides } from "@/lib/beauty-studio-guides";
import { createSocialMetadata } from "@/lib/seo";

const title = "AI Beauty Studio Guides";
const description = "Practical guides to hairstyle try-on, hair color, beard preview, makeup, skin analysis, and face-shape tools.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/beauty-studio/guides" },
  ...createSocialMetadata(title, description, "/beauty-studio/guides"),
};

export default function BeautyStudioGuidesPage() {
  return <main>
    <section className="border-b border-[#E2E9E6] bg-[#f7f2f1]">
      <div className="mx-auto max-w-[1100px] px-5 py-14 sm:px-8 sm:py-20">
        <nav aria-label="Breadcrumb" className="text-[11px] text-[#0F766E]">
          <Link href="/beauty-studio" className="hover:underline">AI Beauty Studio</Link><span aria-hidden="true"> / </span><span>Guides</span>
        </nav>
        <p className="section-kicker mt-10">Practical how-to guides</p>
        <h1 className="mt-3 max-w-[850px] font-heading text-[clamp(42px,6vw,72px)] leading-[1.05] tracking-[-.035em]">Make a virtual try-on more useful.</h1>
        <p className="mt-5 max-w-[720px] text-[15px] leading-[1.9] text-[#625b62]">
          Each guide explains how to prepare a photo, use a tool’s controls, and interpret what you see. The studio is for visual exploration; its image-based results cannot promise a salon outcome or diagnose a skin concern.
        </p>
      </div>
    </section>
    <section className="mx-auto grid max-w-[1100px] gap-5 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-2 lg:grid-cols-3">
      {beautyStudioGuides.map((guide) => <article key={guide.slug} className="flex flex-col rounded-xl border border-[#E2E9E6] bg-white p-6">
        <span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#0F766E]">{guide.tool} · {guide.readTime}</span>
        <h2 className="mt-3 font-heading text-[27px] leading-tight">{guide.title}</h2>
        <p className="mt-3 flex-1 text-[13px] leading-[1.8] text-[#625b62]">{guide.description}</p>
        <Link className="mt-6 inline-flex items-center gap-1 text-[12px] font-semibold text-[#0F766E]" href={`/beauty-studio/guides/${guide.slug}`}>Read the guide <ArrowRight size={14} /></Link>
      </article>)}
    </section>
    <section className="border-t border-[#E2E9E6] bg-[#f7f3f1]">
      <div className="mx-auto max-w-[1100px] px-5 py-10 sm:px-8">
        <p className="text-[13px] leading-[1.9] text-[#625b62]">Want to start experimenting? <Link href="/beauty-studio" className="font-semibold text-[#0F766E] underline underline-offset-2">Open AI Beauty Studio</Link> to explore the tools in your browser.</p>
      </div>
    </section>
  </main>;
}
