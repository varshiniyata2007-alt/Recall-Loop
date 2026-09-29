export interface ProblemItem {
  id: string;
  name: string;
  count: number;
  trend: 'Increasing' | 'Stable' | 'Decreasing';
  recurrence: 'Recurring' | 'New' | 'Resolved / Low';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  category: string;
  last_reported: string;
  sample_complaints: string[];
}

export interface DashboardOverview {
  total_complaints: number;
  active_problems: number;
  recurring_problems: number;
  increasing_problems: number;
  problems: ProblemItem[];
}

export interface HindsightStatus {
  sdk_installed: boolean;
  api_url: string;
  bank_id: string;
  is_key_provided: boolean;
  is_real_hindsight_active: boolean;
  status: 'connected' | 'unconfigured' | 'auth_failed' | 'connection_error' | 'sdk_missing';
  message: string;
}

export interface SystemStatusResponse {
  app_name: string;
  subtitle: string;
  hindsight: HindsightStatus;
  groq: {
    groq_installed: boolean;
    has_key: boolean;
    model: string;
    active: boolean;
  };
  environment: {
    hindsight_bank_id: string;
    hindsight_api_url: string;
    has_hindsight_key: boolean;
    has_groq_key: boolean;
  };
}

export interface RecalledMemoryItem {
  id: string;
  problem: string;
  action?: string;
  result?: string;
  text?: string;
  timestamp?: string;
  source: string;
  scores?: Record<string, number>;
}

export interface HindsightRecallResult {
  has_relevant_experience: boolean;
  problem: string;
  query: string;
  memories: RecalledMemoryItem[];
  previous_action: string | null;
  previous_result: string | null;
  source: string;
  is_real_hindsight: boolean;
  hindsight_status: HindsightStatus;
  raw_context: string;
}

export interface FactData {
  has_memory: boolean;
  problem: string;
  previous_action: string | null;
  previous_result: string | null;
  what_happened_next: string | null;
  statement: string;
  hindsight_source: string;
}

export interface AgentInsightData {
  headline: string;
  recurrence_alert: string;
  summary: string;
  suggested_focus: string;
  notice: string;
}

export interface AnalysisResponse {
  complaint: string;
  classification: {
    detected_problem: string;
    confidence: number;
    category: string;
    severity: string;
    trend: string;
    recurrence_status: string;
    complaint_count: number;
    similar_complaints: string[];
    raw_text: string;
  };
  hindsight_recall: HindsightRecallResult;
  insight_synthesis: {
    fact: FactData;
    agent_insight: AgentInsightData;
    engine_used: string;
  };
}

export interface MemoryHistoryEntry {
  id: string;
  problem: string;
  action: string;
  result: string;
  timestamp: string;
  formatted_text: string;
  tags: string[];
  source: string;
  real_hindsight_synced: boolean;
  hindsight_bank: string;
}
