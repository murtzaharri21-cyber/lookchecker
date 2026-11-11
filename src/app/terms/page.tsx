import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { createSocialMetadata } from "@/lib/seo";

const description = "Terms for using Look Checker’s free, browser-based face analysis and personal style tools.";
export const metadata: Metadata = {
  title: "Terms of Service",
  description,
  alternates: { canonical: "/terms" },
  ...createSocialMetadata("Terms of Service", description, "/terms"),
};

const terms = [
  {
    title: "Who may use the service",
    text: "Look Checker is intended for adults aged 18 and older. By using the service, you confirm that you are at least 18. Do not use the service to analyze another person without their permission, or to make decisions about employment, credit, insurance, healthcare, identity, or eligibility.",
  },
  {
    title: "What the service does",
    text: "Look Checker provides free, informational photo-based measurements and personal-style suggestions. Results are estimates from an image and can be affected by lighting, angle, expression, and image quality. They are not a measure of personal worth, medical advice, or a professional assessment.",
  },
  {
    title: "Photos and results",
    text: "Photo analysis runs in your browser. Your photo, facial landmarks, and measurements remain in the current tab and are not sent to or saved by Look Checker. The site does not offer accounts, saved reports, or report links. Results are cleared when you reset the scan or leave the page.",
  },
  {
    title: "Free service",
    text: "All Look Checker services are currently free. We do not offer subscriptions, paid features, or in-app purchases. We will clearly update the site and these terms before introducing a paid service.",
  },
  {
    title: "Acceptable use and availability",
    text: "Do not interfere with the service, attempt unauthorized access, or use results as a substitute for qualified professional advice. We may update or discontinue features to maintain or improve the service. Nothing in these terms limits consumer rights that cannot be waived under the laws applicable to you.",
  },
  {
    title: "Applicable law and contact",
    text: "The operator is based in Pakistan and the service may be accessed internationally. These terms do not select a single governing law or court; mandatory rights under the laws that apply to you remain unaffected. For questions or requests, contact the operator using the business details below.",
  },
];

export default function TermsPage() {
  return (
    <main>
      <section className="border-b border-[#E2E9E6] bg-[#f7f2f1]">
        <div className="mx-auto max-w-[1040px] px-5 pb-13 pt-10 sm:px-8 sm:pb-18">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-[#53615e]">
            <Link href="/" className="hover:text-[#0F766E]">Home</Link><ChevronRight size={12} /><span>Terms of Service</span>
          </nav>
          <div className="mt-11 max-w-[710px]">
            <p className="section-kicker">Clear terms, no hidden fees</p>
            <h1 className="mt-3 font-heading text-[clamp(48px,6vw,72px)] leading-[1.02] tracking-[-.04em]">Terms of Service</h1>
            <p className="mt-5 text-[15px] leading-[1.85] text-[#5f575e]">These terms explain how to use Look Checker. All tools are free, and user photos and results are not saved by the site.</p>
          </div>
        </div>
      </section>
      <article className="mx-auto max-w-[850px] px-5 py-12 sm:px-8 sm:py-16">
        <div className="divide-y divide-[#E2E9E6] border-t border-[#E2E9E6]">
          {terms.map((section, index) => (
            <section key={section.title} className="grid gap-3 py-6 sm:grid-cols-[36px_1fr]">
              <span className="pt-1 font-mono text-[12px] text-[#0F766E]">{String(index + 1).padStart(2, "0")}</span>
              <div><h2 className="font-heading text-[27px] leading-tight">{section.title}</h2><p className="mt-3 text-[14px] leading-[1.9] text-[#514a50]">{section.text}</p></div>
            </section>
          ))}
        </div>
        <div className="mt-8 rounded-xl border border-[#D2E7E3] bg-[#F0F8F7] p-5 text-[13px] leading-[1.8] text-[#465652]">
          <h2 className="font-semibold text-[#1b1b1e]">Operator and contact</h2>
          <p className="mt-2">Look Checker · G13, Islamabad, Pakistan</p>
          <p>Email: <a className="underline underline-offset-2" href="mailto:murtzaharry21@gmail.com">murtzaharry21@gmail.com</a></p>
          <p className="mt-2">See our <Link className="font-semibold underline underline-offset-2" href="/privacy">Privacy Policy</Link> and <Link className="font-semibold underline underline-offset-2" href="/refunds">Refund Policy</Link>.</p>
        </div>
      </article>
    </main>
  );
}
