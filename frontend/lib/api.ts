/**
 * NeuroLens Typed API Client
 */

import { AnalysisResult } from "./types/analysis";

export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
export const SYSTEM_BASE = API_BASE.replace("/api/v1", "");

export async function fetchHealth(): Promise<{ status: string; service: string; disclaimer: string }> {
  const res = await fetch(`${SYSTEM_BASE}/health`);
  if (!res.ok) throw new Error("Health check failed");
  return res.json();
}

export async function fetchModelInfo(): Promise<any> {
  const res = await fetch(`${SYSTEM_BASE}/model-info`);
  if (!res.ok) throw new Error("Failed to fetch model info");
  return res.json();
}

export async function fetchStudyAnalysis(studyId: string): Promise<AnalysisResult> {
  const res = await fetch(`${API_BASE}/studies/${studyId}/analysis`);
  if (!res.ok) throw new Error(`Failed to load analysis for study ${studyId}`);
  return res.json();
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
