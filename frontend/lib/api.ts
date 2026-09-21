/**
 * NeuroLens Typed API Client
 */

import { AnalysisResult } from "./types/analysis";

export const RENDER_BACKEND_URL = "https://neurolens-dahk.onrender.com";
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://neurolens-dahk.onrender.com/api/v1";
export const SYSTEM_BASE = API_BASE.startsWith("http")
  ? API_BASE.replace("/api/v1", "")
  : "";

export async function fetchHealth(): Promise<{ status: string; service: string; disclaimer: string }> {
  // Try Netlify proxy (/health) or direct Render URL
  try {
    const target = SYSTEM_BASE ? `${SYSTEM_BASE}/health` : "/health";
    const res = await fetch(target, { cache: "no-store" });
    if (res.ok) return res.json();
  } catch {
    // If relative proxy or configured URL had issues, fallback to direct Render domain
    if (SYSTEM_BASE !== RENDER_BACKEND_URL) {
      const res = await fetch(`${RENDER_BACKEND_URL}/health`, { cache: "no-store" });
      if (res.ok) return res.json();
    }
  }
  throw new Error("Health check failed");
}

export async function fetchModelInfo(): Promise<any> {
  const target = `${SYSTEM_BASE || RENDER_BACKEND_URL}/model-info`;
  const res = await fetch(target);
  if (!res.ok) throw new Error("Failed to fetch model info");
  return res.json();
}

export async function fetchStudyAnalysis(studyId: string): Promise<AnalysisResult> {
  try {
    const res = await fetch(`${API_BASE}/studies/${studyId}/analysis`);
    if (res.ok) return res.json();
  } catch {
    // Try relative /api/v1 proxy on Netlify
    if (typeof window !== "undefined" && API_BASE.startsWith("http")) {
      const res = await fetch(`/api/v1/studies/${studyId}/analysis`);
      if (res.ok) return res.json();
    }
  }
  throw new Error(`Failed to load analysis for study ${studyId}`);
}

export async function fetchJobStatus(jobId: string): Promise<{
  id: string;
  status: 'queued' | 'running' | 'done' | 'failed';
  progress: number;
  stage: string;
}> {
  const res = await fetch(`${API_BASE}/jobs/${jobId}`);
  if (!res.ok) throw new Error(`Failed to fetch job ${jobId}`);
  return res.json();
}
