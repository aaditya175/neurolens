"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FileText, Download, CheckCircle, ArrowLeft, Printer, ShieldCheck } from "lucide-react";
import { getPatientProfile, PatientProfile } from "@/lib/patientCatalog";
import { API_BASE } from "@/lib/api";

export default function ReportEditorPage() {
  const params = useParams();
  const reportId = (params.id as string) || "856c7e19-a1ae-4298-94f5-d4ad0bdc6072";

  const [profile, setProfile] = useState<PatientProfile>(() => getPatientProfile(reportId));
  const [status, setStatus] = useState<"draft" | "reviewed" | "signed">("draft");
  const [impression, setImpression] = useState<string>(() => getPatientProfile(reportId).clinicalImpression);

  useEffect(() => {
    const loaded = getPatientProfile(reportId);
    setProfile(loaded);
    setImpression(loaded.clinicalImpression);
  }, [reportId]);

  const wt = profile.analysis.segmentation.regions.WT.volume_ml;
  const tc = profile.analysis.segmentation.regions.TC.volume_ml;
  const et = profile.analysis.segmentation.regions.ET.volume_ml;
  const shift = profile.analysis.location.midline_shift_mm;

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
              Study ID: {profile.id.slice(0, 16)} • Patient Code: {profile.code} • Demographics: {profile.age}y, {profile.sex}
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
            href={`${API_BASE}/reports/${reportId}/pdf`}
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
            <div>Patient: {profile.code} ({profile.age}y {profile.sex})</div>
            <div>Ref: NL-{profile.id.slice(0, 8).toUpperCase()}</div>
          </div>
        </div>

        {/* Disclaimer Callout */}
        <div className="p-3 rounded-lg border border-amber-200 bg-amber-50 text-[11px] text-amber-800 font-medium">
          <strong>Mandatory Notice:</strong> NeuroLens is a research prototype for decision support only. It is not a medical device and must not replace clinical judgement or diagnosis by a qualified doctor.
        </div>

        {/* Section 1: Classification & Malignancy */}
        <div
          className={`p-4 rounded-xl border space-y-1 ${
            profile.isMalignant
              ? "border-red-200 bg-red-50/60 text-red-900"
              : "border-emerald-200 bg-emerald-50/60 text-emerald-900"
          }`}
        >
          <div className="flex items-center justify-between">
            <h3 className={`font-bold uppercase text-[11px] tracking-wider ${profile.isMalignant ? "text-red-800" : "text-emerald-800"}`}>
              1. AI Classification & Tumour Nature
            </h3>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                profile.isMalignant
                  ? "bg-red-100 border-red-300 text-red-800"
                  : "bg-emerald-100 border-emerald-300 text-emerald-800"
              }`}
            >
              {profile.isMalignant ? "MALIGNANT (CANCEROUS)" : "BENIGN (NON-CANCEROUS)"}
            </span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Consensus Prediction: <strong className="capitalize">{profile.tumourType}</strong> (Confidence: {(profile.analysis.classification.ensemble.confidence * 100).toFixed(0)}%).
            {profile.isMalignant
              ? " Both visual deep learning and texture machine learning classifiers detect aggressive neo-vascularization or infiltrative glial expansion."
              : " Features demonstrate circumscribed, non-infiltrative borders characteristic of benign pathology."}
          </p>
        </div>

        {/* Section 2: Imaging Technique */}
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 uppercase text-[11px] tracking-wider text-purple-700">
            2. Imaging Technique & Protocol
          </h3>
          <p className="leading-relaxed text-slate-600">
            Standard 4-sequence volumetric brain MRI acquired: T1 pre-contrast, T1ce post-gadolinium contrast, T2 axial, and FLAIR. Automated brain skull-stripping and 1.0 mm isotropic spatial co-registration completed.
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
              <span className="text-base font-bold text-purple-700">{wt.toFixed(1)} mL</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-sans">Tumour Core (TC)</span>
              <span className="text-base font-bold text-orange-600">{tc.toFixed(1)} mL</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-sans">Active Rim (ET)</span>
              <span className="text-base font-bold text-blue-600">{et.toFixed(1)} mL</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 block font-sans">Midline Brain Shift</span>
              <span className={`text-base font-bold ${shift > 2 ? "text-red-600" : "text-slate-800"}`}>
                {shift.toFixed(1)} mm
              </span>
            </div>
          </div>
          <div className="text-[11px] text-slate-600 space-y-0.5 pt-1">
            <p>• Max Tumour Diameter: {profile.analysis.segmentation.regions.WT.max_diameter_mm.toFixed(1)} mm (Cross-width: {profile.analysis.segmentation.regions.WT.perp_diameter_mm.toFixed(1)} mm)</p>
            <p>• Lesion Count: {profile.analysis.segmentation.lesion_count} focal lesion(s) localized in {profile.analysis.location.lobes.join(", ")}.</p>
            <p>• Brain Displacement: {shift > 2 ? `${shift.toFixed(1)} mm midline displacement indicates significant parenchymal pressure (mass effect).` : "No significant midline shift observed."}</p>
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
