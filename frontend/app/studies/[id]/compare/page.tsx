"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { GitCompare, ArrowLeft, AlertTriangle, CheckCircle2 } from "lucide-react";
import { getPatientProfile, PatientProfile } from "@/lib/patientCatalog";

export default function CompareStudyPage() {
  const params = useParams();
  const studyId = (params.id as string) || "856c7e19-a1ae-4298-94f5-d4ad0bdc6072";

  const [profile, setProfile] = useState<PatientProfile>(() => getPatientProfile(studyId));

  useEffect(() => {
    setProfile(getPatientProfile(studyId));
  }, [studyId]);

  const long = profile.longitudinal;
  const wtDelta = long.latestWT - long.earlierWT;
  const tcDelta = long.latestTC - long.earlierTC;
  const etDelta = long.latestET - long.earlierET;
  const edDelta = long.latestED - long.earlierED;

  const pct = (delta: number, base: number) => {
    if (base === 0) return delta === 0 ? "0.0%" : "+100%";
    const p = (delta / base) * 100;
    return `${p >= 0 ? "+" : ""}${p.toFixed(1)}%`;
  };

  return (
    <div className="flex-1 max-w-5xl mx-auto w-full p-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/studies/${studyId}`}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-purple-600" />
              Compare Scan With Previous Visit (Longitudinal)
            </h1>
            <p className="text-xs text-slate-500">
              Patient: {profile.code} • {profile.scenarioName} • Tracking volumetric tumor progression or therapy response.
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full border text-xs font-bold flex items-center gap-1.5 ${
            long.isGrowth
              ? "bg-red-100 border-red-300 text-red-800"
              : long.deltaPercent < -10
              ? "bg-emerald-100 border-emerald-300 text-emerald-800"
              : "bg-purple-100 border-purple-300 text-purple-800"
          }`}
        >
          {long.isGrowth ? (
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          )}
          {long.status} ({long.deltaPercent >= 0 ? "+" : ""}{long.deltaPercent.toFixed(1)}%)
        </span>
      </div>

      {/* Summary Card */}
      <div
        className={`rounded-xl border p-6 space-y-3 text-xs shadow-xs ${
          long.isGrowth
            ? "border-red-200 bg-red-50/50 text-slate-900"
            : "border-slate-200 bg-slate-50 text-slate-900"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`font-bold text-sm uppercase tracking-wide ${long.isGrowth ? "text-red-800" : "text-purple-700"}`}>
            What Changed Since The Earlier Scan?
          </span>
          <span className="text-[11px] text-slate-600 italic">
            Automated RANO Criteria Check • Radiologist Review Required
          </span>
        </div>
        <p className="text-slate-700 leading-relaxed text-xs">
          {long.summaryText}
        </p>
      </div>

      {/* Side-by-Side Volume Delta Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 text-xs shadow-sm">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-900">
            Detailed Size Comparison by Tumour Zone for {profile.code}
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            Baseline: {long.baselineDate} ➔ Latest: {long.followupDate}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-[11px]">
                <th className="py-2.5 px-3 font-semibold">Tumour Zone</th>
                <th className="py-2.5 px-3 text-right font-semibold">Earlier Scan (mL)</th>
                <th className="py-2.5 px-3 text-right font-semibold">Latest Scan (mL)</th>
                <th className="py-2.5 px-3 text-right font-semibold">Size Difference (mL)</th>
                <th className="py-2.5 px-3 text-right font-semibold">Change (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              <tr className="hover:bg-slate-50 transition">
                <td className="py-3 px-3 font-sans font-bold text-slate-900">Whole Tumour (WT)</td>
                <td className="py-3 px-3 text-right text-slate-600">{long.earlierWT.toFixed(1)}</td>
                <td className="py-3 px-3 text-right text-slate-900 font-bold">{long.latestWT.toFixed(1)}</td>
                <td className={`py-3 px-3 text-right font-bold ${wtDelta > 0 ? "text-red-600" : wtDelta < 0 ? "text-emerald-600" : "text-slate-600"}`}>
                  {wtDelta >= 0 ? "+" : ""}{wtDelta.toFixed(1)}
                </td>
                <td className={`py-3 px-3 text-right font-bold ${wtDelta > 0 ? "text-red-600" : wtDelta < 0 ? "text-emerald-600" : "text-slate-600"}`}>
                  {pct(wtDelta, long.earlierWT)}
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="py-3 px-3 font-sans font-medium text-slate-800">Tumour Core (TC)</td>
                <td className="py-3 px-3 text-right text-slate-600">{long.earlierTC.toFixed(1)}</td>
                <td className="py-3 px-3 text-right text-slate-900 font-bold">{long.latestTC.toFixed(1)}</td>
                <td className={`py-3 px-3 text-right font-bold ${tcDelta > 0 ? "text-red-600" : tcDelta < 0 ? "text-emerald-600" : "text-slate-600"}`}>
                  {tcDelta >= 0 ? "+" : ""}{tcDelta.toFixed(1)}
                </td>
                <td className={`py-3 px-3 text-right font-bold ${tcDelta > 0 ? "text-red-600" : tcDelta < 0 ? "text-emerald-600" : "text-slate-600"}`}>
                  {pct(tcDelta, long.earlierTC)}
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="py-3 px-3 font-sans font-medium text-slate-800">Active Rim (ET)</td>
                <td className="py-3 px-3 text-right text-slate-600">{long.earlierET.toFixed(1)}</td>
                <td className="py-3 px-3 text-right text-slate-900 font-bold">{long.latestET.toFixed(1)}</td>
                <td className={`py-3 px-3 text-right font-bold ${etDelta > 0 ? "text-red-600" : etDelta < 0 ? "text-emerald-600" : "text-slate-600"}`}>
                  {etDelta >= 0 ? "+" : ""}{etDelta.toFixed(1)}
                </td>
                <td className={`py-3 px-3 text-right font-bold ${etDelta > 0 ? "text-red-600" : etDelta < 0 ? "text-emerald-600" : "text-slate-600"}`}>
                  {pct(etDelta, long.earlierET)}
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="py-3 px-3 font-sans font-medium text-slate-800">Brain Swelling (ED)</td>
                <td className="py-3 px-3 text-right text-slate-600">{long.earlierED.toFixed(1)}</td>
                <td className="py-3 px-3 text-right text-slate-900 font-bold">{long.latestED.toFixed(1)}</td>
                <td className={`py-3 px-3 text-right font-bold ${edDelta > 0 ? "text-amber-600" : edDelta < 0 ? "text-emerald-600" : "text-slate-600"}`}>
                  {edDelta >= 0 ? "+" : ""}{edDelta.toFixed(1)}
                </td>
                <td className={`py-3 px-3 text-right font-bold ${edDelta > 0 ? "text-amber-600" : edDelta < 0 ? "text-emerald-600" : "text-slate-600"}`}>
                  {pct(edDelta, long.earlierED)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
