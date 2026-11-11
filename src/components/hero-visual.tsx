"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ScanFace } from "lucide-react";
import { useState } from "react";

const measurements = [
  { title: "Eye spacing", value: "0.46 of face width", caption: "Balanced placement" },
  { title: "Facial proportions", value: "1.46 length / width", caption: "Within reference range" },
  { title: "Jaw proportion", value: "0.78 jaw / cheekbone", caption: "A gentle taper" },
];

const meshRows = [
  [[390, 225], [425, 211], [465, 203], [500, 202], [535, 203], [575, 211], [610, 225]],
  [[343, 310], [392, 298], [442, 294], [500, 295], [558, 294], [608, 298], [657, 310]],
  [[315, 382], [366, 374], [418, 370], [467, 371], [532, 371], [582, 370], [634, 374], [685, 382]],
  [[303, 459], [358, 451], [405, 446], [465, 451], [500, 456], [535, 451], [595, 446], [642, 451], [697, 459]],
  [[315, 530], [369, 526], [421, 516], [466, 523], [500, 526], [534, 523], [579, 516], [631, 526], [685, 530]],
  [[343, 601], [389, 601], [443, 599], [500, 611], [557, 599], [611, 601], [657, 601]],
  [[388, 672], [429, 678], [466, 695], [500, 702], [534, 695], [571, 678], [612, 672]],
];

export function HeroVisual() {
  const [active, setActive] = useState(0);

  return (
    <div className="relative mx-auto min-w-0 w-full max-w-[555px]">
      <div className="group overflow-hidden rounded-[13px] border border-white/15 bg-[#101013] shadow-[0_28px_90px_rgba(0,0,0,.3)] transition-colors hover:border-white/35">
        <div className="relative aspect-square overflow-hidden bg-[#272629]">
          <Image src="/images/hero-portrait.webp" alt="Example front-facing portrait showing an illustrative facial landmark analysis" fill priority sizes="(max-width: 595px) calc(100vw - 2.5rem), 555px" className="object-cover brightness-[.81] saturate-[.75] contrast-[1.05] transition-transform duration-700 group-hover:scale-[1.025]" />
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_43%,transparent_42%,rgba(8,8,11,.25)_100%)]" />
          <svg viewBox="0 0 1000 1000" className="pointer-events-none absolute inset-0 h-full w-full opacity-80" aria-hidden="true">
            <defs>
              <linearGradient id="scanStroke" x1="0" x2="1"><stop stopColor="#fff" stopOpacity=".34"/><stop offset=".5" stopColor="#fff" stopOpacity=".68"/><stop offset="1" stopColor="#fff" stopOpacity=".34"/></linearGradient>
            </defs>
            <path d="M 500 104 C 371 100 308 208 303 335 C 284 461 325 610 402 687 C 445 734 478 754 500 757 C 522 754 555 734 598 687 C 675 610 716 461 697 335 C 692 208 629 100 500 104 Z" fill="none" stroke="url(#scanStroke)" strokeWidth="1.4" strokeDasharray="4 8" />
            {meshRows.map((row, rowIndex) => <g key={rowIndex}>
              <polyline points={row.map(([x, y]) => `${x},${y}`).join(" ")} fill="none" stroke="white" strokeOpacity=".26" strokeWidth="1" />
              {row.map(([x, y], pointIndex) => <circle key={pointIndex} cx={x} cy={y} r={pointIndex % 2 === 0 ? 2.2 : 1.5} fill="white" fillOpacity={pointIndex % 2 === 0 ? ".74" : ".48"} />)}
            </g>)}
            <path d="M 340 400 Q 385 371 449 404 Q 392 428 340 400 Z M 551 404 Q 615 371 660 400 Q 608 428 551 404 Z M 430 304 Q 386 286 347 317 M 570 304 Q 614 286 653 317 M 500 397 L 478 527 Q 500 542 522 527 M 421 607 Q 500 584 579 607 Q 500 644 421 607 Z" fill="none" stroke="white" strokeOpacity=".53" strokeWidth="1.2" />
            <path d="M 390 235 L 340 310 M 610 235 L 660 310 M 358 452 L 421 516 M 642 452 L 579 516 M 389 601 L 466 695 M 611 601 L 534 695" fill="none" stroke="white" strokeOpacity=".23" strokeWidth="1" />
            <line x1="500" y1="180" x2="500" y2="755" stroke="white" strokeOpacity=".36" strokeWidth="1" strokeDasharray="3 8" />
            <path d="M 390 392 L 610 392 M 390 383 L 390 401 M 610 383 L 610 401" stroke="#72C6BB" strokeWidth="2" opacity=".9" />
            <circle cx="390" cy="392" r="4" fill="#72C6BB" /><circle cx="610" cy="392" r="4" fill="#72C6BB" />
            <path d="M 269 385 L 287 385 M 278 376 L 278 394 M 713 385 L 731 385 M 722 376 L 722 394" stroke="white" strokeOpacity=".65" strokeWidth="1" />
          </svg>
          <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-4 sm:p-5">
            <span className="inline-flex items-center gap-2 rounded-md bg-[#141417]/75 px-2.5 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-md"><span className="h-[6px] w-[6px] animate-pulse rounded-full bg-[#8DD1C8]" /> Face mapped</span>
            <span className="rounded-md bg-[#141417]/75 px-2.5 py-1.5 font-mono text-[10px] text-white/85 backdrop-blur-md">478 / 478 points</span>
          </div>
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="pointer-events-none absolute bottom-4 left-5 flex items-center gap-2 text-[11px] font-medium text-white/80"><ScanFace size={15} /> Sample analysis</div>
          <Link href="/tools/attractiveness" className="absolute inset-0 z-10"><span className="hero-visual-cta absolute bottom-4 right-4 inline-flex items-center gap-1.5 rounded-md bg-white px-3.5 py-2.5 text-[11px] font-semibold text-[#17171a] shadow-lg transition-colors group-hover:bg-[#fff0f3] sm:text-xs">Try it on your photo <ArrowUpRight size={13} /></span></Link>
        </div>
        <div className="relative flex min-h-[111px] items-center justify-between gap-3 border-t border-[#dce7e4] bg-white px-5 py-4 sm:px-6">
          <div className="min-w-0">
            <p className="text-[11px] text-[#514a50]">Measuring facial geometry <span className="ml-1 text-[#0F766E]">✦</span></p>
            <p className="mt-1.5 truncate font-heading text-[25px] leading-tight text-[#1b1b1e] sm:text-[28px]">{measurements[active].title}</p>
            <p className="mt-1 text-[11px] text-[#626a68]">{measurements[active].value} <span className="px-1.5 text-[#514a50]">·</span> {measurements[active].caption}</p>
          </div>
          <div role="group" aria-label="Example measurements" className="flex shrink-0 items-center gap-0.5 self-end pb-0.5">
            {measurements.map((measurement, index) => <button key={measurement.title} type="button" aria-label={`Show ${measurement.title} measurement`} aria-pressed={active === index} onClick={() => setActive(index)} className="grid h-11 w-10 shrink-0 place-items-center rounded-full focus-visible:outline-offset-[-2px]"><span aria-hidden="true" className={`block h-1.5 rounded-full transition-[width,background-color] ${active === index ? "w-5 bg-[#0F766E]" : "w-2 bg-[#b9c6c2] hover:bg-[#78958f]"}`} /></button>)}
          </div>
        </div>
      </div>
      <p className="mt-3 text-center text-[11px] text-[#514a50]">Illustrative scan on a sample portrait. Your real scan uses your own photo.</p>
    </div>
  );
}
