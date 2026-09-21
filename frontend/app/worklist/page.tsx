"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ListFilter,
  Search,
  AlertTriangle,
  Upload,
  ChevronRight,
  BookOpen,
  PlusCircle,
  BarChart3,
  X,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import {
  WorklistItem,
  getAllWorklistItems,
  createPatientFromInput,
  registerCustomPatient,
} from "@/lib/patientCatalog";
import { API_BASE } from "@/lib/api";

export default function WorklistPage() {
  const [studies, setStudies] = useState<WorklistItem[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterMalignancy, setFilterMalignancy] = useState<string>("all");
  const [filterNeedsReview, setFilterNeedsReview] = useState<boolean>(false);
  const [searchCode, setSearchCode] = useState<string>("");

  // Quick Add Modal State
  const [showModal, setShowModal] = useState<boolean>(false);
  const [newCode, setNewCode] = useState<string>("");
  const [newAge, setNewAge] = useState<number>(54);
  const [newSex, setNewSex] = useState<string>("Male");
  const [newTumourType, setNewTumourType] = useState<string>("Glioma");
  const [newIsMalignant, setNewIsMalignant] = useState<boolean>(true);
  const [newVolume, setNewVolume] = useState<number>(38.5);
  const [newShift, setNewShift] = useState<number>(2.0);
  const [newNotes, setNewNotes] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load items from catalog & localStorage
  useEffect(() => {
    setStudies(getAllWorklistItems());
  }, []);

  // Update malignancy toggle when tumour type changes
  const handleTypeChange = (type: string) => {
    setNewTumourType(type);
    if (type === "Glioma" || type === "Glioblastoma" || type === "Metastasis" || type === "Astrocytoma" || type === "Oligodendroglioma") {
      setNewIsMalignant(true);
    } else {
      setNewIsMalignant(false);
    }
  };

  const handleCreatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    const codeToUse = newCode.trim() || `PT-${Math.floor(10000 + Math.random() * 90000)}`;

    const { profile, worklistItem } = createPatientFromInput({
      patientCode: codeToUse,
      age: Number(newAge),
      sex: newSex,
      tumourType: newTumourType,
      isMalignant: newIsMalignant,
      volumeMl: Number(newVolume),
      midlineShiftMm: Number(newShift),
      notes: newNotes,
    });

    // Save locally and in-memory
    registerCustomPatient(profile, worklistItem);

    // Sync to backend API / MongoDB
    try {
      fetch(`${API_BASE}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: codeToUse,
          age: Number(newAge),
          sex: newSex === "Male" ? "M" : "F",
        }),
      }).catch((err) => console.warn("Background API sync:", err));
    } catch {
      // Offline fallback safe
    }

    setStudies(getAllWorklistItems());
    setShowModal(false);
    setSuccessMessage(`Patient ${codeToUse} recorded and added to worklist!`);
    setTimeout(() => setSuccessMessage(null), 4000);

    // Reset form
    setNewCode("");
    setNewVolume(38.5);
    setNewShift(2.0);
    setNewNotes("");
  };

  const filtered = studies.filter((item) => {
    if (filterType !== "all" && !item.tumour_type.toLowerCase().includes(filterType.toLowerCase())) {
      return false;
    }
    if (filterMalignancy === "malignant" && !item.is_malignant) {
      return false;
    }
    if (filterMalignancy === "benign" && item.is_malignant) {
      return false;
    }
    if (filterNeedsReview && !item.needs_review) {
      return false;
    }
    if (searchCode && !item.patient_code.toLowerCase().includes(searchCode.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full p-6 space-y-6">
      {/* Success Notification */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ListFilter className="w-6 h-6 text-purple-600" />
            Patient Worklist & Scan Triage
          </h1>
          <p className="text-xs text-slate-500">
            Automated priority triage sorted by medical urgency score. Every patient has individual 3D brain scans, measurements, and AI insights.
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
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-purple-50 border border-purple-300 text-purple-700 hover:bg-purple-100 font-bold text-xs transition shadow-xs"
          >
            <PlusCircle className="w-4 h-4 text-purple-600" />
            <span>Quick Input Patient</span>
          </button>
          <Link
            href="/studies/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition shadow-sm"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Scan Files</span>
          </Link>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-white border border-slate-200 text-xs shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search Patient ID..."
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600 w-44 text-xs font-mono"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-purple-600"
          >
            <option value="all">All Tumour Types</option>
            <option value="glioma">Glioma / GBM</option>
            <option value="meningioma">Meningioma</option>
            <option value="pituitary">Pituitary</option>
            <option value="metastasis">Metastasis</option>
            <option value="schwannoma">Schwannoma</option>
            <option value="control">Normal / No Tumour</option>
          </select>

          {/* Malignancy Filter */}
          <select
            value={filterMalignancy}
            onChange={(e) => setFilterMalignancy(e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-xs focus:outline-none focus:border-purple-600"
          >
            <option value="all">All (Benign & Malignant)</option>
            <option value="benign">Benign Only (Non-Cancerous)</option>
            <option value="malignant">Malignant Only (Cancerous)</option>
          </select>
        </div>

        {/* Needs Review Filter Toggle */}
        <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
          <input
            type="checkbox"
            checked={filterNeedsReview}
            onChange={(e) => setFilterNeedsReview(e.target.checked)}
            className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4"
          />
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            Only Cases Flagged for Review
          </span>
        </label>
      </div>

      {/* Triage Worklist Table */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden text-xs shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-[11px] font-semibold">
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Scan Date</th>
                <th className="py-3 px-4">Tumour Type & Nature</th>
                <th className="py-3 px-4">Size (mL)</th>
                <th className="py-3 px-4">Key Highlights</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 text-xs">
                    No patients match your search criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.study_id} className="hover:bg-slate-50 transition">
                    {/* Priority */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-center font-bold text-xs border ${
                            item.urgency_score > 0.75
                              ? "bg-red-100 border-red-300 text-red-800"
                              : item.urgency_score > 0.5
                              ? "bg-amber-100 border-amber-300 text-amber-800"
                              : "bg-emerald-100 border-emerald-300 text-emerald-800"
                          }`}
                        >
                          {item.urgency_score > 0.75 ? "High" : item.urgency_score > 0.5 ? "Medium" : "Routine"}
                        </span>
                        {item.needs_review && (
                          <span title="Doctor review advised">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Patient */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <div className="flex items-center gap-1.5">
                        <span>{item.patient_code}</span>
                        {item.study_id.startsWith("custom-study-") && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Acquired */}
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {item.acquired_at}
                    </td>

                    {/* Tumour Prediction with Benign/Malignant Tag */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-bold text-slate-900 capitalize">
                          {item.tumour_type}
                        </span>
                        <span
                          className={`inline-block px-2 py-0.2 rounded-full text-[10px] font-bold border w-fit ${
                            item.is_malignant
                              ? "bg-red-50 border-red-200 text-red-700"
                              : "bg-emerald-50 border-emerald-200 text-emerald-700"
                          }`}
                        >
                          {item.is_malignant ? "Malignant (Cancerous)" : "Benign (Non-Cancerous)"}
                        </span>
                      </div>
                    </td>

                    {/* WT Volume */}
                    <td className="py-3 px-4 font-mono text-slate-900 font-bold">
                      {item.wt_volume_ml.toFixed(1)} mL
                    </td>

                    {/* Badges */}
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {item.badges.map((b, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] text-slate-700 font-medium"
                          >
                            {b}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Actions: AI Insights & Open Workspace */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/insights?studyId=${item.study_id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold transition text-xs border border-slate-200"
                          title="Open AI Insights for this patient"
                        >
                          <BarChart3 className="w-3.5 h-3.5 text-purple-600" />
                          <span>AI Insights</span>
                        </Link>
                        <Link
                          href={`/studies/view?id=${item.study_id}`}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold transition text-xs shadow-xs"
                          title="Open 3D Viewer and diagnosis workspace"
                        >
                          <span>Open Workspace</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Input Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-purple-600" />
                  Quick Input New Patient Scan
                </h3>
                <p className="text-xs text-slate-500">
                  Input new patient details to immediately record and triage in the worklist.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Patient Code / ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. PT-88129"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Patient Age & Sex</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      required
                      min={1}
                      max={120}
                      value={newAge}
                      onChange={(e) => setNewAge(Number(e.target.value))}
                      className="w-20 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-purple-600"
                    />
                    <select
                      value={newSex}
                      onChange={(e) => setNewSex(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-purple-600"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Tumour Type</label>
                  <select
                    value={newTumourType}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-purple-600"
                  >
                    <option value="Glioma">Glioma (Glioblastoma)</option>
                    <option value="Meningioma">Meningioma</option>
                    <option value="Pituitary">Pituitary Adenoma</option>
                    <option value="Metastasis">Brain Metastasis</option>
                    <option value="Schwannoma">Schwannoma</option>
                    <option value="No Tumour">Healthy Normal (No Tumour)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Clinical Nature</label>
                  <select
                    value={newIsMalignant ? "malignant" : "benign"}
                    onChange={(e) => setNewIsMalignant(e.target.value === "malignant")}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-purple-600 font-semibold"
                  >
                    <option value="malignant" className="text-red-700">Malignant (Cancerous)</option>
                    <option value="benign" className="text-emerald-700">Benign (Non-Cancerous)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Tumour Volume (mL)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    value={newVolume}
                    onChange={(e) => setNewVolume(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-purple-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700">Midline Shift (mm)</label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    value={newShift}
                    onChange={(e) => setNewShift(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-purple-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700">Clinical Notes / Indications</label>
                <input
                  type="text"
                  placeholder="e.g. Headache, blurred vision, MRI with gadolinium"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-purple-600"
                />
              </div>

              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-[11px] text-purple-800 space-y-0.5">
                <div className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>Automatic AI Calculation:</span>
                </div>
                <p>
                  Will generate 3D MPR tumour slices, core & swelling volumes, radiomics texture features, and AI insights specifically for this case.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold transition shadow-sm"
                >
                  Save & Record in Worklist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
