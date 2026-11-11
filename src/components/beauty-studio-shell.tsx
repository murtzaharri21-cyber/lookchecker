"use client";

import dynamic from "next/dynamic";
import Landing from "@/beauty-studio/components/Landing";

const noop = () => undefined;

const BeautyStudioApp = dynamic(() => import("@/beauty-studio/App"), {
  ssr: false,
  loading: () => <Landing onFile={noop} onCamera={noop} />,
});

export default function BeautyStudioShell() {
  return (
    <div className="beauty-studio-page">
      <BeautyStudioApp />
      <style jsx global>{`
        .beauty-studio-page {
          --beauty-bg: #fbfaf8;
          --beauty-surface: #ffffff;
          --beauty-soft: #f0f6f4;
          --beauty-text: #1b1b1e;
          --beauty-muted: #56545b;
          --beauty-subtle: #6b6970;
          --beauty-border: #dce7e4;
          --beauty-accent: #0f766e;
          --beauty-accent-strong: #115e59;
          background: var(--beauty-bg);
          color: var(--beauty-text);
        }

        html[data-theme="dark"] .beauty-studio-page {
          --beauty-bg: #111714;
          --beauty-surface: #171d1a;
          --beauty-soft: #202824;
          --beauty-text: #edf2ef;
          --beauty-muted: #c4cec9;
          --beauty-subtle: #aeb9b4;
          --beauty-border: #394640;
          --beauty-accent: #8dd1c8;
          --beauty-accent-strong: #a1e0d7;
        }

        .beauty-studio-page .font-display {
          font-family: "Newsreader Variable", Georgia, serif;
        }

        .beauty-studio-page .text-gold {
          background: linear-gradient(100deg, #0f766e 0%, #286d68 55%, #73a9a0 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        html[data-theme="dark"] .beauty-studio-page .text-gold {
          background-image: linear-gradient(100deg, #8dd1c8 0%, #a1e0d7 55%, #c1e8e2 100%);
        }

        .beauty-studio-page .btn-gold {
          background: #0f766e;
          color: #fff;
          box-shadow: 0 8px 20px -10px rgba(15, 118, 110, 0.55);
        }

        .beauty-studio-page .btn-gold:hover {
          background: #115e59;
        }

        .beauty-studio-page .glass {
          background: color-mix(in srgb, var(--beauty-surface) 92%, transparent);
          color: var(--beauty-text);
          border: 1px solid var(--beauty-border);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }

        .beauty-studio-page .min-h-screen.bg-stone-950 {
          background: var(--beauty-bg);
          color: var(--beauty-text);
        }

        .beauty-studio-page [class*="bg-stone-950"]:not(.min-h-screen),
        .beauty-studio-page [class*="bg-stone-900"] {
          background-color: var(--beauty-surface) !important;
        }

        .beauty-studio-page [class*="bg-stone-800"],
        .beauty-studio-page [class*="bg-stone-700"] {
          background-color: var(--beauty-soft) !important;
        }

        .beauty-studio-page [class~="bg-white"] {
          background-color: var(--beauty-surface) !important;
        }

        .beauty-studio-page [class*="bg-white/"] {
          background-color: var(--beauty-soft) !important;
        }

        .beauty-studio-page [class*="bg-[#0F766E]/"] {
          background-color: #e4f2ef !important;
        }

        html[data-theme="dark"] .beauty-studio-page [class*="bg-[#0F766E]/"] {
          background-color: #25443e !important;
          color: var(--beauty-accent-strong) !important;
        }

        .beauty-studio-page [class*="bg-[radial-gradient"] {
          background: radial-gradient(ellipse at center, var(--beauty-soft) 0%, var(--beauty-bg) 78%) !important;
        }

        .beauty-studio-page [class~="text-white"],
        .beauty-studio-page [class*="text-stone-200"],
        .beauty-studio-page [class*="text-stone-300"] {
          color: var(--beauty-text) !important;
        }

        .beauty-studio-page .studio-thumb-label {
          color: #fff !important;
          text-shadow: 0 1px 3px rgb(0 0 0 / 85%);
        }

        .beauty-studio-page [class*="text-stone-400"],
        .beauty-studio-page [class*="text-stone-500"] {
          color: var(--beauty-muted) !important;
        }

        .beauty-studio-page [class*="text-stone-600"],
        .beauty-studio-page [class*="text-stone-700"] {
          color: var(--beauty-subtle) !important;
        }

        .beauty-studio-page [class*="text-emerald-200"],
        .beauty-studio-page [class*="text-emerald-300"] {
          color: var(--beauty-accent) !important;
        }

        .beauty-studio-page [class*="text-rose-200"],
        .beauty-studio-page [class*="text-rose-300"],
        .beauty-studio-page [class*="text-rose-400"] {
          color: #a33b51 !important;
        }

        html[data-theme="dark"] .beauty-studio-page [class*="text-rose-200"],
        html[data-theme="dark"] .beauty-studio-page [class*="text-rose-300"],
        html[data-theme="dark"] .beauty-studio-page [class*="text-rose-400"] {
          color: #f3a8b5 !important;
        }

        .beauty-studio-page [class*="border-white/"] {
          border-color: var(--beauty-border) !important;
        }

        .beauty-studio-page [class*="border-[#f3c3a3]"],
        .beauty-studio-page [class*="ring-[#f3c3a3]"] {
          border-color: var(--beauty-accent) !important;
          --tw-ring-color: var(--beauty-accent);
        }

        .beauty-studio-page [class*="text-[#f3c3a3]"] {
          color: var(--beauty-accent) !important;
        }

        .beauty-studio-page [class*="bg-[#f3c3a3]"] {
          background-color: var(--beauty-accent) !important;
        }

        .beauty-studio-page [class*="bg-gradient-to-r"][class*="from-[#f3c3a3]"] {
          background-image: linear-gradient(to right, var(--beauty-accent), var(--beauty-accent-strong)) !important;
        }

        .beauty-studio-page [class*="from-[#f8d6bd]"],
        .beauty-studio-page [class*="from-[#f3c3a3]"] {
          --tw-gradient-from: #dcece9 !important;
          --tw-gradient-to: rgb(220 236 233 / 0) !important;
        }

        .beauty-studio-page [class*="to-[#e48b9b]"] {
          --tw-gradient-to: var(--beauty-accent) !important;
        }

        html[data-theme="dark"] .beauty-studio-page [class*="from-[#f8d6bd]"],
        html[data-theme="dark"] .beauty-studio-page [class*="from-[#f3c3a3]"] {
          --tw-gradient-from: #8dd1c8 !important;
          --tw-gradient-to: rgb(141 209 200 / 0) !important;
        }

        .beauty-studio-page button:hover {
          border-color: var(--beauty-accent);
        }

        .beauty-studio-page [class*="ring-offset-stone-900"] {
          --tw-ring-offset-color: var(--beauty-bg);
        }

        .beauty-studio-page .lux-range {
          --beauty-range-accent: var(--beauty-accent);
          --beauty-range-track: var(--beauty-border);
        }

        .beauty-studio-page .lux-range {
          -webkit-appearance: none;
          appearance: none;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--beauty-accent) 0%, #4d9b91 var(--pct), var(--beauty-range-track) var(--pct));
          outline: none;
          cursor: pointer;
        }

        .beauty-studio-page .lux-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid var(--beauty-accent);
          box-shadow: 0 2px 8px rgba(15, 118, 110, 0.2);
        }

        .beauty-studio-page .lux-range::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid var(--beauty-accent);
        }

        .beauty-studio-page .scroll-thin::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .beauty-studio-page .scroll-thin::-webkit-scrollbar-thumb {
          background: var(--beauty-border);
          border-radius: 6px;
        }

        @keyframes beauty-scan {
          0% {
            top: 0%;
          }
          100% {
            top: 100%;
          }
        }

        .beauty-studio-page .scan-line {
          animation: beauty-scan 2.2s ease-in-out infinite alternate;
        }

        @keyframes beauty-floaty {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .beauty-studio-page .floaty {
          animation: beauty-floaty 6s ease-in-out infinite;
        }

        @keyframes beauty-fade-up {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: none;
          }
        }

        .beauty-studio-page .fade-up {
          animation: beauty-fade-up 0.6s ease both;
        }
      `}</style>
    </div>
  );
}
