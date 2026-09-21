"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, Lock, Mail, ShieldAlert } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("radiologist@neurolens.local");
  const [password, setPassword] = useState("doctor_demo_password");
  const [role, setRole] = useState("doctor");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/worklist");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-purple-600 items-center justify-center shadow-sm mb-1">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Sign In to Neuro<span className="text-purple-600">Lens</span>
          </h1>
          <p className="text-xs text-slate-500">
            Brain Tumour Analysis & Decision Support
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-600"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("doctor")}
                  className={`py-2 text-xs font-semibold rounded-lg border transition ${
                    role === "doctor"
                      ? "bg-purple-50 border-purple-300 text-purple-700 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  Doctor / Radiologist
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`py-2 text-xs font-semibold rounded-lg border transition ${
                    role === "admin"
                      ? "bg-purple-50 border-purple-300 text-purple-700 shadow-xs"
                      : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  System Admin
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm transition shadow-sm"
            >
              Enter Workspace
            </button>
          </form>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-800 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
            <span>
              <strong>Staff Notice:</strong> Authorized clinical and research personnel only. All access is logged for patient data compliance.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
