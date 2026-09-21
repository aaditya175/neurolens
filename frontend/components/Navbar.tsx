"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Upload, ListFilter, BarChart2, ShieldCheck, User, BookOpen } from "lucide-react";
import { fetchHealth } from "@/lib/api";

export function Navbar() {
  const pathname = usePathname();
  const [backendStatus, setBackendStatus] = useState<"checking" | "online" | "offline">("checking");

  useEffect(() => {
    let isMounted = true;
    async function check() {
      try {
        const data = await fetchHealth();
        if (isMounted && data.status === "ok") {
          setBackendStatus("online");
        }
      } catch {
        if (isMounted) {
          // Render free instances take ~30-50s to wake up on cold boot; retry after 6s
          setTimeout(async () => {
            try {
              const retry = await fetchHealth();
              if (isMounted && retry.status === "ok") setBackendStatus("online");
            } catch {
              if (isMounted) setBackendStatus("offline");
            }
          }, 6000);
        }
      }
    }
    check();
    return () => {
      isMounted = false;
    };
  }, []);

  const navItems = [
    { name: "Patient Worklist", href: "/worklist", icon: ListFilter },
    { name: "Upload Scan", href: "/studies/new", icon: Upload },
    { name: "Medical Guide & Terms", href: "/info", icon: BookOpen },
    { name: "AI Insights", href: "/insights", icon: BarChart2 },
    { name: "Admin", href: "/admin", icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur shadow-xs">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-6">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 hover:opacity-90 transition">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center shadow-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="tracking-tight text-slate-900 font-extrabold">
              Neuro<span className="text-purple-600">Lens</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(`${item.href}`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    isActive
                      ? "bg-purple-50 text-purple-700 border border-purple-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Info & Profile */}
        <div className="flex items-center gap-3">
          {backendStatus === "online" && (
            <div
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs"
              title="Render Backend (neurolens-dahk.onrender.com) is LIVE & Connected"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-emerald-700 font-bold text-[11px]">Backend Connected</span>
            </div>
          )}
          {backendStatus === "checking" && (
            <div
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-xs"
              title="Connecting to Render backend..."
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-amber-700 font-medium text-[11px]">Connecting Backend...</span>
            </div>
          )}
          {backendStatus === "offline" && (
            <div
              className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs"
              title="Render free instance may be waking up (~45s) or running client-side engine."
            >
              <span className="w-2 h-2 rounded-full bg-purple-600"></span>
              <span className="text-slate-700 font-medium text-[11px]">System Online</span>
            </div>
          )}

          <Link
            href="/login"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-200 text-slate-700 border border-slate-200 transition"
          >
            <User className="w-3.5 h-3.5 text-purple-600" />
            <span className="hidden sm:inline">Dr. Radiologist</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
