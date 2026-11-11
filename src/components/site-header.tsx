"use client";

import Link from "next/link";
import { ArrowUpRight, Check, ChevronDown, Globe2, Menu, Moon, Sun, X } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { tools } from "@/lib/site-data";
import { LocalizedToolName } from "@/components/localized-tool-name";
import { availableLocales, headerCopy, localeSettingsCopy, type Locale } from "@/lib/localization";
import { getLocaleSnapshot, setLocale, subscribeToLocaleChange } from "@/lib/locale-store";
import { beautyStudioGuides } from "@/lib/beauty-studio-guides";

const studioNavigationGuides = beautyStudioGuides.filter((guide) => guide.slug !== "face-shape-haircut-guide");

function subscribeToThemeChange(onChange: () => void) {
  window.addEventListener("look-checker-theme-change", onChange);
  return () => window.removeEventListener("look-checker-theme-change", onChange);
}

function getThemeSnapshot() {
  return document.documentElement.dataset.theme === "dark";
}

function getServerThemeSnapshot() {
  return false;
}

function getServerLocaleSnapshot(): Locale {
  return "en";
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageControlRef = useRef<HTMLDivElement>(null);
  const languageButtonRef = useRef<HTMLButtonElement>(null);
  const darkMode = useSyncExternalStore(subscribeToThemeChange, getThemeSnapshot, getServerThemeSnapshot);
  const locale = useSyncExternalStore(subscribeToLocaleChange, getLocaleSnapshot, getServerLocaleSnapshot);
  const copy = headerCopy[locale] ?? headerCopy.en;
  const settingsCopy = localeSettingsCopy[locale] ?? localeSettingsCopy.en;

  useEffect(() => {
    if (!languageOpen) return;

    function handlePointerDown(event: PointerEvent) {
      if (event.target instanceof Node && !languageControlRef.current?.contains(event.target)) {
        setLanguageOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setLanguageOpen(false);
        languageButtonRef.current?.focus();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [languageOpen]);

  function toggleTheme() {
    const nextDarkMode = !darkMode;
    document.documentElement.dataset.theme = nextDarkMode ? "dark" : "light";
    window.dispatchEvent(new Event("look-checker-theme-change"));
  }

  function changeLocale(nextLocale: Locale) {
    setLocale(nextLocale);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8EFEC] bg-[#fcfbfa]">
      <div className="mx-auto flex h-[62px] max-w-[1200px] items-center justify-between gap-3 px-4 sm:gap-5 sm:px-8">
        <Link href="/" className="group shrink-0 text-[16px] font-[750] tracking-[-0.045em] text-[#1b1b1e]" aria-label="Look Checker home">
          <span className="font-heading text-[22px] font-normal italic text-[#0F766E] group-hover:text-[#115E59]">Look</span> Checker<span className="ml-[1px] text-[#0F766E]">.</span>
        </Link>

        <nav className="hidden items-center gap-4 xl:flex 2xl:gap-6" aria-label="Main navigation">
          <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
            <button
              type="button"
              onClick={() => setToolsOpen(!toolsOpen)}
              aria-expanded={toolsOpen}
              className="flex items-center gap-1.5 py-5 text-[13px] font-medium text-[#525158] transition-colors hover:text-[#0F766E]"
            >
              {copy.tools} <ChevronDown size={14} className={toolsOpen ? "rotate-180 transition-transform" : "transition-transform"} />
            </button>

            {toolsOpen && (
              <div className="absolute left-0 top-[calc(100%-8px)] z-50 w-[580px] rounded-xl border border-[#E2E9E6] bg-white p-5 shadow-xl">
                <div className="mb-3 flex items-center justify-between border-b border-[#ece9e5] pb-2">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#514a50]">{copy.tools}</span>
                  <Link href="/tools" onClick={() => setToolsOpen(false)} className="text-[12px] font-semibold text-[#0F766E] hover:underline">View all tools</Link>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                  {tools.slice(0, 10).map((tool) => (
                    <Link key={tool.slug} href={`/tools/${tool.slug}`} onClick={() => setToolsOpen(false)} className="rounded-md px-2 py-2.5 text-[13px] text-[#3d3b40] hover:bg-[#f8f3f4] hover:text-[#0F766E]"><LocalizedToolName slug={tool.slug} fallback={tool.title} /></Link>
                  ))}
                </div>
                <div className="mt-4 border-t border-[#ece9e5] pt-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#514a50]">AI Beauty Studio tools</span>
                    <div className="flex items-center gap-2">
                      <Link href="/beauty-studio/guides" onClick={() => setToolsOpen(false)} className="text-[11px] font-semibold text-[#0F766E] hover:underline">All guides</Link>
                      <span className="text-[#ece9e5]">·</span>
                      <Link href="/beauty-studio" onClick={() => setToolsOpen(false)} className="text-[11px] font-semibold text-[#0F766E] hover:underline">Open studio</Link>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                    {studioNavigationGuides.map((guide) => (
                      <Link key={guide.slug} href={`/beauty-studio/guides/${guide.slug}`} onClick={() => setToolsOpen(false)} className="rounded-md px-2 py-2 text-[12px] text-[#3d3b40] hover:bg-[#f8f3f4] hover:text-[#0F766E]">{guide.tool}</Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link href="/#how-it-works" className="text-[13px] font-medium text-[#525158] transition-colors hover:text-[#0F766E]">{copy.howItWorks}</Link>
          <Link href="/sample-report" className="text-[13px] font-medium text-[#525158] transition-colors hover:text-[#0F766E]">{copy.sample}</Link>
          <Link href="/guides" className="text-[13px] font-medium text-[#525158] transition-colors hover:text-[#0F766E]">{copy.guides}</Link>
          <Link href="/pricing" className="text-[13px] font-medium text-[#525158] transition-colors hover:text-[#0F766E]">{copy.free}</Link>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div ref={languageControlRef} className="relative">
            <button
              ref={languageButtonRef}
              type="button"
              onClick={() => setLanguageOpen((open) => !open)}
              aria-label={settingsCopy.language}
              title={settingsCopy.language}
              aria-expanded={languageOpen}
              aria-controls="site-language-menu"
              className="grid h-9 w-9 place-items-center rounded-md border border-[#E2E9E6] text-[#525158] transition-colors hover:bg-[#f5faf8]"
            >
              <Globe2 size={17} />
            </button>
            {languageOpen && (
              <div id="site-language-menu" className="site-preferences-menu absolute right-0 top-full z-[60] mt-2 w-[min(300px,calc(100vw-1.5rem))] rounded-xl border border-[#E2E9E6] bg-white p-3 shadow-xl sm:p-4">
                <p className="mb-2 px-1 text-[11px] font-semibold text-[#525158]">{settingsCopy.language}</p>
                <div role="group" aria-label={settingsCopy.language} className="max-h-[min(65vh,420px)] space-y-1 overflow-y-auto">
                  {availableLocales.map(({ code, flag, nativeLabel, label }) => {
                    const selected = locale === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          changeLocale(code);
                          setLanguageOpen(false);
                          languageButtonRef.current?.focus();
                        }}
                        aria-pressed={selected}
                        className={`flex min-h-10 w-full items-center gap-3 rounded-md px-2.5 text-left text-[12px] transition-colors focus-visible:outline-offset-[-2px] ${selected ? "bg-[#EAF5F3] font-semibold text-[#0F766E]" : "text-[#34363a] hover:bg-[#f5faf8]"}`}
                      >
                        <span aria-hidden="true" className="text-base leading-none">{flag}</span>
                        <span className="min-w-0 flex-1 truncate">{nativeLabel}<span className={`ml-1.5 text-[10px] font-normal ${selected ? "text-[#0F766E]" : "text-[#68666c]"}`}>{label}</span></span>
                        {selected && <Check size={15} aria-hidden="true" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={toggleTheme}
            aria-label={darkMode ? copy.switchLight : copy.switchDark}
            title={darkMode ? copy.switchLight : copy.switchDark}
            aria-pressed={darkMode}
            className="grid h-9 w-9 place-items-center rounded-md border border-[#E2E9E6] text-[#525158] transition-colors hover:bg-[#f5faf8]"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <Link
            href="/beauty-studio"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[#0F766E] px-2.5 text-[11px] font-semibold text-white transition-colors hover:bg-[#115E59] min-[400px]:px-3 sm:px-4 sm:text-[13px] max-[399px]:hidden"
          >
            <span className="hidden sm:inline">Open AI Beauty Studio</span>
            <span className="sm:hidden">AI Beauty Studio</span>
            <ArrowUpRight size={14} className="hidden sm:block" />
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="grid h-9 w-9 shrink-0 place-items-center text-[#222126] xl:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-[#E8EFEC] bg-white px-5 py-6 xl:hidden">
          <div className="mx-auto max-w-[1200px] space-y-4">
            <div className="flex flex-col gap-2">
              <Link href="/tools" onClick={() => setMenuOpen(false)} className="text-[15px] font-semibold text-[#1b1b1e]">{copy.tools}</Link>
              <div className="grid grid-cols-2 gap-2 pl-2">
                {tools.slice(0, 10).map((tool) => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`} onClick={() => setMenuOpen(false)} className="text-[13px] text-[#525158]"><LocalizedToolName slug={tool.slug} fallback={tool.title} /></Link>
                ))}
              </div>
            </div>
            <hr className="border-[#ece9e5]" />
            <div className="flex flex-col gap-3">
              <Link href="/beauty-studio" onClick={() => setMenuOpen(false)} className="text-[14px] font-semibold text-[#0F766E]">AI Beauty Studio</Link>
              <Link href="/#how-it-works" onClick={() => setMenuOpen(false)} className="text-[14px] font-medium text-[#525158]">{copy.howItWorks}</Link>
              <Link href="/sample-report" onClick={() => setMenuOpen(false)} className="text-[14px] font-medium text-[#525158]">{copy.sample}</Link>
              <Link href="/guides" onClick={() => setMenuOpen(false)} className="text-[14px] font-medium text-[#525158]">{copy.guides}</Link>
              <Link href="/pricing" onClick={() => setMenuOpen(false)} className="text-[14px] font-medium text-[#525158]">{copy.free}</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
