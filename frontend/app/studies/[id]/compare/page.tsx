"use client";

import React from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { GitCompare, TrendingUp, AlertTriangle, ArrowLeft, CheckCircle } from "lucide-react";

export default function CompareStudyPage() {
  const params = useParams();
  const studyId = (params.id as string) || "demo-study-uuid";

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full p-6 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/studies/${studyId}`}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-purple-400" />
              Longitudinal Comparison & RANO Assessment
            </h1>
            <p className="text-xs text-slate-400">
              Co-registered Baseline vs Follow-up MRI Study
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-red-950/80 border border-red-800 text-red-300 text-xs font-bold">
          RANO: Progressive Disease (PD)
        </span>
      </div>

      {/* RANO Criteria Summary Card */}
      <div className="rounded-xl border border-red-900/60 bg-gradient-to-r from-red-950/40 via-clinical-surface to-red-950/40 p-5 space-y-3 text-xs shadow-xl">
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm text-red-400 uppercase tracking-wide">
            Automated RANO-Style Response Suggestion
          </span>
          <span className="text-[11px] text-slate-400 italic">
            Rule-based suggestion — Requires radiologist sign-off
          </span>
        </div>
        <p className="text-slate-300 leading-relaxed text-xs">
          Comparing follow-up scan against baseline registered volume. Whole tumour bidimensional product increased by{" "}
          <strong className="text-red-300 font-mono">+28.4%</strong> (threshold: &ge; 25% for Progression). Enhancing volume (ET) increased by{" "}
          <strong className="text-red-300 font-mono">+4.9 mL</strong>. No new distant lesions detected.
        </p>
      </div>

      {/* Side-by-Side Volume Delta Table */}
      <div className="rounded-xl border border-slate-800 bg-clinical-surface p-5 space-y-4 text-xs">
        <h2 className="text-sm font-semibold text-slate-200">Volumetric Change Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                <th className="py-2">Region</th>
                <th className="py-2 text-right">Baseline (mL)</th>
                <th className="py-2 text-right">Follow-up (mL)</th>
                <th className="py-2 text-right">Delta (&Delta; mL)</th>
                <th className="py-2 text-right">Change (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 font-sans font-medium text-purple-400">Whole Tumour (WT)</td>
                <td className="py-2.5 text-right text-slate-300">38.6</td>
                <td className="py-2.5 text-right text-slate-100 font-bold">46.8</td>
                <td className="py-2.5 text-right text-red-400 font-bold">+8.2</td>
                <td className="py-2.5 text-right text-red-400 font-bold">+21.2%</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 font-sans font-medium text-orange-400">Tumour Core (TC)</td>
                <td className="py-2.5 text-right text-slate-300">19.4</td>
                <td className="py-2.5 text-right text-slate-100 font-bold">25.3</td>
                <td className="py-2.5 text-right text-red-400 font-bold">+5.9</td>
                <td className="py-2.5 text-right text-red-400 font-bold">+30.4%</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 font-sans font-medium text-cyan-400">Enhancing (ET)</td>
                <td className="py-2.5 text-right text-slate-300">11.2</td>
                <td className="py-2.5 text-right text-slate-100 font-bold">16.1</td>
                <td className="py-2.5 text-right text-red-400 font-bold">+4.9</td>
                <td className="py-2.5 text-right text-red-400 font-bold">+43.8%</td>
              </tr>
              <tr className="hover:bg-slate-800/30">
                <td className="py-2.5 font-sans font-medium text-yellow-400">Edema (ED)</td>
                <td className="py-2.5 text-right text-slate-300">19.2</td>
                <td className="py-2.5 text-right text-slate-100 font-bold">21.5</td>
                <td className="py-2.5 text-right text-amber-400">+2.3</td>
                <td className="py-2.5 text-right text-amber-400">+12.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
