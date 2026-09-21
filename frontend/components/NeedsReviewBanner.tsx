"use client";

import React from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { UncertaintyResult } from "../lib/types/analysis";

interface NeedsReviewBannerProps {
  uncertainty: UncertaintyResult;
}

export function NeedsReviewBanner({ uncertainty }: NeedsReviewBannerProps) {
  if (!uncertainty.needs_review) {
    return (
      <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 flex items-center justify-between text-xs text-emerald-900 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="font-bold text-slate-900 block text-sm">
              AI Confidence High — Automated Checks Clear
            </span>
            <span className="text-slate-600 text-xs">
              The AI is confident in its segmentation boundaries and tumour type prediction (Uncertainty score: {uncertainty.case_score.toFixed(2)}).
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-red-300 bg-red-50 p-4 space-y-2 text-xs shadow-sm text-slate-900">
      <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
        <span>DOCTOR REVIEW RECOMMENDED</span>
        <span className="ml-auto px-2 py-0.5 rounded bg-red-100 text-red-800 font-mono text-[10px] border border-red-300">
          Uncertainty: {uncertainty.case_score.toFixed(2)}
        </span>
      </div>
      <p className="text-slate-700 text-xs leading-relaxed">
        The AI has flagged this scan for doctor review because some tumour borders or model predictions were unclear:
      </p>
      <ul className="list-disc list-inside space-y-1 text-red-800 text-xs font-medium pl-1">
        {uncertainty.reasons.length > 0 ? (
          uncertainty.reasons.map((r, i) => (
            <li key={i}>
              {r.replace("boundary entropy", "fuzzy or indistinct tumour edges")}
            </li>
          ))
        ) : (
          <li>Fuzzy or hard-to-distinguish tumour edges inside the scan</li>
        )}
      </ul>
    </div>
  );
}
