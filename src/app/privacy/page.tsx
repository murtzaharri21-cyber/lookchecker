import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronRight, LockKeyhole, ShieldCheck } from "lucide-react";
import { createSocialMetadata } from "@/lib/seo";

const description = "How Look Checker processes photos and measurements locally without saving them to user accounts or site databases.";
export const metadata: Metadata = {
  title: "Privacy Policy",
  description,
  alternates: { canonical: "/privacy" },
  ...createSocialMetadata("Privacy Policy", description, "/privacy"),
};

const sections = [
  {
    title: "Photos and results stay on your device",
    text: "When you choose or capture a photo, it is processed in your browser using the face-landmark model and runtime served by Look Checker. Your photo, facial landmarks, and generated measurements are not sent to Look Checker servers, uploaded, or saved by this site. They remain temporarily in the open tab and are cleared when you reset the scan or leave the page.",
  },
  {
    title: "No accounts or saved reports",
    text: "Look Checker does not provide user accounts, does not save scan results, and has no report-saving or report-sharing feature. Your scan stays in the current browser tab and is discarded when you leave or reset it. You can choose to contact us by email; any information you include is then handled by your email provider and the site operator to respond to your message.",
  },
  {
    title: "Service providers and third-party software",
    text: "Face analysis uses MediaPipe Tasks Vision, with its runtime and model files served from this website. Scan images and measurements are not sent to MediaPipe or another analysis provider. Our hosting provider may process standard connection metadata, such as IP address and request details, to deliver and secure the website; retention is governed by the provider's settings and terms. Fonts are bundled locally; their SIL Open Font License notices are published below.",
  },
  {
    title: "Browser storage",
    text: "The site does not use Google Analytics or analytics cookies. Theme and language choices are temporary, and photos and scan results are not stored. See our Cookie & Browser Storage Policy for details.",
  },
  {
    title: "Adults only",
    text: "Look Checker is intended for people aged 18 and older. The site does not ask for or store your date of birth or age.",
  },
  {
    title: "No email marketing",
    text: "The site does not currently collect email addresses for accounts, newsletters, or marketing and does not send marketing email. If that changes, we will explain the purpose and provide an unsubscribe option in every marketing email.",
  },
  {
    title: "Advertising and Google services",
    text: "The site does not display ads or use Google Analytics.",
  },
  {
    title: "Your choices and contact",
    text: "You may reset a scan or close the page at any time to clear its in-memory photo and results. For privacy questions or requests, contact the operator using the details on this page.",
  },
];

export default function PrivacyPage() {
  return (
    <main>
      <section className="border-b border-[#E2E9E6] bg-[#f7f2f1]">
        <div className="mx-auto max-w-[1040px] px-5 pb-13 pt-10 sm:px-8 sm:pb-18">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] text-[#53615e]">
            <Link href="/" className="hover:text-[#0F766E]">Home</Link><ChevronRight size={12} /><span>Privacy Policy</span>
          </nav>
          <div className="mt-11 max-w-[710px]">
            <p className="section-kicker">Your photo belongs to you</p>
            <h1 className="mt-3 font-heading text-[clamp(52px,6vw,76px)] leading-[1.02] tracking-[-.04em]">Privacy is the <em className="font-normal text-[#0F766E]">point.</em></h1>
            <p className="mt-5 text-[15px] leading-[1.85] text-[#5f575e]">This policy explains how Look Checker works without collecting or saving your photos or scan results.</p>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-[1040px] gap-10 px-5 py-14 sm:px-8 sm:py-19 md:grid-cols-[.35fr_1fr]">
        <aside>
          <div className="sticky top-24 rounded-xl border border-[#D2E7E3] bg-[#F0F8F7] p-5">
            <ShieldCheck size={23} className="text-[#0F766E]" />
            <h2 className="mt-3 font-heading text-[23px] leading-tight">Your photo stays on your device.</h2>
            <p className="mt-2 text-[12px] leading-[1.7] text-[#5f6d69]">Photos and results are processed in your browser and are not saved by this site.</p>
          </div>
        </aside>
        <div className="divide-y divide-[#E2E9E6] border-t border-[#E2E9E6]">
          {sections.map((section, index) => (
            <section key={section.title} className="grid gap-2 py-6 sm:grid-cols-[32px_1fr]">
              <span className="pt-1 font-mono text-[12px] text-[#0F766E]">{String(index + 1).padStart(2, "0")}</span>
              <div><h2 className="font-heading text-[27px] leading-tight">{section.title}</h2><p className="mt-3 text-[14px] leading-[1.9] text-[#514a50]">{section.text}</p></div>
            </section>
          ))}
          <section className="py-6">
            <h2 className="font-heading text-[27px] leading-tight">Operator and privacy contact</h2>
            <address className="mt-3 not-italic text-[14px] leading-[1.9] text-[#514a50]">
              Look Checker<br />
              G13, Islamabad, Pakistan<br />
              <a className="font-semibold text-[#0F766E] underline underline-offset-2" href="mailto:murtzaharry21@gmail.com">murtzaharry21@gmail.com</a>
            </address>
            <p className="mt-4 text-[12px] leading-[1.8] text-[#514a50]">
              Also see our <Link className="font-semibold text-[#0F766E] underline underline-offset-2" href="/terms">Terms of Service</Link>,{" "}
              <Link className="font-semibold text-[#0F766E] underline underline-offset-2" href="/refunds">Refund Policy</Link>, and{" "}
              <Link className="font-semibold text-[#0F766E] underline underline-offset-2" href="/cookies">Cookie &amp; Browser Storage Policy</Link>.
            </p>
            <p className="mt-3 text-[12px] leading-[1.8] text-[#514a50]">
              Font license notices: <a className="font-semibold text-[#0F766E] underline underline-offset-2" rel="nofollow" href="/licenses/inter-OFL.txt">Inter</a>,{" "}
              <a className="font-semibold text-[#0F766E] underline underline-offset-2" rel="nofollow" href="/licenses/newsreader-OFL.txt">Newsreader</a>, and{" "}
              <a className="font-semibold text-[#0F766E] underline underline-offset-2" rel="nofollow" href="/licenses/ibm-plex-mono-OFL.txt">IBM Plex Mono</a>.
            </p>
            <p className="mt-4 flex items-center gap-2 text-[12px] text-[#514a50]"><LockKeyhole size={15} className="text-[#0F766E]" /> No account or payment is needed to use any tool.</p>
            <Link href="/tools/attractiveness" className="mt-5 inline-flex items-center gap-1 text-[12px] font-semibold text-[#0F766E] hover:underline">Try a private scan <ArrowUpRight size={13} /></Link>
          </section>
        </div>
      </section>
    </main>
  );
}
