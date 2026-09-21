"use client";

import React, { Suspense } from "react";
import PatientTimelineClient from "../[id]/PatientTimelineClient";

export default function PatientViewPage() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center p-8 space-y-4 text-center">
        <div className="space-y-3">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-600 font-medium">Loading Patient Timeline...</p>
        </div>
      </div>
    }>
      <PatientTimelineClient />
    </Suspense>
  );
}
