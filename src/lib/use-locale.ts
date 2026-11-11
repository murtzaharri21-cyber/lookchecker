"use client";

import { useSyncExternalStore } from "react";
import { type Locale } from "@/lib/localization";
import { getLocaleSnapshot, subscribeToLocaleChange } from "@/lib/locale-store";

function getServerLocaleSnapshot(): Locale {
  return "en";
}

export function useLocale(): Locale {
  return useSyncExternalStore(subscribeToLocaleChange, getLocaleSnapshot, getServerLocaleSnapshot);
}
