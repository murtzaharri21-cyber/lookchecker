import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { HeroVisual } from "@/components/hero-visual";

export function HomeHero() {
  return (
    <section className="overflow-hidden bg-[#EAF5F3] text-[#1b1b1e]">
      <div className="mx-auto grid max-w-[1200px] items-center gap-11 px-5 pb-16 pt-12 sm:px-8 sm:pt-16 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,.96fr)] lg:gap-16 lg:py-[76px]">
        {/* Left column — HeroVisual card */}
        <div className="order-2 min-w-0 lg:order-1">
          <HeroVisual />
        </div>

        {/* Right column — text */}
        <div className="order-1 mx-auto w-full max-w-[560px] lg:order-2">
          <div className="inline-flex items-center gap-2 text-[13px] font-medium tracking-[.01em] text-[#53625f]">
            <span className="h-[7px] w-[7px] rounded-full bg-[#0F766E] shadow-[0_0_0_4px_rgba(15,118,110,.16)]" />
            No cost · On your device · No account
          </div>

          <h1 className="mt-6 font-heading text-[clamp(59px,6vw,88px)] font-[460] leading-[.99] tracking-[-.045em] text-[#1b1b1e]">
            A closer look<br />
            <span className="italic text-[#0F766E]">at you.</span>
          </h1>

          <p className="mt-6 max-w-[510px] text-[16px] leading-[1.75] text-[#53565a] sm:text-[18px]">
            Explore how visible proportions relate, see which measurements shape your results, and get practical ideas to try at your own pace.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/tools/attractiveness" className="btn-primary !min-h-[53px] !px-6 !text-[14px]">
              Analyze a photo <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/tools/full-analysis" className="btn-outline-dark !min-h-[53px] !px-5 !text-[14px]">
              Explore your features <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-4">
            <Link
              href="/beauty-studio"
              className="inline-flex items-center gap-2 rounded-full border border-[#d7e2df] bg-white/70 px-4 py-2 text-[12px] font-semibold text-[#234f4a] transition hover:border-[#0F766E] hover:text-[#0F766E]"
            >
              Open AI Beauty Studio
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-10 grid min-w-0 grid-cols-2 gap-x-5 gap-y-4 border-t border-[#cbdad6] pt-5 text-[12px] text-[#666a6b] sm:flex sm:flex-wrap sm:gap-x-6">
            <span className="min-w-0">
              <strong className="font-mono font-medium text-[#1b1b1e]">478</strong> landmarks
            </span>
            <span className="min-w-0">
              <strong className="font-medium text-[#1b1b1e]">On-device scan</strong>
            </span>
            <span className="min-w-0">
              <strong className="font-medium text-[#1b1b1e]">Your photo stays on your device</strong>
            </span>
            <span className="min-w-0">
              <strong className="font-medium text-[#1b1b1e]">No signup needed</strong>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
