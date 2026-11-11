"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { availableLocales, type Locale } from "@/lib/localization";
import { homeCopy, type HomeCopyKey } from "@/lib/home-copy";
import { getLocaleSnapshot, subscribeToLocaleChange } from "@/lib/locale-store";

function getServerLocaleSnapshot(): Locale {
  return "en";
}

export function LocaleText({ copyKey, children }: { copyKey: HomeCopyKey; children: ReactNode }) {
  const locale = useSyncExternalStore(subscribeToLocaleChange, getLocaleSnapshot, getServerLocaleSnapshot);
  const translated = homeCopy[locale]?.[copyKey];
  return <>{translated ?? children}</>;
}
