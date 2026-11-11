import Link from "next/link";
import { ArrowLeft, ScanFace } from "lucide-react";

export default function NotFound() {
  return <main className="flex min-h-[66vh] items-center bg-[#f8f4f2]"><div className="mx-auto w-full max-w-[900px] px-5 py-20 text-center sm:px-8"><div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-[#D2E7E3] bg-[#F0F8F7] text-[#0F766E]"><ScanFace size={29} strokeWidth={1.5} /></div><p className="section-kicker mt-7">404 · Out of frame</p><h1 className="mt-3 font-heading text-[clamp(53px,6vw,78px)] leading-[1.02] tracking-[-.04em]">Nothing to see <em className="font-normal text-[#0F766E]">here.</em></h1><p className="mx-auto mt-5 max-w-[460px] text-[14px] leading-[1.85] text-[#514a50]">The page you’re looking for may have moved, or the report link may no longer be available.</p><Link href="/" className="btn-primary mt-8"><ArrowLeft size={15} /> Back to the beginning</Link></div></main>;
}
