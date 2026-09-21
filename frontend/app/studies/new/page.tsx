"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileUp, CheckCircle, AlertTriangle, ShieldCheck, ArrowRight } from "lucide-react";

export default function UploadStudyPage() {
  const router = useRouter();
  const [patientCode, setPatientCode] = useState<string>("PT-" + Math.floor(10000 + Math.random() * 90000));
  const [patientAge, setPatientAge] = useState<number>(54);
  const [patientSex, setPatientSex] = useState<string>("M");

  const [files, setFiles] = useState<Record<string, File | null>>({
    t1: null,
    t1ce: null,
    t2: null,
    flair: null,
  });

  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (seq: string, file: File | null) => {
    setFiles((prev) => ({ ...prev, [seq]: file }));
  };

  const handleDemoUpload = async () => {
    // Generates/uses demo synthetic upload
    setUploading(true);
    setProgress(15);
    try {
      const step1 = setInterval(() => {
        setProgress((p) => {
          if (p >= 90) {
            clearInterval(step1);
            return 90;
          }
          return p + 25;
        });
      }, 300);

      // Create patient
      const pRes = await fetch("http://localhost:8000/api/v1/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: patientCode, age: patientAge, sex: patientSex }),
      });
      const patient = await pRes.json();

      // Trigger redirect to study workspace with generated patient ID
      setTimeout(() => {
        setProgress(100);
        setUploading(false);
        router.push(`/studies/${patient.id || "demo-study-uuid"}`);
      }, 1200);
    } catch (e: any) {
      setError("Failed to upload: using local mock demo fallback.");
      setTimeout(() => {
        router.push("/studies/demo-study-uuid");
      }, 1000);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full p-6 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Upload Brain MRI Study
        </h1>
        <p className="text-xs text-slate-400">
          Upload standard 4-sequence NIfTI files (.nii, .nii.gz) or DICOM archives.
        </p>
      </div>

      {/* Anonymization Governance Notice */}
      <div className="p-4 rounded-xl border border-cyan-900/50 bg-cyan-950/20 text-xs text-cyan-300 flex items-start gap-3 shadow-lg shadow-cyan-950/10">
        <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-cyan-200">
            Automated De-Identification & HIPAA/GDPR Compliance Guard
          </span>
          <p className="text-[11px] text-cyan-300/80 leading-relaxed">
            All identifying DICOM tags (PatientName, PatientID, Institution, BirthDate) are stripped and purged in memory before storage. Files are saved under randomized UUID isolated directories.
          </p>
        </div>
      </div>

      {/* Patient Pseudonymization Form */}
      <div className="rounded-xl border border-slate-800 bg-clinical-surface p-5 space-y-4">
        <h2 className="text-sm font-semibold text-slate-200">1. Patient Information (Pseudonymised)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Subject Code</label>
            <input
              type="text"
              value={patientCode}
              onChange={(e) => setPatientCode(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-cyan-500"
              placeholder="e.g. PT-40192"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Age</label>
            <input
              type="number"
              value={patientAge}
              onChange={(e) => setPatientAge(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Sex</label>
            <select
              value={patientSex}
              onChange={(e) => setPatientSex(e.target.value)}
              className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="M">Male (M)</option>
              <option value="F">Female (F)</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4-Sequence Upload Dropzone Grid */}
      <div className="rounded-xl border border-slate-800 bg-clinical-surface p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-200">2. MRI Sequences (.nii.gz)</h2>
          <span className="text-[11px] text-slate-500 font-mono">Multi-modal protocol</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { id: "t1", label: "T1 Native", tag: "Anatomy", required: true },
            { id: "t1ce", label: "T1ce Post-Contrast", tag: "Enhancing (ET)", required: true },
            { id: "t2", label: "T2 Axial", tag: "Edema / Fluid", required: true },
            { id: "flair", label: "FLAIR Axial", tag: "Infiltration (ED)", required: true },
          ].map((seq) => (
            <div
              key={seq.id}
              className="relative p-4 rounded-xl border border-dashed border-slate-700 bg-slate-900/60 hover:border-cyan-500/60 transition group flex flex-col justify-between h-36"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-100 uppercase">{seq.label}</span>
                  {seq.required && (
                    <span className="text-[10px] text-cyan-400 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-800">
                      Required
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-mono">{seq.tag}</span>
              </div>

              <div className="flex flex-col items-center justify-center text-center space-y-1 my-auto">
                <FileUp className="w-6 h-6 text-slate-500 group-hover:text-cyan-400 transition" />
                <span className="text-xs text-slate-300">
                  {files[seq.id] ? files[seq.id]?.name : "Drag & drop or click to upload"}
                </span>
                <span className="text-[10px] text-slate-600">Supports NIfTI-1 (.nii.gz)</span>
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
        <div className="rounded-xl border border-slate-800 bg-clinical-surface p-4 space-y-2 text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Uploading & Validating Sequences...</span>
            <span className="font-mono text-cyan-400">{progress}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-300"
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
          className="px-4 py-2 rounded-lg text-xs font-medium text-slate-400 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={uploading}
          onClick={handleDemoUpload}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-cyan-500/20 disabled:opacity-50"
        >
          <span>Ingest & Run Full Analysis</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
