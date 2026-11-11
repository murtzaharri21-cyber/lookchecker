"use client";

import { useLocale } from "@/lib/use-locale";
import { translateToolName } from "@/lib/tool-copy";

export function LocalizedToolName({ slug, fallback }: { slug: string; fallback: string }) {
  const locale = useLocale();
  return <>{translateToolName(locale, slug, fallback)}</>;
}
