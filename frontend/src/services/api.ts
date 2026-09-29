import {
  DashboardOverview,
  SystemStatusResponse,
  AnalysisResponse,
  MemoryHistoryEntry
} from '../types';

const API_BASE = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api` 
  : '/api';

export async function fetchSystemStatus(): Promise<SystemStatusResponse> {
  const res = await fetch(`${API_BASE}/status`);
  if (!res.ok) throw new Error(`Status check failed: ${res.statusText}`);
  return res.json();
}

export async function fetchDashboardOverview(): Promise<DashboardOverview> {
  const res = await fetch(`${API_BASE}/dashboard/overview`);
  if (!res.ok) throw new Error(`Failed to load dashboard overview: ${res.statusText}`);
  return res.json();
}

export async function analyzeComplaint(complaint: string): Promise<AnalysisResponse> {
  const res = await fetch(`${API_BASE}/complaints/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ complaint }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Failed to analyze complaint');
  }
  return res.json();
}

export async function retainExperience(problem: string, action: string, result: string) {
  const res = await fetch(`${API_BASE}/memory/retain`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ problem, action, result }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail || 'Failed to retain experience');
  }
  return res.json();
}

export async function fetchMemoryHistory(): Promise<{ history: MemoryHistoryEntry[]; count: number; hindsight_bank: string }> {
  const res = await fetch(`${API_BASE}/memory/history`);
  if (!res.ok) throw new Error(`Failed to load memory history: ${res.statusText}`);
  return res.json();
}

export async function resetMemoryBank() {
  const res = await fetch(`${API_BASE}/memory/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset memory bank');
  return res.json();
}

export async function updateConfiguration(config: {
  hindsight_api_key?: string;
  hindsight_api_url?: string;
  hindsight_bank_id?: string;
  groq_api_key?: string;
}) {
  const res = await fetch(`${API_BASE}/config/update`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(config),
  });
  if (!res.ok) throw new Error('Failed to update configuration');
  return res.json();
}
