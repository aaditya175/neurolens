"use client";

import React from "react";
import { Eye, Sliders, Flame, Cpu, ShieldAlert } from "lucide-react";

interface OverlayControlsProps {
  maskOpacity: number;
  onOpacityChange: (val: number) => void;
  showMask: boolean;
  onToggleMask: (val: boolean) => void;
  showUncertainty: boolean;
  onToggleUncertainty: (val: boolean) => void;
  showHabitats: boolean;
  onToggleHabitats: (val: boolean) => void;
  showGradCam: boolean;
  onToggleGradCam: (val: boolean) => void;
}

export function OverlayControls({
  maskOpacity,
  onOpacityChange,
  showMask,
  onToggleMask,
  showUncertainty,
  onToggleUncertainty,
  showHabitats,
  onToggleHabitats,
  showGradCam,
  onToggleGradCam,
}: OverlayControlsProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-clinical-surface p-3 space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-semibold text-slate-200 flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-cyan-400" />
          Overlay Controls
        </span>
        <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={showMask}
            onChange={(e) => onToggleMask(e.target.checked)}
            className="rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-900"
          />
          <span>Show Segmentation</span>
        </label>
      </div>

      {/* Opacity Slider */}
      <div className="space-y-1">
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>Mask Opacity</span>
          <span className="font-mono text-cyan-300">{Math.round(maskOpacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={maskOpacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
        />
      </div>

      {/* Advanced Research Overlays Toggles */}
      <div className="pt-2 border-t border-slate-800 grid grid-cols-3 gap-1.5 text-[11px]">
        {/* Uncertainty */}
        <button
          type="button"
          onClick={() => onToggleUncertainty(!showUncertainty)}
          className={`flex flex-col items-center p-2 rounded-lg border transition ${
            showUncertainty
              ? "bg-amber-950/60 border-amber-600 text-amber-300"
              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <ShieldAlert className="w-4 h-4 mb-1 text-amber-400" />
          <span>Uncertainty</span>
        </button>

        {/* Grad-CAM */}
        <button
          type="button"
          onClick={() => onToggleGradCam(!showGradCam)}
          className={`flex flex-col items-center p-2 rounded-lg border transition ${
            showGradCam
              ? "bg-red-950/60 border-red-600 text-red-300"
              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <Flame className="w-4 h-4 mb-1 text-red-400" />
          <span>Grad-CAM</span>
        </button>

        {/* Habitats */}
        <button
          type="button"
          onClick={() => onToggleHabitats(!showHabitats)}
          className={`flex flex-col items-center p-2 rounded-lg border transition ${
            showHabitats
              ? "bg-purple-950/60 border-purple-600 text-purple-300"
              : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"
          }`}
        >
          <Cpu className="w-4 h-4 mb-1 text-purple-400" />
          <span>Habitats</span>
        </button>
      </div>
    </div>
  );
}
