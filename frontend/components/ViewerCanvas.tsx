"use client";

import React, { useState, useRef, useEffect } from "react";
import { Maximize2, Minimize2, ZoomIn, ZoomOut, RefreshCw, Crosshair, Sun } from "lucide-react";

interface ViewerCanvasProps {
  studyId: string;
  currentSequence: string;
  maskOpacity: number;
  showMask: boolean;
  activeRegions: Record<string, boolean>;
  showUncertainty?: boolean;
  showHabitats?: boolean;
  showGradCam?: boolean;
  lesions?: Array<{
    cx: number;
    cy: number;
    cz: number;
    r_ed: number;
    r_et: number;
    r_ncr: number;
  }>;
}

export function ViewerCanvas({
  studyId,
  currentSequence,
  maskOpacity,
  showMask,
  activeRegions,
  showUncertainty = false,
  showHabitats = false,
  showGradCam = false,
  lesions,
}: ViewerCanvasProps) {
  // 3D Crosshair coordinates in volume space [x, y, z] (0 to 95 for 96^3 volume)
  const [coords, setCoords] = useState<{ x: number; y: number; z: number }>({
    x: 58, // Coronal cut
    y: 44, // Sagittal cut
    z: 48, // Axial cut
  });

  const [windowLevel, setWindowLevel] = useState<{ window: number; level: number }>({
    window: 256,
    level: 128,
  });

  const [zoom, setZoom] = useState<number>(1.0);
  const [showCrosshairs, setShowCrosshairs] = useState<boolean>(true);
  const [maximizedPlane, setMaximizedPlane] = useState<"mpr" | "axial" | "coronal" | "sagittal">("mpr");

  // Canvas references for each plane
  const axialRef = useRef<HTMLCanvasElement | null>(null);
  const coronalRef = useRef<HTMLCanvasElement | null>(null);
  const sagittalRef = useRef<HTMLCanvasElement | null>(null);

  // Default lesion if none provided
  const activeLesions = lesions !== undefined ? lesions : [
    { cx: 62, cy: 40, cz: 48, r_ed: 36, r_et: 22, r_ncr: 11 }
  ];

  // Auto-center crosshairs on lesion when switching patients
  useEffect(() => {
    if (lesions && lesions.length > 0) {
      setCoords({ x: lesions[0].cx, y: lesions[0].cy, z: lesions[0].cz });
    } else if (lesions && lesions.length === 0) {
      setCoords({ x: 48, y: 48, z: 48 });
    }
  }, [lesions]);

  // Draw simulated anatomically plausible MPR slices with tumour mask
  useEffect(() => {
    drawPlane("axial", axialRef.current, coords.z, coords.x, coords.y);
    drawPlane("coronal", coronalRef.current, coords.y, coords.x, coords.z);
    drawPlane("sagittal", sagittalRef.current, coords.x, coords.y, coords.z);
  }, [coords, currentSequence, maskOpacity, showMask, activeRegions, showUncertainty, showHabitats, showGradCam, zoom, windowLevel, lesions]);

  const drawPlane = (
    plane: "axial" | "coronal" | "sagittal",
    canvas: HTMLCanvasElement | null,
    slice: number,
    crossX: number,
    crossY: number
  ) => {
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Background
    ctx.fillStyle = "#05070c";
    ctx.fillRect(0, 0, width, height);

    ctx.save();
    // Center and apply zoom
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    const cx = width / 2;
    const cy = height / 2;

    // 1. Draw Anatomical Brain Silhouette (Simulated Brain Slice)
    // Contrast adjusted by window/level
    const contrastFactor = (windowLevel.window / 256);
    const brightnessOffset = (windowLevel.level - 128) / 128;

    const radX = width * 0.38;
    const radY = height * 0.42;

    const brainGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, radX);
    brainGrad.addColorStop(0, `rgb(${Math.min(255, Math.floor(160 * contrastFactor))}, ${Math.min(255, Math.floor(160 * contrastFactor))}, ${Math.min(255, Math.floor(160 * contrastFactor))})`);
    brainGrad.addColorStop(0.7, `rgb(${Math.min(255, Math.floor(110 * contrastFactor))}, ${Math.min(255, Math.floor(110 * contrastFactor))}, ${Math.min(255, Math.floor(110 * contrastFactor))})`);
    brainGrad.addColorStop(1, "#111827");

    ctx.beginPath();
    ctx.ellipse(cx, cy, radX, radY, 0, 0, Math.PI * 2);
    ctx.fillStyle = brainGrad;
    ctx.fill();

    // Ventricles (dark central CSF)
    ctx.beginPath();
    ctx.ellipse(cx - 10, cy, 6, 22, 0, 0, Math.PI * 2);
    ctx.ellipse(cx + 10, cy, 6, 22, 0, 0, Math.PI * 2);
    ctx.fillStyle = currentSequence === "t2" ? "#ffffff" : "#070b14"; // Bright on T2, dark on T1/FLAIR
    ctx.fill();

    // 2. Draw Tumour Lesions (dynamic per patient case)
    activeLesions.forEach((lesion) => {
      // Determine distance from slice cut depending on viewing plane
      const sliceTarget = plane === "axial" ? lesion.cz : plane === "coronal" ? lesion.cy : lesion.cx;
      const tCenterDistFromSlice = Math.abs(slice - sliceTarget);
      const maxDist = Math.max(lesion.r_ed, lesion.r_et, lesion.r_ncr, 1);

      if (tCenterDistFromSlice < maxDist) {
        const sliceScale = Math.cos((tCenterDistFromSlice / maxDist) * (Math.PI / 2));

        // Calculate 2D position in canvas
        let tx = cx;
        let ty = cy;
        if (plane === "axial") {
          tx = (lesion.cx / 96) * width;
          ty = (lesion.cy / 96) * height;
        } else if (plane === "coronal") {
          tx = (lesion.cx / 96) * width;
          ty = (lesion.cz / 96) * height;
        } else {
          tx = (lesion.cy / 96) * width;
          ty = (lesion.cz / 96) * height;
        }

        // Edema (ED = 2, Yellow)
        const rEd = lesion.r_ed * sliceScale;
        if (showMask && activeRegions.ED !== false && maskOpacity > 0 && rEd > 0) {
          ctx.beginPath();
          ctx.arc(tx, ty, rEd, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(234, 179, 8, ${maskOpacity * 0.7})`;
          ctx.fill();
        }

        // Enhancing Rim (ET = 3, Cyan)
        const rEt = lesion.r_et * sliceScale;
        if (showMask && activeRegions.ET !== false && maskOpacity > 0 && rEt > 0) {
          ctx.beginPath();
          ctx.arc(tx, ty, rEt, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6, 182, 212, ${maskOpacity * 0.85})`;
          ctx.fill();
        }

        // Necrotic Core (NCR = 1, Red)
        const rNcr = lesion.r_ncr * sliceScale;
        if (showMask && activeRegions.NCR !== false && maskOpacity > 0 && rNcr > 0) {
          ctx.beginPath();
          ctx.arc(tx, ty, rNcr, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(239, 68, 68, ${maskOpacity * 0.9})`;
          ctx.fill();
        }

        // Research Overlays: Uncertainty Entropy Heatmap
        if (showUncertainty && rEd > 0) {
          ctx.beginPath();
          ctx.arc(tx, ty, rEd + 6, 0, Math.PI * 2);
          ctx.lineWidth = 6;
          ctx.strokeStyle = "rgba(245, 158, 11, 0.7)";
          ctx.stroke();
        }

        // Research Overlays: Grad-CAM
        if (showGradCam && rEt > 0) {
          const gradCam = ctx.createRadialGradient(tx, ty, 2, tx, ty, rEt + 15);
          gradCam.addColorStop(0, "rgba(220, 38, 38, 0.65)");
          gradCam.addColorStop(0.5, "rgba(245, 158, 11, 0.45)");
          gradCam.addColorStop(1, "rgba(0, 0, 0, 0)");
          ctx.beginPath();
          ctx.arc(tx, ty, rEt + 15, 0, Math.PI * 2);
          ctx.fillStyle = gradCam;
          ctx.fill();
        }
      }
    });

    // 3. Crosshairs Sync
    if (showCrosshairs) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(6, 182, 212, 0.55)";
      ctx.setLineDash([3, 3]);

      // Vertical line
      ctx.beginPath();
      ctx.moveTo(crossX * (width / 96), 0);
      ctx.lineTo(crossX * (width / 96), height);
      ctx.stroke();

      // Horizontal line
      ctx.beginPath();
      ctx.moveTo(0, crossY * (height / 96));
      ctx.lineTo(width, crossY * (height / 96));
      ctx.stroke();

      ctx.setLineDash([]);
    }

    ctx.restore();
  };

  const handleCanvasClick = (
    plane: "axial" | "coronal" | "sagittal",
    e: React.MouseEvent<HTMLCanvasElement>
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.floor(((e.clientX - rect.left) / rect.width) * 96);
    const clickY = Math.floor(((e.clientY - rect.top) / rect.height) * 96);

    if (plane === "axial") {
      setCoords((prev) => ({ ...prev, x: clickX, y: clickY }));
    } else if (plane === "coronal") {
      setCoords((prev) => ({ ...prev, x: clickX, z: clickY }));
    } else if (plane === "sagittal") {
      setCoords((prev) => ({ ...prev, y: clickX, z: clickY }));
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-900 border border-slate-200 rounded-xl overflow-hidden select-none shadow-sm">
      {/* Viewer Top Utility Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-slate-200 text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-900">
            3D Brain Viewer
          </span>
          <span className="text-slate-300">•</span>
          <span className="font-medium text-slate-600 uppercase">
            Viewing: <strong className="text-purple-700 font-bold">{currentSequence}</strong>
          </span>
          <span className="text-slate-300">•</span>
          <span className="font-mono text-slate-500 text-[11px]">
            Slice Pos: [{coords.x}, {coords.y}, {coords.z}]
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowCrosshairs(!showCrosshairs)}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1 ${
              showCrosshairs ? "bg-purple-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
            }`}
            title="Toggle Crosshairs"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Crosshair</span>
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.7, z - 0.15))}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setZoom(1.0);
              setWindowLevel({ window: 256, level: 128 });
            }}
            className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            title="Reset View"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Viewport Canvas Grid */}
      <div
        className={`flex-1 p-2 grid gap-2 bg-slate-950 ${
          maximizedPlane === "mpr"
            ? "grid-cols-1 md:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        {/* Axial Viewport */}
        {(maximizedPlane === "mpr" || maximizedPlane === "axial") && (
          <div className="relative flex flex-col rounded-lg bg-black border border-slate-800 overflow-hidden group">
            <div className="absolute top-2 left-2 z-10 flex items-center gap-2 bg-white/90 backdrop-blur px-2.5 py-0.5 rounded-md text-[11px] font-bold text-slate-900 shadow-xs">
              <span>Top-Down (Axial Slice: {coords.z}/95)</span>
            </div>
            <button
              type="button"
              onClick={() => setMaximizedPlane(maximizedPlane === "axial" ? "mpr" : "axial")}
              className="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-white/90 text-slate-700 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition shadow-xs"
            >
              {maximizedPlane === "axial" ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <canvas
              ref={axialRef}
              width={340}
              height={340}
              onClick={(e) => handleCanvasClick("axial", e)}
              className="w-full h-full object-contain cursor-crosshair"
            />
            {/* Axial Slice Slider */}
            <div className="absolute bottom-2 inset-x-4 z-10 opacity-0 group-hover:opacity-100 transition">
              <input
                type="range"
                min="0"
                max="95"
                value={coords.z}
                onChange={(e) => setCoords((c) => ({ ...c, z: parseInt(e.target.value) }))}
                className="w-full h-1.5 accent-purple-500 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Coronal Viewport */}
        {(maximizedPlane === "mpr" || maximizedPlane === "coronal") && (
          <div className="relative flex flex-col rounded-lg bg-black border border-slate-800 overflow-hidden group">
            <div className="absolute top-2 left-2 z-10 flex items-center gap-2 bg-white/90 backdrop-blur px-2.5 py-0.5 rounded-md text-[11px] font-bold text-slate-900 shadow-xs">
              <span>Front-Back (Coronal Slice: {coords.y}/95)</span>
            </div>
            <button
              type="button"
              onClick={() => setMaximizedPlane(maximizedPlane === "coronal" ? "mpr" : "coronal")}
              className="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-white/90 text-slate-700 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition shadow-xs"
            >
              {maximizedPlane === "coronal" ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <canvas
              ref={coronalRef}
              width={340}
              height={340}
              onClick={(e) => handleCanvasClick("coronal", e)}
              className="w-full h-full object-contain cursor-crosshair"
            />
            {/* Coronal Slice Slider */}
            <div className="absolute bottom-2 inset-x-4 z-10 opacity-0 group-hover:opacity-100 transition">
              <input
                type="range"
                min="0"
                max="95"
                value={coords.y}
                onChange={(e) => setCoords((c) => ({ ...c, y: parseInt(e.target.value) }))}
                className="w-full h-1.5 accent-purple-500 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* Sagittal Viewport */}
        {(maximizedPlane === "mpr" || maximizedPlane === "sagittal") && (
          <div className="relative flex flex-col rounded-lg bg-black border border-slate-800 overflow-hidden group">
            <div className="absolute top-2 left-2 z-10 flex items-center gap-2 bg-white/90 backdrop-blur px-2.5 py-0.5 rounded-md text-[11px] font-bold text-slate-900 shadow-xs">
              <span>Side-View (Sagittal Slice: {coords.x}/95)</span>
            </div>
            <button
              type="button"
              onClick={() => setMaximizedPlane(maximizedPlane === "sagittal" ? "mpr" : "sagittal")}
              className="absolute top-2 right-2 z-10 p-1.5 rounded-md bg-white/90 text-slate-700 hover:text-slate-900 opacity-0 group-hover:opacity-100 transition shadow-xs"
            >
              {maximizedPlane === "sagittal" ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
            <canvas
              ref={sagittalRef}
              width={340}
              height={340}
              onClick={(e) => handleCanvasClick("sagittal", e)}
              className="w-full h-full object-contain cursor-crosshair"
            />
            {/* Sagittal Slice Slider */}
            <div className="absolute bottom-2 inset-x-4 z-10 opacity-0 group-hover:opacity-100 transition">
              <input
                type="range"
                min="0"
                max="95"
                value={coords.x}
                onChange={(e) => setCoords((c) => ({ ...c, x: parseInt(e.target.value) }))}
                className="w-full h-1.5 accent-purple-500 bg-slate-800 rounded cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Viewer Bottom Window/Level Control Footer */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-t border-slate-200 text-xs text-slate-600 font-medium">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Contrast: {windowLevel.window}</span>
            <span>•</span>
            <span>Brightness: {windowLevel.level}</span>
          </div>
          <span>Zoom: {(zoom * 100).toFixed(0)}%</span>
        </div>
        <div className="flex items-center gap-2 text-slate-500 text-[11px]">
          <span>Click on brain to move crosshair</span>
          <span>•</span>
          <span>Hover slider to scroll through slices</span>
        </div>
      </div>
    </div>
  );
}
