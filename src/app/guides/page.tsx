import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { guides } from "@/lib/site-data";
import { createSocialMetadata } from "@/lib/seo";

const description = "Browse practical, evidence-aware guides to face shape, eyewear fit, personal style, and understanding photo-based measurements.";

export const metadata: Metadata = {
  title: "Face Shape and Personal Style Guides",
  description,
  alternates: { canonical: "/guides" },
  ...createSocialMetadata("Face Shape and Personal Style Guides", description, "/guides"),
};

export default function GuidesPage() {
  return <main>
    <section className="border-b border-[#E2E9E6] bg-[#f7f2f1]">
      <div className="mx-auto max-w-[1100px] px-5 py-16 sm:px-8 sm:py-20">
        <p className="section-kicker">Look Checker reading room</p>
        <h1 className="mt-3 max-w-[800px] font-heading text-[clamp(48px,6vw,76px)] leading-tight">Practical guides for curious people.</h1>
        <p className="mt-5 max-w-[680px] text-[15px] leading-relaxed text-[#625b62]">These guides explain common styling ideas and the limits of measurements from a photograph. Use them as starting points, not rules about how anyone should look.</p>
      </div>
    </section>
    <section className="mx-auto grid max-w-[1100px] gap-5 px-5 py-12 sm:px-8 sm:py-16 md:grid-cols-2 lg:grid-cols-3">
      {guides.map((guide) => <article key={guide.slug} className="flex flex-col rounded-xl border border-[#E2E9E6] bg-white p-6">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#0F766E]">{guide.category} · {guide.readTime}</span>
        <h2 className="mt-3 font-heading text-[27px] leading-tight">{guide.title}</h2>
        <p className="mt-3 text-[13px] leading-relaxed text-[#625b62]">{guide.description}</p>
        <Link className="mt-6 inline-flex items-center gap-1 text-[12px] font-semibold text-[#0F766E]" href={`/guides/${guide.slug}`}>Read guide <ArrowUpRight size={14} /></Link>
      </article>)}
    </section>
    <section className="border-t border-[#E2E9E6] bg-[#f7f3f1]">
      <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 sm:py-14">
        <div className="flex flex-col justify-between gap-4 rounded-xl border border-[#D2E7E3] bg-[#F0F8F7] p-6 sm:flex-row sm:items-center">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#0F766E]">AI Beauty Studio</span>
            <h3 className="mt-1 font-heading text-[24px] leading-tight text-[#1b1b1e]">Looking for virtual try-on guides?</h3>
            <p className="mt-2 text-[13px] leading-[1.8] text-[#625b62]">Explore practical tutorials for hairstyle try-on, hair color, beard preview, makeup, and skin analysis.</p>
          </div>
          <Link href="/beauty-studio/guides" className="btn-primary shrink-0 !min-h-[42px] !text-[12px]">
            Explore studio guides <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  </main>;
}
