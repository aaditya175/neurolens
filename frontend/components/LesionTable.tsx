"use client";

import React from "react";
import { CircleDot } from "lucide-react";
import { LesionItem } from "../lib/types/analysis";

interface LesionTableProps {
  lesions: LesionItem[];
  lesionCount: number;
}

export function LesionTable({ lesions, lesionCount }: LesionTableProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 text-xs shadow-sm text-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <CircleDot className="w-4 h-4 text-purple-600" />
          Individual Tumour Spots
        </h3>
        <span
          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
            lesionCount > 1
              ? "bg-amber-100 border-amber-300 text-amber-800"
              : "bg-emerald-100 border-emerald-300 text-emerald-800"
          }`}
        >
          {lesionCount > 1 ? `Multiple Spots (${lesionCount} areas)` : "Single Concentrated Area"}
        </span>
      </div>

      <p className="text-slate-600 text-[11px] leading-relaxed">
        The AI checks whether the tumour is concentrated in one primary location or spread across several separate spots in the brain, while filtering out scan artifacts.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-[11px] bg-slate-50">
              <th className="py-2 px-2 font-semibold">Spot Number</th>
              <th className="py-2 px-2 font-semibold text-right">Size (mL)</th>
              <th className="py-2 px-2 font-semibold text-right">3D Brain Coordinates (x, y, z mm)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {lesions.map((lesion) => (
              <tr key={lesion.id} className="hover:bg-slate-50 transition">
                <td className="py-2.5 px-2 flex items-center gap-2 text-slate-900 font-sans font-semibold">
                  <span className="w-2 h-2 rounded-full bg-purple-600" />
                  <span>Tumour Area #{lesion.id}</span>
                </td>
                <td className="py-2.5 px-2 text-right text-slate-900 font-bold">
                  {lesion.volume_ml.toFixed(1)}
                </td>
                <td className="py-2.5 px-2 text-right text-slate-500 text-[11px]">
                  ({lesion.centroid_mm[0].toFixed(1)}, {lesion.centroid_mm[1].toFixed(1)}, {lesion.centroid_mm[2].toFixed(1)})
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
