"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  Aperture,
  Blend,
  Droplets,
  Eye,
  FlipHorizontal2,
  Grid3x3,
  Heart,
  Palette,
  Ratio,
  ScanFace,
  Scissors,
  Shirt,
  Sparkles,
  Sun,
  UnfoldHorizontal,
  Wand2,
} from "lucide-react";
import { Button, Glass } from "@/components/liquid";
import { useRouter } from "next/navigation";
import { LocalizedToolName } from "@/components/localized-tool-name";
import { tools } from "@/lib/site-data";

const toolIcons: Record<string, LucideIcon> = {
 "face-shape": ScanFace,
 attractiveness: Sparkles,
 symmetry: UnfoldHorizontal,
 "golden-ratio": Ratio,
 "jawline-score": Aperture,
 "canthal-tilt": Eye,
 "eye-shape": Eye,
 "facial-ratios": Grid3x3,
 "hairstyle-finder": Scissors,
 "hairstyle-try-on": Wand2,
 "makeup-suggestions": Palette,
 "full-dress-check": Shirt,
 "skin-analysis": Droplets,
 "pretty-scale": Heart,
 "glow-up": Sun,
 "eyebrow-mapping": Blend,
 "true-mirror": FlipHorizontal2,
};

const groups = [
  {
    title: "Scan",
    slugs: ["attractiveness", "face-shape", "symmetry", "golden-ratio", "jawline-score", "facial-ratios", "canthal-tilt", "eye-shape", "eyebrow-mapping", "pretty-scale"],
  },
  {
    title: "Style",
    slugs: ["hairstyle-try-on", "hairstyle-finder", "makeup-suggestions", "skin-analysis", "glow-up", "full-dress-check"],
  },
  {
    title: "Live",
    slugs: ["true-mirror"],
  },
];

const shortcuts = [
  { href: "/tools/attractiveness", label: "Attractiveness", hint: "Photo scan", filled: true },
  { href: "/tools/full-analysis", label: "Full report", hint: "All scores", filled: false },
  { href: "/tools/face-shape", label: "Face shape", hint: "Hair & frames", filled: false },
  { href: "/beauty-studio", label: "Beauty Studio", hint: "Try looks", filled: false },
];

export function HomeLauncher() {
  const router = useRouter();
  const bySlug = Object.fromEntries(tools.map((tool) => [tool.slug, tool]));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {shortcuts.map((item) => (
          <button
            key={item.href}
            type="button"
            className="look-tile-hit"
            onClick={() => router.push(item.href)}
          >
            <Glass className={`look-tile ${item.filled ? "look-tile-filled" : ""}`}>
              <span className="font-heading text-[20px] leading-tight">{item.label}</span>
              <span className="text-[12px] opacity-75">{item.hint}</span>
            </Glass>
          </button>
        ))}
      </div>

      {groups.map((group) => (
        <section key={group.title} aria-labelledby={`group-${group.title}`}>
          <h2 id={`group-${group.title}`} className="mb-3 px-1 text-[13px] font-semibold uppercase tracking-[.14em] text-[#0F766E]">
            {group.title}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {group.slugs.map((slug) => {
              const tool = bySlug[slug];
              if (!tool) return null;
              const Icon = toolIcons[slug] ?? ScanFace;
              return (
                <Link key={slug} href={`/tools/${slug}`} className="look-tile-hit">
                  <Glass className="look-tool">
                    <span className="look-tool-icon" aria-hidden="true">
                      <Icon size={20} />
                    </span>
                    <span className="min-w-0 font-heading text-[16px] leading-tight text-[var(--lg-foreground)]">
                      <LocalizedToolName slug={slug} fallback={tool.title} />
                    </span>
                  </Glass>
                </Link>
              );
            })}
          </div>
        </section>
      ))}

      <div className="flex justify-center pt-1">
        <Button variant="glass" onClick={() => router.push("/tools")}>
          See all tools
        </Button>
      </div>
    </div>
  );
}
