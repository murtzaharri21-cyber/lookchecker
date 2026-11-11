import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { beautyStudioGuides, getBeautyStudioGuide } from "@/lib/beauty-studio-guides";
import { createSocialMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return beautyStudioGuides.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const guide = getBeautyStudioGuide((await params).slug);
  if (!guide) return { title: "AI Beauty Studio Guide" };
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/beauty-studio/guides/${guide.slug}` },
    keywords: [guide.tool, "AI Beauty Studio", "virtual try-on guide"],
    ...createSocialMetadata(guide.title, guide.description, `/beauty-studio/guides/${guide.slug}`, "article"),
  };
}

export default async function BeautyStudioGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const guide = getBeautyStudioGuide((await params).slug);
  if (!guide) notFound();
  const related = beautyStudioGuides.filter(({ slug }) => slug !== guide.slug).slice(0, 3);

  return <main>
    <section className="border-b border-[#E2E9E6] bg-[#f7f2f1]">
      <div className="mx-auto max-w-[1100px] px-5 pb-12 pt-9 sm:px-8 sm:pb-16 sm:pt-12">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#0F766E]">
          <Link href="/" className="hover:underline">Home</Link><ChevronRight size={12} aria-hidden="true" />
          <Link href="/beauty-studio" className="hover:underline">AI Beauty Studio</Link><ChevronRight size={12} aria-hidden="true" />
          <Link href="/beauty-studio/guides" className="hover:underline">Guides</Link><ChevronRight size={12} aria-hidden="true" />
          <span>{guide.tool}</span>
        </nav>
        <div className="mt-10 max-w-[800px]">
          <p className="section-kicker">AI Beauty Studio / {guide.tool}</p>
          <h1 className="mt-3 font-heading text-[clamp(42px,6vw,70px)] leading-[1.05] tracking-[-.035em]">{guide.title}<span className="text-[#0F766E]">.</span></h1>
          <p className="mt-5 max-w-[700px] text-[15px] leading-[1.9] text-[#625b62]">{guide.intro}</p>
          <p className="mt-5 border-t border-[#e2d9d6] pt-4 text-[11px] text-[#0F766E]">{guide.readTime} · A practical guide from Look Checker</p>
        </div>
      </div>
    </section>
    <div className="mx-auto grid max-w-[1100px] gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[minmax(0,700px)_minmax(220px,1fr)] lg:gap-14">
      <article className="space-y-10">
        {guide.sections.map((section, index) => <section key={section.title} className="border-t border-[#E2E9E6] pt-5">
          <div className="flex gap-4">
            <span className="pt-1 font-mono text-[11px] text-[#0F766E]">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <h2 className="font-heading text-[30px] leading-[1.15] tracking-[-.02em]">{section.title}</h2>
              <div className="mt-4 space-y-4">{section.paragraphs.map((paragraph) => <p key={paragraph} className="text-[14px] leading-[1.95] text-[#514a50]">{paragraph}</p>)}</div>
              {section.bullets && <ul className="mt-5 space-y-3 rounded-xl border border-[#E2E9E6] bg-[#F7FAF9] p-5">
                {section.bullets.map((bullet) => <li key={bullet} className="flex gap-2.5 text-[13px] leading-[1.8] text-[#514a50]"><span className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#16877D]" />{bullet}</li>)}
              </ul>}
            </div>
          </div>
        </section>)}
        <section className="border-t border-[#E2E9E6] pt-6">
          <h2 className="font-heading text-[32px]">Questions people ask</h2>
          <div className="mt-4 divide-y divide-[#E2E9E6]">
            {guide.faqs.map(({ question, answer }) => <details key={question} className="group py-4">
              <summary className="cursor-pointer list-none pr-6 text-[14px] font-semibold text-[#28262b] marker:hidden">{question}</summary>
              <p className="mt-3 text-[13px] leading-[1.85] text-[#625b62]">{answer}</p>
            </details>)}
          </div>
        </section>
        <section className="border-t border-[#E2E9E6] pt-5">
          <p className="text-[12px] leading-[1.8] text-[#625b62]">This guide is for general styling and product exploration. Skin-related estimates are not medical advice, and digital previews cannot guarantee a real-world result.</p>
        </section>
      </article>
      <aside>
        <div className="rounded-xl border border-[#D2E7E3] bg-[#F0F8F7] p-6 lg:sticky lg:top-24">
          <p className="section-kicker">Try it for yourself</p>
          <h2 className="mt-3 font-heading text-[27px] leading-tight">See ideas on your photo.</h2>
          <p className="mt-3 text-[12px] leading-[1.8] text-[#514a50]">Use the studio to compare looks at your own pace. The preview is processed in your browser for this experience.</p>
          <Link href="/beauty-studio" className="btn-primary mt-5 w-full !min-h-[44px] !text-[12px]">Open AI Beauty Studio <ArrowRight size={14} /></Link>
          <Link href="/beauty-studio/guides" className="mt-4 block text-center text-[11px] font-medium text-[#0F766E] underline underline-offset-2">Browse all studio guides</Link>
        </div>
      </aside>
    </div>
    <section className="border-t border-[#E8E2DE] bg-[#f7f3f1]">
      <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 sm:py-16">
        <p className="section-kicker">Related guides</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">{related.map((item) => <Link href={`/beauty-studio/guides/${item.slug}`} key={item.slug} className="rounded-xl border border-[#E2E9E6] bg-white p-5 transition hover:border-[#9CCBC6]">
          <span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#0F766E]">{item.tool}</span>
          <h2 className="mt-2 font-heading text-[22px] leading-tight">{item.title}</h2>
          <span className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-[#0F766E]">Read guide <ArrowRight size={13} /></span>
        </Link>)}</div>
      </div>
    </section>
  </main>;
}
