import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createSocialMetadata } from "@/lib/seo";

const description = "Learn how Look Checker uses browser storage without analytics cookies or tracking.";
export const metadata: Metadata = {
  title: "Cookie & Browser Storage Policy",
  description,
  alternates: { canonical: "/cookies" },
  ...createSocialMetadata("Cookie & Browser Storage Policy", description, "/cookies"),
};

export default function CookiesPage() {
  return (
    <main>
      <section className="border-b border-[#E2E9E6] bg-[#f7f2f1]">
        <div className="mx-auto max-w-[1040px] px-5 pb-13 pt-10 sm:px-8 sm:pb-18">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-[#53615e]">
            <Link href="/" className="hover:text-[#0F766E]">Home</Link><ChevronRight size={12} /><span>Cookie Policy</span>
          </nav>
          <div className="mt-11 max-w-[710px]">
            <p className="section-kicker">Application cookie policy</p>
            <h1 className="mt-3 font-heading text-[clamp(44px,6vw,68px)] leading-[1.02] tracking-[-.04em]">Cookies &amp; browser storage</h1>
            <p className="mt-5 text-[15px] leading-[1.85] text-[#5f575e]">Look Checker does not use analytics cookies or tracking. Photos and results are held temporarily in memory for the scan and are cleared when you leave or reset it.</p>
          </div>
        </div>
      </section>
      <article className="mx-auto max-w-[850px] px-5 py-12 sm:px-8 sm:py-16">
        <h2 className="font-heading text-[30px]">Browser storage and analytics</h2>
        <p className="mt-3 text-[14px] leading-[1.9] text-[#514a50]">Look Checker does not use Google Analytics or analytics cookies. Theme and language selections are temporary. Scan photos and results are processed in the open page and are not retained after you leave or reset the scan.</p>
        <p className="mt-5 text-[14px] leading-[1.9] text-[#514a50]">Your browser may keep ordinary cached copies of static site files to help pages load; these do not include your selected photo or scan results.</p>
        <section className="mt-8 rounded-xl border border-[#E2E9E6] bg-[#F0F8F7] p-5">
          <h2 className="font-heading text-[23px]">Analytics</h2>
          <p className="mt-2 text-[13px] leading-[1.8] text-[#514a50]">Look Checker does not load Google Analytics or use analytics cookies.</p>
        </section>
        <p className="mt-8 text-[13px] text-[#514a50]">Read the <Link className="font-semibold text-[#0F766E] underline underline-offset-2" href="/privacy">Privacy Policy</Link> or email <a className="font-semibold text-[#0F766E] underline underline-offset-2" href="mailto:murtzaharry21@gmail.com">murtzaharry21@gmail.com</a>.</p>
      </article>
    </main>
  );
}
