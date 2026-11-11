import type { FaceLandmarker, ImageSegmenter } from "@mediapipe/tasks-vision";

export type P = { x: number; y: number };
export type LP = { x: number; y: number; z: number };

export interface FaceData {
  lm: LP[]; // pixel coordinates
  width: number;
  height: number;
  hairMask: Float32Array | null; // same size as image (width*height) after resampling
}

let facePromise: Promise<{ face: FaceLandmarker; hair: ImageSegmenter | null }> | null = null;

function b64ToBytes(b64: string): Uint8Array {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function gunzip(b64: string): Promise<Uint8Array> {
  const bytes = b64ToBytes(b64);
  if (typeof DecompressionStream === "undefined") {
    throw new Error("Your browser does not support DecompressionStream. Please use a recent Chrome, Edge, Safari or Firefox.");
  }
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(new DecompressionStream("gzip"));
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

export type ProgressFn = (pct: number, label: string) => void;

export function loadModels(onProgress?: ProgressFn) {
  if (facePromise) return facePromise;
  facePromise = (async () => {
    onProgress?.(5, "Unpacking on-device AI engine…");
    const assets = await import("../generated/mpAssets");
    const vision = await import("@mediapipe/tasks-vision");
    const [loader, wasm] = await Promise.all([gunzip(assets.WASM_LOADER_GZ), gunzip(assets.WASM_BINARY_GZ)]);
    onProgress?.(35, "Preparing neural network runtime…");
    const loaderUrl = URL.createObjectURL(new Blob([loader as BlobPart], { type: "text/javascript" }));
    const wasmUrl = URL.createObjectURL(new Blob([wasm as BlobPart], { type: "application/wasm" }));
    const fileset = { wasmLoaderPath: loaderUrl, wasmBinaryPath: wasmUrl };
    onProgress?.(50, "Loading 478-point face mesh model…");
    const faceModel = await gunzip(assets.FACE_MODEL_GZ);
    const face = await vision.FaceLandmarker.createFromOptions(fileset as never, {
      baseOptions: { modelAssetBuffer: faceModel, delegate: "CPU" },
      runningMode: "IMAGE",
      numFaces: 1,
      minFaceDetectionConfidence: 0.3,
      minFacePresenceConfidence: 0.3,
    });
    onProgress?.(80, "Loading hair segmentation model…");
    let hair: ImageSegmenter | null = null;
    try {
      const hairModel = await gunzip(assets.HAIR_MODEL_GZ);
      hair = await vision.ImageSegmenter.createFromOptions(fileset as never, {
        baseOptions: { modelAssetBuffer: hairModel, delegate: "CPU" },
        runningMode: "IMAGE",
        outputConfidenceMasks: true,
        outputCategoryMask: false,
      });
    } catch (e) {
      console.warn("Hair segmenter unavailable", e);
    }
    onProgress?.(100, "Ready");
    return { face, hair };
  })();
  facePromise.catch(() => {
    facePromise = null;
  });
  return facePromise;
}

export async function analyzeImage(canvas: HTMLCanvasElement, onProgress?: ProgressFn): Promise<FaceData | null> {
  const { face, hair } = await loadModels(onProgress);
  const w = canvas.width,
    h = canvas.height;
  const res = face.detect(canvas);
  if (!res.faceLandmarks || res.faceLandmarks.length === 0) return null;
  if (res.faceLandmarks.length > 1) {
    throw new Error("We found more than one face. Please choose a photo with just you in it.");
  }
  const lm = res.faceLandmarks[0].map((p) => ({ x: p.x * w, y: p.y * h, z: p.z * w }));

  let hairMask: Float32Array | null = null;
  if (!hair) throw new Error("The on-device hair detector could not start. Please reload the page and try again.");
  let sr: ReturnType<ImageSegmenter["segment"]> | null = null;
  try {
    sr = hair.segment(canvas);
    const masks = sr.confidenceMasks;
    if (masks && masks.length) {
      const m = masks.length > 1 ? masks[1] : masks[0];
      const data = m.getAsFloat32Array();
      const mw = m.width,
        mh = m.height;
      if (mw === w && mh === h) hairMask = new Float32Array(data);
      else {
        hairMask = new Float32Array(w * h);
        for (let y = 0; y < h; y++) {
          const sy = Math.min(mh - 1, Math.floor((y / h) * mh));
          for (let x = 0; x < w; x++) {
            const sx = Math.min(mw - 1, Math.floor((x / w) * mw));
            hairMask[y * w + x] = data[sy * mw + sx];
          }
        }
      }
    }
  } catch (e) {
    console.error("Hair segmentation failed", e);
    throw new Error("Hair could not be detected in this photo. Try a clear, evenly lit image.");
  } finally {
    sr?.close?.();
  }
  if (!hairMask) throw new Error("The on-device hair detector returned no result. Please try another photo.");
  return { lm, width: w, height: h, hairMask };
}
