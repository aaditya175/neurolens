"use client";

import React from "react";
import { Ruler } from "lucide-react";
import { SegmentationResult, LocationResult } from "../lib/types/analysis";

interface MeasurementsTableProps {
  segmentation: SegmentationResult;
  location: LocationResult;
}

export function MeasurementsTable({ segmentation, location }: MeasurementsTableProps) {
  const regions = [
    { key: "WT", label: "Whole Tumour (WT)", meaning: "Total tumour size including swelling", dot: "bg-purple-600" },
    { key: "TC", label: "Tumour Core (TC)", meaning: "Active central core (NCR + ET)", dot: "bg-orange-500" },
    { key: "ET", label: "Enhancing (ET)", meaning: "Actively growing cancerous rim", dot: "bg-blue-600" },
    { key: "NCR", label: "Necrotic Core (NCR)", meaning: "Dead tissue center", dot: "bg-red-600" },
    { key: "ED", label: "Edema (ED)", meaning: "Fluid swelling around tumour", dot: "bg-amber-500" },
  ];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 text-xs shadow-sm text-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Ruler className="w-4 h-4 text-purple-600" />
          Tumour Size & Measurements
        </h3>
        <span className="text-[11px] text-slate-500">1 mL &approx; 1 sugar cube</span>
      </div>

      {/* Volumetric Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-[11px] bg-slate-50">
              <th className="py-2 px-2 font-semibold">Tumour Zone</th>
              <th className="py-2 px-2 font-semibold text-right">Volume (mL)</th>
              <th className="py-2 px-2 font-semibold text-right">Max Width (mm)</th>
              <th className="py-2 px-2 font-semibold text-right">Perp Width (mm)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {regions.map((r) => {
              const data = segmentation.regions[r.key] || {
                volume_ml: 0,
                max_diameter_mm: 0,
                perp_diameter_mm: 0,
              };
              return (
                <tr key={r.key} className="hover:bg-slate-50/80 transition">
                  <td className="py-2.5 px-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${r.dot} shrink-0`} />
                      <div>
                        <span className="font-bold text-slate-900 block">{r.label}</span>
                        <span className="text-[10px] text-slate-500">{r.meaning}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono font-bold text-slate-900 text-sm">
                    {data.volume_ml.toFixed(1)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-700">
                    {data.max_diameter_mm.toFixed(1)}
                  </td>
                  <td className="py-2.5 px-2 text-right font-mono text-slate-500">
                    {data.perp_diameter_mm.toFixed(1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Location & Mass Effect Card */}
      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
            Brain Location
          </span>
          <div className="font-bold text-slate-900 capitalize text-sm">
            {location.hemisphere} hemisphere • {location.lobes.join(", ") || "Unspecified"} lobe
          </div>
          <span className="text-[10px] text-slate-500 block">
            Automatic landmark alignment
          </span>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-1">
          <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">
            Midline Shift (Brain Pressure)
          </span>
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-base font-bold ${
                location.midline_shift_mm > 3.0
                  ? "text-red-600"
                  : location.midline_shift_mm > 0
                  ? "text-amber-600"
                  : "text-emerald-600"
              }`}
            >
              {location.midline_shift_mm.toFixed(1)} mm
            </span>
            {location.midline_shift_mm > 2.0 ? (
              <span className="px-2 py-0.5 rounded-full bg-red-100 border border-red-300 text-red-800 text-[10px] font-bold">
                Significant Shift
              </span>
            ) : location.midline_shift_mm === 0 ? (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold">
                Normal (No Shift)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-bold">
                Mild Shift
              </span>
            )}
          </div>
          <span className="text-[10px] text-slate-500 block">
            {location.midline_shift_mm > 2.0
              ? "Tumour is pushing the brain midline sideways"
              : "Brain midline remains in its natural position"}
          </span>
        </div>
      </div>
    </div>
  );
}
