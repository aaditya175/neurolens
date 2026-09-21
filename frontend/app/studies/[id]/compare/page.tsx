"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { GitCompare, ArrowLeft, AlertTriangle } from "lucide-react";

export default function CompareStudyPage() {
  const params = useParams();
  const studyId = (params.id as string) || "demo-study-uuid";

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
              Checking whether the tumour has grown, stayed the same, or shrunk since the earlier MRI.
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-800 text-xs font-bold flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
          Tumour Growth Detected (+21.2%)
        </span>
      </div>

      {/* Summary Card */}
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 space-y-3 text-xs shadow-xs text-slate-900">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm text-red-800 uppercase tracking-wide">
            What Changed Since The Last Scan?
          </span>
          <span className="text-[11px] text-slate-600 italic">
            Automated RANO Criteria Check • Radiologist Review Required
          </span>
        </div>
        <p className="text-slate-700 leading-relaxed text-xs">
          The total tumour volume (Whole Tumour) increased from <strong>38.6 mL</strong> to <strong>46.8 mL</strong> (<span className="text-red-700 font-bold font-mono">+21.2%</span>). In addition, the actively growing cancerous rim (ET) increased by <span className="text-red-700 font-bold font-mono">+4.9 mL (+43.8%)</span>. In medical terms, this indicates <strong>Progressive Disease (PD)</strong>.
        </p>
      </div>

      {/* Side-by-Side Volume Delta Table */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 text-xs shadow-sm">
        <h2 className="text-sm font-bold text-slate-900">Detailed Size Comparison by Tumour Zone</h2>
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
                <td className="py-3 px-3 text-right text-slate-600">38.6</td>
                <td className="py-3 px-3 text-right text-slate-900 font-bold">46.8</td>
                <td className="py-3 px-3 text-right text-red-600 font-bold">+8.2</td>
                <td className="py-3 px-3 text-right text-red-600 font-bold">+21.2%</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="py-3 px-3 font-sans font-medium text-slate-800">Tumour Core (TC)</td>
                <td className="py-3 px-3 text-right text-slate-600">19.4</td>
                <td className="py-3 px-3 text-right text-slate-900 font-bold">25.3</td>
                <td className="py-3 px-3 text-right text-red-600 font-bold">+5.9</td>
                <td className="py-3 px-3 text-right text-red-600 font-bold">+30.4%</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="py-3 px-3 font-sans font-medium text-slate-800">Active Rim (ET)</td>
                <td className="py-3 px-3 text-right text-slate-600">11.2</td>
                <td className="py-3 px-3 text-right text-slate-900 font-bold">16.1</td>
                <td className="py-3 px-3 text-right text-red-600 font-bold">+4.9</td>
                <td className="py-3 px-3 text-right text-red-600 font-bold">+43.8%</td>
              </tr>
              <tr className="hover:bg-slate-50 transition">
                <td className="py-3 px-3 font-sans font-medium text-slate-800">Brain Swelling (ED)</td>
                <td className="py-3 px-3 text-right text-slate-600">19.2</td>
                <td className="py-3 px-3 text-right text-slate-900 font-bold">21.5</td>
                <td className="py-3 px-3 text-right text-amber-600 font-bold">+2.3</td>
                <td className="py-3 px-3 text-right text-amber-600 font-bold">+12.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
