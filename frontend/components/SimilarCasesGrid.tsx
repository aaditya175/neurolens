"use client";

import React from "react";
import { Sparkles, Brain, ArrowUpRight } from "lucide-react";
import { SimilarCase } from "../lib/types/analysis";

interface SimilarCasesGridProps {
  similarCases: SimilarCase[];
}

export function SimilarCasesGrid({ similarCases }: SimilarCasesGridProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-clinical-surface p-4 space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          Similar Historical Cases (KNN)
        </h3>
        <span className="text-[11px] font-mono text-purple-300">k = {similarCases.length}</span>
      </div>

      <p className="text-slate-400 text-[11px] leading-relaxed">
        Nearest neighbors in radiomics PCA embedding space. Matched against confirmed histological records.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {similarCases.map((c) => (
          <div
            key={c.case_id}
            className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-purple-500/50 transition space-y-2 group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-slate-200 group-hover:text-purple-300 transition">
                {c.case_id}
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-300 transition" />
            </div>

            <div className="flex items-center justify-between text-[11px]">
              <span className="capitalize px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {c.label}
              </span>
              <span className="font-mono font-bold text-emerald-400">
                {(c.similarity * 100).toFixed(0)}% match
              </span>
            </div>

            {/* Thumbnail Placeholder */}
            <div className="h-16 rounded bg-slate-950 border border-slate-800/80 flex items-center justify-center text-slate-600 group-hover:border-slate-700 transition">
              <Brain className="w-6 h-6 text-slate-700 group-hover:text-purple-400/60 transition" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
