"use client";

import React from "react";

interface RegionLegendProps {
  activeRegions?: Record<string, boolean>;
  onToggleRegion?: (region: string) => void;
  showComposites?: boolean;
}

export function RegionLegend({
  activeRegions = { NCR: true, ED: true, ET: true, WT: true, TC: true },
  onToggleRegion,
  showComposites = true,
}: RegionLegendProps) {
  const regions = [
    { key: "NCR", name: "Necrotic Core (Dead Center)", color: "bg-red-600", border: "border-red-500", text: "text-red-700" },
    { key: "ED",  name: "Brain Swelling (Edema)", color: "bg-amber-500", border: "border-amber-500", text: "text-amber-700" },
    { key: "ET",  name: "Active Tumour Rim (Enhancing)", color: "bg-blue-600", border: "border-blue-500", text: "text-blue-700" },
  ];

  const composites = [
    { key: "WT", name: "Whole Tumour (WT)", color: "bg-purple-600", text: "text-purple-700", desc: "Total area: Core + Swelling" },
    { key: "TC", name: "Tumour Core (TC)",  color: "bg-orange-500", text: "text-orange-700", desc: "Active center: Dead + Live cells" },
  ];

  return (
    <div className="space-y-3 p-4 rounded-xl bg-white border border-slate-200 shadow-sm text-xs text-slate-800">
      <div className="font-bold text-slate-900 tracking-wide uppercase text-[11px]">
        Tumour Color Guide (Click to Toggle)
      </div>
      <div className="space-y-1.5">
        {regions.map((r) => {
          const isActive = activeRegions[r.key] !== false;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => onToggleRegion?.(r.key)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg border transition ${
                isActive
                  ? "bg-purple-50 text-slate-900 border-purple-200"
                  : "bg-slate-50 text-slate-400 border-slate-200 line-through"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${r.color} shrink-0`} />
                <span className="font-medium text-xs">{r.name}</span>
              </div>
              <span className={`text-[10px] font-bold ${isActive ? "text-purple-700" : "text-slate-400"}`}>
                {isActive ? "SHOWN" : "HIDDEN"}
              </span>
            </button>
          );
        })}
      </div>

      {showComposites && (
        <div className="pt-2 border-t border-slate-100 space-y-1.5">
          <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Combined Measurements</div>
          {composites.map((c) => (
            <div key={c.key} className="flex items-center justify-between px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${c.color} shrink-0`} />
                <span className="font-semibold text-xs">{c.name}</span>
              </div>
              <span className="text-[10px] text-slate-500">{c.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
