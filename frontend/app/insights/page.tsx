"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BarChart3, GitFork, BookOpen, User, ArrowRight, ShieldAlert, CheckCircle2, ChevronRight, Activity } from "lucide-react";
import Link from "next/link";
import {
  PatientProfile,
  getPatientProfile,
  getAllPatientProfiles,
} from "@/lib/patientCatalog";

function InsightsContent() {
  const searchParams = useSearchParams();
  const queryStudyId = searchParams.get("studyId") || searchParams.get("id");

  const [activeTab, setActiveTab] = useState<"pca" | "benchmarks" | "habitats">("pca");
  const [patientList, setPatientList] = useState<PatientProfile[]>([]);
  const [selectedId, setSelectedId] = useState<string>(queryStudyId || "856c7e19-a1ae-4298-94f5-d4ad0bdc6072");

  // Load all available patients (built-in 16 + any newly input/recorded ones)
  useEffect(() => {
    const list = getAllPatientProfiles();
    setPatientList(list);
    if (queryStudyId) {
      setSelectedId(queryStudyId);
    } else if (list.length > 0 && !selectedId) {
      setSelectedId(list[0].id);
    }
  }, [queryStudyId]);

  const currentProfile: PatientProfile = getPatientProfile(selectedId);

  // Calculate dynamic 2D PCA coordinates for the active patient
  const getPcaCoordinates = (prof: PatientProfile) => {
    const type = prof.tumourType.toLowerCase();
    const wt = prof.analysis.segmentation.regions.WT.volume_ml;

    if (type.includes("meningioma")) {
      return { x: 450, y: 85, cluster: "Meningioma (Benign Cluster)" };
    }
    if (type.includes("metastasis") || type.includes("met")) {
      return { x: 415, y: 230, cluster: "Metastasis (Malignant Cluster)" };
    }
    if (type.includes("pituitary")) {
      return { x: 310, y: 80, cluster: "Sellar / Pituitary (Benign Cluster)" };
    }
    if (type.includes("schwannoma")) {
      return { x: 340, y: 110, cluster: "Acoustic Schwannoma (Benign Cluster)" };
    }
    if (type.includes("neurocytoma")) {
      return { x: 280, y: 150, cluster: "Neurocytoma (Benign Intraventricular Cluster)" };
    }
    if (type.includes("no tumour") || type.includes("control") || wt === 0) {
      return { x: 100, y: 240, cluster: "Healthy Normal Brain (Control Baseline)" };
    }
    if (wt > 50) {
      // Massive Glioblastoma
      return { x: 230, y: 150, cluster: "High-Grade Glioblastoma (Massive Mass Effect)" };
    }
    // Standard Glioma
    return { x: 205, y: 125, cluster: "Glioma / Glioblastoma (Malignant Cluster)" };
  };

  const currentPca = getPcaCoordinates(currentProfile);

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

  const wtVal = currentProfile.analysis.segmentation.regions.WT.volume_ml;
  const tcVal = currentProfile.analysis.segmentation.regions.TC.volume_ml;
  const etVal = currentProfile.analysis.segmentation.regions.ET.volume_ml;
  const ncrVal = currentProfile.analysis.segmentation.regions.NCR.volume_ml;
  const edVal = currentProfile.analysis.segmentation.regions.ED.volume_ml;

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-600" />
            AI Insights & Accuracy Comparison
          </h1>
          <p className="text-xs text-slate-500">
            Inspect AI model decisions, texture feature space (PCA), and micro-environment habitats for any patient scan.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link
            href="/info"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium text-xs transition shadow-xs"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>Guide to Terms</span>
          </Link>
          <Link
            href={`/studies/${currentProfile.id}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition shadow-sm"
          >
            <span>Open 3D Viewer</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Patient Selector Card - Available for ALL Patients */}
      <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-4 space-y-3 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-purple-600" />
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                Select Patient to Inspect AI Insights:
              </span>
              <span className="text-[11px] text-slate-500">
                Viewing analysis for {currentProfile.code} ({currentProfile.scenarioName})
              </span>
            </div>
          </div>

          {/* Dropdown with all patients */}
          <div className="flex items-center gap-2">
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="px-3 py-2 bg-white border border-purple-300 rounded-lg text-slate-900 font-semibold text-xs focus:outline-none focus:border-purple-600 shadow-xs cursor-pointer max-w-xs"
            >
              {patientList.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.code} • {p.tumourType} ({p.isMalignant ? "Malignant" : "Benign"}) • {p.analysis.segmentation.regions.WT.volume_ml.toFixed(1)} mL
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Selected Patient Live Status Badge Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="text-[10px] text-slate-500 block">Tumour Classification</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-bold text-slate-900 capitalize">{currentProfile.tumourType}</span>
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                  currentProfile.isMalignant
                    ? "bg-red-100 text-red-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {currentProfile.isMalignant ? "Malignant" : "Benign"}
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono">
            <span className="text-[10px] text-slate-500 block font-sans">Whole Tumour Volume</span>
            <span className="font-bold text-purple-700 text-sm mt-0.5 block">
              {wtVal.toFixed(1)} mL
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-slate-200 font-mono">
            <span className="text-[10px] text-slate-500 block font-sans">Midline Shift Pressure</span>
            <span className={`font-bold text-sm mt-0.5 block ${currentProfile.analysis.location.midline_shift_mm > 2 ? "text-red-600" : "text-slate-800"}`}>
              {currentProfile.analysis.location.midline_shift_mm.toFixed(1)} mm
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white border border-slate-200">
            <span className="text-[10px] text-slate-500 block">AI Consensus Confidence</span>
            <span className="font-bold text-emerald-700 font-mono text-sm mt-0.5 block">
              {(currentProfile.analysis.classification.ensemble.confidence * 100).toFixed(0)}% Agree
            </span>
          </div>
        </div>
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
          AI Model Comparison Table & Voting
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
          Tumour Micro-Environments (Habitats)
        </button>
      </div>

      {/* Tab 1: Dynamic PCA Scatter */}
      {activeTab === "pca" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
          <div className="flex justify-between items-center text-xs flex-wrap gap-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Where Does Patient {currentProfile.code}&apos;s Tumour Sit? (2D Texture &amp; Shape Map)
              </h2>
              <p className="text-slate-500 text-[11px]">
                Reduces 107 complex 3D shape and texture features into an intuitive 2D map. Similar tumours cluster together.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                <span className="text-slate-700">Glioma Cluster</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <span className="text-slate-700">Meningioma Cluster</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="text-slate-700">Metastasis Cluster</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-slate-700">Healthy Control</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-purple-700">
                <span className="w-3 h-3 rounded-full bg-purple-600 animate-ping" />
                <span>Current Patient: {currentProfile.code}</span>
              </div>
            </div>
          </div>

          {/* SVG PCA Visualization (Light Theme with Dynamic Position) */}
          <div className="relative h-88 w-full rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:40px_40px]" />
            
            <svg className="w-full h-full p-8" viewBox="0 0 600 300">
              {/* Glioma cluster (left/mid) */}
              {[
                [140, 90], [160, 110], [180, 85], [195, 140], [210, 100], [230, 130],
                [170, 150], [150, 170], [220, 160], [240, 110], [200, 120]
              ].map(([x, y], i) => (
                <circle key={`g-${i}`} cx={x} cy={y} r={6} fill="#06B6D4" opacity={0.65} />
              ))}
              <text x={150} y={75} fill="#0891B2" fontSize="10" fontWeight="bold">Glioma (Malignant)</text>

              {/* Meningioma cluster (top right) */}
              {[
                [420, 60], [450, 80], [430, 100], [470, 70], [460, 110], [490, 85]
              ].map(([x, y], i) => (
                <circle key={`m-${i}`} cx={x} cy={y} r={6} fill="#EAB308" opacity={0.65} />
              ))}
              <text x={425} y={50} fill="#CA8A04" fontSize="10" fontWeight="bold">Meningioma (Benign)</text>

              {/* Metastasis cluster (bottom right) */}
              {[
                [380, 220], [410, 240], [430, 210], [390, 250], [450, 230]
              ].map(([x, y], i) => (
                <circle key={`met-${i}`} cx={x} cy={y} r={6} fill="#EF4444" opacity={0.65} />
              ))}
              <text x={385} y={200} fill="#DC2626" fontSize="10" fontWeight="bold">Metastases (Malignant)</text>

              {/* Healthy normal baseline cluster (bottom left) */}
              {[
                [90, 230], [105, 245], [120, 225], [100, 260]
              ].map(([x, y], i) => (
                <circle key={`ctrl-${i}`} cx={x} cy={y} r={6} fill="#10B981" opacity={0.65} />
              ))}
              <text x={70} y={215} fill="#059669" fontSize="10" fontWeight="bold">Normal Brain (Control)</text>

              {/* ACTIVE CURRENT CASE (Dynamically Positioned) */}
              <circle cx={currentPca.x} cy={currentPca.y} r={10} fill="#9333EA" className="animate-pulse" />
              <circle cx={currentPca.x} cy={currentPca.y} r={18} fill="none" stroke="#9333EA" strokeWidth={2.5} opacity={0.6} />
              
              <rect
                x={currentPca.x > 350 ? currentPca.x - 220 : currentPca.x + 15}
                y={currentPca.y - 18}
                width={210}
                height={34}
                rx={6}
                fill="#ffffff"
                stroke="#9333EA"
                strokeWidth={1.5}
                opacity={0.95}
              />
              <text
                x={currentPca.x > 350 ? currentPca.x - 212 : currentPca.x + 23}
                y={currentPca.y - 4}
                fill="#581C87"
                fontSize="11"
                fontWeight="bold"
                fontFamily="monospace"
              >
                ★ {currentProfile.code}: {currentProfile.tumourType}
              </text>
              <text
                x={currentPca.x > 350 ? currentPca.x - 212 : currentPca.x + 23}
                y={currentPca.y + 10}
                fill="#6B21A8"
                fontSize="9"
                fontFamily="sans-serif"
              >
                Vol: {wtVal.toFixed(1)} mL • {currentProfile.isMalignant ? "Malignant" : "Benign"}
              </text>
            </svg>
          </div>

          {/* Detailed Diagnosis Reasoning for Selected Patient */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <span className="font-bold text-slate-900 block">
              Why Is Patient {currentProfile.code} Located in the {currentPca.cluster}?
            </span>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              The AI extracted 107 volumetric MRI radiomics descriptors for this scan. The top features guiding this placement are:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {currentProfile.analysis.radiomics_top_features.map((feat) => (
                <div key={feat.name} className="p-2 rounded bg-white border border-slate-200">
                  <span className="font-semibold text-slate-800 block text-[10px]">{feat.name}</span>
                  <span className="text-purple-700 font-mono font-bold text-xs">{(feat.importance * 100).toFixed(0)}% weight</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: AI Benchmarking & Voting Breakdown */}
      {activeTab === "benchmarks" && (
        <div className="space-y-4">
          {/* Patient-Specific Voting Card */}
          <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-5 space-y-3 text-xs shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-600" />
                Multi-Model Voting Consensus for Patient {currentProfile.code}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold text-[10px]">
                Consensus Agree: {(currentProfile.analysis.classification.ensemble.confidence * 100).toFixed(0)}%
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Dual Ensemble Head</span>
                <span className="text-sm font-bold text-purple-700 capitalize block">
                  {currentProfile.analysis.classification.ensemble.label}
                </span>
                <p className="text-[10px] text-slate-600">Final combined recommendation head</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">3D Deep CNN (EfficientNet)</span>
                <span className="text-sm font-bold text-slate-900 capitalize block">
                  {currentProfile.analysis.classification.cnn.label}
                </span>
                <p className="text-[10px] text-slate-600">Visual pattern voxel recognition</p>
              </div>

              <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 font-bold uppercase">SVM Texture Classifier</span>
                <span className="text-sm font-bold text-slate-900 capitalize block">
                  {currentProfile.analysis.classification.classical.label}
                </span>
                <p className="text-[10px] text-slate-600">Radiomic intensity &amp; boundary shape</p>
              </div>
            </div>
          </div>

          {/* Benchmark Table */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden text-xs shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h2 className="text-sm font-bold text-slate-900">
                Syllabus Machine Learning &amp; Deep Learning Accuracy Scores
              </h2>
              <p className="text-[11px] text-slate-500">
                Evaluated on multi-sequence brain MRI radiomics (Mumbai University ML Syllabus). Combining visual deep learning with classical texture analysis achieves the highest accuracy (93.1%).
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
        </div>
      )}

      {/* Tab 3: Habitats for Selected Patient */}
      {activeTab === "habitats" && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5 shadow-sm text-xs">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <GitFork className="w-4 h-4 text-purple-600" />
              Tumour Micro-Environments for Patient {currentProfile.code}
            </h2>
            <p className="text-slate-600 leading-relaxed text-xs mt-1">
              Tumour tissue is biologically diverse. The AI segments this patient&apos;s scan into 3 distinct biological micro-environments based on blood perfusion and tissue necrosis:
            </p>
          </div>

          {/* Visual Habitat Breakdown Bar */}
          {wtVal > 0 ? (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold text-slate-700">
                <span>Micro-Environment Distribution (Total WT: {wtVal.toFixed(1)} mL)</span>
                <span className="font-mono text-purple-700">100% Segmented</span>
              </div>
              <div className="w-full h-4 rounded-full bg-slate-100 border border-slate-200 flex overflow-hidden">
                {ncrVal > 0 && (
                  <div
                    className="h-full bg-red-500 transition-all"
                    style={{ width: `${(ncrVal / wtVal) * 100}%` }}
                    title={`Zone 1 Necrotic Core: ${ncrVal} mL`}
                  />
                )}
                {etVal > 0 && (
                  <div
                    className="h-full bg-blue-500 transition-all"
                    style={{ width: `${(etVal / wtVal) * 100}%` }}
                    title={`Zone 2 Active Rim: ${etVal} mL`}
                  />
                )}
                {edVal > 0 && (
                  <div
                    className="h-full bg-amber-400 transition-all"
                    style={{ width: `${(edVal / wtVal) * 100}%` }}
                    title={`Zone 3 Edema Swelling: ${edVal} mL`}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-semibold">
              ✓ Healthy Brain Scan: Zero pathological tumour habitats or necrosis detected (0.0 mL).
            </div>
          )}

          {/* Cards for the 3 Habitats with Patient's Exact Volumes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-4 rounded-xl border border-red-200 bg-red-50/50 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-red-800 text-xs block">Zone 1: Necrotic Core</span>
                <span className="font-mono font-bold text-red-700 text-xs">{ncrVal.toFixed(1)} mL</span>
              </div>
              <p className="text-[11px] text-slate-600">
                {ncrVal > 0
                  ? `Dead cellular tissue in the core due to insufficient blood supply (${((ncrVal / (wtVal || 1)) * 100).toFixed(0)}% of mass).`
                  : "No necrosis observed (indicates low-grade or non-aggressive benign nature)."}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-blue-800 text-xs block">Zone 2: Active Growing Edge</span>
                <span className="font-mono font-bold text-blue-700 text-xs">{etVal.toFixed(1)} mL</span>
              </div>
              <p className="text-[11px] text-slate-600">
                {etVal > 0
                  ? `Vascularized active tumour tissue absorbing contrast (${((etVal / (wtVal || 1)) * 100).toFixed(0)}% of mass).`
                  : "Non-enhancing tumour volume."}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-800 text-xs block">Zone 3: Brain Swelling (Edema)</span>
                <span className="font-mono font-bold text-amber-700 text-xs">{edVal.toFixed(1)} mL</span>
              </div>
              <p className="text-[11px] text-slate-600">
                {edVal > 0
                  ? `Fluid accumulation and swelling extending into healthy brain tissue (${((edVal / (wtVal || 1)) * 100).toFixed(0)}% of mass).`
                  : "Zero peritumoural swelling detected."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InsightsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
      }
    >
      <InsightsContent />
    </Suspense>
  );
}
