import type { Metadata } from "next";
import { HomeLauncher } from "@/components/home-launcher";
import { createSocialMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Free Face Analysis Tools",
  description: "Explore face shape, facial symmetry, jaw proportions, eye shape, and more with free, on-device facial measurements.",
  alternates: { canonical: "/tools" },
  ...createSocialMetadata(
    "Free Face Analysis Tools",
    "Explore face shape, facial symmetry, jaw proportions, eye shape, and more with free, on-device facial measurements.",
    "/tools",
    "website",
    { image: "/images/face-report-concept.webp", alt: "Illustrative face report concept" },
  ),
};

export default function ToolsPage() {
  return (
    <main className="look-main">
      <section className="px-5 pt-8 sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          <h1 className="font-heading text-[clamp(36px,6vw,52px)] leading-tight text-[var(--lg-foreground)]">All tools</h1>
          <p className="mt-1 text-[14px] text-[var(--lg-muted)]">Tap a feature to start.</p>
        </div>
      </section>
      <section id="tools" className="px-5 py-7 sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          <HomeLauncher />
        </div>
      </section>
    </main>
  );
}
