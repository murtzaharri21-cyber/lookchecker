import { useEffect, useRef, useState } from "react";

export default function CameraModal({ onClose, onCapture }: { onClose: () => void; onCapture: (c: HTMLCanvasElement) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [facing, setFacing] = useState<"user" | "environment">("user");
  const [count, setCount] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        streamRef.current?.getTracks().forEach((t) => t.stop());
        const s = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: facing, width: { ideal: 1920 }, height: { ideal: 1440 } },
          audio: false,
        });
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          await videoRef.current.play();
        }
        setErr(null);
      } catch (e) {
        setErr("Camera access was denied or no camera was found. Please allow camera permission or upload a photo instead.");
        console.warn(e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [facing]);

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  const snap = () => {
    const v = videoRef.current;
    if (!v || !v.videoWidth) return;
    const c = document.createElement("canvas");
    c.width = v.videoWidth;
    c.height = v.videoHeight;
    const x = c.getContext("2d")!;
    if (facing === "user") {
      x.translate(c.width, 0);
      x.scale(-1, 1);
    }
    x.drawImage(v, 0, 0);
    setFlash(true);
    setTimeout(() => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
      onCapture(c);
    }, 180);
  };

  const startTimer = () => {
    let n = 3;
    setCount(n);
    const id = setInterval(() => {
      n--;
      if (n <= 0) {
        clearInterval(id);
        setCount(null);
        snap();
      } else setCount(n);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur">
      <div className="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-stone-950 shadow-2xl">
        <div className="flex items-center justify-between px-5 py-3">
          <div>
            <h3 className="font-display text-xl text-white">Take a selfie</h3>
            <p className="text-xs text-stone-400">Face the camera, hair off your forehead, even front lighting.</p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 text-stone-400 hover:bg-white/10 hover:text-white" aria-label="Close">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div className="relative aspect-[4/3] w-full bg-black">
          {err ? (
            <div className="flex h-full items-center justify-center p-8 text-center text-sm text-rose-200">{err}</div>
          ) : (
            <>
              <video ref={videoRef} playsInline muted className="h-full w-full object-cover" style={{ transform: facing === "user" ? "scaleX(-1)" : undefined }} />
              {/* face guide */}
              <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <mask id="hole">
                    <rect width="400" height="300" fill="white" />
                    <ellipse cx="200" cy="140" rx="70" ry="95" fill="black" />
                  </mask>
                </defs>
                <rect width="400" height="300" fill="rgba(0,0,0,.45)" mask="url(#hole)" />
                <ellipse cx="200" cy="140" rx="70" ry="95" fill="none" stroke="url(#g)" strokeWidth="1.5" strokeDasharray="5 5" />
                <linearGradient id="g" x1="0" x2="1">
                  <stop offset="0" stopColor="#f3c3a3" />
                  <stop offset="1" stopColor="#e48b9b" />
                </linearGradient>
              </svg>
              {count !== null && <div className="absolute inset-0 flex items-center justify-center font-display text-8xl text-white drop-shadow-lg">{count}</div>}
              {flash && <div className="absolute inset-0 bg-white" />}
            </>
          )}
        </div>
        <div className="flex items-center justify-center gap-6 py-5">
          <button onClick={() => setFacing((f) => (f === "user" ? "environment" : "user"))} className="rounded-full border border-white/10 px-4 py-2 text-xs text-stone-300 hover:bg-white/5">
            Flip camera
          </button>
          <button onClick={snap} disabled={!!err} className="group relative h-16 w-16 rounded-full border-4 border-white/80 disabled:opacity-40" aria-label="Capture">
            <span className="absolute inset-1.5 rounded-full bg-gradient-to-br from-[#f8d6bd] to-[#e48b9b] transition group-hover:inset-1" />
          </button>
          <button onClick={startTimer} disabled={!!err || count !== null} className="rounded-full border border-white/10 px-4 py-2 text-xs text-stone-300 hover:bg-white/5 disabled:opacity-40">
            3s timer
          </button>
        </div>
      </div>
    </div>
  );
}
