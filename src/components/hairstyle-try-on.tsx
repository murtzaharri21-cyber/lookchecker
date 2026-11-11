"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  FlipHorizontal,
  ImagePlus,
  Layers,
  LoaderCircle,
  LockKeyhole,
  Maximize2,
  Minimize2,
  Palette,
  RefreshCw,
  RotateCcw,
  Sliders,
  Sparkles,
  User,
  X,
  Zap,
} from "lucide-react";
import { getFaceLandmarker } from "@/lib/face-landmarker";
import {
  defaultFitParams,
  extractHeadGeometry,
  generateShadeFromHex,
  hairstyles,
  hairShades,
  preloadAllHairstyleImages,
  renderHairstyleToCanvas,
  sampleSkinToneFromImage,
  type HairFitParams,
  type HairstyleCategory,
  type HairstyleDefinition,
  type HairShade,
  type HeadGeometry,
} from "@/lib/hair-renderer";

const categoryFilters: { id: HairstyleCategory; label: string; count?: number }[] = [
  { id: "all", label: "All Cuts" },
  { id: "long", label: "Long Hair" },
  { id: "short", label: "Short Hair" },
  { id: "bald", label: "No Hair (Bald & Buzz)" },
  { id: "retro", label: "Old Style / Retro" },
  { id: "curly", label: "Curly Hair" },
  { id: "straight", label: "Straight Hair" },
  { id: "footballer", label: "Footballer Cuts" },
];

export function HairstyleTryOn() {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoUrlRef = useRef<string | null>(null);
  const photoRequestRef = useRef(0);

  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoSize, setPhotoSize] = useState({ width: 0, height: 0 });
  const [imageEl, setImageEl] = useState<HTMLImageElement | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [headGeometry, setHeadGeometry] = useState<HeadGeometry | null>(null);
  const [detectingFace, setDetectingFace] = useState(false);
  const [isProcessingDemo, setIsProcessingDemo] = useState(false);

  // Selected Style & Category
  const [selectedStyleId, setSelectedStyleId] = useState<string>("curtain-layers");
  const [selectedCategory, setSelectedCategory] = useState<HairstyleCategory>("all");
  const [selectedShadeId, setSelectedShadeId] = useState<string>("espresso");
  const [customHex, setCustomHex] = useState<string>("#3d2217");
  const [isCustomColor, setIsCustomColor] = useState(false);

  // Precision Fit & Customization Controls
  const [fitParams, setFitParams] = useState<HairFitParams>(defaultFitParams);
  const [activeTab, setActiveTab] = useState<"style" | "color" | "fit" | "finish">("style");

  // Comparison & Split Slider
  const [compareMode, setCompareMode] = useState<"split" | "styled" | "original">("split");
  const [splitPercent, setSplitPercent] = useState<number>(50);
  const [isDraggingSplit, setIsDraggingSplit] = useState(false);

  // Filtered hairstyles
  const visibleStyles = useMemo(() => {
    if (selectedCategory === "all") return hairstyles;
    return hairstyles.filter((s) => s.category === selectedCategory);
  }, [selectedCategory]);

  const currentStyle: HairstyleDefinition = useMemo(() => {
    return hairstyles.find((s) => s.id === selectedStyleId) ?? hairstyles[0];
  }, [selectedStyleId]);

  const currentShade: HairShade = useMemo(() => {
    if (isCustomColor) {
      return generateShadeFromHex(customHex, "Custom Tint");
    }
    return hairShades.find((s) => s.id === selectedShadeId) ?? hairShades[1];
  }, [isCustomColor, customHex, selectedShadeId]);

  // Preload real photographic hairstyle assets
  useEffect(() => {
    preloadAllHairstyleImages();
  }, []);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    };
  }, []);

  // Process image bitmap and detect landmarks with MediaPipe
  const processImageFile = useCallback(async (file: File) => {
    const requestId = ++photoRequestRef.current;
    setPhotoError("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setPhotoError("Choose a JPG, PNG, or WebP image.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setPhotoError("Choose an image smaller than 15 MB.");
      return;
    }

    const url = URL.createObjectURL(file);
    try {
      const img = new window.Image();
      img.src = url;
      await img.decode();

      if (requestId !== photoRequestRef.current) {
        URL.revokeObjectURL(url);
        return;
      }

      if (img.naturalWidth < 180 || img.naturalHeight < 180) {
        throw new Error("Choose a portrait photo at least 180 pixels wide and tall.");
      }

      if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
      photoUrlRef.current = url;
      setPhotoUrl(url);
      setPhotoSize({ width: img.naturalWidth, height: img.naturalHeight });
      setImageEl(img);
      setHeadGeometry(null);
      setDetectingFace(true);

      try {
        const detector = await getFaceLandmarker();
        const longestSide = Math.max(img.naturalWidth, img.naturalHeight);
        let bitmap: ImageBitmap | null = null;
        try {
          const source: HTMLImageElement | ImageBitmap =
            longestSide > 1280 && typeof createImageBitmap === "function"
              ? (bitmap = await createImageBitmap(img, {
                  resizeWidth: Math.round((img.naturalWidth * 1280) / longestSide),
                  resizeHeight: Math.round((img.naturalHeight * 1280) / longestSide),
                  resizeQuality: "high",
                }))
              : img;

          const result = detector.detect(source);
          if (result.faceLandmarks.length !== 1) {
            throw new Error(
              result.faceLandmarks.length === 0
                ? "We couldn't detect a clear face. Try a front-facing portrait with good lighting."
                : "Multiple faces detected. Please choose a portrait with just you in the frame.",
            );
          }

          if (requestId === photoRequestRef.current) {
            const rawLandmarks = result.faceLandmarks[0];
            const geo = extractHeadGeometry(rawLandmarks, img.naturalWidth, img.naturalHeight);
            // Sample actual forehead skin tone directly from the image
            geo.skinTone = sampleSkinToneFromImage(img, geo);
            setHeadGeometry(geo);
            setFitParams(defaultFitParams);
          }
        } finally {
          bitmap?.close();
        }
      } catch (err) {
        if (requestId === photoRequestRef.current) {
          setPhotoError(
            err instanceof Error
              ? err.message
              : "We couldn't align the hairstyle to this photo. Try another front-facing portrait.",
          );
        }
      } finally {
        if (requestId === photoRequestRef.current) setDetectingFace(false);
      }
    } catch (err) {
      URL.revokeObjectURL(url);
      if (requestId === photoRequestRef.current) {
        setPhotoError(err instanceof Error ? err.message : "This photo could not be opened. Please choose another.");
      }
    }
  }, []);

  const handlePhotoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    e.currentTarget.value = "";
    if (file) void processImageFile(file);
  };

  const handleLoadDemo = async () => {
    setIsProcessingDemo(true);
    setPhotoError("");
    try {
      const res = await fetch("/images/hero-portrait.jpg");
      const blob = await res.blob();
      const file = new File([blob], "demo-portrait.jpg", { type: "image/jpeg" });
      await processImageFile(file);
    } catch {
      setPhotoError("Could not load the demo portrait. Please upload your own photo.");
    } finally {
      setIsProcessingDemo(false);
    }
  };

  const removePhoto = () => {
    photoRequestRef.current += 1;
    if (photoUrlRef.current) URL.revokeObjectURL(photoUrlRef.current);
    photoUrlRef.current = null;
    setPhotoUrl(null);
    setPhotoSize({ width: 0, height: 0 });
    setImageEl(null);
    setHeadGeometry(null);
    setDetectingFace(false);
    setPhotoError("");
    setFitParams(defaultFitParams);
    if (inputRef.current) inputRef.current.value = "";
  };

  const [renderVersion, setRenderVersion] = useState(0);

  // Redraw hairstyle canvas whenever geometry, style, shade, or fit adjustments change
  useEffect(() => {
    if (!canvasRef.current || !headGeometry || !photoSize.width || !photoSize.height) return;

    const canvas = canvasRef.current;
    canvas.width = photoSize.width;
    canvas.height = photoSize.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderHairstyleToCanvas(
      ctx,
      headGeometry,
      currentStyle,
      currentShade,
      fitParams,
      canvas.width,
      canvas.height,
      () => setRenderVersion((v) => v + 1),
    );
  }, [headGeometry, photoSize, currentStyle, currentShade, fitParams, renderVersion]);

  // Handle Before/After Split drag interactions
  const handlePointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (compareMode !== "split") return;
    setIsDraggingSplit(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateSplitFromPointer(e);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!isDraggingSplit || compareMode !== "split") return;
    updateSplitFromPointer(e);
  };

  const handlePointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (isDraggingSplit) {
      setIsDraggingSplit(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
    }
  };

  const updateSplitFromPointer = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(5, Math.min(95, (x / rect.width) * 100));
    setSplitPercent(pct);
  };

  // High-Resolution Composite Download
  const handleDownloadLook = () => {
    if (!imageEl || !headGeometry) return;

    const offscreen = document.createElement("canvas");
    offscreen.width = imageEl.naturalWidth;
    offscreen.height = imageEl.naturalHeight;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return;

    // 1. Draw original photo
    ctx.drawImage(imageEl, 0, 0);

    // 2. Render hairstyle on top
    renderHairstyleToCanvas(
      ctx,
      headGeometry,
      currentStyle,
      currentShade,
      fitParams,
      offscreen.width,
      offscreen.height,
    );

    offscreen.toBlob((blob) => {
      if (!blob) return;
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `hairstyle-${currentStyle.id}-${currentShade.id}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(downloadUrl), 2000);
    }, "image/png");
  };

  // Nudge stepper helper
  const adjustFit = (key: keyof HairFitParams, delta: number, min: number, max: number) => {
    setFitParams((prev) => {
      const current = typeof prev[key] === "number" ? (prev[key] as number) : 0;
      const updated = Math.max(min, Math.min(max, Number((current + delta).toFixed(2))));
      return { ...prev, [key]: updated };
    });
  };

  return (
    <div className="grid gap-7 lg:grid-cols-[1.12fr_.88fr]">
      {/* LEFT COLUMN: VISUAL PREVIEW & COMPARISON CANVAS */}
      <section className="flex flex-col overflow-hidden rounded-2xl border border-[#E2E9E6] bg-white shadow-sm" aria-label="Hairstyle preview and visual comparison">
        {photoUrl ? (
          <>
            {/* CANVAS / PHOTO STAGE */}
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className={`relative select-none overflow-hidden bg-[#181617] ${
                compareMode === "split" ? "cursor-ew-resize" : "cursor-default"
              }`}
              style={{ touchAction: "none" }}
            >
              {/* Layer 1: Original Photo */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoUrl}
                alt="Your original portrait"
                className="block h-auto w-full object-contain"
                draggable={false}
              />

              {/* Layer 2: Hairstyle Overlay Canvas */}
              {headGeometry && (
                <canvas
                  ref={canvasRef}
                  className="pointer-events-none absolute inset-0 h-full w-full object-contain transition-opacity duration-150"
                  style={{
                    opacity: compareMode === "original" ? 0 : 1,
                    clipPath:
                      compareMode === "split"
                        ? `polygon(${splitPercent}% 0, 100% 0, 100% 100%, ${splitPercent}% 100%)`
                        : undefined,
                  }}
                />
              )}

              {/* Split Curtain Divider Line and Handle */}
              {compareMode === "split" && headGeometry && (
                <div
                  className="pointer-events-none absolute bottom-0 top-0 z-20 flex w-0.5 items-center justify-center bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)]"
                  style={{ left: `${splitPercent}%` }}
                >
                  <div className="flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-2 border-white bg-[#0F766E] text-white shadow-lg transition-transform hover:scale-110">
                    <span className="flex items-center gap-0.5 text-[9px] font-bold">
                      <ChevronLeft size={10} strokeWidth={3} />
                      <ChevronRight size={10} strokeWidth={3} />
                    </span>
                  </div>
                </div>
              )}

              {/* Comparison Badges */}
              {compareMode === "split" && headGeometry && (
                <>
                  <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-md bg-black/60 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white/90 backdrop-blur-sm">
                    Original
                  </div>
                  <div className="pointer-events-none absolute bottom-4 right-4 z-10 rounded-md bg-[#0F766E]/90 px-2.5 py-1 text-[11px] font-medium tracking-wide text-white backdrop-blur-sm">
                    {currentStyle.label}
                  </div>
                </>
              )}

              {/* Top Controls Bar inside Preview */}
              <div className="absolute left-3.5 right-3.5 top-3.5 z-20 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 rounded-lg bg-black/75 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm backdrop-blur-md">
                  {detectingFace ? (
                    <>
                      <LoaderCircle size={13} className="animate-spin text-[#6ee7b7]" />
                      <span>Detecting head & cranial shape…</span>
                    </>
                  ) : headGeometry ? (
                    <>
                      <Zap size={13} className="text-[#6ee7b7]" />
                      <span className="hidden sm:inline">Head detected ·</span>
                      <span>{currentStyle.label}</span>
                    </>
                  ) : (
                    <span>Portrait ready</span>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Download Composite Button */}
                  {headGeometry && (
                    <button
                      type="button"
                      onClick={handleDownloadLook}
                      title="Download high-resolution look"
                      className="flex h-8 items-center gap-1.5 rounded-lg bg-white/95 px-2.5 text-[11px] font-semibold text-[#181617] shadow-md backdrop-blur-sm transition hover:bg-white"
                    >
                      <Download size={13} />
                      <span className="hidden sm:inline">Download</span>
                    </button>
                  )}
                  {/* Remove Photo Button */}
                  <button
                    type="button"
                    onClick={removePhoto}
                    title="Remove photo"
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-[#333] shadow-md backdrop-blur-sm transition hover:bg-white"
                  >
                    <X size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* PREVIEW BOTTOM BAR & VIEW MODES */}
            <div className="border-t border-[#E2E9E6] bg-[#faf8f7] p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="font-heading text-[22px] leading-tight text-[#1b1b1e]">
                    {compareMode === "original" ? "Original Portrait" : currentStyle.label}
                  </h3>
                  <p className="mt-0.5 text-[12px] text-[#6e666d]">
                    {currentStyle.isBald ? "Clean shaved scalp simulation" : `${currentShade.label} · ${currentStyle.description}`}
                  </p>
                </div>

                {/* Compare Mode Toggles */}
                {headGeometry && (
                  <div className="flex items-center gap-1 rounded-lg border border-[#dce5e2] bg-white p-1">
                    <button
                      type="button"
                      onClick={() => setCompareMode("split")}
                      className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                        compareMode === "split" ? "bg-[#0F766E] text-white" : "text-[#4d484c] hover:bg-[#f0f4f3]"
                      }`}
                      title="Drag split slider to compare"
                    >
                      <Layers size={13} />
                      Split View
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompareMode("styled")}
                      className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                        compareMode === "styled" ? "bg-[#0F766E] text-white" : "text-[#4d484c] hover:bg-[#f0f4f3]"
                      }`}
                    >
                      <Eye size={13} />
                      Hairstyle
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompareMode("original")}
                      className={`flex items-center gap-1 rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                        compareMode === "original" ? "bg-[#0F766E] text-white" : "text-[#4d484c] hover:bg-[#f0f4f3]"
                      }`}
                    >
                      <RotateCcw size={13} />
                      Original
                    </button>
                  </div>
                )}
              </div>

              {/* Head-Fitting Quick Actions */}
              {headGeometry && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#ece7e4] pt-3 text-[11px]">
                  <span className="font-medium text-[#655e64]">Direct fit:</span>
                  <button
                    type="button"
                    onClick={() => adjustFit("offsetY", -3, -45, 45)}
                    className="inline-flex items-center gap-1 rounded-md border border-[#d8e2df] bg-white px-2.5 py-1 text-[#245e58] hover:bg-[#f2f7f5]"
                    title="Raise hairline higher"
                  >
                    ▲ Raise hairline
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustFit("offsetY", 3, -45, 45)}
                    className="inline-flex items-center gap-1 rounded-md border border-[#d8e2df] bg-white px-2.5 py-1 text-[#245e58] hover:bg-[#f2f7f5]"
                    title="Lower hairline lower"
                  >
                    ▼ Lower hairline
                  </button>
                  <button
                    type="button"
                    onClick={() => setFitParams((p) => ({ ...p, flipped: !p.flipped }))}
                    className={`inline-flex items-center gap-1 rounded-md border px-2.5 py-1 ${
                      fitParams.flipped ? "border-[#0F766E] bg-[#EAF5F3] text-[#0F766E] font-semibold" : "border-[#d8e2df] bg-white text-[#245e58] hover:bg-[#f2f7f5]"
                    }`}
                    title="Mirror hair parting left to right"
                  >
                    <FlipHorizontal size={12} />
                    Mirror Parting
                  </button>
                  <button
                    type="button"
                    onClick={() => setFitParams(defaultFitParams)}
                    className="inline-flex items-center gap-1 rounded-md border border-[#d8e2df] bg-white px-2.5 py-1 text-[#6e666d] hover:bg-[#f2f7f5]"
                    title="Reset to auto-detected AI fit"
                  >
                    <RefreshCw size={11} />
                    Auto Reset
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* EMPTY STATE / UPLOAD PHOTO STAGE */
          <div className="flex min-h-[460px] flex-col items-center justify-center bg-gradient-to-b from-[#fdfbf9] to-[#f7f4f2] p-8 text-center sm:min-h-[540px]">
            <div className="grid h-18 w-18 place-items-center rounded-2xl border border-[#D2E7E3] bg-[#EAF5F3] text-[#0F766E] shadow-sm">
              <Zap size={32} strokeWidth={1.5} />
            </div>

            <h2 className="mt-6 font-heading text-[30px] font-normal leading-tight text-[#1b1b1e]">
              Auto head detection & realistic styling.
            </h2>
            <p className="mt-2.5 max-w-[380px] text-[13px] leading-relaxed text-[#686369]">
              Detects your cranial shape and automatically places realistic hairstyles directly on your head. Long, short, bald, retro, curly, straight, footballer cuts, and more.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <label
                htmlFor="hairstyle-upload-photo"
                className="btn-primary min-h-12 cursor-pointer shadow-md hover:shadow-lg"
              >
                <ImagePlus size={16} />
                Upload your portrait
              </label>

              <button
                type="button"
                onClick={handleLoadDemo}
                disabled={isProcessingDemo}
                className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-[#cfdcd8] bg-white px-5 text-[13px] font-semibold text-[#245e58] shadow-sm hover:bg-[#f5faf8] disabled:opacity-50"
              >
                {isProcessingDemo ? (
                  <>
                    <LoaderCircle size={15} className="animate-spin text-[#0F766E]" />
                    Detecting head…
                  </>
                ) : (
                  <>
                    <User size={15} />
                    Try with demo model
                  </>
                )}
              </button>
            </div>

            <input
              ref={inputRef}
              id="hairstyle-upload-photo"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              aria-label="Upload a portrait photo"
              onChange={handlePhotoUpload}
              className="sr-only"
            />

            <p className="mt-6 flex items-center gap-1.5 text-[11px] text-[#787178]">
              <LockKeyhole size={13} className="text-[#0F766E]" />
              JPG, PNG, or WebP · runs 100% on your device with no API calls or external uploads.
            </p>

            {photoError && (
              <div role="alert" className="mt-5 max-w-[420px] rounded-lg border border-red-200 bg-red-50 p-3.5 text-left text-[12px] text-red-800">
                {photoError}
              </div>
            )}
          </div>
        )}
      </section>

      {/* RIGHT COLUMN: HAIRSTYLE CONTROLS & SALON CUSTOMIZATION */}
      <section className="flex flex-col rounded-2xl border border-[#E2E9E6] bg-white p-5 sm:p-7 shadow-sm" aria-labelledby="hairstyle-studio-title">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="section-kicker">Style studio</p>
            <h2 id="hairstyle-studio-title" className="mt-1 font-heading text-[28px] leading-tight text-[#1b1b1e]">
              Choose a style.
            </h2>
          </div>

          {/* Change Photo Trigger */}
          {photoUrl && (
            <label
              htmlFor="hairstyle-upload-photo-alt"
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-[#cbdad6] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#245e58] hover:bg-[#f5faf8]"
            >
              <ImagePlus size={13} />
              Change photo
            </label>
          )}
          <input
            id="hairstyle-upload-photo-alt"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            aria-label="Upload a replacement portrait photo"
            onChange={handlePhotoUpload}
            className="sr-only"
          />
        </div>

        <p className="mt-2 text-[12px] leading-relaxed text-[#686369]">
          The style automatically adapts directly to your detected head shape, cranial dome, and forehead curve.
        </p>

        {/* CONTROLS TABS */}
        <div className="mt-6 flex border-b border-[#E2E9E6]">
          <button
            type="button"
            onClick={() => setActiveTab("style")}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[12px] font-semibold transition ${
              activeTab === "style"
                ? "border-[#0F766E] text-[#0F766E]"
                : "border-transparent text-[#6e666d] hover:text-[#1b1b1e]"
            }`}
          >
            <Sparkles size={14} />
            Hairstyles ({hairstyles.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("color")}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[12px] font-semibold transition ${
              activeTab === "color"
                ? "border-[#0F766E] text-[#0F766E]"
                : "border-transparent text-[#6e666d] hover:text-[#1b1b1e]"
            }`}
          >
            <Palette size={14} />
            Shade & Tint
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("fit")}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[12px] font-semibold transition ${
              activeTab === "fit"
                ? "border-[#0F766E] text-[#0F766E]"
                : "border-transparent text-[#6e666d] hover:text-[#1b1b1e]"
            }`}
          >
            <Sliders size={14} />
            Head Fit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("finish")}
            className={`flex items-center gap-1.5 border-b-2 px-3 py-2.5 text-[12px] font-semibold transition ${
              activeTab === "finish"
                ? "border-[#0F766E] text-[#0F766E]"
                : "border-transparent text-[#6e666d] hover:text-[#1b1b1e]"
            }`}
          >
            <Layers size={14} />
            Texture
          </button>
        </div>

        {/* TAB 1: HAIRSTYLE CARDS */}
        {activeTab === "style" && (
          <div className="mt-5 space-y-4">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {categoryFilters.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-3 py-1 text-[11px] font-medium transition ${
                    selectedCategory === cat.id
                      ? "bg-[#0F766E] text-white shadow-sm"
                      : "border border-[#dce5e2] bg-[#f9fbfb] text-[#555055] hover:border-[#98cac3]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Hairstyles Grid */}
            <div className="grid max-h-[460px] grid-cols-1 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2">
              {visibleStyles.map((style) => {
                const isSelected = selectedStyleId === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedStyleId(style.id)}
                    className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? "border-[#0F766E] bg-[#F0F8F7] shadow-sm ring-1 ring-[#0F766E]"
                        : "border-[#dce7e4] bg-white hover:border-[#8BCAC2] hover:bg-[#fafdfc]"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-heading text-[16px] font-medium text-[#1b1b1e]">
                          {style.label}
                        </span>
                        <span className="rounded-full bg-[#EAF5F3] px-2 py-0.5 text-[10px] font-semibold text-[#0F766E]">
                          {style.tag}
                        </span>
                      </div>

                      <div className="mt-2.5 flex items-center gap-2.5">
                        {style.image ? (
                          <div className="relative h-13 w-13 shrink-0 overflow-hidden rounded-lg border border-[#e2e9e6] bg-[#f8faf9] p-0.5 shadow-xs">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={style.image}
                              alt={style.label}
                              className="h-full w-full object-contain"
                              loading="lazy"
                            />
                          </div>
                        ) : (
                          <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-lg border border-[#e2e9e6] bg-[#f8faf9] text-[#0F766E] shadow-xs">
                            <User size={22} />
                          </div>
                        )}
                        <p className="line-clamp-2 text-[11px] leading-relaxed text-[#686369]">
                          {style.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[10px] font-medium text-[#686369]">
                      <span className="capitalize">{style.length} silhouette</span>
                      {isSelected && (
                        <span className="flex items-center gap-1 font-semibold text-[#0F766E]">
                          <Check size={12} strokeWidth={2.5} /> On Head
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: SHADE & COLOR */}
        {activeTab === "color" && (
          <div className="mt-5 space-y-6">
            <div>
              <p className="mb-2 text-[12px] font-semibold text-[#252827]">
                Salon Hair Shades
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
                {hairShades.map((shade) => {
                  const isSelected = !isCustomColor && selectedShadeId === shade.id;
                  return (
                    <button
                      key={shade.id}
                      type="button"
                      aria-pressed={isSelected}
                      onClick={() => {
                        setSelectedShadeId(shade.id);
                        setIsCustomColor(false);
                      }}
                      className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition ${
                        isSelected
                          ? "border-[#0F766E] bg-[#F0F8F7] shadow-sm ring-1 ring-[#0F766E]"
                          : "border-[#dce7e4] bg-white hover:border-[#8BCAC2]"
                      }`}
                    >
                      <span
                        className="h-6 w-6 shrink-0 rounded-full border border-black/15 shadow-inner"
                        style={{
                          background: `linear-gradient(135deg, ${shade.highlight} 0%, ${shade.color} 50%, ${shade.shadow} 100%)`,
                        }}
                      />
                      <div className="min-w-0">
                        <span className="block truncate text-[12px] font-medium text-[#1b1b1e]">
                          {shade.label}
                        </span>
                        <span className="block text-[10px] text-[#746d74]">
                          Multi-tonal
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Color Mode */}
            <div className="rounded-xl border border-[#dce7e4] bg-[#faf8f7] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] font-semibold text-[#1b1b1e]">Custom Color & Balayage</p>
                  <p className="text-[11px] text-[#6e666d]">Pick any tone with dynamic highlights</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customHex}
                    onChange={(e) => {
                      setCustomHex(e.target.value);
                      setIsCustomColor(true);
                    }}
                    className="h-9 w-9 cursor-pointer rounded-lg border border-black/20 bg-transparent p-0.5"
                    title="Select custom hair color"
                  />
                  <button
                    type="button"
                    onClick={() => setIsCustomColor(true)}
                    className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${
                      isCustomColor ? "bg-[#0F766E] text-white" : "border border-[#cbdad6] bg-white text-[#245e58]"
                    }`}
                  >
                    {isCustomColor ? "Applied" : "Apply"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: FIX ON HEAD / FINE-TUNING CONTROLS */}
        {activeTab === "fit" && (
          <div className="mt-5 space-y-5">
            <div className="rounded-xl border border-[#D2E7E3] bg-[#F0F8F7] p-3.5 text-[11px] text-[#1b433e]">
              <p className="font-semibold">Automatic Head Alignment Active</p>
              <p className="mt-0.5 text-[#245e58]">
                The style is automatically locked onto your detected skull dome. You can use these sliders to nudge the hairline up/down or adjust overall volume.
              </p>
            </div>

            {/* Hairline Position (Up/Down) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-[#2d2a2d]">Hairline Height</span>
                <span className="font-mono text-[11px] text-[#0F766E]">
                  {fitParams.offsetY > 0 ? `+${fitParams.offsetY}px (Lower)` : fitParams.offsetY < 0 ? `${fitParams.offsetY}px (Higher)` : "Auto-Aligned"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => adjustFit("offsetY", -3, -45, 45)}
                  className="rounded-md border border-[#cbdad6] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#245e58] hover:bg-[#f5faf8]"
                >
                  ▲ Higher
                </button>
                <input
                  type="range"
                  min="-45"
                  max="45"
                  step="1"
                  value={fitParams.offsetY}
                  onChange={(e) => setFitParams((p) => ({ ...p, offsetY: Number(e.target.value) }))}
                  className="h-2 w-full cursor-pointer accent-[#0F766E]"
                />
                <button
                  type="button"
                  onClick={() => adjustFit("offsetY", 3, -45, 45)}
                  className="rounded-md border border-[#cbdad6] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#245e58] hover:bg-[#f5faf8]"
                >
                  ▼ Lower
                </button>
              </div>
            </div>

            {/* Horizontal Alignment (Left/Right) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-[#2d2a2d]">Horizontal Alignment</span>
                <span className="font-mono text-[11px] text-[#0F766E]">
                  {fitParams.offsetX > 0 ? `+${fitParams.offsetX}px (Right)` : fitParams.offsetX < 0 ? `${fitParams.offsetX}px (Left)` : "Centered"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => adjustFit("offsetX", -3, -35, 35)}
                  className="rounded-md border border-[#cbdad6] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#245e58] hover:bg-[#f5faf8]"
                >
                  ◀ Left
                </button>
                <input
                  type="range"
                  min="-35"
                  max="35"
                  step="1"
                  value={fitParams.offsetX}
                  onChange={(e) => setFitParams((p) => ({ ...p, offsetX: Number(e.target.value) }))}
                  className="h-2 w-full cursor-pointer accent-[#0F766E]"
                />
                <button
                  type="button"
                  onClick={() => adjustFit("offsetX", 3, -35, 35)}
                  className="rounded-md border border-[#cbdad6] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#245e58] hover:bg-[#f5faf8]"
                >
                  ▶ Right
                </button>
              </div>
            </div>

            {/* Head Fit Scale */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-[#2d2a2d]">Overall Head Scale</span>
                <span className="font-mono text-[11px] text-[#0F766E]">
                  {Math.round(fitParams.scale * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => adjustFit("scale", -0.05, 0.75, 1.25)}
                  className="rounded-md border border-[#cbdad6] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#245e58] hover:bg-[#f5faf8]"
                >
                  <Minimize2 size={12} />
                </button>
                <input
                  type="range"
                  min="0.75"
                  max="1.25"
                  step="0.01"
                  value={fitParams.scale}
                  onChange={(e) => setFitParams((p) => ({ ...p, scale: Number(e.target.value) }))}
                  className="h-2 w-full cursor-pointer accent-[#0F766E]"
                />
                <button
                  type="button"
                  onClick={() => adjustFit("scale", 0.05, 0.75, 1.25)}
                  className="rounded-md border border-[#cbdad6] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#245e58] hover:bg-[#f5faf8]"
                >
                  <Maximize2 size={12} />
                </button>
              </div>
            </div>

            {/* Crown Volume */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-[#2d2a2d]">Crown & Side Volume</span>
                <span className="font-mono text-[11px] text-[#0F766E]">
                  {Math.round(fitParams.volume * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.80"
                max="1.40"
                step="0.02"
                value={fitParams.volume}
                onChange={(e) => setFitParams((p) => ({ ...p, volume: Number(e.target.value) }))}
                className="h-2 w-full cursor-pointer accent-[#0F766E]"
              />
            </div>

            {/* Hair Length */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-[#2d2a2d]">Hair Length Stretch</span>
                <span className="font-mono text-[11px] text-[#0F766E]">
                  {Math.round(fitParams.length * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.80"
                max="1.30"
                step="0.02"
                value={fitParams.length}
                onChange={(e) => setFitParams((p) => ({ ...p, length: Number(e.target.value) }))}
                className="h-2 w-full cursor-pointer accent-[#0F766E]"
              />
            </div>

            {/* Mirror Parting & Reset */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => setFitParams((p) => ({ ...p, flipped: !p.flipped }))}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] font-semibold transition ${
                  fitParams.flipped ? "border-[#0F766E] bg-[#EAF5F3] text-[#0F766E]" : "border-[#cbdad6] bg-white text-[#245e58]"
                }`}
              >
                <FlipHorizontal size={13} />
                {fitParams.flipped ? "Parting Flipped" : "Mirror Parting"}
              </button>

              <button
                type="button"
                onClick={() => setFitParams(defaultFitParams)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#cbdad6] bg-white px-3 py-1.5 text-[11px] font-semibold text-[#686369] hover:bg-[#f5faf8]"
              >
                <RotateCcw size={13} />
                Reset Fit
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: FINISH & TEXTURE CONTROLS */}
        {activeTab === "finish" && (
          <div className="mt-5 space-y-5">
            {/* Gloss / Sheen */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-[#2d2a2d]">Gloss & Anisotropic Sheen</span>
                <span className="font-mono text-[11px] text-[#0F766E]">
                  {Math.round(fitParams.gloss * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={fitParams.gloss}
                onChange={(e) => setFitParams((p) => ({ ...p, gloss: Number(e.target.value) }))}
                className="h-2 w-full cursor-pointer accent-[#0F766E]"
              />
              <p className="text-[10px] text-[#746d74]">Silk light reflections across the crown and wave ridges.</p>
            </div>

            {/* Highlight Intensity */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-[#2d2a2d]">Balayage / Highlight Contrast</span>
                <span className="font-mono text-[11px] text-[#0F766E]">
                  {Math.round(fitParams.highlightIntensity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.05"
                value={fitParams.highlightIntensity}
                onChange={(e) => setFitParams((p) => ({ ...p, highlightIntensity: Number(e.target.value) }))}
                className="h-2 w-full cursor-pointer accent-[#0F766E]"
              />
              <p className="text-[10px] text-[#746d74]">Dimensional sun-kissed micro-fibers along surface locks.</p>
            </div>

            {/* Root Shadow */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[12px]">
                <span className="font-medium text-[#2d2a2d]">Root Shadow & Contact Depth</span>
                <span className="font-mono text-[11px] text-[#0F766E]">
                  {Math.round(fitParams.rootDepth * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={fitParams.rootDepth}
                onChange={(e) => setFitParams((p) => ({ ...p, rootDepth: Number(e.target.value) }))}
                className="h-2 w-full cursor-pointer accent-[#0F766E]"
              />
              <p className="text-[10px] text-[#746d74]">Ambient contact shadow cast onto the forehead to naturally anchor the hair.</p>
            </div>
          </div>
        )}

        {/* BOTTOM PRIVACY & INFO FOOTER */}
        <div className="mt-7 border-t border-[#E2E9E6] pt-4">
          <p className="flex items-center gap-1.5 text-[11px] leading-relaxed text-[#746d74]">
            <LockKeyhole size={13} className="shrink-0 text-[#0F766E]" />
            Your photo is processed 100% locally on your machine with zero external APIs, network uploads, or trackers.
          </p>
        </div>
      </section>
    </div>
  );
}
