"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ListFilter,
  Search,
  AlertTriangle,
  Flame,
  CircleDot,
  ArrowUpDown,
  Upload,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

interface WorklistItem {
  study_id: string;
  patient_code: string;
  acquired_at: string;
  tumour_type: string;
  urgency_score: number;
  badges: string[];
  needs_review: boolean;
  wt_volume_ml: number;
  status: "analyzed" | "analyzing" | "uploaded";
}

export default function WorklistPage() {
  const [filterType, setFilterType] = useState<string>("all");
  const [filterNeedsReview, setFilterNeedsReview] = useState<boolean>(false);
  const [searchCode, setSearchCode] = useState<string>("");

  // Sample prioritized triage worklist
  const studies: WorklistItem[] = [
    {
      study_id: "856c7e19-a1ae-4298-94f5-d4ad0bdc6072",
      patient_code: "PT-70194",
      acquired_at: "2026-09-20 14:10",
      tumour_type: "glioma",
      urgency_score: 0.88,
      badges: ["Mass Effect (>3mm)", "Large WT (>40mL)", "Multifocal"],
      needs_review: true,
      wt_volume_ml: 46.8,
      status: "analyzed",
    },
    {
      study_id: "721a9c31-b0fe-4192-811d-e5cf01ad2381",
      patient_code: "PT-48210",
      acquired_at: "2026-09-20 11:35",
      tumour_type: "meningioma",
      urgency_score: 0.62,
      badges: ["High Contrast Rim"],
      needs_review: false,
      wt_volume_ml: 22.4,
      status: "analyzed",
    },
    {
      study_id: "331d2b99-a9fe-4411-921c-a1bd99cd1044",
      patient_code: "PT-90114",
      acquired_at: "2026-09-19 16:50",
      tumour_type: "metastasis",
      urgency_score: 0.79,
      badges: ["Multifocal (3 lesions)", "Rapid Growth"],
      needs_review: true,
      wt_volume_ml: 31.0,
      status: "analyzed",
    },
    {
      study_id: "542e88cc-f1aa-4712-88ef-bc2100aa7789",
      patient_code: "PT-20941",
      acquired_at: "2026-09-19 09:20",
      tumour_type: "pituitary",
      urgency_score: 0.35,
      badges: ["Stable", "Non-infiltrative"],
      needs_review: false,
      wt_volume_ml: 8.4,
      status: "analyzed",
    },
  ];

  // Filtering
  const filtered = studies.filter((item) => {
    if (filterType !== "all" && item.tumour_type !== filterType) return false;
    if (filterNeedsReview && !item.needs_review) return false;
    if (searchCode && !item.patient_code.toLowerCase().includes(searchCode.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ListFilter className="w-6 h-6 text-cyan-400" />
            Radiology Triage Worklist
          </h1>
          <p className="text-xs text-slate-400">
            Cases prioritized by Decision-Tree AI urgency scores, volumetric load, and mass effect.
          </p>
        </div>

        <Link
          href="/studies/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Study</span>
        </Link>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-clinical-surface border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search Patient Code..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48 text-xs font-mono"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Tumour Types</option>
            <option value="glioma">Glioma</option>
            <option value="meningioma">Meningioma</option>
            <option value="pituitary">Pituitary</option>
            <option value="metastasis">Metastasis</option>
          </select>
        </div>

        {/* Needs Review Filter Toggle */}
        <label className="flex items-center gap-2 cursor-pointer text-slate-300">
          <input
            type="checkbox"
            checked={filterNeedsReview}
            onChange={(e) => setFilterNeedsReview(e.target.checked)}
            className="rounded border-slate-700 text-amber-500 focus:ring-0 bg-slate-900"
          />
          <span className="flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            Only Flagged for Human Review
          </span>
        </label>
      </div>

      {/* Triage Worklist Table */}
      <div className="rounded-xl border border-slate-800 bg-clinical-surface overflow-hidden text-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-[11px] font-medium">
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Patient Code</th>
                <th className="py-3 px-4">Acquired</th>
                <th className="py-3 px-4">Tumour Prediction</th>
                <th className="py-3 px-4">WT Vol (mL)</th>
                <th className="py-3 px-4">Clinical Badges</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((item) => (
                <tr key={item.study_id} className="hover:bg-slate-800/30 transition group">
                  {/* Urgency Rank */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-8 py-0.5 rounded text-center font-mono font-bold text-xs ${
                          item.urgency_score > 0.75
                            ? "bg-red-950/80 border border-red-800 text-red-300"
                            : item.urgency_score > 0.5
                            ? "bg-amber-950/80 border border-amber-800 text-amber-300"
                            : "bg-slate-900 border border-slate-800 text-slate-400"
                        }`}
                      >
                        {(item.urgency_score * 10).toFixed(1)}
                      </span>
                      {item.needs_review && (
                        <span title="Needs Clinical Review">
                          <AlertTriangle className="w-4 h-4 text-amber-400 animate-pulse" />
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Patient */}
                  <td className="py-3 px-4 font-mono font-bold text-slate-200">
                    {item.patient_code}
                  </td>

                  {/* Acquired */}
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {item.acquired_at}
                  </td>

                  {/* Tumour Prediction */}
                  <td className="py-3 px-4">
                    <span className="capitalize px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700 font-medium">
                      {item.tumour_type}
                    </span>
                  </td>

                  {/* WT Volume */}
                  <td className="py-3 px-4 font-mono text-slate-200 font-semibold">
                    {item.wt_volume_ml.toFixed(1)}
                  </td>

                  {/* Badges */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {item.badges.map((b, i) => (
                        <span
                          key={i}
                          className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300"
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
                      className="inline-flex items-center gap-1 px-3 py-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 font-medium transition text-xs border border-slate-700"
                    >
                      <span>Open Study</span>
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
