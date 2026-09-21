"use client";

import React from "react";
import { Ruler, Activity, ArrowRightLeft } from "lucide-react";
import { SegmentationResult, LocationResult } from "../lib/types/analysis";

interface MeasurementsTableProps {
  segmentation: SegmentationResult;
  location: LocationResult;
}

export function MeasurementsTable({ segmentation, location }: MeasurementsTableProps) {
  const regions = [
    { key: "WT", label: "Whole Tumour (WT)", color: "text-purple-400", dot: "bg-tumour-wt" },
    { key: "TC", label: "Tumour Core (TC)", color: "text-orange-400", dot: "bg-tumour-tc" },
    { key: "ET", label: "Enhancing (ET)", color: "text-cyan-400", dot: "bg-tumour-et" },
    { key: "NCR", label: "Necrotic Core (NCR)", color: "text-red-400", dot: "bg-tumour-ncr" },
    { key: "ED", label: "Edema (ED)", color: "text-yellow-400", dot: "bg-tumour-ed" },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-clinical-surface p-4 space-y-4 text-xs">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
          <Ruler className="w-4 h-4 text-cyan-400" />
          Quantitative Measurements
        </h3>
        <span className="text-[11px] text-slate-400 font-mono">1 mm³ = 0.001 mL</span>
      </div>

      {/* Volumetric Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
              <th className="py-1.5 font-medium">Sub-Region</th>
              <th className="py-1.5 font-medium text-right">Volume (mL)</th>
              <th className="py-1.5 font-medium text-right">Max Diam (mm)</th>
              <th className="py-1.5 font-medium text-right">Perp Diam (mm)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {regions.map((r) => {
              const data = segmentation.regions[r.key] || {
                volume_ml: 0,
                max_diameter_mm: 0,
                perp_diameter_mm: 0,
              };
              return (
                <tr key={r.key} className="hover:bg-slate-800/30">
                  <td className="py-2 flex items-center gap-2 font-sans text-slate-200">
                    <span className={`w-2 h-2 rounded-full ${r.dot}`} />
                    <span className={r.color}>{r.label}</span>
                  </td>
                  <td className="py-2 text-right text-slate-100 font-bold">
                    {data.volume_ml.toFixed(1)}
                  </td>
                  <td className="py-2 text-right text-slate-300">
                    {data.max_diameter_mm.toFixed(1)}
                  </td>
                  <td className="py-2 text-right text-slate-400">
                    {data.perp_diameter_mm.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mass Effect & Location Card */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-medium">
            Anatomical Lobe & Hemisphere
          </span>
          <div className="font-semibold text-slate-200 capitalize">
            {location.hemisphere} • {location.lobes.join(", ") || "Unspecified"}
          </div>
          <span className="text-[10px] text-slate-500 italic block">
            Confidence: {location.confidence}
          </span>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1">
          <span className="text-[10px] text-slate-400 block uppercase font-medium">
            Midline Shift (Mass Effect)
          </span>
          <div className="font-semibold text-slate-200 flex items-center gap-2">
            <span
              className={`font-mono text-base font-bold ${
                location.midline_shift_mm > 3.0
                  ? "text-red-400"
                  : location.midline_shift_mm > 0
                  ? "text-amber-400"
                  : "text-emerald-400"
              }`}
            >
              {location.midline_shift_mm.toFixed(1)} mm
            </span>
            {location.midline_shift_mm > 2.0 && (
              <span className="px-1.5 py-0.5 rounded bg-amber-950 border border-amber-800 text-amber-300 text-[10px]">
                Significant
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 italic block">
            Symmetric ventricle heuristic
          </span>
        </div>
      </div>
    </div>
  );
}
