import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check, ChevronRight, LockKeyhole } from "lucide-react";
import { createSocialMetadata } from "@/lib/seo";

const description = "Every Look Checker tool and report is free. No account, subscription, or payment required.";
export const metadata: Metadata = {
  title: "Always Free",
  description,
  alternates: { canonical: "/pricing" },
  ...createSocialMetadata("Always Free", description, "/pricing"),
};

const included = [
  "Private, on-device photo scans",
  "Face shape, harmony, and symmetry readings",
  "Eye, jaw, and facial proportion measurements",
  "Personalized hairstyle and styling suggestions",
  "Full report and sample report",
  "All guides and tools",
];

export default function PricingPage() {
  return (
    <main>
      <section className="border-b border-[#E2E9E6] bg-[#f7f2f1]">
        <div className="mx-auto max-w-[1160px] px-5 pb-17 pt-10 sm:px-8 sm:pb-21">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-[#514a50]">
            <Link href="/" className="hover:text-[#0F766E]">Home</Link>
            <ChevronRight size={12} />
            <span>Always free</span>
          </nav>
          <div className="mt-10 max-w-[760px]">
            <p className="section-kicker">No fees. No fine print.</p>
            <h1 className="mt-3 font-heading text-[clamp(54px,6vw,78px)] leading-[1.01] tracking-[-.04em]">
              Everything is <em className="font-normal text-[#0F766E]">free.</em>
            </h1>
            <p className="mt-5 max-w-[630px] text-[15px] leading-[1.8] text-[#71676e]">
              Every face scan, measurement, tool, and report is free to use. No account, signup, subscription, checkout, or payment is required.
            </p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-[800px] px-5 py-15 sm:px-8 sm:py-20">
        <div className="rounded-xl border border-[#E2E9E6] bg-white p-7 sm:p-10">
          <div className="flex items-center justify-between">
            <p className="section-kicker">Included for everyone</p>
            <LockKeyhole size={20} className="text-[#0F766E]" />
          </div>
          <h2 className="mt-4 font-heading text-[39px] leading-tight">The whole experience</h2>
          <p className="mt-3 font-heading text-[54px] leading-none">Free</p>
          <div className="mt-7 space-y-3 border-t border-[#E8EFEC] pt-6">
            {included.map((item) => (
              <p key={item} className="flex items-start gap-2.5 text-[13px] text-[#5f575e]">
                <Check size={16} className="mt-[1px] shrink-0 text-[#0F766E]" />
                {item}
              </p>
            ))}
          </div>
          <Link href="/tools/attractiveness" className="btn-primary mt-9 w-full">
            Start a free scan <ArrowUpRight size={15} />
          </Link>
          <p className="mt-4 text-center text-[12px] leading-relaxed text-[#514a50]">
            Your photo is analyzed in your browser and is never uploaded for a scan.
          </p>
        </div>
      </section>
    </main>
  );
}
