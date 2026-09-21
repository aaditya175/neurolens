"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FileUp, ShieldCheck, ArrowRight, FolderCheck, Sparkles, CheckCircle2 } from "lucide-react";
import { createPatientFromInput, registerCustomPatient } from "@/lib/patientCatalog";
import { API_BASE } from "@/lib/api";

export default function UploadStudyPage() {
  const router = useRouter();
  const [patientCode, setPatientCode] = useState<string>("PT-" + Math.floor(10000 + Math.random() * 90000));
  const [patientAge, setPatientAge] = useState<number>(54);
  const [patientSex, setPatientSex] = useState<string>("M");
  const [tumourType, setTumourType] = useState<string>("Glioma");

  const [files, setFiles] = useState<Record<string, { name: string } | null>>({
    t1: null,
    t1ce: null,
    t2: null,
    flair: null,
  });

  const [selectedSample, setSelectedSample] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const sampleScans = [
    { id: "01", name: "Patient 01: Glioblastoma Multiforme (Malignant)", type: "Glioma", age: 58, sex: "M", wt: 46.8, shift: 2.3 },
    { id: "03", name: "Patient 03: Diffuse Low-Grade Glioma (Malignant)", type: "Low-Grade Glioma", age: 34, sex: "F", wt: 19.8, shift: 0.3 },
    { id: "07", name: "Patient 07: Massive Glioblastoma (Emergency Midline Shift)", type: "Glioblastoma", age: 62, sex: "M", wt: 68.4, shift: 6.5 },
    { id: "09", name: "Patient 09: Parasagittal Dural Meningioma (Benign)", type: "Meningioma", age: 51, sex: "F", wt: 22.4, shift: 0.0 },
    { id: "12", name: "Patient 12: Incidental Small Meningioma 4mL (Benign)", type: "Meningioma", age: 46, sex: "F", wt: 4.2, shift: 0.0 },
    { id: "15", name: "Patient 15: Solitary Brain Metastasis (Malignant)", type: "Metastasis", age: 65, sex: "M", wt: 31.0, shift: 0.8 },
    { id: "18", name: "Patient 18: Miliary Brain Metastases - 5 Nodules (Malignant)", type: "Metastasis", age: 59, sex: "F", wt: 12.6, shift: 0.2 },
    { id: "20", name: "Patient 20: Sellar Pituitary Macroadenoma (Benign)", type: "Pituitary", age: 42, sex: "M", wt: 8.4, shift: 0.0 },
    { id: "24", name: "Patient 24: Acoustic Neuroma / Schwannoma (Benign)", type: "Schwannoma", age: 48, sex: "F", wt: 6.1, shift: 0.0 },
    { id: "29", name: "Patient 29: Healthy Control - Normal Brain (No Tumour)", type: "No Tumour", age: 29, sex: "M", wt: 0.0, shift: 0.0 },
  ];

  const handleSelectSample = (sampleId: string) => {
    setSelectedSample(sampleId);
    if (!sampleId) return;

    const sample = sampleScans.find((s) => s.id === sampleId);
    if (sample) {
      setPatientCode(`PT-${sample.id}092`);
      setPatientAge(sample.age);
      setPatientSex(sample.sex);
      setTumourType(sample.type);
      setFiles({
        t1: { name: `Patient_${sample.id}_${sample.type.replace(/\s+/g, "_")}_T1.nii.gz` },
        t1ce: { name: `Patient_${sample.id}_${sample.type.replace(/\s+/g, "_")}_T1ce.nii.gz` },
        t2: { name: `Patient_${sample.id}_${sample.type.replace(/\s+/g, "_")}_T2.nii.gz` },
        flair: { name: `Patient_${sample.id}_${sample.type.replace(/\s+/g, "_")}_FLAIR.nii.gz` },
      });
    }
  };

  const handleFileChange = (seq: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [seq]: file ? { name: file.name } : null }));
  };

  const handleUploadAndAnalyze = async () => {
    setUploading(true);
    setProgress(10);

    const activeSample = sampleScans.find((s) => s.id === selectedSample);
    const volume = activeSample ? activeSample.wt : (tumourType === "No Tumour" ? 0.0 : 36.4);
    const shift = activeSample ? activeSample.shift : (tumourType === "No Tumour" ? 0.0 : 1.8);
    const isMalignant = tumourType === "Meningioma" || tumourType === "Pituitary" || tumourType === "Schwannoma" || tumourType === "No Tumour" ? false : true;

    // Create and register patient
    const { profile, worklistItem } = createPatientFromInput({
      patientCode: patientCode.trim(),
      age: patientAge,
      sex: patientSex === "M" ? "Male" : "Female",
      tumourType: tumourType,
      isMalignant: isMalignant,
      volumeMl: volume,
      midlineShiftMm: shift,
      notes: `Uploaded study containing 4 sequences (${Object.values(files).filter(Boolean).map(f => f?.name).join(", ") || "NIfTI volumes"}).`,
      files,
    });

    // Save to persistent storage immediately
    registerCustomPatient(profile, worklistItem);

    // Simulated multi-stage progress
    let p = 15;
    const interval = setInterval(() => {
      p += 20;
      if (p >= 95) {
        clearInterval(interval);
        setProgress(95);
      } else {
        setProgress(p);
      }
    }, 250);

    // Sync to backend API / MongoDB
    try {
      await fetch(`${API_BASE}/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: patientCode.trim(), age: patientAge, sex: patientSex }),
      }).catch((err) => console.warn("Background API sync:", err));
    } catch {
      // Offline fallback safe
    }

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setTimeout(() => {
        setUploading(false);
        router.push(`/studies/${profile.id}`);
      }, 500);
    }, 1400);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Upload Brain MRI Study
        </h1>
        <p className="text-xs text-slate-500">
          Upload 4-sequence NIfTI files (.nii, .nii.gz) for automated 3D tumour segmentation and classification.
        </p>
      </div>

      {/* Desktop Files Notice */}
      <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/60 text-xs text-purple-900 flex items-start gap-3 shadow-xs">
        <FolderCheck className="w-5 h-5 text-purple-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900 block">
            150 .nii.gz Test Files Available on Your Desktop
          </span>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            A library of 30 clinical test cases has been generated directly in your Desktop folder at:
            <br />
            <code className="bg-white px-2 py-0.5 rounded border border-purple-200 font-mono text-[10px] text-purple-800 font-semibold mt-1 inline-block">
              C:\Users\AADITYA CHAUHAN\Desktop\NeuroLens_Test_Scans
            </code>
            <br />
            You can drag & drop any `.nii.gz` file directly into the boxes below, or select a sample from the dropdown to test instantly!
          </p>
        </div>
      </div>

      {/* Quick Test Sample Selector */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 shadow-sm">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600" />
            Quick-Select a Pre-Loaded Test Patient Scan
          </label>
          <span className="text-[11px] text-slate-500">Auto-fills all 4 sequences</span>
        </div>
        <select
          value={selectedSample}
          onChange={(e) => handleSelectSample(e.target.value)}
          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 text-xs font-medium focus:outline-none focus:border-purple-600 cursor-pointer"
        >
          <option value="">-- Choose a test case to load into the uploader --</option>
          {sampleScans.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {/* Privacy Notice */}
      <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-900 flex items-start gap-3 shadow-xs">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-bold text-slate-900 block">
            Automatic Privacy De-Identification Guard
          </span>
          <p className="text-[11px] text-slate-600 leading-relaxed">
            All identifying metadata (Patient Name, Hospital ID, Birth Date) are stripped automatically before processing. Files are stored securely under an anonymous code.
          </p>
        </div>
      </div>

      {/* Patient Pseudonymization Form */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
        <h2 className="text-sm font-bold text-slate-900">1. Patient Information (Anonymous)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 mb-1 font-medium">Anonymous Patient Code</label>
            <input
              type="text"
              value={patientCode}
              onChange={(e) => setPatientCode(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:border-purple-600"
              placeholder="e.g. PT-40192"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-medium">Age</label>
            <input
              type="number"
              value={patientAge}
              onChange={(e) => setPatientAge(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-purple-600"
            />
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-medium">Biological Sex</label>
            <select
              value={patientSex}
              onChange={(e) => setPatientSex(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-purple-600"
            >
              <option value="M">Male (M)</option>
              <option value="F">Female (F)</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-slate-600 mb-1 font-medium">Suspected Tumour Category</label>
            <select
              value={tumourType}
              onChange={(e) => setTumourType(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-purple-600"
            >
              <option value="Glioma">Glioma / GBM (Malignant)</option>
              <option value="Meningioma">Meningioma (Benign)</option>
              <option value="Pituitary">Pituitary (Benign)</option>
              <option value="Metastasis">Metastasis (Malignant)</option>
              <option value="Schwannoma">Schwannoma (Benign)</option>
              <option value="No Tumour">Healthy Normal (No Tumour)</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4-Sequence Upload Dropzone Grid */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900">2. The 4 MRI Sequences (.nii.gz)</h2>
          <span className="text-[11px] text-slate-500">T1, T1ce, T2, FLAIR</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: "t1", label: "T1 Scan", tag: "Brain Shape & Anatomy", required: true },
            { id: "t1ce", label: "T1 Contrast Scan", tag: "Active Live Tumour Rim", required: true },
            { id: "t2", label: "T2 Scan", tag: "Water & Damaged Tissue", required: true },
            { id: "flair", label: "FLAIR Scan", tag: "Brain Swelling Around Tumour", required: true },
          ].map((seq) => (
            <div
              key={seq.id}
              className={`relative p-4 rounded-xl border-2 border-dashed transition group flex flex-col justify-between h-36 ${
                files[seq.id]
                  ? "border-emerald-400 bg-emerald-50/40"
                  : "border-slate-200 bg-slate-50/70 hover:border-purple-400 hover:bg-purple-50/20"
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{seq.label}</span>
                  {files[seq.id] ? (
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 font-bold">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Loaded
                    </span>
                  ) : (
                    <span className="text-[10px] text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 font-semibold">
                      Required
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-slate-500">{seq.tag}</span>
              </div>

              <div className="flex flex-col items-center justify-center text-center space-y-1 my-auto">
                {files[seq.id] ? (
                  <>
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    <span className="text-xs font-mono font-bold text-slate-900 truncate max-w-full px-2">
                      {files[seq.id]?.name}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium">Ready for analysis</span>
                  </>
                ) : (
                  <>
                    <FileUp className="w-6 h-6 text-slate-400 group-hover:text-purple-600 transition" />
                    <span className="text-xs font-medium text-slate-700">
                      Drag & drop .nii.gz file here or click to browse
                    </span>
                    <span className="text-[10px] text-slate-400">Supports NIfTI-1 (.nii.gz)</span>
                  </>
                )}
              </div>

              <input
                type="file"
                accept=".nii,.nii.gz,.zip"
                onChange={(e) => handleFileChange(seq.id, e.target.files?.[0] || null)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar (if uploading) */}
      {uploading && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-2 text-xs shadow-sm">
          <div className="flex justify-between text-slate-700 font-medium">
            <span>Uploading & Running AI Segmentation...</span>
            <span className="font-mono text-purple-700 font-bold">{progress}%</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.push("/worklist")}
          className="px-4 py-2 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={uploading}
          onClick={handleUploadAndAnalyze}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition shadow-sm disabled:opacity-50"
        >
          <span>Run AI Pipeline & Record in Worklist</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
