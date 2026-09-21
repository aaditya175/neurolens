import React from "react";
import { AlertCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-slate-800 bg-clinical-surface/80 backdrop-blur py-3 px-6 text-xs text-slate-400 select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-amber-400 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-500" />
          <span>
            <strong>Mandatory Disclaimer:</strong> NeuroLens is a research prototype for decision support only. It is not a medical device and must not be used for clinical diagnosis or treatment decisions.
          </span>
        </div>
        <div className="flex items-center gap-4 text-slate-500 shrink-0">
          <span>v0.1.0-alpha</span>
          <span>•</span>
          <span>MONAI + Mumbai Univ ML Syllabus</span>
        </div>
      </div>
    </footer>
  );
}
