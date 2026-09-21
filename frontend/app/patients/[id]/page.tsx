"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { User, TrendingUp, ChevronRight, ArrowUpRight, BarChart3 } from "lucide-react";
import { getPatientProfile, PatientProfile } from "@/lib/patientCatalog";

export default function PatientTimelinePage() {
  const params = useParams();
  const patientId = (params.id as string) || "PT-70194";

  const [profile, setProfile] = useState<PatientProfile>(() => getPatientProfile(patientId));

  useEffect(() => {
    setProfile(getPatientProfile(patientId));
  }, [patientId]);

  const timeline = profile.timeline;

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-6">
      {/* Patient Header Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-sm">
            <User className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 font-mono">{profile.code}</h1>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  profile.isMalignant
                    ? "bg-red-100 border-red-300 text-red-800"
                    : "bg-emerald-100 border-emerald-300 text-emerald-800"
                }`}
              >
                {profile.isMalignant ? "Malignant" : "Benign"}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {profile.sex}, {profile.age} yrs • {profile.tumourType} Protocol ({profile.scenarioName})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/insights?studyId=${profile.id}`}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-medium text-xs transition shadow-xs"
          >
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span>AI Insights</span>
          </Link>
          <Link
            href={`/studies/${profile.id}`}
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
          <span className="text-[11px] text-slate-500 font-mono">
            {timeline.length} Scan{timeline.length === 1 ? "" : "s"} on Record
          </span>
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
                  style={{ width: `${Math.min(100, (scan.et_ml / 60) * 100)}%` }}
                  title={`Active Growing Rim: ${scan.et_ml} mL`}
                />
                <div
                  className="h-full bg-red-600"
                  style={{ width: `${Math.min(100, (Math.max(0, scan.tc_ml - scan.et_ml) / 60) * 100)}%` }}
                  title="Necrotic Dead Center"
                />
                <div
                  className="h-full bg-amber-500"
                  style={{ width: `${Math.min(100, (Math.max(0, scan.wt_ml - scan.tc_ml) / 60) * 100)}%` }}
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
