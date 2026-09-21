"use client";

import React from "react";
import Link from "next/link";
import {
  BookOpen,
  Brain,
  Layers,
  Activity,
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Search,
} from "lucide-react";

export default function InfoGlossaryPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          Easy Clinical & AI Guide
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          What Do All These Terms Mean?
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-base">
          Medical MRI and artificial intelligence terms can be confusing. Here is a simple, plain-English breakdown of how NeuroLens analyzes brain tumours.
        </p>
      </div>

      {/* Section 1: Benign vs Malignant Classification */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              1. Are We Classifying Benign vs. Malignant Brain Tumours?
            </h2>
            <p className="text-sm text-slate-500">
              Yes! NeuroLens classifies the specific tumour type and highlights whether it is typically non-cancerous (benign) or cancerous (malignant).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Benign Card */}
          <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                BENIGN (NON-CANCEROUS)
              </span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Non-Invasive, Slow-Growing
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Benign tumours do not spread to distant parts of the body and usually have clear, distinct borders. They are still treated carefully because they can press on delicate brain areas.
            </p>
            <div className="pt-2 border-t border-emerald-200/60 space-y-2">
              <div>
                <strong className="text-xs text-slate-900">Meningioma:</strong>
                <span className="text-xs text-slate-600 block">
                  The most common primary brain tumour. Grows slowly on the protective membranes (meninges) wrapping the brain. Over 80% are benign and curable with surgery.
                </span>
              </div>
              <div>
                <strong className="text-xs text-slate-900">Pituitary Adenoma:</strong>
                <span className="text-xs text-slate-600 block">
                  A benign growth on the hormone-producing pituitary gland at the base of the skull. Rarely spreads.
                </span>
              </div>
            </div>
          </div>

          {/* Malignant Card */}
          <div className="p-5 rounded-xl border border-red-200 bg-red-50/50 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">
                MALIGNANT (CANCEROUS)
              </span>
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Aggressive, Fast-Growing, Infiltrative
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              Malignant tumours contain cancerous cells that invade and damage nearby brain tissue. They require urgent multi-disciplinary treatment (surgery, radiotherapy, and chemotherapy).
            </p>
            <div className="pt-2 border-t border-red-200/60 space-y-2">
              <div>
                <strong className="text-xs text-slate-900">Glioma / Glioblastoma:</strong>
                <span className="text-xs text-slate-600 block">
                  Originates from supportive glial cells inside the brain. High-grade gliomas (Glioblastoma) are fast-growing with central dead tissue and severe swelling.
                </span>
              </div>
              <div>
                <strong className="text-xs text-slate-900">Metastasis:</strong>
                <span className="text-xs text-slate-600 block">
                  Cancer that originated elsewhere in the body (such as lungs, breast, or skin) and traveled through blood vessels into the brain. Often appears as multiple nodules.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: What do the 4 MRI Scans Show? */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              2. The 4 MRI Scans Explained in Simple Words
            </h2>
            <p className="text-sm text-slate-500">
              Why does the doctor need 4 different MRI sequences? Because each scan highlights different properties of water, fat, and blood flow.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <span className="font-bold text-purple-700 text-sm">T1-Weighted (T1)</span>
            <div className="text-xs font-semibold text-slate-900">The Structural Blueprint</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Shows normal brain anatomy with sharp detail. Water and spinal fluid (CSF) look dark, while brain tissue looks gray.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1.5">
            <span className="font-bold text-blue-700 text-sm">T1ce (Contrast-Enhanced)</span>
            <div className="text-xs font-semibold text-slate-900">Shows Active Tumour Blood Supply</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Taken after injecting a safe dye (gadolinium). Since cancerous blood vessels are leaky, dye accumulates inside active tumours, making them glow bright white!
            </p>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
            <span className="font-bold text-amber-700 text-sm">T2-Weighted (T2)</span>
            <div className="text-xs font-semibold text-slate-900">Detects Water & Swelling</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Water and fluids appear very bright white. Extremely sensitive for identifying tissue damage and fluid buildup around the lesion.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1.5">
            <span className="font-bold text-purple-700 text-sm">FLAIR (Fluid-Attenuated Inversion)</span>
            <div className="text-xs font-semibold text-slate-900">Isolates True Brain Edema</div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Similar to T2, but artificially blacks out normal spinal fluid in the ventricles so only abnormal brain swelling (edema) glows brightly.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Sub-Regions */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              3. Tumour Sub-Regions & Colors on the 3D Viewer
            </h2>
            <p className="text-sm text-slate-500">
              A brain tumour is not a uniform solid ball; it has live parts, dead parts, and swelling. NeuroLens color-codes them:
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-red-200 bg-red-50/40">
            <span className="w-4 h-4 rounded-full bg-red-600 mt-0.5 shrink-0"></span>
            <div>
              <div className="text-sm font-bold text-slate-900">
                NCR — Necrotic Core (Dead Tissue)
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                The center of an aggressive tumour where cells multiplied so fast they outgrew their blood supply and died.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-amber-200 bg-amber-50/40">
            <span className="w-4 h-4 rounded-full bg-amber-600 mt-0.5 shrink-0"></span>
            <div>
              <div className="text-sm font-bold text-slate-900">
                ED — Peritumoural Edema (Brain Swelling)
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Fluid swelling in the healthy brain tissue directly surrounding the tumour, caused by inflammation and vascular pressure.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-blue-200 bg-blue-50/40">
            <span className="w-4 h-4 rounded-full bg-blue-600 mt-0.5 shrink-0"></span>
            <div>
              <div className="text-sm font-bold text-slate-900">
                ET — Enhancing Tumour (Active Cancerous Rim)
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                The actively growing, live cancerous rim where blood vessels are actively feeding the tumour.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3.5 rounded-xl border border-purple-200 bg-purple-50/40">
            <span className="w-4 h-4 rounded-full bg-purple-600 mt-0.5 shrink-0"></span>
            <div>
              <div className="text-sm font-bold text-slate-900">
                WT — Whole Tumour (Total Affected Volume)
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                The combined sum of all three components: Necrotic Core + Active Enhancing Rim + Brain Swelling (NCR + ET + ED).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Key Clinical Measurements */}
      <section className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              4. Key Clinical Measurements & Terms
            </h2>
            <p className="text-sm text-slate-500">
              The automated numbers displayed in the clinical summary:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">Volume (in mL / milliliters)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The 3D physical size of the tumour. 1 mL is approximately the size of a single sugar cube. Tumours larger than 30–40 mL cause severe mass effect.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">RANO Bidimensional Diameters (mm)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              The standard measurement used by radiologists worldwide: the longest diameter across the tumour slice multiplied by the widest perpendicular width.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">Midline Shift (mm)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              When a large mass pushes the natural dividing line of the brain to the side. A shift over 2 mm is dangerous and flagged with an urgent red warning badge.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-slate-900 text-sm">RANO Longitudinal Response</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Comparison with prior scans to check treatment effectiveness:
              <br />• <strong>Complete Response:</strong> Active tumour has vanished.
              <br />• <strong>Partial Response:</strong> Tumour shrank by more than 50%.
              <br />• <strong>Stable Disease:</strong> Tumour size has stayed the same.
              <br />• <strong>Progressive Disease:</strong> Tumour grew by more than 25% or new nodules appeared.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Back to Worklist */}
      <div className="text-center py-6">
        <Link
          href="/worklist"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-sm transition"
        >
          Explore the Triage Worklist
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
