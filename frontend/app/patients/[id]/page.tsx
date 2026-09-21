"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { User, TrendingUp, ChevronRight, ArrowUpRight } from "lucide-react";

export default function PatientTimelinePage() {
  const params = useParams();
  const patientId = (params.id as string) || "PT-DEMO-01";

  // Longitudinal study timeline history
  const timeline = [
    {
      study_id: "856c7e19-a1ae-4298-94f5-d4ad0bdc6072",
      date: "2026-09-20",
      scan_type: "Post-Treatment Follow-up #2",
      wt_ml: 46.8,
      tc_ml: 25.3,
      et_ml: 16.1,
      response: "Tumour Growth (+21%)",
      is_progression: true,
    },
    {
      study_id: "441b8c22-b0fe-4112-911d-e5cf01ad2381",
      date: "2026-05-14",
      scan_type: "Post-Treatment Follow-up #1",
      wt_ml: 38.6,
      tc_ml: 19.4,
      et_ml: 11.2,
      response: "Tumour Shrinkage (-29%)",
      is_progression: false,
    },
    {
      study_id: "119d2b99-a9fe-4411-921c-a1bd99cd1044",
      date: "2026-01-10",
      scan_type: "Initial Baseline Scan",
      wt_ml: 54.2,
      tc_ml: 32.1,
      et_ml: 24.5,
      response: "Initial Baseline",
      is_progression: false,
    },
  ];

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-6">
      {/* Patient Header Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 font-mono">{patientId}</h1>
            <p className="text-xs text-slate-500">
              Male, 54 yrs • Glioblastoma Protocol (Malignant Brain Tumour)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/studies/${timeline[0].study_id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition shadow-sm"
          >
            <span>View Latest Scan</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Volumetric Trend Visualization */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            Tumour Size History Over Time (mL)
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">3 Scans on Record</span>
        </div>

        {/* Visual Trend Bars */}
        <div className="space-y-4 pt-2">
          {timeline.map((scan) => (
            <div key={scan.study_id} className="space-y-1 text-xs">
              <div className="flex justify-between items-center text-slate-700">
                <span className="font-semibold">
                  {scan.date} • {scan.scan_type}
                </span>
                <span className="font-mono font-bold text-slate-900">
                  Total Size: {scan.wt_ml} mL (Active Rim: {scan.et_ml} mL)
                </span>
              </div>
              <div className="w-full h-3.5 rounded-full bg-slate-100 border border-slate-200 flex overflow-hidden">
                <div
                  className="h-full bg-blue-600"
                  style={{ width: `${(scan.et_ml / 60) * 100}%` }}
                  title={`Active Growing Rim: ${scan.et_ml} mL`}
                />
                <div
                  className="h-full bg-red-600"
                  style={{ width: `${((scan.tc_ml - scan.et_ml) / 60) * 100}%` }}
                  title="Necrotic Dead Center"
                />
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${((scan.wt_ml - scan.tc_ml) / 60) * 100}%` }}
                  title="Brain Swelling"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-slate-600 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            <span>Active Rim (ET)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
            <span>Dead Center (NCR)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span>Brain Swelling (ED)</span>
          </div>
        </div>
      </div>

      {/* Studies History Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden text-xs shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-[11px] font-semibold">
              <th className="py-3 px-4">Scan Date</th>
              <th className="py-3 px-4">Scan Type</th>
              <th className="py-3 px-4">Result / Response</th>
              <th className="py-3 px-4">Total Tumour Size</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {timeline.map((s) => (
              <tr key={s.study_id} className="hover:bg-slate-50 transition">
                <td className="py-3 px-4 font-mono font-medium text-slate-900">{s.date}</td>
                <td className="py-3 px-4 text-slate-700">{s.scan_type}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                      s.is_progression
                        ? "bg-red-100 border-red-300 text-red-800"
                        : s.response.includes("Shrinkage")
                        ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                        : "bg-slate-100 border-slate-200 text-slate-700"
                    }`}
                  >
                    {s.response}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-900 font-bold">{s.wt_ml} mL</td>
                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/studies/${s.study_id}`}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 font-medium text-xs border border-purple-200 transition"
                  >
                    <span>Open Scan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
