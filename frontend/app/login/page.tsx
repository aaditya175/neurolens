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
    // For Phase 0 mock authentication, redirect to worklist
    router.push("/worklist");
  };

  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 items-center justify-center shadow-lg shadow-cyan-500/20 mb-2">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Sign In to Neuro<span className="text-cyan-400">Lens</span>
          </h1>
          <p className="text-xs text-slate-400">
            Clinical Decision-Support MRI Workspace
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-clinical-surface p-6 shadow-xl space-y-5">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Staff Email / ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Role Context
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("doctor")}
                  className={`py-2 text-xs font-medium rounded-lg border transition ${
                    role === "doctor"
                      ? "bg-cyan-950/60 border-cyan-500 text-cyan-300"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  Doctor / Radiologist
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`py-2 text-xs font-medium rounded-lg border transition ${
                    role === "admin"
                      ? "bg-cyan-950/60 border-cyan-500 text-cyan-300"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200"
                  }`}
                >
                  System Administrator
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-sm transition shadow-lg shadow-cyan-500/20"
            >
              Enter Workspace
            </button>
          </form>

          <div className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-3 text-[11px] text-amber-400 flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500 mt-0.5" />
            <span>
              <strong>Notice:</strong> Authorized clinical & research personnel only. All access and actions are recorded in the system audit log.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
