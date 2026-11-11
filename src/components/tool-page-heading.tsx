"use client";

import { LocalizedToolName } from "@/components/localized-tool-name";
import { useLocale } from "@/lib/use-locale";
import { translateToolIntroduction } from "@/lib/tool-copy";

export function ToolPageHeading({ slug, title, eyebrow, description, mode, full }: {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  mode?: "outfit" | "skin" | "glow-up";
  full: boolean;
}) {
  const locale = useLocale();
  const introKey = mode === "skin" ? "skinTool" : mode === "outfit" ? "outfitTool" : mode === "glow-up" ? "glowTool" : slug === "true-mirror" ? "mirrorTool" : "scanTool";
  const heading = full && locale === "en"
    ? <>The full picture of <em className="font-normal text-[#0F766E]">you.</em></>
    : <LocalizedToolName slug={slug} fallback={title} />;

  return <div className="max-w-[740px]">
    <p className="section-kicker">{full ? translateToolIntroduction(locale, "completeLook", "A complete look · free preview") : <LocalizedToolName slug={slug} fallback={eyebrow} />}</p>
    <h1 className="mt-2 font-heading text-[clamp(48px,6vw,75px)] leading-[1.02] tracking-[-.04em]">{heading}</h1>
    <p className="mt-4 max-w-[660px] text-[14px] leading-[1.85] text-[#6d646c] sm:text-[16px]">{translateToolIntroduction(locale, introKey, description)}</p>
  </div>;
}
