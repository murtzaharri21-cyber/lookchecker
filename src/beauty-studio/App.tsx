import { useCallback, useEffect, useState } from "react";
import NextImage from "next/image";
import { AlertTriangle } from "lucide-react";
import { BEAUTY_STUDIO_HANDOFF_KEY } from "@/lib/beauty-studio-handoff";
import CameraModal from "./components/CameraModal";
import Landing from "./components/Landing";
import Studio from "./components/Studio";
import { analyzeImage, type FaceData } from "./lib/vision";

const MAX_SIDE = 1280;

function toCanvas(src: CanvasImageSource, w: number, h: number) {
  const k = Math.min(1, MAX_SIDE / Math.max(w, h));
  const c = document.createElement("canvas");
  c.width = Math.round(w * k);
  c.height = Math.round(h * k);
  const x = c.getContext("2d", { willReadFrequently: true })!;
  x.imageSmoothingQuality = "high";
  x.drawImage(src, 0, 0, c.width, c.height);
  return c;
}

function loadImg(url: string): Promise<HTMLImageElement> {
  return new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = () => rej(new Error("Could not read this image file."));
    im.src = url;
  });
}

export default function App() {
  const [camera, setCamera] = useState(false);
  const [work, setWork] = useState<{ preview: string; pct: number; label: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<{ src: HTMLCanvasElement; face: FaceData; id: number } | null>(null);

  // warm up models in the background so analysis is instant
  const process = useCallback(async (canvas: HTMLCanvasElement) => {
    setError(null);
    let preview = "";
    try {
      preview = canvas.toDataURL("image/jpeg", 0.8);
      setWork({ preview, pct: 2, label: "Starting…" });
      await new Promise((r) => setTimeout(r, 50));
      const face = await analyzeImage(canvas, (pct, label) => setWork({ preview, pct: Math.min(95, pct), label }));
      if (!face) {
        setWork(null);
        setError("We couldn't detect a face. Please use a clear, well-lit photo with the visible eye, nose and cheek unobstructed.");
        return;
      }
      setWork({ preview, pct: 100, label: "Mapping 478 landmarks & hair…" });
      await new Promise((r) => setTimeout(r, 350));
      setSession({ src: canvas, face, id: Date.now() });
      setWork(null);
    } catch (e) {
      console.error(e);
      setWork(null);
      setError((e as Error).message || "Something went wrong while analyzing the photo.");
    }
  }, []);

  const onFile = useCallback(async (f: File) => {
    if (!f.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG, WEBP, HEIC converted).");
      return;
    }
    const url = URL.createObjectURL(f);
    try {
      const im = await loadImg(url);
      await process(toCanvas(im, im.naturalWidth, im.naturalHeight));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setTimeout(() => URL.revokeObjectURL(url), 5000);
    }
  }, [process]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      let photo: string | null;
      try {
        photo = sessionStorage.getItem(BEAUTY_STUDIO_HANDOFF_KEY);
      } catch (caught) {
        console.error("Could not access the temporary hairstyle photo handoff:", caught);
        setError("Your browser could not pass this photo to AI Beauty Studio. Please upload it again there.");
        return;
      }
      if (!photo) return;
      try {
        sessionStorage.removeItem(BEAUTY_STUDIO_HANDOFF_KEY);
      } catch (caught) {
        console.error("Could not clear the temporary hairstyle photo handoff:", caught);
      }
      void fetch(photo)
        .then((response) => {
          if (!response.ok) throw new Error("The selected photo could not be opened.");
          return response.blob();
        })
        .then((blob) => onFile(new File([blob], "hairstyle-preview.jpg", { type: blob.type || "image/jpeg" })))
        .catch((caught: unknown) => {
          console.error("Could not open the hairstyle finder photo in AI Beauty Studio:", caught);
          setError(caught instanceof Error ? caught.message : "Could not open the selected photo in AI Beauty Studio.");
        });
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [onFile]);

  return (
    <div className={`${session ? "min-h-0" : "min-h-screen"} bg-stone-950 font-sans text-stone-200`}>
      {session ? (
        <Studio key={session.id} src={session.src} face={session.face} onNew={() => setSession(null)} />
      ) : (
        <Landing onFile={onFile} onCamera={() => setCamera(true)} />
      )}

      {camera && (
        <CameraModal
          onClose={() => setCamera(false)}
          onCapture={(c) => {
            setCamera(false);
            process(toCanvas(c, c.width, c.height));
          }}
        />
      )}

      {work && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 p-6 backdrop-blur-md">
          <div className="w-full max-w-sm text-center">
            <div className="relative mx-auto mb-6 aspect-[4/5] w-60 overflow-hidden rounded-3xl border border-white/10">
              <NextImage src={work.preview} alt="Photo being analyzed" fill unoptimized sizes="240px" className="object-cover" />
              <div className="absolute inset-0 bg-stone-950/30" />
              <div className="scan-line absolute left-0 right-0 h-20 -translate-y-1/2 bg-gradient-to-b from-transparent via-[#f3c3a3]/30 to-transparent">
                <div className="absolute left-0 right-0 top-1/2 h-px bg-[#f3c3a3] shadow-[0_0_14px_#f3c3a3]" />
              </div>
            </div>
            <div className="font-display text-2xl text-white">Analyzing your photo</div>
            <div className="mt-2 text-sm text-stone-400">{work.label}</div>
            <div className="mx-auto mt-5 h-1 w-56 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-[#f3c3a3] to-[#e48b9b] transition-all duration-500" style={{ width: `${work.pct}%` }} />
            </div>
            <p className="mt-4 text-[11px] text-stone-600">Everything runs locally in your browser – your photo is never uploaded.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed bottom-6 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-2xl border border-rose-400/30 bg-stone-900 p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} aria-hidden="true" />
            <p className="flex-1 text-sm text-rose-100">{error}</p>
            <button onClick={() => setError(null)} className="text-stone-400 hover:text-white">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
