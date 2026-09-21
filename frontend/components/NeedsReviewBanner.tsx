"use client";

import React from "react";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { UncertaintyResult } from "../lib/types/analysis";

interface NeedsReviewBannerProps {
  uncertainty: UncertaintyResult;
}

export function NeedsReviewBanner({ uncertainty }: NeedsReviewBannerProps) {
  if (!uncertainty.needs_review) {
    return (
      <div className="rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-3 flex items-center justify-between text-xs text-emerald-300">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Standard Confidence:</strong> Automated checks passed. Uncertainty score {uncertainty.case_score.toFixed(2)} is within safe bounds.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-500/60 bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-amber-950/40 p-4 space-y-2 text-xs shadow-lg shadow-amber-950/20">
      <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
        <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
        <span>NEEDS CLINICAL REVIEW</span>
        <span className="ml-auto px-2 py-0.5 rounded bg-amber-900/80 text-amber-200 font-mono text-[10px]">
          Score: {uncertainty.case_score.toFixed(2)}
        </span>
      </div>
      <p className="text-slate-300 text-xs leading-relaxed">
        The system has flagged this case for mandatory radiologist verification due to elevated uncertainty or pipeline alerts:
      </p>
      <ul className="list-disc list-inside space-y-1 text-amber-300/90 text-[11px] font-medium pl-1">
        {uncertainty.reasons.length > 0 ? (
          uncertainty.reasons.map((r, i) => <li key={i}>{r}</li>)
        ) : (
          <li>Elevated boundary entropy inside Whole Tumour border</li>
        )}
      </ul>
    </div>
  );
}
