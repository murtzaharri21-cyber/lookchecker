"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight, Camera, CameraOff, Check, ChevronDown, FileImage, ImagePlus, LoaderCircle, LockKeyhole, RotateCcw, ShieldCheck, Sparkles, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { ReportDetails } from "@/components/report-details";
import { CombinedReportDisclosure } from "@/components/comprehensive-evaluation";
import { ToolResultDetails } from "@/components/tool-result-details";
import { analyzeFace, analyzeHeadHair, type FaceReport, type HairLength, type Landmark } from "@/lib/face-analysis";
import { analyzeImage as analyzeStudioImage } from "@/beauty-studio/lib/vision";
import { translateFeatureTerm, translateTool, translateToolName, type ToolCopyKey } from "@/lib/tool-copy";
import type { ToolDefinition } from "@/lib/site-data";
import { useLocale } from "@/lib/use-locale";
import { BEAUTY_STUDIO_HANDOFF_KEY } from "@/lib/beauty-studio-handoff";

const contourSets = [
  [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109, 10],
  [33, 160, 158, 133, 153, 144, 33], [362, 385, 387, 263, 373, 380, 362],
  [61, 40, 37, 0, 267, 270, 291, 321, 314, 17, 84, 91, 61],
  [70, 63, 105, 66, 107], [300, 293, 334, 296, 336], [168, 6, 197, 1, 4, 2],
];

const MAX_ANALYSIS_IMAGE_SIDE = 1280;

function ResultOverlay({ landmarks, width, height, hairlinePoints = [] }: { landmarks: Landmark[]; width: number; height: number; hairlinePoints?: Landmark[] }) {
  return <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
    {contourSets.map((set, index) => <polyline key={index} points={set.map((id) => `${landmarks[id].x * width},${landmarks[id].y * height}`).join(" ")} fill="none" stroke={index < 1 ? "#8DD1C8" : "#ffffff"} strokeWidth={Math.max(width / 500, 1.1)} strokeOpacity=".82" />)}
    {landmarks.filter((_, index) => index % 5 === 0).map((landmark, index) => <circle key={index} cx={landmark.x * width} cy={landmark.y * height} r={Math.max(width / 480, 1.25)} fill="#fff" fillOpacity=".8" />)}
    <line x1={landmarks[168].x * width} y1={landmarks[168].y * height} x2={landmarks[152].x * width} y2={landmarks[152].y * height} stroke="#8DD1C8" strokeDasharray={`${width / 130} ${width / 120}`} strokeWidth={Math.max(width / 900, 1)} />
    {hairlinePoints.length >= 4 && <polyline points={hairlinePoints.map((point) => `${point.x * width},${point.y * height}`).join(" ")} fill="none" stroke="#f5c27b" strokeWidth={Math.max(width / 260, 2)} strokeDasharray={`${width / 110} ${width / 180}`} strokeLinecap="round" strokeLinejoin="round" />}
  </svg>;
}

function getFocus(report: FaceReport, slug: string) {
  switch (slug) {
    case "face-shape": return { label: "Your visible face shape", value: report.shape, context: "Measured from face length, cheekbone width, and jaw taper." };
    case "symmetry": return { label: "Your symmetry reading", value: `${report.symmetry}/100`, context: "Compared across corresponding facial landmarks." };
    case "golden-ratio": return { label: "Your length-to-width ratio", value: report.faceRatio.toFixed(2), context: "A proportion, not an ideal to reach." };
    case "jawline-score": return { label: "Your jaw proportion score", value: `${report.jaw}/100`, context: `Jaw width is ${Math.round(report.jawRatio * 100)}% of cheekbone width.` };
    case "canthal-tilt": return { label: "Your average canthal tilt", value: `${report.tilt > 0 ? "+" : ""}${report.tilt.toFixed(1)}°`, context: report.tilt > 2 ? "Slightly upturned eye corners." : report.tilt < -2 ? "Slightly downturned eye corners." : "Eye corners sit close to level." };
    case "eye-shape": return { label: "Your visible eye shape", value: report.eyeShape, context: "Based on eye-opening width and height in this photo." };
    case "facial-ratios": return { label: "Your face length-to-width", value: report.faceRatio.toFixed(2), context: "More of your facial ratios are just below." };
    case "hairstyle-finder": return { label: "Hair coverage & hairline", value: report.headHair?.length ?? "Hair detection unavailable", context: "Hair is estimated as long when it visibly extends below the ear line in the photo; otherwise it is estimated as short. Camera angle, styling, and lighting can affect detection. This is not a diagnosis." };
    case "makeup-suggestions": return { label: "Makeup ideas from your features", value: "Personalized ideas", context: `Based on the visible ${report.shape.toLowerCase()} face shape and ${report.eyeShape.toLowerCase()} eye shape measured in this photo.` };
    case "attractiveness": return { label: "Photo proportion reading", value: `${report.score}/100`, context: "A mathematical summary of selected facial measurements, not an attractiveness or worth rating." };
    case "pretty-scale": return { label: "Photo proportion snapshot", value: `${report.score}/100`, context: "This is not a pretty scale. It summarizes selected photo measurements only." };
    case "eyebrow-mapping": return { label: "Your brow balance", value: `${report.brow}/100`, context: "Compared between the left and right brow landmarks." };
    default: return { label: "Your facial harmony reading", value: `${report.score}/100`, context: "A snapshot of this photo, not a judgement of you." };
  }
}

export function ScanExperience({ tool, full = false }: { tool: ToolDefinition; full?: boolean }) {
  const router = useRouter();
  const locale = useLocale();
  const copy = (key: ToolCopyKey, fallback: string) => translateTool(locale, key) === key ? fallback : translateTool(locale, key);
  const fileInput = useRef<HTMLInputElement>(null);
  const cameraVideo = useRef<HTMLVideoElement>(null);
  const cameraStream = useRef<MediaStream | null>(null);
  const objectUrl = useRef<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "processing" | "done">("idle");
  const [progress, setProgress] = useState("");
  const [error, setError] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraLoading, setCameraLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [landmarks, setLandmarks] = useState<Landmark[]>([]);
  const [report, setReport] = useState<FaceReport | null>(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const [studioError, setStudioError] = useState("");

  useEffect(() => () => {
    cameraStream.current?.getTracks().forEach((track) => track.stop());
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
  }, []);

  const processFile = useCallback(async (file?: File, sampleHairLength?: HairLength) => {
    if (!file) return;
    setError(""); setCameraError(""); setReport(null);
    if (!file.type.startsWith("image/") || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please choose a JPG, PNG, or WebP photo."); return;
    }
    if (file.size > 15 * 1024 * 1024) { setError("That photo is too large. Please choose one under 15 MB."); return; }
    if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    const url = URL.createObjectURL(file);
    objectUrl.current = url;
    setImageUrl(url);
    setPhase("processing");
    setProgress("Preparing your photo...");
    let resizedBitmap: ImageBitmap | null = null;
    try {
      const image = new window.Image();
      image.src = url;
      await image.decode();
      if (image.naturalWidth < 180 || image.naturalHeight < 180) throw new Error("Please choose a photo at least 180 pixels wide and tall.");
      setImageSize({ width: image.naturalWidth, height: image.naturalHeight });
      setProgress("Loading the private on-device face model...");
      setProgress("Finding your facial landmarks...");
      await new Promise<void>((resolve) => {
        let finished = false;
        const finish = () => {
          if (finished) return;
          finished = true;
          window.clearTimeout(fallbackTimer);
          resolve();
        };
        const fallbackTimer = window.setTimeout(finish, 250);
        window.requestAnimationFrame(() => window.requestAnimationFrame(finish));
      });
      const longestSide = Math.max(image.naturalWidth, image.naturalHeight);
      if (longestSide > MAX_ANALYSIS_IMAGE_SIDE && typeof createImageBitmap === "function") {
        const scale = MAX_ANALYSIS_IMAGE_SIDE / longestSide;
        try {
          resizedBitmap = await createImageBitmap(image, {
            resizeWidth: Math.round(image.naturalWidth * scale),
            resizeHeight: Math.round(image.naturalHeight * scale),
            resizeQuality: "high",
          });
        } catch {
          // Some older browsers cannot resize during bitmap creation; keep the original image as a fallback.
        }
      }
      const scanCanvas = document.createElement("canvas");
      const scanScale = Math.min(1, MAX_ANALYSIS_IMAGE_SIDE / longestSide);
      scanCanvas.width = resizedBitmap?.width ?? Math.round(image.naturalWidth * scanScale);
      scanCanvas.height = resizedBitmap?.height ?? Math.round(image.naturalHeight * scanScale);
      const scanContext = scanCanvas.getContext("2d");
      if (!scanContext) throw new Error("Could not prepare your photo for the on-device scan.");
      scanContext.drawImage(resizedBitmap ?? image, 0, 0, scanCanvas.width, scanCanvas.height);
      setProgress("Detecting hair only around the head...");
      const detected = await analyzeStudioImage(scanCanvas);
      if (!detected) throw new Error("We couldn’t find a face. Try a well-lit photo with your face clearly visible.");
      const points = detected.lm.map((point) => ({ x: point.x / detected.width, y: point.y / detected.height }));
      const measured = analyzeFace(points, image.naturalWidth, image.naturalHeight);
      if (!detected.hairMask) throw new Error("Hair could not be detected in this photo. Try another clear, evenly lit image.");
      const headHair = analyzeHeadHair(detected.hairMask, points, detected.width, detected.height);
      measured.headHair = { ...headHair, length: sampleHairLength ?? headHair.length };
      setLandmarks(points);
      setReport(measured);
      setPhase("done");
    } catch (caught) {
      if (!(caught instanceof Error && caught.message.startsWith("We couldn’t find a face."))) {
        console.error("Face scan failed:", caught);
      }
      setError(caught instanceof Error ? caught.message : "We couldn’t analyze that photo. Please try another one.");
      setPhase("idle");
    } finally {
      resizedBitmap?.close();
      setProgress("");
    }
  }, []);

  function stopSelfieCamera() {
    cameraStream.current?.getTracks().forEach((track) => track.stop());
    cameraStream.current = null;
    if (cameraVideo.current) cameraVideo.current.srcObject = null;
    setCameraActive(false);
    setCameraLoading(false);
  }

  async function startSelfieCamera() {
    setCameraError("");
    setCameraLoading(true);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera access is unavailable. Use HTTPS or localhost, or choose a photo instead.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: { facingMode: "user", width: { ideal: 1280 }, height: { ideal: 1280 } },
      });
      cameraStream.current = stream;
      if (!cameraVideo.current) throw new Error("Camera preview is not available. Please try again.");
      cameraVideo.current.srcObject = stream;
      await cameraVideo.current.play();
      setCameraActive(true);
    } catch (caught) {
      stopSelfieCamera();
      if (caught instanceof DOMException && (caught.name === "NotAllowedError" || caught.name === "PermissionDeniedError")) {
        setCameraError("Camera access was denied. Allow camera access in your browser settings, or choose a photo instead.");
      } else {
        setCameraError(caught instanceof Error ? caught.message : "Could not access your camera. Check browser permissions and try again.");
      }
    } finally {
      setCameraLoading(false);
    }
  }

  async function captureSelfie() {
    const video = cameraVideo.current;
    if (!video || video.videoWidth < 180 || video.videoHeight < 180) {
      setCameraError("The camera is still starting. Please wait a moment and try again.");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) {
      setCameraError("Could not capture a frame from your camera. Please try again or choose a photo.");
      return;
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.92));
    if (!blob) {
      setCameraError("Could not capture a frame from your camera. Please try again or choose a photo.");
      return;
    }
    stopSelfieCamera();
    await processFile(new File([blob], "selfie.jpg", { type: "image/jpeg" }));
  }

  async function trySample() {
    setError("");
    try {
      const response = await fetch("/images/hero-portrait.webp");
      if (!response.ok) throw new Error("The sample photo could not be loaded.");
      const blob = await response.blob();
      const type = blob.type || "image/webp";
      const extension = type === "image/png" ? "png" : type === "image/jpeg" ? "jpg" : "webp";
      await processFile(
        new File([blob], `sample-portrait.${extension}`, { type }),
        tool.slug === "hairstyle-finder" ? "Short hair" : undefined,
      );
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not load the sample photo."); }
  }

  async function openHairstyleStudio() {
    if (!imageUrl) return;
    setStudioError("");
    try {
      const image = new window.Image();
      image.src = imageUrl;
      await image.decode();
      let handoff: string | null = null;

      for (const maxSide of [1200, 960, 720]) {
        const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
        canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Could not prepare your photo for the hairstyle preview.");
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        handoff = canvas.toDataURL("image/jpeg", 0.72);
        if (handoff.length <= 1_500_000) break;
        handoff = null;
      }

      if (!handoff) throw new Error("Could not prepare a small enough photo. Please try a smaller image.");
      sessionStorage.setItem(BEAUTY_STUDIO_HANDOFF_KEY, handoff);
      router.push("/beauty-studio");
    } catch (caught) {
      sessionStorage.removeItem(BEAUTY_STUDIO_HANDOFF_KEY);
      setStudioError(caught instanceof Error ? caught.message : "Could not open the hairstyle preview. Please try again.");
    }
  }

  function handleInput(event: ChangeEvent<HTMLInputElement>) {
    void processFile(event.currentTarget.files?.[0]);
    event.currentTarget.value = "";
  }
  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault(); setDragging(false);
    void processFile(event.dataTransfer.files?.[0]);
  }
  function reset() {
    setPhase("idle"); setReport(null); setError(""); setStudioError(""); setImageUrl(null); setLandmarks([]);
    if (objectUrl.current) { URL.revokeObjectURL(objectUrl.current); objectUrl.current = null; }
  }

  const focus = report ? getFocus(report, tool.slug) : null;
  return <div className="mx-auto max-w-[1160px] px-5 pb-20 sm:px-8">
    <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" aria-label="Choose a face photo" onChange={handleInput} />
    {phase !== "done" ? <div className="grid overflow-hidden rounded-2xl border border-[#E2E9E6] bg-white shadow-[0_16px_60px_rgba(45,32,36,.045)] lg:grid-cols-[1.12fr_.88fr]">
      <div className="p-5 sm:p-8 lg:p-9">
        <div
          className="scan-dropzone flex min-h-[390px] flex-col items-center justify-center rounded-xl bg-[#fcfaf9] p-6 text-center sm:min-h-[440px]"
          data-dragging={dragging}
          onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
          onDragLeave={(event) => { event.preventDefault(); setDragging(false); }}
          onDrop={handleDrop}
        >
          <div className={cameraActive ? "relative w-full max-w-[480px] overflow-hidden rounded-xl bg-[#19181b]" : "hidden"}>
            <video ref={cameraVideo} autoPlay muted playsInline aria-label="Live selfie camera preview" className="aspect-[4/3] w-full scale-x-[-1] object-cover" />
            <span className="absolute left-3 top-3 rounded-md bg-[#19181b]/75 px-2.5 py-1.5 text-[11px] font-medium text-white">{copy("livePreview", "Live selfie preview")}</span>
          </div>
          {phase === "processing" ? <>
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#EAF5F3] text-[#0F766E]"><LoaderCircle size={29} className="animate-spin" strokeWidth={1.5} /></div>
            <h2 className="mt-6 font-heading text-[31px] leading-tight">{copy("processingTitle", "Seeing the full picture.")}</h2>
            <p className="mt-2 max-w-[310px] text-[13px] leading-relaxed text-[#514a50]">{progress}</p>
            <div className="mt-7 h-1.5 w-44 overflow-hidden rounded-full bg-[#DCECE9]"><div className="h-full w-1/2 animate-pulse rounded-full bg-[#0F766E]" /></div>
            <p className="mt-5 flex items-center gap-1.5 text-[11px] text-[#514a50]"><LockKeyhole size={12} /> {copy("privacyLine", "Your photo never leaves this browser.")}</p>
          </> : cameraActive ? <>
            <p className="mt-4 text-[12px] text-[#514a50]">{copy("centerFace", "Center your face and use soft, even lighting.")}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button type="button" className="btn-primary !min-h-[45px]" onClick={(event) => { event.stopPropagation(); void captureSelfie(); }}><Camera size={16} /> {copy("captureSelfie", "Capture selfie")}</button>
              <button type="button" className="btn-outline-dark !min-h-[45px]" onClick={(event) => { event.stopPropagation(); stopSelfieCamera(); }}><CameraOff size={16} /> {copy("cancel", "Cancel")}</button>
            </div>
          </> : <>
            <div className="grid h-[70px] w-[70px] place-items-center rounded-2xl border border-[#eedce1] bg-[#EAF5F3] text-[#0F766E]"><ImagePlus size={29} strokeWidth={1.4} /></div>
            <h2 className="mt-5 font-heading text-[32px] leading-tight">{copy("photoTitle", "Start with a photo of you.")}</h2>
            <p className="mt-2 max-w-[330px] text-[13px] leading-[1.75] text-[#514a50]">{copy("photoPrompt", "Drag and drop a clear, front-facing selfie here, or choose a photo from your device.")}</p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <button type="button" className="btn-primary !min-h-[47px]" onClick={(event) => { event.stopPropagation(); fileInput.current?.click(); }}><UploadCloud size={16} /> {copy("choosePhoto", "Choose a photo")}</button>
              <button type="button" className="btn-outline-dark !min-h-[47px]" disabled={cameraLoading} onClick={(event) => { event.stopPropagation(); void startSelfieCamera(); }}><Camera size={16} /> {cameraLoading ? copy("openingCamera", "Opening camera...") : copy("takeSelfie", "Take a selfie")}</button>
            </div>
            <p className="mt-4 text-[11px] text-[#514a50]">{copy("formats", "JPG, PNG, or WebP · up to 15 MB")}</p>
            <button type="button" onClick={(event) => { event.stopPropagation(); void trySample(); }} className="mt-6 border-b border-[#759E99] pb-0.5 text-[12px] font-medium text-[#286D68] transition-colors hover:text-[#0F766E]">{copy("samplePortrait", "Or try it with our sample portrait")} <ArrowRight size={12} className="inline" /></button>
          </>}
        </div>
        {error && <div role="alert" className="mt-4 rounded-lg border border-[#B9DDD8] bg-[#F0F8F7] px-4 py-3 text-[12px] leading-relaxed text-[#286D68]">{error}</div>}
        {cameraError && <div role="alert" className="mt-4 rounded-lg border border-[#B9DDD8] bg-[#F0F8F7] px-4 py-3 text-[12px] leading-relaxed text-[#286D68]">{cameraError}</div>}
      </div>
      <div className="relative flex flex-col justify-between overflow-hidden bg-[#EAF5F3] p-7 text-[#1b1b1e] sm:p-9 lg:p-10">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#0F766E]/10 blur-[90px]" />
        <div className="relative"><span className="inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[.15em] text-[#0F766E]"><Sparkles size={14} /> {copy("privateScan", "The private scan")}</span><h3 className="mt-7 max-w-[280px] font-heading text-[39px] leading-[1.05] tracking-[-.025em]">{copy("storyTitle", "Your face tells a unique story.")}</h3><p className="mt-4 max-w-[335px] text-[13px] leading-[1.8] text-[#626a68]">{copy("storyDescription", "We measure the relationships between features, then explain what they mean in words that make sense.")}</p></div>
        <div className="relative mt-10 space-y-4 border-t border-[#cbdad6] pt-6">{[
          [Camera, copy("tipStraight", "Face the camera straight on")], [Sparkles, copy("tipLighting", "Use soft, even lighting")], [FileImage, copy("tipFrame", "Keep your full face in the frame")],
        ].map(([Icon, text], index) => <div key={index} className="flex items-center gap-3 text-[12px] text-[#4f5b58]">{typeof Icon !== "string" && <Icon size={16} className="text-[#0F766E]" />}{text as string}</div>)}</div>
        <div className="relative mt-8 flex items-start gap-2.5 rounded-md border border-[#cbdad6] bg-white/70 px-4 py-3"><ShieldCheck size={17} className="mt-0.5 shrink-0 text-[#0F766E]" /><p className="text-[11px] leading-[1.65] text-[#626a68]">{copy("deviceOnly", "All face detection happens on this device. We never receive your photo for the free scan.")}</p></div>
      </div>
    </div> : report && focus && imageUrl ? <div className="space-y-7">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="section-kicker !text-[10px]">{copy("privateAnalysis", "Your private analysis")}</p><h2 className="mt-1 font-heading text-[36px] leading-tight">{copy("faceInFocus", "Your face, in focus.")}</h2></div><button type="button" onClick={reset} className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#695e65] hover:text-[#0F766E]"><RotateCcw size={14} /> {copy("scanAnother", "Scan another photo")}</button></div>
      <div className="grid items-start gap-5 lg:grid-cols-[.85fr_1.15fr]">
        <div className="overflow-hidden rounded-xl border border-[#E2E9E6] bg-white lg:sticky lg:top-20"><div className="relative overflow-hidden bg-[#252026]"><div className="relative mx-auto w-full"><Image src={imageUrl} alt="Your private face analysis photo with optional facial landmarks" width={imageSize.width} height={imageSize.height} unoptimized className="block h-auto w-full" />{showOverlay && <ResultOverlay landmarks={landmarks} width={imageSize.width} height={imageSize.height} hairlinePoints={tool.slug === "hairstyle-finder" ? report.headHair?.hairlinePoints : undefined} />}</div><div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-md bg-[#151416]/80 px-2.5 py-1.5 font-mono text-[10px] text-white"><span className="h-1.5 w-1.5 rounded-full bg-[#8DD1C8]" /> {landmarks.length} {copy("points", "LANDMARKS").toLocaleUpperCase(locale)}</div></div><div className="flex items-center justify-between gap-2 px-4 py-3"><span className="flex items-center gap-1.5 text-[11px] text-[#514a50]"><LockKeyhole size={13} className="text-[#0F766E]" /> {copy("privacyLine", "Photo stays on your device")}</span><button type="button" onClick={() => setShowOverlay(!showOverlay)} className="text-[11px] font-medium text-[#0F766E] hover:underline">{showOverlay ? copy("hide", "Hide") : copy("show", "Show")} {copy("points", "points")}</button></div></div>
        <div className="rounded-xl border border-[#E2E9E6] bg-white p-6 sm:p-8"><div className="flex items-center justify-between gap-2"><span className="section-kicker !text-[10px]">{tool.slug === "hairstyle-finder" ? focus.label : translateToolName(locale, tool.slug, focus.label)}</span><span className="rounded-full bg-[#EAF5F3] px-2.5 py-1 text-[10px] font-medium text-[#0F766E]">{copy("results", "Your results")}</span></div><div className="mt-5 flex flex-wrap items-end gap-5"><span className="font-heading text-[clamp(50px,7vw,76px)] leading-[.95] tracking-[-.05em] text-[#0F766E]">{translateFeatureTerm(locale, focus.value)}</span>{tool.slug !== "face-shape" && tool.slug !== "eye-shape" && tool.slug !== "hairstyle-finder" && tool.slug !== "makeup-suggestions" && <span className="mb-2 text-[12px] text-[#514a50]">{copy("measurementReading", "A photo-based reading")}</span>}</div><p className="mt-5 text-[13px] leading-[1.8] text-[#716a71]">{focus.context}</p>{tool.slug === "hairstyle-finder" && report.headHair && <div className="mt-5 rounded-lg border border-[#E2E9E6] bg-[#fbfaf8] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><p className="text-[12px] font-semibold text-[#1b1b1e]">Hairline and hair coverage</p><span className="rounded-full bg-[#EAF5F3] px-2.5 py-1 text-[10px] font-semibold text-[#286D68]">{report.headHair.appearance}</span></div><div className="mt-4 grid gap-3 sm:grid-cols-2"><div className="rounded-md border border-[#E2E9E6] bg-white px-3 py-3"><p className="text-[10px] text-[#716a71]">Visible hair coverage · head</p><p className="mt-1 text-[20px] font-semibold text-[#1b1b1e]">{report.headHair.visibleHairCoveragePercent}%</p></div><div className="rounded-md border border-[#E2E9E6] bg-white px-3 py-3"><p className="text-[10px] text-[#716a71]">Visible hair coverage · crown</p><p className="mt-1 text-[20px] font-semibold text-[#1b1b1e]">{report.headHair.crownHairCoveragePercent}%</p></div></div><div className="mt-3 flex items-center gap-2 text-[10px] text-[#625b62]"><span className="h-0.5 w-6 border-t-2 border-dashed border-[#d18a37]" />{report.headHair.hairlineOffsetPercent === null ? "No clear front hairline detected in this photo." : <>Estimated front hairline shown on photo · {Math.abs(report.headHair.hairlineOffsetPercent)}% {report.headHair.hairlineOffsetPercent < 0 ? "above" : "below"} forehead reference</>}</div><p className="mt-3 text-[10px] leading-relaxed text-[#716a71]">These are approximate image-segmentation measurements, not a diagnosis. Pose, lighting, hairstyle, and photo framing can change the estimate; one front photo cannot show the crown or confirm hair loss.</p></div>}{tool.slug === "hairstyle-finder" && <div className="mt-5 border-t border-[#E2E9E6] pt-4"><p className="text-[10px] font-semibold uppercase tracking-[.12em] text-[#0F766E]">Optional haircut ideas for your face shape</p><ul className="mt-3 flex flex-wrap gap-2">{report.hairstyles.map((style) => <li key={style} className="rounded-full border border-[#cbdad6] bg-[#F7FAF9] px-3 py-1.5 text-[11px] font-medium text-[#245e58]">{style}</li>)}</ul><p className="mt-3 text-[10px] leading-relaxed text-[#746d74]">These style ideas are separate from the hairline and coverage estimate.</p><div className="mt-5 rounded-lg border border-[#cbdad6] bg-[#F0F8F7] p-4"><p className="text-[13px] font-semibold text-[#1b1b1e]">See hairstyles on your photo</p><p className="mt-1 text-[11px] leading-relaxed text-[#514a50]">Open AI Beauty Studio to try styles on the same photo. Your image stays in this browser.</p><button type="button" onClick={() => void openHairstyleStudio()} className="mt-3 inline-flex min-h-10 items-center gap-2 rounded-md bg-[#0F766E] px-4 py-2 text-[12px] font-semibold text-white transition hover:bg-[#115E59]"><Sparkles size={14} /> Try hairstyles in AI Studio <ArrowUpRight size={13} /></button>{studioError && <p role="alert" className="mt-2 text-[11px] text-rose-700">{studioError}</p>}</div></div>}<div className="mt-6 rounded-md bg-[#EAF5F3] px-4 py-3 text-[11px] leading-relaxed text-[#0F766E]"><strong className="font-semibold">{copy("photoPrivacy", "Photo note:")}</strong> Lighting, camera angle, and expression can affect what the scan measures.</div></div>
      </div>
      {full ? <ReportDetails report={report} /> : <ToolResultDetails report={report} toolSlug={tool.slug} />}
      <CombinedReportDisclosure report={report} />
      {full && <div className="rounded-xl border border-[#D2E7E3] bg-[#F0F8F7] p-6 text-center sm:p-8"><p className="section-kicker !text-[10px]">Private by design</p><h3 className="mt-2 font-heading text-[28px]">Your results stay in this tab.</h3><p className="mx-auto mt-2 max-w-[560px] text-[12px] leading-[1.8] text-[#514a50]">Your photo and measurements are processed on this device. They are not sent to Look Checker or saved by this site, and disappear when you leave or reset the scan.</p></div>}
      {full && <div className="rounded-xl border border-[#D2E7E3] bg-[#F0F8F7] p-6 text-center sm:p-8"><p className="section-kicker !text-[10px]">Always free</p><h3 className="mt-2 font-heading text-[28px]">Your complete report, no charge.</h3><p className="mx-auto mt-2 max-w-[560px] text-[12px] leading-[1.8] text-[#776b72]">Every measurement and styling suggestion is included. No account, signup, subscription, or payment is needed.</p></div>}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[12px]"><button type="button" onClick={reset} className="inline-flex items-center gap-1.5 font-medium text-[#0F766E] hover:underline"><ArrowLeft size={14} /> Scan another photo</button><Link href="/tools" className="inline-flex items-center gap-1 text-[#6c646b] hover:text-[#0F766E]">Explore other tools <ArrowUpRight size={14} /></Link></div>
    </div> : null}
    <div className="mx-auto mt-8 flex max-w-[600px] flex-wrap items-center justify-center gap-x-5 gap-y-2 text-center text-[11px] text-[#514a50]"><span className="flex items-center gap-1.5"><LockKeyhole size={12} /> Photo stays in your browser</span><span className="flex items-center gap-1.5"><Check size={12} /> No signup or payment</span><span className="flex items-center gap-1.5"><ChevronDown size={12} /> Formula explained below</span></div>
  </div>;
}
