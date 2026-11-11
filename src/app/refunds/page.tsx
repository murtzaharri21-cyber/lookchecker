import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createSocialMetadata } from "@/lib/seo";

const description = "Look Checker’s refund policy: all services are currently free and there are no purchases to refund.";
export const metadata: Metadata = {
  title: "Refund Policy",
  description,
  alternates: { canonical: "/refunds" },
  ...createSocialMetadata("Refund Policy", description, "/refunds"),
};

export default function RefundsPage() {
  return (
    <main>
      <section className="border-b border-[#E2E9E6] bg-[#f7f2f1]">
        <div className="mx-auto max-w-[1040px] px-5 pb-13 pt-10 sm:px-8 sm:pb-18">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-[#53615e]">
            <Link href="/" className="hover:text-[#0F766E]">Home</Link><ChevronRight size={12} /><span>Refund Policy</span>
          </nav>
          <div className="mt-11 max-w-[710px]">
            <p className="section-kicker">No purchases or surprise charges</p>
            <h1 className="mt-3 font-heading text-[clamp(48px,6vw,72px)] leading-[1.02] tracking-[-.04em]">Refund Policy</h1>
            <p className="mt-5 text-[15px] leading-[1.85] text-[#5f575e]">All Look Checker tools and reports are currently free to use. We do not collect payments, offer subscriptions, or sell paid features, so there are no Look Checker purchases to refund.</p>
          </div>
        </div>
      </section>
      <article className="mx-auto max-w-[850px] px-5 py-12 sm:px-8 sm:py-16">
        <h2 className="font-heading text-[30px]">If this changes</h2>
        <p className="mt-3 text-[14px] leading-[1.9] text-[#514a50]">If Look Checker introduces paid products, we will publish the applicable price, cancellation terms, and refund policy before accepting payment. Nothing here limits refund or cancellation rights that apply under your local law.</p>
        <h2 className="mt-8 font-heading text-[30px]">Third-party charges</h2>
        <p className="mt-3 text-[14px] leading-[1.9] text-[#514a50]">Look Checker does not charge for its current services. If you independently purchase a product or service from another provider, that provider’s refund terms apply to that purchase.</p>
        <p className="mt-8 text-[13px] text-[#514a50]">Questions? Email <a className="font-semibold text-[#0F766E] underline underline-offset-2" href="mailto:murtzaharry21@gmail.com">murtzaharry21@gmail.com</a>.</p>
      </article>
    </main>
  );
}
