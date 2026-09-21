import React from "react";
import { AlertCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-3 px-6 text-xs text-slate-500 select-none shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-amber-800 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 text-[11px]">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>
            <strong>Important Notice:</strong> NeuroLens is a clinical decision-support research prototype. It is not an FDA/CE-cleared medical device and must not replace professional clinical diagnosis or doctor decisions.
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 shrink-0 text-[11px]">
          <span>NeuroLens v0.1.0</span>
          <span>•</span>
          <span>Mumbai University ML Syllabus</span>
        </div>
      </div>
    </footer>
  );
}
