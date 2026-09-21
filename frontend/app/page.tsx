import React from "react";
import Link from "next/link";
import {
  Activity,
  Layers,
  Brain,
  Upload,
  BarChart3,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  GitCompare,
  FileText,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex-1 flex flex-col p-6 max-w-7xl mx-auto w-full gap-8">
      {/* Hero / Overview Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-clinical-surface to-slate-900 p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            Clinical Decision-Support Research Prototype
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Neuro<span className="text-cyan-400">Lens</span>
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed">
            Multi-sequence 3D brain MRI analysis workspace. Combines MONAI deep learning segmentation with classical ML radiomics, uncertainty quantification, MPR multi-planar viewing, and longitudinal tracking.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/worklist"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition shadow-lg shadow-cyan-500/20"
            >
              Open Triage Worklist
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/studies/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-sm border border-slate-700 transition"
            >
              <Upload className="w-4 h-4 text-cyan-400" />
              Upload New Study
            </Link>
            <Link
              href="/insights"
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium text-sm border border-slate-700 transition"
            >
              <BarChart3 className="w-4 h-4 text-purple-400" />
              Cohort Insights
            </Link>
          </div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute right-0 top-0 -mr-24 -mt-24 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* 4-Sequence Protocol & Sub-Regions Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sequences */}
        <div className="rounded-xl border border-slate-800 bg-clinical-surface p-6">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2 mb-4">
            <Layers className="w-5 h-5 text-cyan-400" />
            Multi-Sequence MRI Protocol
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center">
              <span className="font-mono text-xs font-bold text-slate-300 block">T1</span>
              <span className="text-[11px] text-slate-500">Anatomy baseline</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center">
              <span className="font-mono text-xs font-bold text-cyan-400 block">T1ce</span>
              <span className="text-[11px] text-slate-500">Contrast enhancing</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center">
              <span className="font-mono text-xs font-bold text-slate-300 block">T2</span>
              <span className="text-[11px] text-slate-500">Fluid & edema</span>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-center">
              <span className="font-mono text-xs font-bold text-amber-400 block">FLAIR</span>
              <span className="text-[11px] text-slate-500">Fluid attenuation</span>
            </div>
          </div>
        </div>

        {/* Standard Sub-Regions */}
        <div className="rounded-xl border border-slate-800 bg-clinical-surface p-6">
          <h2 className="text-base font-semibold text-slate-200 flex items-center gap-2 mb-4">
            <Brain className="w-5 h-5 text-purple-400" />
            Standard Tumour Sub-Regions
          </h2>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-tumour-ncr"></span>
                <span className="font-medium text-slate-200">Necrotic Core (NCR)</span>
              </div>
              <span className="text-slate-400 font-mono">Label 1</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-tumour-ed"></span>
                <span className="font-medium text-slate-200">Peritumoural Edema (ED)</span>
              </div>
              <span className="text-slate-400 font-mono">Label 2</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-sm bg-tumour-et"></span>
                <span className="font-medium text-slate-200">Enhancing Tumour (ET)</span>
              </div>
              <span className="text-slate-400 font-mono">Label 3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Capabilities Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-800 bg-clinical-surface p-5 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-blue-950/60 border border-blue-800 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-100 text-sm">3D MPR Viewer</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Multi-planar reconstruction (Axial, Coronal, Sagittal) with crosshair sync, window/level, and sequence toggle.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-clinical-surface p-5 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-purple-950/60 border border-purple-800 flex items-center justify-center text-purple-400">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-100 text-sm">Dual ML Classification</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Deep CNN and classical radiomics SVM/RF models vote concurrently, flagging cases where models disagree.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-clinical-surface p-5 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-800 flex items-center justify-center text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-100 text-sm">Uncertainty & Review</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Voxel predictive entropy maps and automated rules trigger a "Needs Human Review" banner when confidence drops.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-clinical-surface p-5 space-y-2">
          <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <FileText className="w-5 h-5" />
          </div>
          <h3 className="font-semibold text-slate-100 text-sm">Structured Reports</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Editable quantitative findings and RANO response criteria exported to signed PDF documents.
          </p>
        </div>
      </div>
    </div>
  );
}
