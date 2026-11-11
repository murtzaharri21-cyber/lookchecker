import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { tools } from "@/lib/site-data";
import { LocalizedToolName } from "@/components/localized-tool-name";

export function SiteFooter() {
  return (
    <footer className="border-t border-[#dedbd6] bg-[#f8f7f5]">
      <div className="mx-auto max-w-[1200px] px-5 pb-8 pt-14 sm:px-8">
        <div className="grid gap-10 border-b border-[#e1deda] pb-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-[300px]">
            <Link className="text-[17px] font-[750] tracking-[-0.045em] text-[#1b1b1e]" href="/">
              <span className="font-heading text-[24px] font-normal italic text-[#0F766E]">Look</span> Checker<span className="text-[#0F766E]">.</span>
            </Link>
            <p className="mt-4 text-[13px] leading-[1.8] text-[#514a50]">
              Explore facial measurements in your browser, then decide which styling ideas feel right for you.
            </p>
            <Link className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0F766E] hover:underline" href="/tools/attractiveness">
              Try a free scan <ArrowUpRight size={14} />
            </Link>
          </div>

          <div>
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#514a50]">Free tools</h2>
            <div className="grid gap-3">
              {tools.map((tool) => (
                <Link key={tool.slug} className="text-[13px] text-[#5f5c62] hover:text-[#0F766E]" href={`/tools/${tool.slug}`}>
                  <LocalizedToolName slug={tool.slug} fallback={tool.title} />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#514a50]">Explore</h2>
            <div className="grid gap-3">
              <Link className="text-[13px] text-[#5f5c62] hover:text-[#0F766E]" href="/sample-report">Sample report</Link>
              <Link className="text-[13px] text-[#5f5c62] hover:text-[#0F766E]" href="/tools/full-analysis">Complete face analysis</Link>
              <Link className="text-[13px] text-[#5f5c62] hover:text-[#0F766E]" href="/pricing">Always free</Link>
              <Link className="text-[13px] text-[#5f5c62] hover:text-[#0F766E]" href="/beauty-studio">AI Beauty Studio</Link>
              <Link className="text-[13px] text-[#5f5c62] hover:text-[#0F766E]" href="/beauty-studio/guides">Beauty Studio guides</Link>
              <Link className="text-[13px] text-[#5f5c62] hover:text-[#0F766E]" href="/guides/face-shape-hairstyle">Hairstyle guide</Link>
              <Link className="text-[13px] text-[#5f5c62] hover:text-[#0F766E]" href="/guides/hairline-check">Hair &amp; hairline guide</Link>
              <Link className="text-[13px] text-[#5f5c62] hover:text-[#0F766E]" href="/guides/glow-up-tips">Everyday care guide</Link>
              <Link className="text-[13px] text-[#5f5c62] hover:text-[#0F766E]" href="/guides/glasses-for-face-shape">Eyewear guide</Link>
            </div>
          </div>

          <div>
            <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#514a50]">Information</h2>
            <div className="grid gap-3">
              <Link className="text-[13px] text-[#5f5c62] hover:text-[#0F766E]" href="/about">About us</Link>
              <Link className="text-[13px] text-[#5f5c62] hover:text-[#0F766E]" href="/contact">Contact</Link>
              <Link className="text-[13px] text-[#5f5c62] hover:text-[#0F766E]" href="/privacy">Privacy</Link>
              <Link className="text-[13px] text-[#5f5c62] hover:text-[#0F766E]" href="/terms">Terms of Service</Link>
              <Link className="text-[13px] text-[#5f5c62] hover:text-[#0F766E]" href="/refunds">Refund Policy</Link>
              <Link className="text-[13px] text-[#5f5c62] hover:text-[#0F766E]" href="/cookies">Cookies &amp; browser storage</Link>
              <Link className="text-[13px] text-[#5f5c62] hover:text-[#0F766E]" href="/tools">All tools</Link>
              <address className="not-italic text-[12px] leading-[1.8] text-[#5f5c62]">
                Look Checker · G13, Islamabad, Pakistan<br />
                <a className="underline underline-offset-2 hover:text-[#0F766E]" href="mailto:murtzaharry21@gmail.com">Privacy &amp; legal contact</a>
              </address>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-3 pt-6 text-[12px] leading-relaxed text-[#514a50] sm:flex-row">
          <p>© {new Date().getFullYear()} Look Checker. Made for curiosity, not comparison.</p>
          <p>For informational purposes only. Not medical advice.</p>
        </div>
      </div>
    </footer>
  );
}
