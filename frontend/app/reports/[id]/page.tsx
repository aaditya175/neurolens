"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FileText, Download, CheckCircle, ArrowLeft, Printer, ShieldCheck } from "lucide-react";

export default function ReportEditorPage() {
  const params = useParams();
  const reportId = (params.id as string) || "demo-report-uuid";

  const [status, setStatus] = useState<"draft" | "reviewed" | "signed">("draft");
  const [impression, setImpression] = useState<string>(
    "Multi-compartment right frontotemporal enhancing intra-axial intra-tumoral mass consistent with high-grade glioma. Significant mass effect with 2.3 mm midline shift. Substantial peritumoural FLAIR edema noted."
  );

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/studies/${reportId}`}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-cyan-400" />
              Structured Radiology Report
            </h1>
            <p className="text-xs text-slate-400">
              Study UUID: {reportId.slice(0, 8)} • Patient: PT-{reportId.slice(0, 6).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              status === "signed"
                ? "bg-emerald-950 border border-emerald-700 text-emerald-300"
                : status === "reviewed"
                ? "bg-cyan-950 border border-cyan-700 text-cyan-300"
                : "bg-slate-800 border border-slate-700 text-slate-400"
            }`}
          >
            Status: {status}
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Print</span>
          </button>
          <a
            href={`http://localhost:8000/api/v1/reports/${reportId}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </a>
        </div>
      </div>

      {/* Structured Document Canvas */}
      <div className="rounded-2xl border border-slate-800 bg-clinical-surface p-8 space-y-6 text-xs text-slate-300 shadow-2xl">
        {/* Document Header */}
        <div className="border-b border-slate-800 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              NEUROLENS CLINICAL DECISION-SUPPORT REPORT
            </h2>
            <p className="text-[11px] text-slate-400">
              Department of Neuroradiology • Advanced 3D Quantitative Analysis
            </p>
          </div>
          <div className="text-right text-[11px] font-mono text-slate-400">
            <div>Date: 2026-09-21</div>
            <div>Ref: NL-{reportId.slice(0, 8).toUpperCase()}</div>
          </div>
        </div>

        {/* Mandatory Disclaimer Callout */}
        <div className="p-3 rounded-lg border border-amber-900/60 bg-amber-950/20 text-[11px] text-amber-300 font-medium">
          <strong>Mandatory Disclaimer:</strong> NeuroLens is a research prototype for decision support only. It is not a medical device and must not be used for clinical diagnosis or treatment decisions.
        </div>

        {/* Section: Technique */}
        <div className="space-y-1">
          <h3 className="font-bold text-slate-100 uppercase text-[11px] tracking-wider text-cyan-400">
            1. Imaging Technique & Protocol
          </h3>
          <p className="leading-relaxed text-slate-300">
            Multi-sequence volumetric brain MRI acquired including pre-contrast T1, post-contrast T1ce, T2 axial, and FLAIR. Skull-stripping, N4 bias field correction, and 1.0 mm isotropic spatial resampling performed.
          </p>
        </div>

        {/* Section: Quantitative Findings */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-100 uppercase text-[11px] tracking-wider text-cyan-400">
            2. Quantitative AI Volumetric Findings
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-center">
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans">Whole Tumour (WT)</span>
              <span className="text-sm font-bold text-purple-400">46.8 mL</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans">Tumour Core (TC)</span>
              <span className="text-sm font-bold text-orange-400">25.3 mL</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans">Enhancing (ET)</span>
              <span className="text-sm font-bold text-cyan-400">16.1 mL</span>
            </div>
            <div className="p-2.5 rounded bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 block font-sans">Midline Shift</span>
              <span className="text-sm font-bold text-amber-400">2.3 mm</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 space-y-0.5 pt-1">
            <p>• Max Axial RANO Diameter: 39.4 mm (Perpendicular: 32.1 mm, Bidimensional product: 12.6 cm²)</p>
            <p>• Lesion Count (DBSCAN ε=2.5mm): 1 Solitary focal lesion in right frontotemporal lobes.</p>
            <p>• Dual-head Consensus: Glioma (CNN: 89%, Classical SVM: 83%, Calibrated Ensemble: 86%).</p>
          </div>
        </div>

        {/* Section: Impression (Editable Free-Text) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-100 uppercase text-[11px] tracking-wider text-cyan-400">
              3. Radiologist Impression (Editable)
            </h3>
            {status !== "signed" && (
              <span className="text-[10px] text-slate-500 italic">Editable before sign-off</span>
            )}
          </div>
          <textarea
            rows={4}
            disabled={status === "signed"}
            value={impression}
            onChange={(e) => setImpression(e.target.value)}
            className="w-full p-3 bg-slate-900/90 border border-slate-800 rounded-lg text-slate-100 leading-relaxed text-xs focus:outline-none focus:border-cyan-500 disabled:opacity-75 font-sans"
          />
        </div>

        {/* Sign-off Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            {status === "signed" ? (
              <span className="text-emerald-400 font-medium flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" />
                Digitally signed and archived. Immutability locked.
              </span>
            ) : (
              <span>Draft document under clinical review</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {status === "draft" && (
              <button
                type="button"
                onClick={() => setStatus("reviewed")}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium text-xs transition"
              >
                Mark as Reviewed
              </button>
            )}
            {status !== "signed" && (
              <button
                type="button"
                onClick={() => setStatus("signed")}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-lg shadow-emerald-600/20"
              >
                Sign Off Report
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
