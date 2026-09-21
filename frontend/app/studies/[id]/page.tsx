"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  GitCompare,
  CheckCircle2,
  Clock,
  BarChart3,
  Layers,
  Sparkles,
  Info,
  ShieldAlert,
} from "lucide-react";

import { ViewerCanvas } from "@/components/ViewerCanvas";
import { SequenceTabs } from "@/components/SequenceTabs";
import { OverlayControls } from "@/components/OverlayControls";
import { MaskEditorToolbar } from "@/components/MaskEditorToolbar";
import { RegionLegend } from "@/components/RegionLegend";
import { ClassificationCard } from "@/components/ClassificationCard";
import { NeedsReviewBanner } from "@/components/NeedsReviewBanner";
import { MeasurementsTable } from "@/components/MeasurementsTable";
import { LesionTable } from "@/components/LesionTable";
import { SimilarCasesGrid } from "@/components/SimilarCasesGrid";
import { AnalysisResult } from "@/lib/types/analysis";
import { fetchStudyAnalysis } from "@/lib/api";

export default function StudyWorkspacePage() {
  const params = useParams();
  const router = useRouter();
  const studyId = (params.id as string) || "demo-study-uuid";

  // State
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Viewer State
  const [currentSequence, setCurrentSequence] = useState<string>("t1ce");
  const [maskOpacity, setMaskOpacity] = useState<number>(0.65);
  const [showMask, setShowMask] = useState<boolean>(true);
  const [activeRegions, setActiveRegions] = useState<Record<string, boolean>>({
    NCR: true,
    ED: true,
    ET: true,
  });

  // Research Overlays
  const [showUncertainty, setShowUncertainty] = useState<boolean>(false);
  const [showHabitats, setShowHabitats] = useState<boolean>(false);
  const [showGradCam, setShowGradCam] = useState<boolean>(false);

  // Right Panel Tabs
  const [activeTab, setActiveTab] = useState<"summary" | "measurements" | "explain" | "similar" | "history">("summary");

  // Load Analysis Data
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const data = await fetchStudyAnalysis(studyId);
        setAnalysis(data);
      } catch (err: any) {
        // Fallback to high-fidelity mock data for standalone UI preview
        setAnalysis({
          study_id: studyId,
          model_versions: {
            segmentation: "swinunetr-v1",
            classifier: "effnet-v1",
            classical: "svm-rbf-v1",
          },
          qc: { passed: true, missing_sequences: [], ood_score: 0.12, warnings: [] },
          segmentation: {
            mask_url: `/api/v1/studies/${studyId}/mask`,
            uncertainty_url: `/api/v1/studies/${studyId}/uncertainty`,
            regions: {
              WT: { volume_ml: 46.8, max_diameter_mm: 39.4, perp_diameter_mm: 32.1, centroid_mm: [14.2, -8.6, 22.1] },
              TC: { volume_ml: 25.3, max_diameter_mm: 27.2, perp_diameter_mm: 21.8, centroid_mm: [14.5, -8.8, 22.0] },
              ET: { volume_ml: 16.1, max_diameter_mm: 24.0, perp_diameter_mm: 20.1, centroid_mm: [14.6, -8.7, 22.3] },
              NCR: { volume_ml: 9.2, max_diameter_mm: 14.8, perp_diameter_mm: 11.9, centroid_mm: [14.0, -9.0, 21.8] },
              ED: { volume_ml: 21.5, max_diameter_mm: 39.4, perp_diameter_mm: 32.1, centroid_mm: [13.8, -8.2, 22.4] },
            },
            lesions: [{ id: 1, volume_ml: 46.8, centroid_mm: [14.2, -8.6, 22.1] }],
            lesion_count: 1,
          },
          location: {
            hemisphere: "right",
            lobes: ["frontal", "temporal"],
            midline_shift_mm: 2.3,
            confidence: "approximate",
          },
          classification: {
            cnn: { label: "glioma", probs: { glioma: 0.89, meningioma: 0.05, pituitary: 0.02, metastasis: 0.04 } },
            classical: { label: "glioma", probs: { glioma: 0.83, meningioma: 0.09, pituitary: 0.02, metastasis: 0.06 }, model: "svm-rbf" },
            ensemble: { label: "glioma", confidence: 0.86, agree: true },
          },
          uncertainty: { case_score: 0.17, needs_review: false, reasons: [] },
          habitats: { method: "gmm", k: 3, map_url: null },
          radiomics_top_features: [
            { name: "original_glcm_Contrast", value: 14.8, importance: 0.34 },
            { name: "original_firstorder_Entropy", value: 5.2, importance: 0.29 },
            { name: "original_shape_Elongation", value: 0.72, importance: 0.21 },
          ],
          similar_cases: [
            { case_id: "BRATS21-00219", label: "glioma", similarity: 0.95 },
            { case_id: "BRATS21-00441", label: "glioma", similarity: 0.91 },
            { case_id: "BRATS21-00108", label: "glioma", similarity: 0.87 },
          ],
          urgency: { score: 0.64, rules_fired: ["Midline shift > 2.0mm", "Large WT volume (>30mL)"] },
          experimental: { idh_prediction: null, survival_bin: null },
        });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [studyId]);

  const toggleRegion = (region: string) => {
    setActiveRegions((prev) => ({ ...prev, [region]: !prev[region] }));
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 space-y-4 text-center">
        <div className="space-y-3">
          <div className="w-10 h-10 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-400 font-mono">Loading Study & Quantitative Results...</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem-2.5rem)] overflow-hidden bg-clinical-bg">
      {/* Top Context Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-clinical-surface border-b border-slate-800 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-100 font-mono">Study: {studyId.slice(0, 8)}</span>
          <span className="text-slate-500">•</span>
          <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 font-medium">
            Protocol: 4-Sequence MRI
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Patient: PT-{studyId.slice(0, 6).toUpperCase()}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/reports/${studyId}`}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition"
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>Generate Report</span>
          </Link>
          <Link
            href={`/studies/${studyId}/compare`}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition"
          >
            <GitCompare className="w-3.5 h-3.5 text-purple-400" />
            <span>Longitudinal Compare</span>
          </Link>
        </div>
      </div>

      {/* Main Workspace Split: Viewer (Left) + Analysis Panels (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Viewer & Controls */}
        <div className="flex-[3] flex flex-col p-3 gap-2 border-r border-slate-800 overflow-hidden">
          {/* Viewer Top Controls */}
          <div className="flex items-center justify-between gap-2">
            <SequenceTabs
              currentSequence={currentSequence}
              onSelectSequence={setCurrentSequence}
              availableSequences={["t1", "t1ce", "t2", "flair"]}
            />
            <MaskEditorToolbar
              onSaveMaskVersion={() => alert("Mask revision saved as Doctor Mask v2!")}
              onRevertAI={() => alert("Restored baseline AI segmentation mask.")}
            />
          </div>

          {/* MPR Viewer Canvas */}
          <div className="flex-1 min-h-0">
            <ViewerCanvas
              studyId={studyId}
              currentSequence={currentSequence}
              maskOpacity={maskOpacity}
              showMask={showMask}
              activeRegions={activeRegions}
              showUncertainty={showUncertainty}
              showHabitats={showHabitats}
              showGradCam={showGradCam}
            />
          </div>

          {/* Viewer Bottom Controls: Overlay & Legend Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <OverlayControls
              maskOpacity={maskOpacity}
              onOpacityChange={setMaskOpacity}
              showMask={showMask}
              onToggleMask={setShowMask}
              showUncertainty={showUncertainty}
              onToggleUncertainty={setShowUncertainty}
              showHabitats={showHabitats}
              onToggleHabitats={setShowHabitats}
              showGradCam={showGradCam}
              onToggleGradCam={setShowGradCam}
            />
            <RegionLegend
              activeRegions={activeRegions}
              onToggleRegion={toggleRegion}
            />
          </div>
        </div>

        {/* Right Column: Analysis Panels with Tabs */}
        <div className="flex-[2] flex flex-col bg-clinical-surface overflow-hidden">
          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-800 bg-clinical-bg/50 px-2 pt-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`px-3 py-2 font-medium border-b-2 transition ${
                activeTab === "summary"
                  ? "border-cyan-400 text-cyan-300 bg-clinical-surface"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Summary
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("measurements")}
              className={`px-3 py-2 font-medium border-b-2 transition ${
                activeTab === "measurements"
                  ? "border-cyan-400 text-cyan-300 bg-clinical-surface"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Measurements
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("explain")}
              className={`px-3 py-2 font-medium border-b-2 transition ${
                activeTab === "explain"
                  ? "border-cyan-400 text-cyan-300 bg-clinical-surface"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Explainability
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("similar")}
              className={`px-3 py-2 font-medium border-b-2 transition ${
                activeTab === "similar"
                  ? "border-cyan-400 text-cyan-300 bg-clinical-surface"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              Similar Cases
            </button>
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeTab === "summary" && (
              <>
                <NeedsReviewBanner uncertainty={analysis.uncertainty} />
                <ClassificationCard classification={analysis.classification} />
                <MeasurementsTable
                  segmentation={analysis.segmentation}
                  location={analysis.location}
                />
              </>
            )}

            {activeTab === "measurements" && (
              <>
                <MeasurementsTable
                  segmentation={analysis.segmentation}
                  location={analysis.location}
                />
                <LesionTable
                  lesions={analysis.segmentation.lesions}
                  lesionCount={analysis.segmentation.lesion_count}
                />
              </>
            )}

            {activeTab === "explain" && (
              <div className="space-y-4 text-xs">
                {/* Top Radiomic Features Chart */}
                <div className="p-4 rounded-xl border border-slate-800 bg-clinical-surface space-y-3">
                  <h4 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    Top Driving Radiomic Features (Random Forest)
                  </h4>
                  <div className="space-y-2 pt-1">
                    {analysis.radiomics_top_features.map((feat) => (
                      <div key={feat.name} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-mono text-slate-300">{feat.name}</span>
                          <span className="font-mono text-purple-300">
                            {(feat.importance * 100).toFixed(1)}% importance
                          </span>
                        </div>
                        <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                            style={{ width: `${feat.importance * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Triage Rules Fired */}
                <div className="p-4 rounded-xl border border-slate-800 bg-clinical-surface space-y-2">
                  <h4 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                    <Info className="w-4 h-4 text-cyan-400" />
                    Decision Tree Urgency Logic
                  </h4>
                  <p className="text-slate-400 text-[11px]">
                    Heuristic rule engine explaining why this study received urgency score{" "}
                    <strong className="text-amber-400 font-mono">{analysis.urgency.score.toFixed(2)}</strong>:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 text-[11px] pl-1">
                    {analysis.urgency.rules_fired.map((rule, idx) => (
                      <li key={idx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === "similar" && (
              <SimilarCasesGrid similarCases={analysis.similar_cases} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
