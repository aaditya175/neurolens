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
    { key: "NCR", name: "Necrotic Core (NCR)", color: "bg-tumour-ncr", border: "border-red-500", text: "text-red-400" },
    { key: "ED",  name: "Peritumoural Edema (ED)", color: "bg-tumour-ed", border: "border-yellow-500", text: "text-yellow-400" },
    { key: "ET",  name: "Enhancing Tumour (ET)", color: "bg-tumour-et", border: "border-cyan-500", text: "text-cyan-400" },
  ];

  const composites = [
    { key: "WT", name: "Whole Tumour (WT)", color: "bg-tumour-wt", text: "text-purple-400", desc: "NCR + ED + ET" },
    { key: "TC", name: "Tumour Core (TC)",  color: "bg-tumour-tc", text: "text-orange-400", desc: "NCR + ET" },
  ];

  return (
    <div className="space-y-3 p-3 rounded-lg bg-clinical-surface border border-slate-800 text-xs">
      <div className="font-semibold text-slate-200 tracking-wide uppercase text-[10px]">
        Sub-Region Color Map
      </div>
      <div className="space-y-1.5">
        {regions.map((r) => {
          const isActive = activeRegions[r.key] !== false;
          return (
            <button
              key={r.key}
              type="button"
              onClick={() => onToggleRegion?.(r.key)}
              className={`w-full flex items-center justify-between px-2 py-1.5 rounded transition ${
                isActive
                  ? "bg-slate-800/80 text-slate-200 border border-slate-700"
                  : "bg-slate-900/40 text-slate-500 border border-transparent line-through"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-sm ${r.color} shrink-0`} />
                <span className="font-medium">{r.name}</span>
              </div>
              <span className={`text-[10px] font-mono ${isActive ? r.text : 'text-slate-600'}`}>
                {isActive ? "ON" : "OFF"}
              </span>
            </button>
          );
        })}
      </div>

      {showComposites && (
        <div className="pt-2 border-t border-slate-800/60 space-y-1.5">
          <div className="text-[10px] text-slate-400 font-medium">Composite Envelopes</div>
          {composites.map((c) => (
            <div key={c.key} className="flex items-center justify-between px-2 py-1 rounded bg-slate-900/40 text-slate-300">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${c.color} shrink-0`} />
                <span>{c.name}</span>
              </div>
              <span className="text-[10px] text-slate-500">{c.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
