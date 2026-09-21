"use client";

import React from "react";
import { CircleDot, Sparkles } from "lucide-react";
import { LesionItem } from "../lib/types/analysis";

interface LesionTableProps {
  lesions: LesionItem[];
  lesionCount: number;
}

export function LesionTable({ lesions, lesionCount }: LesionTableProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-clinical-surface p-4 space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
          <CircleDot className="w-4 h-4 text-cyan-400" />
          Lesion Clusters (DBSCAN)
        </h3>
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-medium border ${
            lesionCount > 1
              ? "bg-purple-950/60 border-purple-700 text-purple-300"
              : "bg-slate-900 border-slate-700 text-slate-300"
          }`}
        >
          {lesionCount > 1 ? `Multifocal (${lesionCount} lesions)` : "Solitary Focal Lesion"}
        </span>
      </div>

      <p className="text-slate-400 text-[11px] leading-relaxed">
        Voxel density spatial clustering (DBSCAN ε=2.5mm) groups contiguous tumour components and filters isolated false-positive noise.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
              <th className="py-1.5 font-medium">Lesion ID</th>
              <th className="py-1.5 font-medium text-right">Volume (mL)</th>
              <th className="py-1.5 font-medium text-right">Centroid (x, y, z mm)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            {lesions.map((lesion) => (
              <tr key={lesion.id} className="hover:bg-slate-800/30">
                <td className="py-2 flex items-center gap-2 text-slate-200 font-sans">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Lesion #{lesion.id}</span>
                </td>
                <td className="py-2 text-right text-slate-100 font-bold">
                  {lesion.volume_ml.toFixed(1)}
                </td>
                <td className="py-2 text-right text-slate-400 text-[11px]">
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
