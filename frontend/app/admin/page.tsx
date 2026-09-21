"use client";

import React, { useState } from "react";
import { ShieldCheck, Users, History, Cpu } from "lucide-react";

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
    { id: "u-1", email: "radiologist@neurolens.local", role: "Doctor / Radiologist", created_at: "2026-09-20" },
    { id: "u-2", email: "admin@neurolens.local", role: "System Administrator", created_at: "2026-09-18" },
  ];

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-purple-600" />
          System Administration & Audit Log
        </h1>
        <p className="text-xs text-slate-500">
          Security audit logs, authorized staff users, and active AI model registry.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("audit")}
          className={`px-4 py-2 font-bold border-b-2 transition ${
            activeTab === "audit"
              ? "border-purple-600 text-purple-700 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Security Audit Trail
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 font-bold border-b-2 transition ${
            activeTab === "users"
              ? "border-purple-600 text-purple-700 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Authorized Staff
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("models")}
          className={`px-4 py-2 font-bold border-b-2 transition ${
            activeTab === "models"
              ? "border-purple-600 text-purple-700 bg-white"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Registered AI Models
        </button>
      </div>

      {/* Audit Log Tab */}
      {activeTab === "audit" && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden text-xs shadow-sm">
          <div className="p-3 bg-slate-50 border-b border-slate-200 text-slate-600 text-[11px]">
            Every patient record access, mask edit, and exported PDF report is logged with UTC timestamps and IP records.
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-600 text-[11px] font-semibold">
                <th className="py-2.5 px-4">Timestamp (UTC)</th>
                <th className="py-2.5 px-4">User</th>
                <th className="py-2.5 px-4">Action Taken</th>
                <th className="py-2.5 px-4">Entity</th>
                <th className="py-2.5 px-4 font-mono">Record ID</th>
                <th className="py-2.5 px-4 font-mono">Client IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-4 text-slate-500">{log.timestamp}</td>
                  <td className="py-2.5 px-4 font-sans font-medium text-slate-900">{log.user}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-semibold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-600 font-sans">{log.entity}</td>
                  <td className="py-2.5 px-4 text-slate-700">{log.entity_id}</td>
                  <td className="py-2.5 px-4 text-slate-500">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden text-xs shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 text-[11px] font-semibold">
                <th className="py-2.5 px-4">Staff Email</th>
                <th className="py-2.5 px-4">Role</th>
                <th className="py-2.5 px-4">Account Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition">
                  <td className="py-2.5 px-4 font-medium text-slate-900">{u.email}</td>
                  <td className="py-2.5 px-4">
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-semibold">
                      {u.role}
                    </span>
                  </td>
                  <td className="py-2.5 px-4 text-slate-500 font-mono text-[11px]">{u.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Models Tab */}
      {activeTab === "models" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-sm">
            <h3 className="font-bold text-sm text-purple-700">MONAI SwinUNETR (3D Transformer)</h3>
            <p className="text-slate-600 text-[11px]">Primary 3D segmentation model. Analyzes the 4 MRI sequences simultaneously using a sliding window to generate sub-region masks.</p>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-bold font-mono">
              Version: swinunetr-v1
            </span>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 bg-white space-y-2 shadow-sm">
            <h3 className="font-bold text-sm text-purple-700">Classical Machine Learning (SVM RBF)</h3>
            <p className="text-slate-600 text-[11px]">Classical classification engine. Extracts 107 Pyradiomics texture and shape features, applying PCA and calibrated Support Vector Machines.</p>
            <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-100 border border-purple-300 text-purple-800 text-[10px] font-bold font-mono">
              Version: svm-rbf-v1
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
