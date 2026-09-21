"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { User, Calendar, TrendingUp, Layers, ChevronRight, ArrowUpRight } from "lucide-react";

export default function PatientTimelinePage() {
  const params = useParams();
  const patientId = (params.id as string) || "PT-DEMO-01";

  // Longitudinal study timeline history
  const timeline = [
    {
      study_id: "856c7e19-a1ae-4298-94f5-d4ad0bdc6072",
      date: "2026-09-20",
      scan_type: "Post-Op Follow-up #2",
      wt_ml: 46.8,
      tc_ml: 25.3,
      et_ml: 16.1,
      response: "Progression (+21%)",
      is_baseline: false,
    },
    {
      study_id: "441b8c22-b0fe-4112-911d-e5cf01ad2381",
      date: "2026-05-14",
      scan_type: "Post-Op Follow-up #1",
      wt_ml: 38.6,
      tc_ml: 19.4,
      et_ml: 11.2,
      response: "Partial Response",
      is_baseline: false,
    },
    {
      study_id: "119d2b99-a9fe-4411-921c-a1bd99cd1044",
      date: "2026-01-10",
      scan_type: "Pre-Surgical Baseline",
      wt_ml: 54.2,
      tc_ml: 32.1,
      et_ml: 24.5,
      response: "Baseline",
      is_baseline: true,
    },
  ];

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-6">
      {/* Patient Header Card */}
      <div className="rounded-xl border border-slate-800 bg-clinical-surface p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white font-mono">{patientId}</h1>
            <p className="text-xs text-slate-400">
              Male, 54 yrs • IDH1-Wildtype Glioblastoma Protocol
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/studies/${timeline[0].study_id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20"
          >
            <span>Latest Scan Analysis</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Volumetric Trend Visualization */}
      <div className="rounded-xl border border-slate-800 bg-clinical-surface p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-cyan-400" />
            Longitudinal Tumour Volume Trend (mL)
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">3 Longitudinal Studies</span>
        </div>

        {/* Visual Trend Bars */}
        <div className="space-y-4 pt-2">
          {timeline.map((scan) => (
            <div key={scan.study_id} className="space-y-1 text-xs">
              <div className="flex justify-between items-center text-slate-300">
                <span className="font-mono font-medium">
                  {scan.date} • {scan.scan_type}
                </span>
                <span className="font-mono font-bold text-slate-100">
                  WT: {scan.wt_ml} mL (ET: {scan.et_ml} mL)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 flex overflow-hidden">
                <div
                  className="h-full bg-tumour-et"
                  style={{ width: `${(scan.et_ml / 60) * 100}%` }}
                  title={`Enhancing: ${scan.et_ml} mL`}
                />
                <div
                  className="h-full bg-tumour-ncr"
                  style={{ width: `${((scan.tc_ml - scan.et_ml) / 60) * 100}%` }}
                  title="Necrotic Core"
                />
                <div
                  className="h-full bg-tumour-ed"
                  style={{ width: `${((scan.wt_ml - scan.tc_ml) / 60) * 100}%` }}
                  title="Edema"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-tumour-et" />
            <span>Enhancing (ET)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-tumour-ncr" />
            <span>Necrotic (NCR)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-tumour-ed" />
            <span>Edema (ED)</span>
          </div>
        </div>
      </div>

      {/* Studies History Table */}
      <div className="rounded-xl border border-slate-800 bg-clinical-surface overflow-hidden text-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60 text-slate-400 text-[11px]">
              <th className="py-3 px-4">Study Date</th>
              <th className="py-3 px-4">Description</th>
              <th className="py-3 px-4">RANO Response</th>
              <th className="py-3 px-4">WT Vol</th>
              <th className="py-3 px-4 text-right">Workspace</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {timeline.map((s) => (
              <tr key={s.study_id} className="hover:bg-slate-800/30 transition">
                <td className="py-3 px-4 font-mono text-slate-200">{s.date}</td>
                <td className="py-3 px-4 text-slate-300">{s.scan_type}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                      s.response.includes("Progression")
                        ? "bg-red-950/80 border border-red-800 text-red-300"
                        : s.response.includes("Partial")
                        ? "bg-emerald-950/80 border border-emerald-800 text-emerald-300"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {s.response}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-slate-100 font-bold">{s.wt_ml} mL</td>
                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/studies/${s.study_id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] border border-slate-700"
                  >
                    <span>View Study</span>
                    <ChevronRight className="w-3 h-3" />
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
