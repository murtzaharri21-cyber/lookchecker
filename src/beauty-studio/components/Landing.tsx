import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Droplets, Palette, ScanFace, Scissors, Sparkles, UserRound } from "lucide-react";
import sampleWoman from "../assets/sample-woman.jpg";

const FEATURES = [
  { icon: Scissors, title: "Hairstyle Try-On", text: "Compare bobs, waves, curls, pompadours, buns and more, positioned from facial landmarks in your photo." },
  { icon: Palette, title: "Hair Color Studio", text: "Explore shades with image-based hair selection that preserves some of the source photo’s texture and lighting." },
  { icon: UserRound, title: "Beard Styles", text: "Preview stubble, boxed beards, goatees, moustaches and fuller shapes along your detected jawline." },
  { icon: Droplets, title: "Skin Analysis", text: "Explore photo-based skin indicators, tone and undertone estimates, optional overlays, and general routine ideas." },
  { icon: Sparkles, title: "Makeup Artist", text: "Try lipstick finishes, eyeshadow, liner, blush and contour, with color suggestions based on estimated undertone." },
  { icon: ScanFace, title: "Face Shape AI", text: "Measures 478 landmarks to estimate face shape and explore haircut and beard ideas.", guideHref: "/beauty-studio/guides/face-shape-haircut-guide" },
];

export default function Landing({ onFile, onCamera }: { onFile: (f: File) => void; onCamera: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#DCECE9]/50 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-40 h-[520px] w-[520px] rounded-full bg-[#EAF5F3]/60 blur-[120px]" />

      <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <span className="font-display text-2xl tracking-wide text-white">AI Beauty Studio</span>
        </div>
      </header>

      <section className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-6 pb-16 pt-6 lg:grid-cols-[1.1fr_1fr] lg:pt-12">
        <div className="fade-up">
          <p className="mb-5 inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-stone-300">AI Beauty & Grooming Studio</p>
          <h1 className="font-display text-5xl leading-[1.05] text-white sm:text-6xl lg:text-6xl">
            See your <span className="text-gold italic">next look</span> before you commit.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-stone-400">
            Upload a photo or take a selfie to preview hairstyles, hair colors, beard shapes and makeup, and explore photo-based skin estimates – processed in your browser.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <button onClick={() => fileRef.current?.click()} className="btn-gold flex items-center gap-2 rounded-full px-7 py-3.5 text-[15px] font-semibold transition">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 16V4m0 0l-5 5m5-5l5 5M4 20h16" />
              </svg>
              Upload photo
            </button>
            <button onClick={onCamera} className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-white/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8a2 2 0 012-2h2l2-2h6l2 2h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                <circle cx="12" cy="13" r="3.5" />
              </svg>
              Take a selfie
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) onFile(f);
                e.target.value = "";
              }}
            />
          </div>
          <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-white/5 pt-6">
            {[
              ["478", "face landmarks"],
              ["19+10", "hair & beard styles"],
              ["8", "skin metrics"],
            ].map(([a, b]) => (
              <div key={b}>
                <div className="font-display text-3xl text-white">{a}</div>
                <div className="text-xs text-stone-500">{b}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[440px] overflow-hidden rounded-[2rem] border border-white/10 shadow-[0_40px_120px_-30px_rgba(228,139,155,0.45)]">
            <Image src={sampleWoman} alt="Portrait preview for AI face analysis" fill priority sizes="(min-width: 1024px) 440px, (min-width: 640px) 440px, 100vw" className="object-cover" />
            <div className="glass absolute left-4 top-4 rounded-2xl border border-white/10 px-4 py-3">
              <div className="text-[10px] uppercase tracking-widest text-stone-400">Face shape</div>
              <div className="font-display text-lg text-white">Oval · 87%</div>
            </div>
            <div className="glass absolute bottom-4 left-4 right-4 rounded-2xl border border-white/10 p-4">
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="text-stone-300">Skin health</span>
                <span className="font-semibold text-emerald-300">84 / 100</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {["#d9a98a", "#c9a28a", "#b9706e", "#e08f86"].map((c) => (
                  <div key={c} className="h-6 rounded-md" style={{ background: c }} />
                ))}
              </div>
              <div className="mt-2 text-[11px] text-stone-400">Undertone: Neutral-warm · Fitzpatrick III</div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-7xl px-6 pb-24">
        <h2 className="sr-only">Explore Beauty Studio tools</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="fade-up rounded-3xl border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-transparent p-6" style={{ animationDelay: `${i * 70}ms` }}>
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-[#0F766E]"><f.icon size={22} strokeWidth={1.7} /></div>
              <h3 className="font-display text-xl text-white">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-400">{f.text}</p>
              {f.guideHref && <Link href={f.guideHref} className="mt-4 inline-flex text-xs font-semibold text-[#0F766E] underline underline-offset-4 hover:text-[#115E59]">Read the face-shape haircut guide</Link>}
            </div>
          ))}
        </div>
        <h2 className="sr-only">How the virtual try-on works</h2>
        <div className="mt-14 grid gap-6 rounded-3xl border border-white/[0.07] bg-white/[0.02] p-8 md:grid-cols-3">
          {[
            ["01", "Capture", "Use a clear, evenly lit photo. Straight-on and gently angled views work best; extreme profiles or covered features may reduce fit accuracy."],
            ["02", "Analyze", "On-device neural networks map 478 landmarks and segment your hair."],
            ["03", "Transform", "Try styles, colors, beards and makeup. Compare & download."],
          ].map(([n, t, d]) => (
            <div key={n} className="flex gap-4">
              <span className="font-display text-3xl text-gold">{n}</span>
              <div>
                <h3 className="font-semibold text-white">{t}</h3>
                <p className="mt-1 text-sm text-stone-400">{d}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-stone-600">Results are visual simulations for inspiration and are not a medical diagnosis.</p>
      </section>
    </div>
  );
}
