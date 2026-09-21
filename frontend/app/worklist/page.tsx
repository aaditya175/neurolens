"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ListFilter,
  Search,
  AlertTriangle,
  Upload,
  ChevronRight,
  BookOpen,
} from "lucide-react";

interface WorklistItem {
  study_id: string;
  patient_code: string;
  acquired_at: string;
  tumour_type: string;
  is_malignant: boolean;
  urgency_score: number;
  badges: string[];
  needs_review: boolean;
  wt_volume_ml: number;
  status: "analyzed" | "analyzing" | "uploaded";
}

export default function WorklistPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterMalignancy, setFilterMalignancy] = useState<string>("all");
  const [filterNeedsReview, setFilterNeedsReview] = useState<boolean>(false);
  const [searchCode, setSearchCode] = useState<string>("");

  // Comprehensive test cohort (16 clinical test cases)
  const studies: WorklistItem[] = [
    {
      study_id: "856c7e19-a1ae-4298-94f5-d4ad0bdc6072",
      patient_code: "PT-70194",
      acquired_at: "2026-09-20 14:10",
      tumour_type: "Glioma",
      is_malignant: true,
      urgency_score: 0.88,
      badges: ["High Brain Pressure (>3mm)", "Large Tumour (>40mL)", "Multifocal"],
      needs_review: true,
      wt_volume_ml: 46.8,
      status: "analyzed",
    },
    {
      study_id: "c11-massive-shift-uuid",
      patient_code: "PT-99412",
      acquired_at: "2026-09-21 08:15",
      tumour_type: "Glioblastoma",
      is_malignant: true,
      urgency_score: 0.98,
      badges: ["CRITICAL: 6.5mm Midline Shift", "Severe Herniation Risk", "Emergency Triage"],
      needs_review: true,
      wt_volume_ml: 68.4,
      status: "analyzed",
    },
    {
      study_id: "331d2b99-a9fe-4411-921c-a1bd99cd1044",
      patient_code: "PT-90114",
      acquired_at: "2026-09-19 16:50",
      tumour_type: "Metastasis",
      is_malignant: true,
      urgency_score: 0.79,
      badges: ["3 Distinct Lesions", "Secondary Cancer Spread"],
      needs_review: true,
      wt_volume_ml: 31.0,
      status: "analyzed",
    },
    {
      study_id: "c14-miliary-met-uuid",
      patient_code: "PT-66301",
      acquired_at: "2026-09-21 11:40",
      tumour_type: "Metastasis",
      is_malignant: true,
      urgency_score: 0.82,
      badges: ["5 Miliary Seeds", "Bilateral Hemispheres"],
      needs_review: true,
      wt_volume_ml: 12.6,
      status: "analyzed",
    },
    {
      study_id: "c09-oligodendro-uuid",
      patient_code: "PT-55219",
      acquired_at: "2026-09-21 09:30",
      tumour_type: "Oligodendroglioma",
      is_malignant: true,
      urgency_score: 0.68,
      badges: ["Frontal Lobe", "Patchy Enhancement"],
      needs_review: false,
      wt_volume_ml: 28.5,
      status: "analyzed",
    },
    {
      study_id: "c07-cystic-astro-uuid",
      patient_code: "PT-31084",
      acquired_at: "2026-09-20 15:45",
      tumour_type: "Astrocytoma",
      is_malignant: true,
      urgency_score: 0.65,
      badges: ["Posterior Fossa", "Cerebellar Cyst + Nodule"],
      needs_review: false,
      wt_volume_ml: 18.2,
      status: "analyzed",
    },
    {
      study_id: "c02-low-grade-uuid",
      patient_code: "PT-11840",
      acquired_at: "2026-09-18 10:20",
      tumour_type: "Low-Grade Glioma",
      is_malignant: true,
      urgency_score: 0.45,
      badges: ["Diffuse Infiltration", "Non-enhancing (T1ce negative)"],
      needs_review: false,
      wt_volume_ml: 19.8,
      status: "analyzed",
    },
    {
      study_id: "c12-recurrent-gbm-uuid",
      patient_code: "PT-77192",
      acquired_at: "2026-09-20 17:10",
      tumour_type: "Glioblastoma",
      is_malignant: true,
      urgency_score: 0.85,
      badges: ["Post-Op Recurrence (+45%)", "Progressive Disease"],
      needs_review: true,
      wt_volume_ml: 41.2,
      status: "analyzed",
    },
    {
      study_id: "721a9c31-b0fe-4192-811d-e5cf01ad2381",
      patient_code: "PT-48210",
      acquired_at: "2026-09-20 11:35",
      tumour_type: "Meningioma",
      is_malignant: false,
      urgency_score: 0.62,
      badges: ["Dural Tail", "Sharp Distinct Borders"],
      needs_review: false,
      wt_volume_ml: 22.4,
      status: "analyzed",
    },
    {
      study_id: "c13-small-meningioma-uuid",
      patient_code: "PT-12490",
      acquired_at: "2026-09-17 14:00",
      tumour_type: "Meningioma",
      is_malignant: false,
      urgency_score: 0.22,
      badges: ["Incidental Finding", "Small Size (4.2 mL)", "Zero Edema"],
      needs_review: false,
      wt_volume_ml: 4.2,
      status: "analyzed",
    },
    {
      study_id: "542e88cc-f1aa-4712-88ef-bc2100aa7789",
      patient_code: "PT-20941",
      acquired_at: "2026-09-19 09:20",
      tumour_type: "Pituitary",
      is_malignant: false,
      urgency_score: 0.35,
      badges: ["Sellar Region", "Non-infiltrative Base"],
      needs_review: false,
      wt_volume_ml: 8.4,
      status: "analyzed",
    },
    {
      study_id: "c08-schwannoma-uuid",
      patient_code: "PT-39102",
      acquired_at: "2026-09-16 11:15",
      tumour_type: "Schwannoma",
      is_malignant: false,
      urgency_score: 0.38,
      badges: ["Acoustic Neuroma", "Cerebellopontine Angle"],
      needs_review: false,
      wt_volume_ml: 6.1,
      status: "analyzed",
    },
    {
      study_id: "c10-neurocytoma-uuid",
      patient_code: "PT-84019",
      acquired_at: "2026-09-15 13:50",
      tumour_type: "Neurocytoma",
      is_malignant: false,
      urgency_score: 0.40,
      badges: ["Intraventricular", "Well Circumscribed"],
      needs_review: false,
      wt_volume_ml: 9.3,
      status: "analyzed",
    },
    {
      study_id: "c05-long-base-uuid",
      patient_code: "PT-50119-M0",
      acquired_at: "2026-06-10 10:00",
      tumour_type: "Glioblastoma",
      is_malignant: true,
      urgency_score: 0.72,
      badges: ["Pre-Op Baseline", "Active ET Rim"],
      needs_review: false,
      wt_volume_ml: 38.6,
      status: "analyzed",
    },
    {
      study_id: "c05-long-followup-uuid",
      patient_code: "PT-50119-M3",
      acquired_at: "2026-09-10 10:00",
      tumour_type: "Glioblastoma",
      is_malignant: true,
      urgency_score: 0.42,
      badges: ["Post-Op Follow-up", "Partial Response (-50% Shrinkage)"],
      needs_review: false,
      wt_volume_ml: 12.8,
      status: "analyzed",
    },
    {
      study_id: "c15-healthy-control-uuid",
      patient_code: "PT-00001",
      acquired_at: "2026-09-21 07:45",
      tumour_type: "No Tumour",
      is_malignant: false,
      urgency_score: 0.05,
      badges: ["Healthy Control", "Zero Lesions (0 mL)", "Passed QC"],
      needs_review: false,
      wt_volume_ml: 0.0,
      status: "analyzed",
    },
  ];

  // Filtering
  const filtered = studies.filter((item) => {
    if (filterType !== "all" && item.tumour_type.toLowerCase() !== filterType.toLowerCase()) return false;
    if (filterMalignancy === "malignant" && !item.is_malignant) return false;
    if (filterMalignancy === "benign" && item.is_malignant) return false;
    if (filterNeedsReview && !item.needs_review) return false;
    if (searchCode && !item.patient_code.toLowerCase().includes(searchCode.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ListFilter className="w-6 h-6 text-purple-600" />
            Patient Scan Worklist
          </h1>
          <p className="text-xs text-slate-500">
            Cases are automatically sorted by clinical urgency, tumour size, and brain pressure effects.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/info"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs transition shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>Guide to Terms</span>
          </Link>
          <Link
            href="/studies/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New Scan</span>
          </Link>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200 text-xs shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search Patient ID..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 w-44 text-xs font-mono"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-purple-600"
          >
            <option value="all">All Tumour Types</option>
            <option value="glioma">Glioma</option>
            <option value="meningioma">Meningioma</option>
            <option value="pituitary">Pituitary</option>
            <option value="metastasis">Metastasis</option>
          </select>

          {/* Malignancy Filter */}
          <select
            value={filterMalignancy}
            onChange={(e) => setFilterMalignancy(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-purple-600"
          >
            <option value="all">All (Benign & Malignant)</option>
            <option value="benign">Benign Only (Non-Cancerous)</option>
            <option value="malignant">Malignant Only (Cancerous)</option>
          </select>
        </div>

        {/* Needs Review Filter Toggle */}
        <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
          <input
            type="checkbox"
            checked={filterNeedsReview}
            onChange={(e) => setFilterNeedsReview(e.target.checked)}
            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
          />
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            Only Cases Flagged for Review
          </span>
        </label>
      </div>

      {/* Triage Worklist Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden text-xs shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-[11px] font-semibold">
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Scan Date</th>
                <th className="py-3 px-4">Tumour Type & Nature</th>
                <th className="py-3 px-4">Size (mL)</th>
                <th className="py-3 px-4">Key Highlights</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.study_id} className="hover:bg-slate-50 transition">
                  {/* Priority */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-center font-bold text-xs border ${
                          item.urgency_score > 0.75
                            ? "bg-red-100 border-red-300 text-red-800"
                            : item.urgency_score > 0.5
                            ? "bg-amber-100 border-amber-300 text-amber-800"
                            : "bg-emerald-100 border-emerald-300 text-emerald-800"
                        }`}
                      >
                        {item.urgency_score > 0.75 ? "High" : item.urgency_score > 0.5 ? "Medium" : "Routine"}
                      </span>
                      {item.needs_review && (
                        <span title="Doctor review advised">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Patient */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {item.patient_code}
                  </td>

                  {/* Acquired */}
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {item.acquired_at}
                  </td>

                  {/* Tumour Prediction with Benign/Malignant Tag */}
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-900 capitalize">
                        {item.tumour_type}
                      </span>
                      <span
                        className={`inline-block px-2 py-0.2 rounded-full text-[10px] font-bold border w-fit ${
                          item.is_malignant
                            ? "bg-red-50 border-red-200 text-red-700"
                            : "bg-emerald-50 border-emerald-200 text-emerald-700"
                        }`}
                      >
                        {item.is_malignant ? "Malignant (Cancerous)" : "Benign (Non-Cancerous)"}
                      </span>
                    </div>
                  </td>

                  {/* WT Volume */}
                  <td className="py-3 px-4 font-mono text-slate-900 font-bold">
                    {item.wt_volume_ml.toFixed(1)} mL
                  </td>

                  {/* Badges */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {item.badges.map((b, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-medium"
                        >
                          {b}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={`/studies/${item.study_id}`}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 font-semibold transition text-xs border border-purple-200"
                    >
                      <span>Open Workspace</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
