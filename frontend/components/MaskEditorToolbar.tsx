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
    <div className="flex flex-wrap items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200 shadow-xs text-xs text-slate-800">
      {/* Tool Selection */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => setActiveTool("brush")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
            activeTool === "brush"
              ? "bg-purple-600 text-white shadow-xs"
              : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          }`}
          title="Paint tumour sub-region area"
        >
          <Paintbrush className="w-3.5 h-3.5" />
          <span>Draw</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool("eraser")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
            activeTool === "eraser"
              ? "bg-red-600 text-white shadow-xs"
              : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          }`}
          title="Erase tumour markings"
        >
          <Eraser className="w-3.5 h-3.5" />
          <span>Erase</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTool("grow")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition ${
            activeTool === "grow"
              ? "bg-amber-600 text-white shadow-xs"
              : "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          }`}
          title="Automatically expand to fill boundary"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Smart Fill</span>
        </button>
      </div>

      {/* Target Label Picker */}
      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200">
        <span className="text-slate-500 text-[11px] font-medium">Draw as:</span>
        <button
          type="button"
          onClick={() => setActiveLabel(1)}
          className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
            activeLabel === 1
              ? "bg-red-100 border-red-400 text-red-800"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Dead Center (NCR)
        </button>
        <button
          type="button"
          onClick={() => setActiveLabel(2)}
          className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
            activeLabel === 2
              ? "bg-amber-100 border-amber-400 text-amber-800"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Swelling (ED)
        </button>
        <button
          type="button"
          onClick={() => setActiveLabel(3)}
          className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
            activeLabel === 3
              ? "bg-blue-100 border-blue-400 text-blue-800"
              : "border-transparent text-slate-600 hover:text-slate-900"
          }`}
        >
          Active Rim (ET)
        </button>
      </div>

      {/* Brush Size Slider */}
      <div className="flex items-center gap-2 px-2 text-[11px] text-slate-600 font-medium">
        <span>Size: {brushSize}px</span>
        <input
          type="range"
          min="1"
          max="25"
          value={brushSize}
          onChange={(e) => setBrushSize(parseInt(e.target.value))}
          className="w-16 accent-purple-600 h-1.5 cursor-pointer"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onRevertAI}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-medium transition"
          title="Discard edits and restore AI segmentation"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
          <span>Reset AI</span>
        </button>
        <button
          type="button"
          onClick={onSaveMaskVersion}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition"
          title="Save manual corrections as Doctor Mask v2"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
