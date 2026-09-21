"use client";

import React from "react";
import { Sliders, Flame, Cpu, ShieldAlert } from "lucide-react";

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
    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3 text-xs shadow-sm text-slate-800">
      <div className="flex items-center justify-between">
        <span className="font-bold text-slate-900 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-purple-600" />
          Display Controls
        </span>
        <label className="flex items-center gap-1.5 cursor-pointer text-slate-800 font-medium">
          <input
            type="checkbox"
            checked={showMask}
            onChange={(e) => onToggleMask(e.target.checked)}
            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
          />
          <span>Show Tumour Colors</span>
        </label>
      </div>

      {/* Opacity Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[11px] text-slate-600 font-medium">
          <span>Colour Transparency</span>
          <span className="font-mono text-purple-700 font-bold">{Math.round(maskOpacity * 100)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={maskOpacity}
          onChange={(e) => onOpacityChange(parseFloat(e.target.value))}
          className="w-full accent-purple-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
        />
      </div>

      {/* Advanced Research Overlays Toggles */}
      <div className="pt-2 border-t border-slate-100 grid grid-cols-3 gap-2 text-[11px]">
        {/* Uncertainty */}
        <button
          type="button"
          onClick={() => onToggleUncertainty(!showUncertainty)}
          className={`flex flex-col items-center p-2 rounded-lg border transition font-medium ${
            showUncertainty
              ? "bg-amber-100 border-amber-400 text-amber-900 shadow-xs"
              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
          title="Shows where the AI is least sure of the borders"
        >
          <ShieldAlert className={`w-4 h-4 mb-1 ${showUncertainty ? "text-amber-700" : "text-slate-500"}`} />
          <span>AI Doubt</span>
        </button>

        {/* Grad-CAM */}
        <button
          type="button"
          onClick={() => onToggleGradCam(!showGradCam)}
          className={`flex flex-col items-center p-2 rounded-lg border transition font-medium ${
            showGradCam
              ? "bg-red-100 border-red-400 text-red-900 shadow-xs"
              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
          title="Heatmap showing what the AI looked at to classify the tumour"
        >
          <Flame className={`w-4 h-4 mb-1 ${showGradCam ? "text-red-600" : "text-slate-500"}`} />
          <span>AI Focus</span>
        </button>

        {/* Habitats */}
        <button
          type="button"
          onClick={() => onToggleHabitats(!showHabitats)}
          className={`flex flex-col items-center p-2 rounded-lg border transition font-medium ${
            showHabitats
              ? "bg-purple-100 border-purple-400 text-purple-900 shadow-xs"
              : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          }`}
          title="Shows different biological zones inside the tumour"
        >
          <Cpu className={`w-4 h-4 mb-1 ${showHabitats ? "text-purple-700" : "text-slate-500"}`} />
          <span>Micro-Zones</span>
        </button>
      </div>
    </div>
  );
}
