"use client";

import React from "react";
import { CheckCircle2, AlertTriangle, Cpu, Brain, GitMerge, HelpCircle } from "lucide-react";
import Link from "next/link";
import { ClassificationResult } from "../lib/types/analysis";

interface ClassificationCardProps {
  classification: ClassificationResult;
}

export function ClassificationCard({ classification }: ClassificationCardProps) {
  const { cnn, classical, ensemble } = classification;

  // Determine malignancy based on clinical consensus
  // Glioma & Metastasis = Malignant (Cancerous)
  // Meningioma & Pituitary = Benign (Non-Cancerous)
  const isMalignant =
    ensemble.label.toLowerCase() === "glioma" ||
    ensemble.label.toLowerCase() === "metastasis";

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4 shadow-sm text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <GitMerge className="w-4 h-4 text-purple-600" />
          AI Tumour Type & Nature
        </h3>
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
            ensemble.agree
              ? "bg-emerald-50 border-emerald-300 text-emerald-800"
              : "bg-red-50 border-red-300 text-red-800"
          }`}
        >
          {ensemble.agree ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Both AI Models Agree
            </>
          ) : (
            <>
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              Models Disagree (Check Scan)
            </>
          )}
        </span>
      </div>

      {/* Prominent Malignancy Status Banner (Green if Benign, Red if Malignant) */}
      <div
        className={`p-3.5 rounded-xl border flex items-start justify-between gap-3 ${
          isMalignant
            ? "bg-red-50/80 border-red-200 text-red-900"
            : "bg-emerald-50/80 border-emerald-200 text-emerald-900"
        }`}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                isMalignant
                  ? "bg-red-100 border-red-300 text-red-800"
                  : "bg-emerald-100 border-emerald-300 text-emerald-800"
              }`}
            >
              {isMalignant ? "Malignant (Cancerous)" : "Benign (Non-Cancerous)"}
            </span>
            <span className="text-xs text-slate-600">•</span>
            <Link
              href="/info"
              className="text-xs font-semibold text-purple-700 hover:underline inline-flex items-center gap-1"
            >
              What does this mean?
              <HelpCircle className="w-3 h-3" />
            </Link>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed pt-0.5">
            {isMalignant
              ? "This tumour is classified as cancerous and aggressive. It has infiltrative properties that invade brain tissue, requiring active medical treatment."
              : "This tumour is classified as non-cancerous and slow-growing. It usually remains well-defined and does not spread across other bodily organs."}
          </p>
        </div>
      </div>

      {/* Final AI Recommendation Callout */}
      <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-200 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-purple-800 tracking-wider block">
            Final AI Recommendation
          </span>
          <span className="text-2xl font-extrabold text-slate-900 capitalize tracking-tight">
            {ensemble.label}
          </span>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">
            Confidence / Certainty
          </span>
          <span className="text-xl font-bold font-mono text-purple-700">
            {(ensemble.confidence * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Side-by-Side: Visual AI vs Texture & Shape AI */}
      <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
        {/* CNN */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-1.5 text-blue-700 font-semibold text-[11px]">
            <Brain className="w-3.5 h-3.5" />
            <span>Visual AI (Deep CNN)</span>
          </div>
          <div className="font-bold text-slate-900 capitalize text-sm">
            {cnn.label}
          </div>
          <div className="space-y-1 text-[11px] text-slate-600">
            {Object.entries(cnn.probs).map(([cls, p]) => (
              <div key={cls} className="flex justify-between items-center">
                <span className="capitalize">{cls}:</span>
                <span className="font-mono text-slate-900 font-medium">{(p * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Classical */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 space-y-2">
          <div className="flex items-center gap-1.5 text-purple-700 font-semibold text-[11px]">
            <Cpu className="w-3.5 h-3.5" />
            <span>Texture & Shape AI ({classical.model || "SVM"})</span>
          </div>
          <div className="font-bold text-slate-900 capitalize text-sm">
            {classical.label}
          </div>
          <div className="space-y-1 text-[11px] text-slate-600">
            {Object.entries(classical.probs).map(([cls, p]) => (
              <div key={cls} className="flex justify-between items-center">
                <span className="capitalize">{cls}:</span>
                <span className="font-mono text-slate-900 font-medium">{(p * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
