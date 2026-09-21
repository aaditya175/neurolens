"use client";

import React from "react";
import { CheckCircle2, AlertCircle, Cpu, Brain, GitMerge } from "lucide-react";
import { ClassificationResult } from "../lib/types/analysis";

interface ClassificationCardProps {
  classification: ClassificationResult;
}

export function ClassificationCard({ classification }: ClassificationCardProps) {
  const { cnn, classical, ensemble } = classification;

  return (
    <div className="rounded-xl border border-slate-800 bg-clinical-surface p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-cyan-400" />
          Dual Model Classification
        </h3>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
            ensemble.agree
              ? "bg-emerald-950/60 border-emerald-700 text-emerald-300"
              : "bg-amber-950/60 border-amber-700 text-amber-300"
          }`}
        >
          {ensemble.agree ? (
            <>
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Models Agree
            </>
          ) : (
            <>
              <AlertCircle className="w-3 h-3 text-amber-400" />
              Discrepancy Detected
            </>
          )}
        </span>
      </div>

      {/* Ensemble Primary Callout */}
      <div className="p-3 rounded-lg bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Consensus Prediction
          </span>
          <span className="text-xl font-extrabold text-cyan-300 capitalize tracking-tight">
            {ensemble.label}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
            Calibrated Conf.
          </span>
          <span className="text-lg font-mono font-bold text-slate-200">
            {(ensemble.confidence * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Side-by-side: CNN vs Classical */}
      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
        {/* CNN */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-blue-400 font-semibold text-[11px]">
            <Brain className="w-3.5 h-3.5" />
            <span>Deep CNN</span>
          </div>
          <div className="font-bold text-slate-100 capitalize text-sm">
            {cnn.label}
          </div>
          <div className="space-y-1 text-[11px] text-slate-400">
            {Object.entries(cnn.probs).map(([cls, p]) => (
              <div key={cls} className="flex justify-between items-center">
                <span className="capitalize">{cls}:</span>
                <span className="font-mono text-slate-300">{(p * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Classical */}
        <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center gap-1.5 text-purple-400 font-semibold text-[11px]">
            <Cpu className="w-3.5 h-3.5" />
            <span>Classical ({classical.model || "SVM"})</span>
          </div>
          <div className="font-bold text-slate-100 capitalize text-sm">
            {classical.label}
          </div>
          <div className="space-y-1 text-[11px] text-slate-400">
            {Object.entries(classical.probs).map(([cls, p]) => (
              <div key={cls} className="flex justify-between items-center">
                <span className="capitalize">{cls}:</span>
                <span className="font-mono text-slate-300">{(p * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
