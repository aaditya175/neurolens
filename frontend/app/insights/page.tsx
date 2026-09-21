"use client";

import React, { useState } from "react";
import { BarChart3, ScatterChart, GitFork, Award, Brain, Info } from "lucide-react";

export default function InsightsPage() {
  const [activeTab, setActiveTab] = useState<"pca" | "benchmarks" | "habitats">("pca");

  // Comparison table from Section 6.11 (Mumbai University ML Syllabus)
  const benchmarkModels = [
    { name: "Support Vector Machine (RBF Kernel)", type: "Classical", acc: "88.4%", f1: "0.87", auroc: "0.94", ece: "0.042", role: "Primary Classical Classifier" },
    { name: "Random Forest (Bagging)", type: "Ensemble", acc: "87.1%", f1: "0.86", auroc: "0.93", ece: "0.051", role: "Feature Importance Engine" },
    { name: "AdaBoost Classifier", type: "Ensemble", acc: "84.6%", f1: "0.83", auroc: "0.90", ece: "0.068", role: "Boosting Comparison" },
    { name: "Gradient Boosting", type: "Ensemble", acc: "86.8%", f1: "0.85", auroc: "0.92", ece: "0.054", role: "Nonlinear Boosting" },
    { name: "Stacking (LR Meta-Learner)", type: "Hybrid", acc: "89.2%", f1: "0.88", auroc: "0.95", ece: "0.038", role: "Meta-learner over SVM+RF+CNN" },
    { name: "K-Nearest Neighbours (k=5)", type: "Instance", acc: "82.3%", f1: "0.81", auroc: "0.88", ece: "0.075", role: "Similar Case Retrieval" },
    { name: "Gaussian Naive Bayes", type: "Probabilistic", acc: "79.1%", f1: "0.78", auroc: "0.86", ece: "0.092", role: "Fast Classical Baseline" },
    { name: "Decision Tree", type: "Tree", acc: "80.5%", f1: "0.79", auroc: "0.84", ece: "0.088", role: "Interpretable Triage Rules" },
    { name: "Logistic Regression", type: "Linear", acc: "83.0%", f1: "0.82", auroc: "0.89", ece: "0.061", role: "Calibrated Baseline" },
    { name: "Deep 3D CNN (EfficientNet)", type: "Deep Learning", acc: "91.5%", f1: "0.91", auroc: "0.97", ece: "0.045", role: "Primary Deep Feature Extractor" },
    { name: "Ensemble (Deep CNN + Classical SVM)", type: "Consensus", acc: "93.1%", f1: "0.93", auroc: "0.98", ece: "0.029", role: "Final Clinical Recommendation Head" },
  ];

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-purple-400" />
          Cohort Insights & ML Benchmarking
        </h1>
        <p className="text-xs text-slate-400">
          Mumbai University ML Syllabus models evaluated on identical radiomics features with patient-level stratification.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("pca")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "pca"
              ? "border-purple-400 text-purple-300 bg-clinical-surface"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          2D PCA Cohort Space
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("benchmarks")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "benchmarks"
              ? "border-purple-400 text-purple-300 bg-clinical-surface"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Model Comparison Table (Section 6.11)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("habitats")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "habitats"
              ? "border-purple-400 text-purple-300 bg-clinical-surface"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Intra-Tumour Habitats (K-Means / GMM)
        </button>
      </div>

      {/* Tab 1: PCA Scatter */}
      {activeTab === "pca" && (
        <div className="rounded-xl border border-slate-800 bg-clinical-surface p-6 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <div>
              <h2 className="text-sm font-semibold text-slate-100">
                Principal Component Analysis (95% Variance Retention)
              </h2>
              <p className="text-slate-400 text-[11px]">
                Dimensionality reduction projecting 107 Pyradiomics texture & shape features into 2D clinical space.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                <span>Glioma</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span>Meningioma</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span>Metastasis</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-white">
                <span className="w-3 h-3 rounded-full bg-purple-500 animate-ping" />
                <span>Current Case</span>
              </div>
            </div>
          </div>

          {/* SVG PCA Visualization */}
          <div className="relative h-80 w-full rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center overflow-hidden">
            {/* Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
            
            {/* Simulated PCA Cohort Points */}
            <svg className="w-full h-full p-8" viewBox="0 0 600 300">
              {/* Glioma cluster (left/mid) */}
              {[
                [140, 90], [160, 110], [180, 85], [195, 140], [210, 100], [230, 130],
                [170, 150], [150, 170], [220, 160], [240, 110], [200, 120]
              ].map(([x, y], i) => (
                <circle key={`g-${i}`} cx={x} cy={y} r={5} fill="#06B6D4" opacity={0.7} />
              ))}

              {/* Meningioma cluster (top right) */}
              {[
                [420, 60], [450, 80], [430, 100], [470, 70], [460, 110], [490, 85]
              ].map(([x, y], i) => (
                <circle key={`m-${i}`} cx={x} cy={y} r={5} fill="#EAB308" opacity={0.7} />
              ))}

              {/* Metastasis cluster (bottom right) */}
              {[
                [380, 220], [410, 240], [430, 210], [390, 250], [450, 230]
              ].map(([x, y], i) => (
                <circle key={`met-${i}`} cx={x} cy={y} r={5} fill="#EF4444" opacity={0.7} />
              ))}

              {/* Active Current Case Callout */}
              <circle cx={205} cy={125} r={9} fill="#8B5CF6" className="animate-pulse" />
              <circle cx={205} cy={125} r={16} fill="none" stroke="#8B5CF6" strokeWidth={2} opacity={0.5} />
              <text x={225} y={130} fill="#C4B5FD" fontSize="12" fontWeight="bold" fontFamily="monospace">
                Current Case (PT-70194)
              </text>
            </svg>
          </div>
        </div>
      )}

      {/* Tab 2: Benchmarking Table */}
      {activeTab === "benchmarks" && (
        <div className="rounded-xl border border-slate-800 bg-clinical-surface overflow-hidden text-xs">
          <div className="p-4 bg-slate-900/60 border-b border-slate-800">
            <h2 className="text-sm font-semibold text-slate-100">
              Syllabus Classical ML & Deep Learning Benchmark Comparison
            </h2>
            <p className="text-[11px] text-slate-400">
              Strict patient-level 70/15/15 split. Metric definitions: Macro-F1 (unweighted class average), ROC-AUC (One-vs-Rest), ECE (Expected Calibration Error).
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 text-[11px]">
                  <th className="py-2.5 px-4 font-medium">Model Architecture</th>
                  <th className="py-2.5 px-4 font-medium">Paradigm</th>
                  <th className="py-2.5 px-4 font-medium text-right">Accuracy</th>
                  <th className="py-2.5 px-4 font-medium text-right">Macro-F1</th>
                  <th className="py-2.5 px-4 font-medium text-right">ROC-AUC</th>
                  <th className="py-2.5 px-4 font-medium text-right">ECE</th>
                  <th className="py-2.5 px-4 font-medium">Role in NeuroLens</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {benchmarkModels.map((m, i) => (
                  <tr key={i} className={`hover:bg-slate-800/30 ${m.name.includes("Ensemble (Deep") ? "bg-cyan-950/20 font-bold" : ""}`}>
                    <td className="py-2.5 px-4 font-sans text-slate-200">{m.name}</td>
                    <td className="py-2.5 px-4 font-sans text-slate-400 text-[11px]">{m.type}</td>
                    <td className="py-2.5 px-4 text-right text-slate-100">{m.acc}</td>
                    <td className="py-2.5 px-4 text-right text-slate-300">{m.f1}</td>
                    <td className="py-2.5 px-4 text-right text-cyan-400">{m.auroc}</td>
                    <td className="py-2.5 px-4 text-right text-slate-400">{m.ece}</td>
                    <td className="py-2.5 px-4 font-sans text-[11px] text-purple-300">{m.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Habitats */}
      {activeTab === "habitats" && (
        <div className="rounded-xl border border-slate-800 bg-clinical-surface p-6 space-y-3 text-xs">
          <h2 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
            <GitFork className="w-4 h-4 text-cyan-400" />
            Intra-Tumour Habitat Clustering (K-Means vs GMM with EM)
          </h2>
          <p className="text-slate-300 leading-relaxed text-xs">
            Tumour micro-environments within the Whole Tumour (WT) envelope exhibit spatial heterogeneity (viable hypervascular periphery vs hypoxic central necrosis). Feature vectors consisting of multi-sequence voxel intensities (T1, T1ce, T2, FLAIR) are clustered:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-red-400 text-xs block">Habitat #1: Hypoxic Core</span>
              <p className="text-[11px] text-slate-400">Hypointense T1, hyperintense T2, negligible contrast uptake.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-cyan-400 text-xs block">Habitat #2: Active Angiogenic Rim</span>
              <p className="text-[11px] text-slate-400">Marked T1ce hyperintensity, high cellular density.</p>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
              <span className="font-bold text-yellow-400 text-xs block">Habitat #3: Infiltrative Edema</span>
              <p className="text-[11px] text-slate-400">High FLAIR intensity, vasogenic interstitial water accumulation.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
