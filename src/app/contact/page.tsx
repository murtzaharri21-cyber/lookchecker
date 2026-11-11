import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { createSocialMetadata } from "@/lib/seo";

const description = "Contact the Look Checker operator about privacy, accessibility, or the website.";

export const metadata: Metadata = {
  title: "Contact Look Checker",
  description,
  alternates: { canonical: "/contact" },
  ...createSocialMetadata("Contact Look Checker", description, "/contact"),
};

export default function ContactPage() {
  return <main>
    <section className="border-b border-[#E2E9E6] bg-[#f7f2f1]">
      <div className="mx-auto max-w-[900px] px-5 py-16 sm:px-8 sm:py-20">
        <p className="section-kicker">Get in touch</p>
        <h1 className="mt-3 font-heading text-[clamp(48px,6vw,72px)] leading-tight">Contact Look Checker.</h1>
        <p className="mt-5 max-w-[640px] text-[15px] leading-relaxed text-[#625b62]">For privacy questions, accessibility feedback, or questions about how the tools work, email the site operator.</p>
        <a className="btn-primary mt-7" href="mailto:murtzaharry21@gmail.com">Email the operator <ArrowUpRight size={15} /></a>
      </div>
    </section>
    <section className="mx-auto max-w-[900px] px-5 py-12 sm:px-8 sm:py-16">
      <h2 className="font-heading text-[30px]">Privacy and website questions</h2>
      <p className="mt-3 text-[14px] leading-relaxed text-[#625b62]">For privacy questions, please do not email a face photo or scan results; Look Checker does not need them to answer your question. See the <Link className="text-[#0F766E] underline" href="/privacy">Privacy Policy</Link> for details.</p>
      <address className="mt-6 not-italic text-[14px] leading-relaxed text-[#625b62]">Look Checker<br />G13, Islamabad, Pakistan<br /><a className="font-semibold text-[#0F766E] underline" href="mailto:murtzaharry21@gmail.com">murtzaharry21@gmail.com</a></address>
    </section>
  </main>;
}
