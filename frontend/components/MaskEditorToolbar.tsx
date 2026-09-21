"use client";

import React, { useState } from "react";
import { Paintbrush, Eraser, Wand2, Undo2, Redo2, RotateCcw, Save } from "lucide-react";

interface MaskEditorToolbarProps {
  onSaveMaskVersion?: () => void;
  onRevertAI?: () => void;
}

export function MaskEditorToolbar({ onSaveMaskVersion, onRevertAI }: MaskEditorToolbarProps) {
  const [activeTool, setActiveTool] = useState<"view" | "brush" | "eraser" | "grow">("view");
  const [activeLabel, setActiveLabel] = useState<number>(3); // default ET
  const [brushSize, setBrushSize] = useState<number>(5);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-lg bg-clinical-surface border border-slate-800 text-xs">
      {/* Tool Selection */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => setActiveTool("brush")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition ${
            activeTool === "brush"
              ? "bg-cyan-500 text-slate-950 font-bold"
              : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          }`}
          title="Paint tumour sub-region voxels"
        >
          <Paintbrush className="w-3.5 h-3.5" />
          <span>Brush</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool("eraser")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition ${
            activeTool === "eraser"
              ? "bg-rose-500 text-slate-950 font-bold"
              : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          }`}
          title="Erase mask voxels"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>Eraser</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool("grow")}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-medium transition ${
            activeTool === "grow"
              ? "bg-amber-500 text-slate-950 font-bold"
              : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          }`}
          title="Threshold-based region growing"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Region Grow</span>
        </button>
      </div>

      {/* Target Label Picker */}
      <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-slate-900 border border-slate-800">
        <span className="text-slate-400 text-[11px]">Paint as:</span>
        <button
          type="button"
          onClick={() => setActiveLabel(1)}
          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
            activeLabel === 1
              ? "bg-red-950 border-red-500 text-red-300"
              : "border-transparent text-slate-400"
          }`}
        >
          NCR
        </button>
        <button
          type="button"
          onClick={() => setActiveLabel(2)}
          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
            activeLabel === 2
              ? "bg-yellow-950 border-yellow-500 text-yellow-300"
              : "border-transparent text-slate-400"
          }`}
        >
          ED
        </button>
        <button
          type="button"
          onClick={() => setActiveLabel(3)}
          className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${
            activeLabel === 3
              ? "bg-cyan-950 border-cyan-500 text-cyan-300"
              : "border-transparent text-slate-400"
          }`}
        >
          ET
        </button>
      </div>

      {/* Brush Size Slider */}
      <div className="flex items-center gap-2 px-2 text-[11px] text-slate-400">
        <span>Size: {brushSize}px</span>
        <input
          type="range"
          min="1"
          max="25"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-16 accent-cyan-400 h-1 cursor-pointer"
        />
      </div>

      {/* Undo / Redo / Revert / Save */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onRevertAI}
          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[11px]"
          title="Discard changes and restore AI segmentation"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span>Revert AI</span>
        </button>
        <button
          type="button"
          onClick={onSaveMaskVersion}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[11px] shadow"
          title="Save revision as Doctor mask version"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Mask (v2)</span>
        </button>
      </div>
    </div>
  );
}
