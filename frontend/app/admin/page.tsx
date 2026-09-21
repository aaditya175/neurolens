"use client";

import React, { useState } from "react";
import { ShieldCheck, Users, History, Cpu, FileText, CheckCircle2 } from "lucide-react";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"audit" | "users" | "models">("audit");

  const auditLogs = [
    { id: "1", user: "radiologist@neurolens.local", action: "export_pdf", entity: "study", entity_id: "856c7e19", timestamp: "2026-09-21 14:22:10", ip: "127.0.0.1" },
    { id: "2", user: "radiologist@neurolens.local", action: "edit_mask", entity: "mask", entity_id: "mask-v2", timestamp: "2026-09-21 13:45:04", ip: "127.0.0.1" },
    { id: "3", user: "radiologist@neurolens.local", action: "view_study", entity: "study", entity_id: "856c7e19", timestamp: "2026-09-21 13:30:15", ip: "127.0.0.1" },
    { id: "4", user: "system_worker", action: "analysis_complete", entity: "study", entity_id: "856c7e19", timestamp: "2026-09-21 13:28:44", ip: "127.0.0.1" },
    { id: "5", user: "radiologist@neurolens.local", action: "upload_study", entity: "study", entity_id: "856c7e19", timestamp: "2026-09-21 13:28:10", ip: "127.0.0.1" },
  ];

  const users = [
    { id: "u-1", email: "radiologist@neurolens.local", role: "doctor", created_at: "2026-09-20" },
    { id: "u-2", email: "admin@neurolens.local", role: "admin", created_at: "2026-09-18" },
  ];

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-cyan-400" />
          System Administration & Governance
        </h1>
        <p className="text-xs text-slate-400">
          User management, compliance audit trail, and model weights catalog.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "audit"
              ? "border-cyan-400 text-cyan-300 bg-clinical-surface"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Compliance Audit Trail
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "users"
              ? "border-cyan-400 text-cyan-300 bg-clinical-surface"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Authorized Users
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("models")}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === "models"
              ? "border-cyan-400 text-cyan-300 bg-clinical-surface"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Active Models
        </button>
      </div>

      {/* Audit Log Tab */}
      {activeTab === "audit" && (
        <div className="rounded-xl border border-slate-800 bg-clinical-surface overflow-hidden text-xs">
          <div className="p-3 bg-slate-900/60 border-b border-slate-800 text-slate-400 text-[11px]">
            Every PHI access, mask modification, and PDF generation is cryptographically timestamped and recorded.
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 text-[11px]">
                <th className="py-2.5 px-4 font-medium">Timestamp (UTC)</th>
                <th className="py-2.5 px-4 font-medium">User</th>
                <th className="py-2.5 px-4 font-medium">Action</th>
                <th className="py-2.5 px-4 font-medium">Entity</th>
                <th className="py-2.5 px-4 font-medium font-mono">Entity ID</th>
                <th className="py-2.5 px-4 font-medium font-mono">Client IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 text-slate-400">{log.timestamp}</td>
                  <td className="py-2.5 px-4 font-sans text-slate-200">{log.user}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-400 font-sans">{log.entity}</td>
                  <td className="py-2.5 px-4 text-slate-300">{log.entity_id}</td>
                  <td className="py-2.5 px-4 text-slate-500">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="rounded-xl border border-slate-800 bg-clinical-surface overflow-hidden text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-slate-400 text-[11px]">
                <th className="py-2.5 px-4 font-medium">Email</th>
                <th className="py-2.5 px-4 font-medium">Assigned Role</th>
                <th className="py-2.5 px-4 font-medium">Created Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans text-slate-200">{u.email}</td>
                  <td className="py-2.5 px-4">
                    <span className="capitalize px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-[11px]">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-400 font-mono text-[11px]">{u.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Models Tab */}
      {activeTab === "models" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-slate-800 bg-clinical-surface space-y-2">
            <h3 className="font-bold text-sm text-cyan-400">MONAI SwinUNETR (3D Transformer)</h3>
            <p className="text-slate-400 text-[11px]">Primary segmentation model. 4-channel input (T1, T1ce, T2, FLAIR). Sliding window inference with patch size 96³.</p>
            <span className="inline-block px-2 py-0.5 rounded bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-mono">
              Version: swinunetr-v1
            </span>
          </div>

          <div className="p-4 rounded-xl border border-slate-800 bg-clinical-surface space-y-2">
            <h3 className="font-bold text-sm text-purple-400">Radiomics SVM (RBF Kernel)</h3>
            <p className="text-slate-400 text-[11px]">Classical classification alternative. StandardScaler + 95% variance PCA + SVC with probability calibration.</p>
            <span className="inline-block px-2 py-0.5 rounded bg-purple-950 border border-purple-800 text-purple-300 text-[10px] font-mono">
              Version: svm-rbf-v1
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
