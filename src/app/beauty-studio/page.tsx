import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Image, LockKeyhole } from "lucide-react";
import BeautyStudioShell from "@/components/beauty-studio-shell";
import { beautyStudioGuides } from "@/lib/beauty-studio-guides";
import { createSocialMetadata } from "@/lib/seo";

const description = "Try hairstyles, hair colors, beard shapes, makeup, and face or skin estimates in a private beauty studio that runs in your browser.";
export const metadata: Metadata = {
  title: "AI Beauty Studio Try-On",
  description,
  alternates: { canonical: "/beauty-studio" },
  keywords: ["AI beauty studio", "virtual hairstyle try-on", "beard style preview", "makeup try-on", "hair color preview", "photo-based skin analysis"],
  ...createSocialMetadata("AI Beauty Studio Try-On", description, "/beauty-studio"),
};

export default function BeautyStudioPage() {
  return <main>
    <BeautyStudioShell />
      <section className="border-t border-[#E2E9E6] bg-white">
        <div className="mx-auto max-w-[1100px] px-5 py-14 sm:px-8 sm:py-20">
          <p className="section-kicker">A thoughtful guide to virtual try-on</p>
          <h2 className="mt-3 max-w-[800px] font-heading text-[clamp(38px,5vw,62px)] leading-[1.08] tracking-[-.03em]">Explore a new look. Keep the decision yours.</h2>
          <p className="mt-5 max-w-[760px] text-[15px] leading-[1.9] text-[#625b62]">
            AI Beauty Studio is a browser-based way to explore hairstyles, hair color, beard shapes, makeup, and photo-based skin and face estimates. Use a photo or take a selfie, compare ideas, and save the versions you want to discuss. The previews are visual starting points, not salon promises or medical advice.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Image, title: "Choose a clear photo", text: "Even light and visible facial features help the on-photo previews fit more consistently." },
              { icon: CheckCircle2, title: "Compare, then adjust", text: "Try a few options and refine color, fit, or intensity instead of settling for the first result." },
              { icon: LockKeyhole, title: "Processed in your browser", text: "The studio analyzes your selected photo locally for this experience; see the privacy notice for site-wide data practices." },
            ].map(({ icon: Icon, title, text }) => <div key={title} className="rounded-xl border border-[#E2E9E6] bg-[#F7FAF9] p-5">
              <Icon size={19} className="text-[#0F766E]" aria-hidden="true" />
              <h2 className="mt-3 text-[14px] font-semibold text-[#1b1b1e]">{title}</h2>
              <p className="mt-2 text-[12px] leading-[1.8] text-[#625b62]">{text}</p>
            </div>)}
          </div>
        </div>
      </section>
      <section className="border-t border-[#E2E9E6] bg-[#f7f3f1]">
        <div className="mx-auto max-w-[1100px] px-5 py-14 sm:px-8 sm:py-18">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="section-kicker">AI Beauty Studio guides</p>
              <h2 className="mt-2 font-heading text-[clamp(32px,4vw,46px)] leading-tight">A guide for every tool.</h2>
              <p className="mt-3 max-w-[700px] text-[14px] leading-[1.8] text-[#625b62]">Learn how to prepare a photo, use the controls, interpret suggestions, and understand where an image-based preview has limits.</p>
            </div>
            <Link href="/beauty-studio/guides" className="inline-flex shrink-0 items-center gap-1.5 text-[13px] font-semibold text-[#0F766E] hover:underline">
              View all studio guides <ArrowRight size={14} />
            </Link>
          </div>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {beautyStudioGuides.map((guide) => <article key={guide.slug} className="flex flex-col rounded-xl border border-[#E2E9E6] bg-white p-5">
              <span className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#0F766E]">{guide.tool} · {guide.readTime}</span>
              <h3 className="mt-3 font-heading text-[25px] leading-tight">{guide.title}</h3>
              <p className="mt-3 flex-1 text-[12px] leading-[1.8] text-[#625b62]">{guide.description}</p>
              <Link className="mt-5 inline-flex items-center gap-1 text-[12px] font-semibold text-[#0F766E]" href={`/beauty-studio/guides/${guide.slug}`}>Read the guide <ArrowRight size={14} /></Link>
            </article>)}
          </div>
        </div>
      </section>
      <section className="border-t border-[#E2E9E6] bg-white">
        <div className="mx-auto max-w-[1100px] px-5 py-12 sm:px-8 sm:py-16">
          <h2 className="font-heading text-[32px]">A note on results and care</h2>
          <p className="mt-4 max-w-[800px] text-[13px] leading-[1.9] text-[#625b62]">
            The studio creates visual estimates from a single image. Hair and beard previews cannot show hidden or unseen areas, and lighting, pose, hair texture, and image quality can affect fit. Skin and face-shape results are not clinical assessments or judgments about your appearance. Use the previews to explore preferences, and consult a qualified stylist or healthcare professional for advice specific to you.
          </p>
          <Link href="/privacy" className="mt-4 inline-flex items-center gap-1 text-[12px] font-semibold text-[#0F766E]">Read our privacy notice <ArrowRight size={14} /></Link>
        </div>
      </section>
  </main>;
}
