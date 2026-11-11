"use client";

import { useEffect, useRef, useState, type ChangeEvent } from "react";
import Image from "next/image";
import type { ReactNode } from "react";
import { Check, ImagePlus, Shirt, Sparkles, Sun, X } from "lucide-react";
import type { ToolDefinition } from "@/lib/site-data";
import { translateTool, translateToolOption, type ToolCopyKey } from "@/lib/tool-copy";
import { useLocale } from "@/lib/use-locale";

const outfitChecks = [
  "I can sit, stand, and move comfortably",
  "The layers work for the weather and setting",
  "The colors and pieces feel like my style",
];

const skinAdvice: Record<string, string[]> = {
  comfortable: ["Keep a gentle cleanser and moisturizer if they suit you.", "Use broad-spectrum sunscreen during daytime exposure."],
  dry: ["Try a gentle, fragrance-free cleanser and a moisturizer that feels comfortable.", "Avoid adding several new active products at once."],
  shiny: ["A gentle cleanse is usually enough; avoid scrubbing to remove shine.", "If you use products, introduce one at a time and stop if irritation develops."],
  sensitive: ["Keep the routine simple and consider fragrance-free products.", "Patch-test a new product first and stop using it if it causes irritation."],
  unsure: ["Notice how your skin feels through the day before changing your routine.", "Keep any routine simple and avoid introducing several new products at once."],
};

const glowUpIdeas: Record<string, string[]> = {
  hair: ["Try a different part or a quick styling technique with products you already own.", "Save two reference photos and ask a stylist which details suit your texture and upkeep preferences."],
  grooming: ["Pick one small grooming habit that feels comfortable to maintain.", "Use tools and products you already have before buying something new."],
  routine: ["Keep the basics simple: gentle cleansing, moisturizer if needed, and daytime sun protection.", "Change one thing at a time so you can tell what works for you."],
  style: ["Choose one color or outfit combination you already enjoy and build around it.", "Check comfort and movement before deciding whether a look works for your day."],
};

function Field({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: [string, string][] }) {
  const locale = useLocale();
  const labelKey: Partial<Record<string, ToolCopyKey>> = {
    "Where are you going?": "occasion",
    "What matters most today?": "priority",
    "How does your skin usually feel after washing?": "skinFeel",
    "Anything you’d like general tips for?": "skinConcern",
    "What would you like to explore?": "glowFocus",
    "How much time would feel realistic?": "timeBudget",
  };
  const key = labelKey[label];
  const translatedLabel = key ? translateTool(locale, key) : label;
  return <label className="grid gap-2 text-[13px] font-medium text-[#393d3b]">
    {translatedLabel === key ? label : translatedLabel}
    <select value={value} onChange={(event) => onChange(event.target.value)} className="min-h-11 rounded-md border border-[#d7e2df] bg-white px-3 text-[13px] font-normal text-[#303432] outline-none focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15">
      {options.map(([option, text]) => <option key={option} value={option}>{translateToolOption(locale, text)}</option>)}
    </select>
  </label>;
}

function OutfitCheck() {
  const locale = useLocale();
  const copy = (key: ToolCopyKey, fallback: string) => translateTool(locale, key) === key ? fallback : translateTool(locale, key);
  const [occasion, setOccasion] = useState("everyday");
  const [priority, setPriority] = useState("comfort");
  const [checked, setChecked] = useState<string[]>([]);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const photoUrlRef = useRef<string | null>(null);
  const nextSteps = outfitChecks.filter((item) => !checked.includes(item));

  useEffect(() => () => {
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
  }, []);

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    setPhotoError("");
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setPhotoError("Choose an image smaller than 15 MB.");
      return;
    }
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    const url = URL.createObjectURL(file);
    photoUrlRef.current = url;
    setPhotoUrl(url);
  }

  function removePhoto() {
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    photoUrlRef.current = null;
    setPhotoUrl(null);
    setPhotoError("");
  }

  const occasionLabel = translateToolOption(locale, occasion === "everyday" ? "Everyday plans" : occasion === "work" ? "Work or study" : occasion === "event" ? "A social event" : occasion === "formal" ? "A formal occasion" : "An outdoor activity").toLowerCase();
  const priorityLabel = translateToolOption(locale, priority === "comfort" ? "Comfort and ease" : priority === "polished" ? "A more polished feel" : "Showing my personal style").toLowerCase();

  return <div className="grid gap-6 md:grid-cols-[1fr_.9fr]">
    <div className="space-y-5 rounded-xl border border-[#E2E9E6] bg-white p-5 sm:p-7">
      <div>
        <p className="text-[13px] font-medium text-[#393d3b]">{copy("uploadOutfit", "Add an outfit photo for your check-in")}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <label htmlFor="outfit-photo" className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-[#cbdad6] bg-white px-3 text-[12px] font-semibold text-[#245e58] hover:bg-[#f5faf8]"><ImagePlus size={15} />{copy("choosePhotoReference", "Choose a photo")}</label>
          <span className="text-[10px] text-[#514a50]">{copy("photoFormatsPrivate", "JPG, PNG, or WebP · up to 15 MB · stays on this device")}</span>
          <input id="outfit-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} className="sr-only" />
        </div>
        {photoError && <p role="alert" className="mt-2 text-[11px] text-[#0F766E]">{photoError}</p>}
        {photoUrl && <div className="relative mt-3 aspect-[4/3] max-w-sm overflow-hidden rounded-lg border border-[#dce7e4] bg-[#f4f7f6]">
          <Image src={photoUrl} alt="Your outfit photo, shown locally for reference" fill sizes="(max-width: 640px) 100vw, 384px" unoptimized className="object-contain" />
          <button type="button" onClick={removePhoto} aria-label={copy("removeOutfitPhoto", "Remove outfit photo")} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-[#333] shadow"><X size={16} /></button>
        </div>}
        {photoUrl && <p role="status" aria-live="polite" className="mt-3 rounded-md bg-[#F0F6F4] p-3 text-[11px] leading-relaxed text-[#53615d]">{copy("outfitPhotoReady", "Your photo is ready for {occasion}. Keep {priority} in mind and use the checklist to check comfort, movement, and weather; the image is not analyzed.").replace("{occasion}", occasionLabel).replace("{priority}", priorityLabel)}</p>}
      </div>
      <Field label="Where are you going?" value={occasion} onChange={setOccasion} options={[
        ["everyday", "Everyday plans"], ["work", "Work or study"], ["event", "A social event"], ["formal", "A formal occasion"], ["outdoor", "An outdoor activity"],
      ]} />
      <Field label="What matters most today?" value={priority} onChange={setPriority} options={[
        ["comfort", "Comfort and ease"], ["polished", "A more polished feel"], ["expressive", "Showing my personal style"],
      ]} />
      <fieldset className="space-y-3">
        <legend className="mb-3 text-[13px] font-medium text-[#393d3b]">{copy("quickCheck", "A quick check before you head out")}</legend>
        {outfitChecks.map((item) => <label key={item} className="flex cursor-pointer items-start gap-3 rounded-md border border-[#e5ece9] p-3 text-[12px] leading-relaxed text-[#555e5b]">
          <input type="checkbox" checked={checked.includes(item)} onChange={(event) => setChecked(event.target.checked ? [...checked, item] : checked.filter((value) => value !== item))} className="mt-0.5 accent-[#0F766E]" />
          {translateToolOption(locale, item)}
        </label>)}
      </fieldset>
    </div>
    <AdvicePanel icon={<Shirt size={18} />} title={copy("outfitCheck", "Your outfit check")} eyebrow={copy("checklistNotRating", "A checklist, not a rating")}>
      <p>For {occasionLabel}, put {priority === "comfort" ? "comfort first" : priority === "polished" ? "the polished details you enjoy" : "your personal style"} at the center.</p>
      {nextSteps.length ? <><p className="mt-4 font-medium text-[#373d3a]">Before you go, consider:</p><ul className="mt-2 list-inside list-disc space-y-2">{nextSteps.map((item) => <li key={item}>{item}</li>)}</ul></> : <p className="mt-4">You checked all three basics. If it feels right and suits your plans, you’re ready.</p>}
    </AdvicePanel>
  </div>;
}

function SkinCheck() {
  const locale = useLocale();
  const copy = (key: ToolCopyKey, fallback: string) => translateTool(locale, key) === key ? fallback : translateTool(locale, key);
  const [feel, setFeel] = useState("comfortable");
  const [concern, setConcern] = useState("none");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const photoUrlRef = useRef<string | null>(null);
  const advice = [...skinAdvice[feel], ...(concern === "redness" ? ["If redness or discomfort persists, consider asking a qualified skin-care professional."] : concern === "spots" ? ["Avoid picking at spots; seek professional advice if they are painful, persistent, or worrying you."] : [])];

  useEffect(() => () => {
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
  }, []);

  function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    setPhotoError("");
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setPhotoError("Choose an image smaller than 15 MB.");
      return;
    }
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    const url = URL.createObjectURL(file);
    photoUrlRef.current = url;
    setPhotoUrl(url);
  }

  function removePhoto() {
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    photoUrlRef.current = null;
    setPhotoUrl(null);
    setPhotoError("");
  }

  const feelLabel = translateToolOption(locale, feel === "comfortable" ? "Comfortable" : feel === "dry" ? "Dry or tight" : feel === "shiny" ? "Shiny or oily" : feel === "sensitive" ? "Easily irritated" : "Not sure / varies").toLowerCase();
  const concernLabel = translateToolOption(locale, concern === "redness" ? "Occasional redness" : concern === "spots" ? "Occasional spots" : "No particular concern").toLowerCase();
  const photoReply = copy("skinPhotoReady", "Your photo is ready. You selected {feel} and want general tips about {concern}. The guidance is based on your answers, not image analysis.")
    .replace("{feel}", feelLabel)
    .replace("{concern}", concernLabel);

  return <div className="grid gap-6 md:grid-cols-[1fr_.9fr]">
    <div className="space-y-5 rounded-xl border border-[#E2E9E6] bg-white p-5 sm:p-7">
      <div>
        <p className="text-[13px] font-medium text-[#393d3b]">{copy("uploadSkin", "Add a photo for your skin check-in")}</p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <label htmlFor="skin-photo" className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-md border border-[#cbdad6] bg-white px-3 text-[12px] font-semibold text-[#245e58] hover:bg-[#f5faf8]"><ImagePlus size={15} />{copy("choosePhotoReference", "Choose a photo")}</label>
          <span className="text-[10px] text-[#514a50]">{copy("photoFormatsPrivate", "JPG, PNG, or WebP · up to 15 MB · stays on this device")}</span>
          <input id="skin-photo" type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} className="sr-only" />
        </div>
        {photoError && <p role="alert" className="mt-2 text-[11px] text-[#0F766E]">{photoError}</p>}
        {photoUrl && <div className="relative mt-3 aspect-[4/3] max-w-sm overflow-hidden rounded-lg border border-[#dce7e4] bg-[#f4f7f6]">
          <Image src={photoUrl} alt="Your skin photo, shown locally for reference" fill sizes="(max-width: 640px) 100vw, 384px" unoptimized className="object-contain" />
          <button type="button" onClick={removePhoto} aria-label={copy("removeSkinPhoto", "Remove skin photo")} className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-[#333] shadow"><X size={16} /></button>
        </div>}
        {photoUrl && <p role="status" aria-live="polite" className="mt-3 rounded-md bg-[#F0F6F4] p-3 text-[11px] leading-relaxed text-[#53615d]">{photoReply}</p>}
      </div>
      <Field label="How does your skin usually feel after washing?" value={feel} onChange={setFeel} options={[
        ["comfortable", "Comfortable"], ["dry", "Dry or tight"], ["shiny", "Shiny or oily"], ["sensitive", "Easily irritated"], ["unsure", "Not sure / varies"],
      ]} />
      <Field label="Anything you’d like general tips for?" value={concern} onChange={setConcern} options={[
        ["none", "No particular concern"], ["redness", "Occasional redness"], ["spots", "Occasional spots"],
      ]} />
      <p className="rounded-md bg-[#F0F6F4] p-3 text-[11px] leading-relaxed text-[#53615d]">{copy("skinPhotoDisclaimer", "Your photo stays in this browser and is not automatically analyzed. Use it as a visual reference while answering; the tips come from your selections.")}</p>
    </div>
    <AdvicePanel icon={<Sun size={18} />} title={copy("skinAdvice", "Gentle starting points")} eyebrow={copy("cosmeticOnly", "Cosmetic guidance only")}>
      <ul className="space-y-3">{advice.map((item) => <li key={item} className="flex gap-2.5"><Check size={15} className="mt-0.5 shrink-0 text-[#0F766E]" />{item}</li>)}</ul>
      <p className="mt-5 border-t border-[#dce7e4] pt-4 text-[11px]">A photo can’t diagnose skin conditions. For persistent or concerning changes, contact a qualified professional.</p>
    </AdvicePanel>
  </div>;
}

function GlowUpPlanner() {
  const locale = useLocale();
  const copy = (key: ToolCopyKey, fallback: string) => translateTool(locale, key) === key ? fallback : translateTool(locale, key);
  const [focus, setFocus] = useState("hair");
  const [time, setTime] = useState("10");
  return <div className="grid gap-6 md:grid-cols-[1fr_.9fr]">
    <div className="space-y-5 rounded-xl border border-[#E2E9E6] bg-white p-5 sm:p-7">
      <Field label="What would you like to explore?" value={focus} onChange={setFocus} options={[
        ["hair", "Hair and styling"], ["grooming", "A grooming habit"], ["routine", "A simple skin-care routine"], ["style", "Personal style"],
      ]} />
      <Field label="How much time would feel realistic?" value={time} onChange={setTime} options={[
        ["5", "About 5 minutes"], ["10", "About 10 minutes"], ["20", "About 20 minutes"],
      ]} />
      <p className="rounded-md bg-[#F0F6F4] p-3 text-[11px] leading-relaxed text-[#53615d]">{copy("smallExperiments", "Small experiments only. No purchases, procedures, or changes are required.")}</p>
    </div>
    <AdvicePanel icon={<Sparkles size={18} />} title={copy("lowPressurePlan", "A low-pressure plan")} eyebrow={`${time} minutes · your choice`}>
      <ol className="space-y-3">{glowUpIdeas[focus].map((item, index) => <li key={item} className="flex gap-3"><span className="font-mono text-[11px] text-[#0F766E]">0{index + 1}</span>{item}</li>)}</ol>
      <p className="mt-5 border-t border-[#dce7e4] pt-4 text-[11px]">Keep only the ideas that feel comfortable, enjoyable, and right for you.</p>
    </AdvicePanel>
  </div>;
}

function AdvicePanel({ icon, title, eyebrow, children }: { icon: ReactNode; title: string; eyebrow: string; children: ReactNode }) {
  return <section aria-live="polite" className="rounded-xl border border-[#cbdad6] bg-[#EAF5F3] p-5 sm:p-7">
    <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.13em] text-[#0F766E]">{icon}{eyebrow}</span>
    <h2 className="mt-3 font-heading text-[29px] leading-tight text-[#1b1b1e]">{title}</h2>
    <div className="mt-4 text-[12px] leading-[1.8] text-[#596360]">{children}</div>
  </section>;
}

export function AppearanceChecker({ tool }: { tool: ToolDefinition }) {
  switch (tool.mode) {
    case "outfit": return <OutfitCheck />;
    case "skin": return <SkinCheck />;
    case "glow-up": return <GlowUpPlanner />;
    default: return null;
  }
}
