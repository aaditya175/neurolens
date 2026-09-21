"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  GitCompare,
  BarChart3,
  BookOpen,
  Info,
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
import { getPatientProfile, PatientProfile } from "@/lib/patientCatalog";

export default function StudyWorkspaceClient({ initialId }: { initialId?: string }) {
  const params = useParams();
  const router = useRouter();
  const studyId = (params?.id as string) || initialId || "856c7e19-a1ae-4298-94f5-d4ad0bdc6072";

  // State
  const [profile, setProfile] = useState<PatientProfile>(() => getPatientProfile(studyId));
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(() => getPatientProfile(studyId).analysis);
  const [loading, setLoading] = useState<boolean>(false);

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
  const [activeTab, setActiveTab] = useState<"summary" | "measurements" | "explain" | "similar">("summary");

  // Load Analysis Data
  useEffect(() => {
    async function loadData() {
      try {
        const resolved = getPatientProfile(studyId);
        setProfile(resolved);
        try {
          const data = await fetchStudyAnalysis(studyId);
          setAnalysis(data);
        } catch {
          // Fallback to patient profile's exact clinical analysis
          setAnalysis(resolved.analysis);
        }
      } catch (err: any) {
        // Fallback
        const fallback = getPatientProfile(studyId);
        setProfile(fallback);
        setAnalysis(fallback.analysis);
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
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-600 font-medium">Loading Patient Brain Scan...</p>
        </div>
      </div>
    );
  }

  if (!analysis) return null;

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-3.5rem-2.5rem)] overflow-hidden bg-slate-50">
      {/* Top Context Bar */}
      <div className="flex items-center justify-between px-6 py-2.5 bg-white border-b border-slate-200 text-xs shadow-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-900 font-mono">Patient: {profile.code}</span>
          <span className="text-slate-300">•</span>
          <span className="px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-semibold">
            {profile.scenarioName}
          </span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-600 font-medium">Demographics: {profile.age}y, {profile.sex}</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/insights?studyId=${studyId}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium transition"
          >
            <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
            <span>AI Insights</span>
          </Link>
          <Link
            href="/info"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium transition"
          >
            <BookOpen className="w-3.5 h-3.5 text-purple-600" />
            <span>Guide to Terms</span>
          </Link>
          <Link
            href={`/studies/${studyId}/compare`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-medium transition"
          >
            <GitCompare className="w-3.5 h-3.5 text-purple-600" />
            <span>Compare with Past Scans</span>
          </Link>
          <Link
            href={`/reports/${studyId}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition shadow-sm"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Create Clinical Report</span>
          </Link>
        </div>
      </div>

      {/* Main Workspace Split: Viewer (Left) + Analysis Panels (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Viewer & Controls */}
        <div className="flex-[3] flex flex-col p-3 gap-2 border-r border-slate-200 overflow-hidden bg-slate-100/60">
          {/* Viewer Top Controls */}
          <div className="flex items-center justify-between gap-2">
            <SequenceTabs
              currentSequence={currentSequence}
              onSelectSequence={setCurrentSequence}
              availableSequences={["t1", "t1ce", "t2", "flair"]}
            />
            <MaskEditorToolbar
              onSaveMaskVersion={() => alert("Doctor corrections saved as Mask v2!")}
              onRevertAI={() => alert("Restored original AI segmentation.")}
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
              lesions={profile.viewerLesions}
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
        <div className="flex-[2] flex flex-col bg-white overflow-hidden border-l border-slate-200">
          {/* Tabs Navigation */}
          <div className="flex border-b border-slate-200 bg-slate-50 px-3 pt-2 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab("summary")}
              className={`px-4 py-2 font-bold border-b-2 transition ${
                activeTab === "summary"
                  ? "border-purple-600 text-purple-700 bg-white"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Summary & Diagnosis
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("measurements")}
              className={`px-4 py-2 font-bold border-b-2 transition ${
                activeTab === "measurements"
                  ? "border-purple-600 text-purple-700 bg-white"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Size & Measurements
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("explain")}
              className={`px-4 py-2 font-bold border-b-2 transition ${
                activeTab === "explain"
                  ? "border-purple-600 text-purple-700 bg-white"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              AI Explanation
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("similar")}
              className={`px-4 py-2 font-bold border-b-2 transition ${
                activeTab === "similar"
                  ? "border-purple-600 text-purple-700 bg-white"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              Similar Past Cases
            </button>
          </div>

          {/* Tab Content Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
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
                {/* Top Features */}
                <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-3 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-purple-600" />
                    Key MRI Features Influencing AI Diagnosis
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    The mathematical texture and boundary measurements that most heavily guided the AI’s tumour classification:
                  </p>
                  <div className="space-y-2.5 pt-1">
                    {analysis.radiomics_top_features.map((feat) => (
                      <div key={feat.name} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-semibold text-slate-800">{feat.name}</span>
                          <span className="font-mono text-purple-700 font-bold">
                            {(feat.importance * 100).toFixed(0)}% importance
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-purple-600"
                            style={{ width: `${feat.importance * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Priority Rules Fired */}
                <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-sm">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <Info className="w-4 h-4 text-purple-600" />
                    Why Is This Scan High Priority?
                  </h4>
                  <p className="text-slate-500 text-[11px]">
                    Clinical safety checks triggered for this case (Urgency Score: <strong className="text-purple-700 font-mono">{analysis.urgency.score.toFixed(2)}</strong>):
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 text-xs pl-1">
                    {analysis.urgency.rules_fired.map((rule, idx) => (
                      <li key={idx} className="font-medium">{rule}</li>
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
