import { availableLocales, type Locale } from "@/lib/localization";

let currentLocale: Locale = "en";
const listeners = new Set<() => void>();

export function subscribeToLocaleChange(onChange: () => void) {
  listeners.add(onChange);
  return () => listeners.delete(onChange);
}

export function getLocaleSnapshot(): Locale {
  return currentLocale;
}

export function setLocale(locale: Locale) {
  const selectedLocale = availableLocales.find(({ code }) => code === locale);
  if (!selectedLocale || currentLocale === locale) return;
  currentLocale = locale;
  document.documentElement.lang = locale;
  document.documentElement.dir = selectedLocale.direction ?? "ltr";
  listeners.forEach((listener) => listener());
}
