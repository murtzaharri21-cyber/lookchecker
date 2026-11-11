"use client";

import Link from "next/link";
import { ArrowUpRight, Camera, CameraOff, FlipHorizontal, LockKeyhole, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { translateTool, type ToolCopyKey } from "@/lib/tool-copy";
import { useLocale } from "@/lib/use-locale";

export function TrueMirror() {
  const locale = useLocale();
  const copy = (key: ToolCopyKey, fallback: string) => translateTool(locale, key) === key ? fallback : translateTool(locale, key);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mirrored, setMirrored] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => () => { streamRef.current?.getTracks().forEach((track) => track.stop()); }, []);

  async function startCamera() {
    setLoading(true); setError("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("Your browser does not support camera access on this page.");
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: { ideal: 1280 } }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      setActive(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not access your camera. Check browser permissions and try again.");
    } finally { setLoading(false); }
  }
  function stopCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
  }

  return <div className="mx-auto grid max-w-[1160px] gap-5 px-5 pb-20 sm:px-8 lg:grid-cols-[1.15fr_.85fr]">
    <div className="overflow-hidden rounded-xl border border-[#E2E9E6] bg-[#EAF5F3]"><div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden sm:aspect-[16/10]"><video ref={videoRef} autoPlay muted playsInline className={`absolute inset-0 h-full w-full object-cover ${mirrored ? "scale-x-[-1]" : ""}`} /><div className="pointer-events-none absolute inset-0 border-[18px] border-[#0F766E]/10" />{!active && <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#EAF5F3] text-center text-[#1b1b1e]"><div className="grid h-17 w-17 place-items-center rounded-2xl border border-[#cbdad6] bg-white/70"><Camera size={30} strokeWidth={1.4} /></div><h2 className="mt-5 font-heading text-[32px]">{copy("mirrorTitle", "A different perspective.")}</h2><p className="mt-2 max-w-[290px] text-[13px] leading-relaxed text-[#626a68]">{copy("mirrorDescription", "Open your camera to see the familiar mirror and the unmirrored you.")}</p></div>}{active && <span className="absolute left-4 top-4 rounded-md bg-[#19181b]/75 px-2.5 py-1.5 text-[11px] font-medium text-white/90">{mirrored ? copy("mirrorView", "Mirrored view") : copy("trueView", "True view · as others see you")}</span>}</div><div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#dce7e4] bg-white px-5 py-4"><p className="flex items-center gap-1.5 text-[11px] text-[#626a68]"><LockKeyhole size={13} /> {copy("cameraPrivate", "Live only. Never recorded or uploaded.")}</p>{active && <button type="button" onClick={() => setMirrored(!mirrored)} className="inline-flex items-center gap-1.5 rounded-md bg-[#EAF5F3] px-4 py-2 text-[12px] font-semibold text-[#1b1b1e] hover:bg-[#dcece9]"><FlipHorizontal size={14} /> {mirrored ? copy("trueView", "See true view") : copy("mirrorView", "See mirror view")}</button>}</div></div>
    <div className="flex flex-col rounded-xl border border-[#E2E9E6] bg-white p-7 sm:p-9"><span className="section-kicker !text-[10px]">Unmirrored, uninterrupted</span><h3 className="mt-2 font-heading text-[37px] leading-[1.08]">{copy("faceInFocus", "See your face a new way.")}</h3><p className="mt-4 text-[13px] leading-[1.8] text-[#514a50]">{copy("mirrorExplanation", "Your usual mirror reverses left and right. The true-view toggle shows the orientation people see across from you. It may feel unfamiliar at first, but it is still you.")}</p><div className="mt-6 space-y-3 border-t border-[#E8EFEC] pt-5"><div className="flex items-center gap-2.5 text-[12px] text-[#554e54]"><ShieldCheck size={17} className="text-[#0F766E]" /> {copy("deviceOnly", "Entirely on your device")}</div><div className="flex items-center gap-2.5 text-[12px] text-[#554e54]"><FlipHorizontal size={17} className="text-[#0F766E]" /> Switch back and forth whenever you like</div><div className="flex items-center gap-2.5 text-[12px] text-[#554e54]"><CameraOff size={17} className="text-[#0F766E]" /> Stop the camera with one click</div></div><div className="mt-auto pt-8">{active ? <button type="button" onClick={stopCamera} className="btn-outline-dark w-full"><CameraOff size={16} /> {copy("stopCamera", "Stop camera")}</button> : <button type="button" onClick={() => void startCamera()} disabled={loading} className="btn-primary w-full disabled:opacity-60"><Camera size={16} /> {loading ? copy("openingCamera", "Opening camera...") : copy("openCamera", "Open my camera")}</button>}{error && <p role="alert" className="mt-3 text-[12px] leading-relaxed text-[#0F766E]">{error}</p>}<Link href="/tools/attractiveness" className="mt-4 flex items-center justify-center gap-1 text-[12px] font-medium text-[#0F766E] hover:underline">Or try a photo analysis <ArrowUpRight size={13} /></Link></div></div>
  </div>;
}
