"use client";

import React from "react";
import { Sparkles, Brain, ArrowUpRight } from "lucide-react";
import { SimilarCase } from "../lib/types/analysis";

interface SimilarCasesGridProps {
  similarCases: SimilarCase[];
}

export function SimilarCasesGrid({ similarCases }: SimilarCasesGridProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 text-xs shadow-sm text-slate-800">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          Similar Past Patient Cases
        </h3>
        <span className="text-[11px] font-mono text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
          {similarCases.length} closest matches
        </span>
      </div>

      <p className="text-slate-600 text-[11px] leading-relaxed">
        Past patients whose tumour shape, texture, and brain scan patterns are closest to this patient, matched against confirmed pathology records.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
        {similarCases.map((c) => {
          const isMalignant =
            c.label.toLowerCase() === "glioma" ||
            c.label.toLowerCase() === "metastasis";

          return (
            <div
              key={c.case_id}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-purple-300 hover:shadow-sm transition space-y-2 group cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-900 group-hover:text-purple-700 transition">
                  {c.case_id}
                </span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-600 transition" />
              </div>

              <div className="flex items-center justify-between gap-1 text-[11px]">
                <span
                  className={`capitalize px-2 py-0.5 rounded-full font-bold border text-[10px] ${
                    isMalignant
                      ? "bg-red-100 border-red-300 text-red-800"
                      : "bg-emerald-100 border-emerald-300 text-emerald-800"
                  }`}
                >
                  {c.label} ({isMalignant ? "Malignant" : "Benign"})
                </span>
                <span className="font-mono font-bold text-emerald-700">
                  {(c.similarity * 100).toFixed(0)}% match
                </span>
              </div>

              {/* Thumbnail Placeholder */}
              <div className="h-16 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-purple-200 transition">
                <Brain className="w-6 h-6 text-slate-400 group-hover:text-purple-600 transition" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
