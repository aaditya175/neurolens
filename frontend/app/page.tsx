import React from "react";
import Link from "next/link";
import {
  Activity,
  Layers,
  Brain,
  Upload,
  BarChart3,
  ArrowRight,
  ShieldAlert,
  BookOpen,
  FileText,
  CheckCircle2,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full gap-8">
      {/* Hero / Overview Banner */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm space-y-5">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
            <Activity className="w-3.5 h-3.5" />
            Clinical Decision-Support Research Prototype
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Neuro<span className="text-purple-600">Lens</span> Brain Tumour Workspace
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            An intelligent brain MRI analysis workspace. Automatically highlights tumour sub-regions in 3D, computes exact sizes, determines whether a tumour is <strong>Non-Cancerous (Benign)</strong> or <strong>Cancerous (Malignant)</strong>, and assists doctors with clear, structured reports.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/worklist"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm transition shadow-sm"
            >
              <span>Open Patient Worklist</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/studies/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm border border-slate-300 transition"
            >
              <Upload className="w-4 h-4 text-purple-600" />
              <span>Upload MRI Scan</span>
            </Link>
            <Link
              href="/info"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm border border-slate-300 transition"
            >
              <BookOpen className="w-4 h-4 text-purple-600" />
              <span>Medical Guide & Glossary</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4-Sequence Protocol & Sub-Regions Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sequences */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-purple-600" />
            The 4 Brain MRI Scans We Use
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Each scan type highlights a different tissue property to reveal the full tumour:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center space-y-1">
              <span className="font-bold text-slate-900 block">T1</span>
              <span className="text-[11px] text-slate-600 block">Normal Brain Anatomy</span>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-3 text-center space-y-1">
              <span className="font-bold text-blue-700 block">T1ce</span>
              <span className="text-[11px] text-slate-600 block">Active Tumour Rim</span>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-center space-y-1">
              <span className="font-bold text-amber-700 block">T2</span>
              <span className="text-[11px] text-slate-600 block">Water & Fluid</span>
            </div>
            <div className="rounded-lg border border-purple-200 bg-purple-50/50 p-3 text-center space-y-1">
              <span className="font-bold text-purple-700 block">FLAIR</span>
              <span className="text-[11px] text-slate-600 block">Brain Swelling</span>
            </div>
          </div>
        </div>

        {/* Standard Sub-Regions */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-purple-600" />
            Tumour Parts Color Guide
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            The AI separates the mass into distinct biological layers:
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-red-50/60 border border-red-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600"></span>
                <span className="font-bold text-slate-900">Necrotic Core (NCR)</span>
              </div>
              <span className="text-slate-600 text-[11px]">Dead cells in centre</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50/60 border border-amber-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                <span className="font-bold text-slate-900">Brain Swelling (ED)</span>
              </div>
              <span className="text-slate-600 text-[11px]">Water buildup around tumour</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50/60 border border-blue-200">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                <span className="font-bold text-slate-900">Active Cancerous Rim (ET)</span>
              </div>
              <span className="text-slate-600 text-[11px]">Live growing tumour cells</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Capabilities Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">3D Multi-Plane Viewer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            View the brain from Top-Down (Axial), Front-Back (Coronal), and Side (Sagittal) planes with interactive crosshairs and slice sliders.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Benign vs Malignant AI</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Deep learning and radiomics analyze scan patterns to classify Glioma, Meningioma, Pituitary, or Metastasis with clear benign/malignant labels.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center text-red-700">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Doctor Review Alerts</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Prominent red alerts automatically flag cases where the AI is unsure, borders are fuzzy, or scans show significant brain pressure (midline shift).
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-purple-100 flex items-center justify-center text-purple-700">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">Structured Reports</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Produces ready-to-print clinical reports with exact measurements, radiologist impressions, and one-click PDF export.
          </p>
        </div>
      </div>
    </div>
  );
}
