"use client";

import React, { useState } from "react";
import { BarChart3, GitFork, BookOpen } from "lucide-react";
import Link from "next/link";

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<"pca" | "benchmarks" | "habitats">("pca");

  // Comparison table from Section 6.11 (Mumbai University ML Syllabus)
  const benchmarkModels = [
    { name: "Support Vector Machine (RBF)", type: "Machine Learning", acc: "88.4%", f1: "0.87", auroc: "0.94", role: "Texture & Shape Classifier" },
    { name: "Random Forest", type: "Ensemble Trees", acc: "87.1%", f1: "0.86", auroc: "0.93", role: "Identifies Key Scan Features" },
    { name: "AdaBoost", type: "Boosting Ensemble", acc: "84.6%", f1: "0.83", auroc: "0.90", role: "Adaptive Weighting Model" },
    { name: "Gradient Boosting", type: "Boosting Ensemble", acc: "86.8%", f1: "0.85", auroc: "0.92", role: "Non-linear Boundary Learner" },
    { name: "Stacking Meta-Learner", type: "Hybrid Stacking", acc: "89.2%", f1: "0.88", auroc: "0.95", role: "Combines Multiple Classifiers" },
    { name: "K-Nearest Neighbours (k=5)", type: "Similarity Matching", acc: "82.3%", f1: "0.81", auroc: "0.88", role: "Finds Similar Historical Scans" },
    { name: "Naive Bayes", type: "Probability Baseline", acc: "79.1%", f1: "0.78", auroc: "0.86", role: "Fast Probabilistic Check" },
    { name: "Decision Tree", type: "Rule Based", acc: "80.5%", f1: "0.79", auroc: "0.84", role: "Interpretable Urgency Rules" },
    { name: "Logistic Regression", type: "Linear Model", acc: "83.0%", f1: "0.82", auroc: "0.89", role: "Calibrated Baseline" },
    { name: "Deep 3D CNN (EfficientNet)", type: "Deep Learning", acc: "91.5%", f1: "0.91", auroc: "0.97", role: "Visual Pattern Recognition" },
    { name: "Dual Ensemble (Deep CNN + SVM)", type: "Combined Consensus", acc: "93.1%", f1: "0.93", auroc: "0.98", role: "Final AI Recommendation Head" },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            AI Insights & Accuracy Comparison
          </h1>
          <p className="text-xs text-slate-500">
            Evaluating machine learning and deep learning models on brain tumour MRI data (Mumbai University ML Syllabus).
          </p>
        </div>

        <Link
          href="/info"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs transition shadow-xs w-fit"
        >
          <BookOpen className="w-3.5 h-3.5 text-purple-600" />
          <span>Guide to Terms</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("pca")}
          className={`px-4 py-2 font-bold border-b-2 transition ${
            activeTab === "pca"
              ? "border-purple-600 text-purple-700 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          2D Tumour Comparison Map (PCA)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("benchmarks")}
          className={`px-4 py-2 font-bold border-b-2 transition ${
            activeTab === "benchmarks"
              ? "border-purple-600 text-purple-700 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          AI Model Comparison Table
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("habitats")}
          className={`px-4 py-2 font-bold border-b-2 transition ${
            activeTab === "habitats"
              ? "border-purple-600 text-purple-700 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Tumour Micro-Environments
        </button>
      </div>

      {/* Tab 1: PCA Scatter */}
      {activeTab === "pca" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center text-xs flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Where Does This Patient's Tumour Sit? (2D Texture & Shape Map)
              </h2>
              <p className="text-slate-500 text-[11px]">
                Reduces 107 complex 3D shape and texture features into an intuitive 2D map. Similar tumours cluster together.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span className="text-slate-700">Glioma (Malignant)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="text-slate-700">Meningioma (Benign)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-slate-700">Metastasis (Malignant)</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-purple-700">
                <span className="w-3 h-3 rounded-full bg-purple-600 animate-ping" />
                <span>Current Patient</span>
              </div>
            </div>
          </div>

          {/* SVG PCA Visualization (Light Theme) */}
          <div className="relative h-80 w-full rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            <svg className="w-full h-full p-8" viewBox="0 0 600 300">
              {/* Glioma cluster (left/mid) */}
              {[
                [140, 90], [160, 110], [180, 85], [195, 140], [210, 100], [230, 130],
                [170, 150], [150, 170], [220, 160], [240, 110], [200, 120]
              ].map(([x, y], i) => (
                <circle key={`g-${i}`} cx={x} cy={y} r={6} fill="#06B6D4" opacity={0.8} />
              ))}

              {/* Meningioma cluster (top right) */}
              {[
                [420, 60], [450, 80], [430, 100], [470, 70], [460, 110], [490, 85]
              ].map(([x, y], i) => (
                <circle key={`m-${i}`} cx={x} cy={y} r={6} fill="#EAB308" opacity={0.8} />
              ))}

              {/* Metastasis cluster (bottom right) */}
              {[
                [380, 220], [410, 240], [430, 210], [390, 250], [450, 230]
              ].map(([x, y], i) => (
                <circle key={`met-${i}`} cx={x} cy={y} r={6} fill="#EF4444" opacity={0.8} />
              ))}

              {/* Active Current Case Callout */}
              <circle cx={205} cy={125} r={9} fill="#9333EA" className="animate-pulse" />
              <circle cx={205} cy={125} r={16} fill="none" stroke="#9333EA" strokeWidth={2} opacity={0.5} />
              <text x={225} y={130} fill="#6B21A8" fontSize="12" fontWeight="bold" fontFamily="monospace">
                Current Case (PT-70194) — Inside Glioma Cluster
              </text>
            </svg>
          </div>
        </div>
      )}

      {/* Tab 2: Benchmarking Table */}
      {activeTab === "benchmarks" && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden text-xs shadow-sm">
          <div className="p-4 bg-slate-50 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-900">
              Syllabus Machine Learning & Deep Learning Accuracy Scores
            </h2>
            <p className="text-[11px] text-slate-500">
              Evaluated on identical multi-sequence brain MRI radiomics. Notice how combining visual deep learning with classical texture analysis achieves the highest accuracy (93.1%).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-600 text-[11px] font-semibold">
                  <th className="py-2.5 px-4">Model Name</th>
                  <th className="py-2.5 px-4">AI Type</th>
                  <th className="py-2.5 px-4 text-right">Accuracy</th>
                  <th className="py-2.5 px-4 text-right">F1-Score</th>
                  <th className="py-2.5 px-4 text-right">ROC-AUC</th>
                  <th className="py-2.5 px-4">Role in NeuroLens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                {benchmarkModels.map((m, i) => (
                  <tr
                    key={i}
                    className={`hover:bg-slate-50 transition ${
                      m.name.includes("Dual Ensemble")
                        ? "bg-purple-50/60 font-bold"
                        : ""
                    }`}
                  >
                    <td className="py-2.5 px-4 font-sans font-bold text-slate-900">{m.name}</td>
                    <td className="py-2.5 px-4 font-sans text-slate-600 text-[11px]">{m.type}</td>
                    <td className="py-2.5 px-4 text-right font-bold text-slate-900">{m.acc}</td>
                    <td className="py-2.5 px-4 text-right text-slate-700">{m.f1}</td>
                    <td className="py-2.5 px-4 text-right text-purple-700 font-bold">{m.auroc}</td>
                    <td className="py-2.5 px-4 font-sans text-[11px] text-slate-600">{m.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Habitats */}
      {activeTab === "habitats" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm text-xs">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <GitFork className="w-4 h-4 text-purple-600" />
            Tumour Micro-Environments (Intra-Tumour Zones)
          </h2>
          <p className="text-slate-600 leading-relaxed text-xs">
            Brain tumours are not uniform inside. The AI groups individual voxels into 3 distinct biological micro-environments based on blood flow and oxygen levels:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-1">
              <span className="font-bold text-red-800 text-xs block">Zone 1: Oxygen-Starved Center</span>
              <p className="text-[11px] text-slate-600">Cells in the center that died because they outgrew their blood supply (central necrosis).</p>
            </div>
            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1">
              <span className="font-bold text-blue-800 text-xs block">Zone 2: Active Growing Edge</span>
              <p className="text-[11px] text-slate-600">The aggressively multiplying outer rim with strong blood vessel development (enhancing rim).</p>
            </div>
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1">
              <span className="font-bold text-amber-800 text-xs block">Zone 3: Infiltrative Swelling</span>
              <p className="text-[11px] text-slate-600">Water accumulation and tissue swelling extending into healthy brain tissue (peritumoural edema).</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
