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
    "Large right frontotemporal enhancing intra-axial brain mass consistent with high-grade glioma (Malignant). Significant mass effect with 2.3 mm midline brain shift. Substantial brain swelling (peritumoural FLAIR edema) noted around the tumour rim. Surgical evaluation advised."
  );

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/studies/${reportId}`}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Clinical Radiology Report
            </h1>
            <p className="text-xs text-slate-500">
              Study ID: {reportId.slice(0, 8)} • Patient: PT-{reportId.slice(0, 6).toUpperCase()}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
              status === "signed"
                ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                : status === "reviewed"
                ? "bg-purple-100 border-purple-300 text-purple-800"
                : "bg-slate-100 border-slate-200 text-slate-600"
            }`}
          >
            Status: {status}
          </span>
          <button
            type="button"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-medium shadow-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Print</span>
          </button>
          <a
            href={`http://localhost:8000/api/v1/reports/${reportId}/pdf`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </a>
        </div>
      </div>

      {/* Structured Document Canvas (White Paper Style) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 space-y-6 text-xs text-slate-700 shadow-sm">
        {/* Document Header */}
        <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              NEUROLENS CLINICAL DECISION-SUPPORT REPORT
            </h2>
            <p className="text-[11px] text-slate-500">
              Department of Neuroradiology • 3D Quantitative MRI Analysis
            </p>
          </div>
          <div className="text-right text-[11px] font-mono text-slate-500">
            <div>Date: 2026-09-21</div>
            <div>Ref: NL-{reportId.slice(0, 8).toUpperCase()}</div>
          </div>
        </div>

        {/* Disclaimer Callout */}
        <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-[11px] text-amber-800 font-medium">
          <strong>Mandatory Notice:</strong> NeuroLens is a research prototype for decision support only. It is not a medical device and must not replace clinical judgement or diagnosis by a qualified doctor.
        </div>

        {/* Section 1: Classification & Malignancy */}
        <div className="p-4 rounded-xl border border-red-200 bg-red-50/60 space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-red-800">
              1. AI Classification & Tumour Nature
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 border border-red-300 text-red-800">
              MALIGNANT (CANCEROUS)
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Consensus Prediction: <strong>Glioma</strong> (Confidence: 86%). Visual AI and Texture AI models both agree on high-grade glial tumour with active vascular enhancement and core necrosis.
          </p>
        </div>

        {/* Section 2: Imaging Technique */}
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-purple-700">
            2. Imaging Technique & Protocol
          </h3>
          <p className="leading-relaxed text-slate-600">
            Standard 4-sequence volumetric brain MRI acquired: T1 pre-contrast, T1ce post-gadolinium contrast, T2 axial, and FLAIR. Automated brain isolation and 1.0 mm spatial alignment completed successfully.
          </p>
        </div>

        {/* Section 3: Quantitative Findings */}
        <div className="space-y-2">
          <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-purple-700">
            3. Automated Tumour Size & Volume Findings
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono text-center">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-sans">Whole Tumour (WT)</span>
              <span className="text-base font-bold text-purple-700">46.8 mL</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-sans">Tumour Core (TC)</span>
              <span className="text-base font-bold text-orange-600">25.3 mL</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-sans">Active Rim (ET)</span>
              <span className="text-base font-bold text-blue-600">16.1 mL</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-sans">Brain Shift</span>
              <span className="text-base font-bold text-red-600">2.3 mm</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
            <p>• Maximum Tumour Diameter: 39.4 mm (Cross-width: 32.1 mm)</p>
            <p>• Tumour Spot Count: 1 primary concentrated mass in right frontotemporal lobes.</p>
            <p>• Brain Shift Note: 2.3 mm midline displacement indicates significant pressure on the surrounding brain tissue.</p>
          </div>
        </div>

        {/* Section 4: Impression (Editable Free-Text) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-purple-700">
              4. Radiologist Clinical Impression (Editable)
            </h3>
            {status !== "signed" && (
              <span className="text-[10px] text-slate-500 italic">Editable before digital sign-off</span>
            )}
          </div>
          <textarea
            rows={4}
            disabled={status === "signed"}
            value={impression}
            onChange={(e) => setImpression(e.target.value)}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 leading-relaxed text-xs focus:outline-none focus:border-purple-600 disabled:opacity-75 font-sans"
          />
        </div>

        {/* Sign-off Actions */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            {status === "signed" ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Digitally signed and finalized by radiologist.
              </span>
            ) : (
              <span>Draft document pending doctor signature</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {status === "draft" && (
              <button
                type="button"
                onClick={() => setStatus("reviewed")}
                className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium text-xs transition"
              >
                Mark as Reviewed
              </button>
            )}
            {status !== "signed" && (
              <button
                type="button"
                onClick={() => setStatus("signed")}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition shadow-sm"
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
