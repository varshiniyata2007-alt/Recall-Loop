import React, { useState, useEffect } from 'react';
import {
  fetchSystemStatus,
  fetchDashboardOverview,
  analyzeComplaint,
  retainExperience,
  fetchMemoryHistory,
  resetMemoryBank,
  updateConfiguration
} from './services/api';
import {
  SystemStatusResponse,
  DashboardOverview,
  AnalysisResponse,
  MemoryHistoryEntry
} from './types';

import { Header } from './components/Header';
import { OverviewDashboard } from './components/OverviewDashboard';
import { ComplaintAnalysis } from './components/ComplaintAnalysis';
import { HindsightMemoryScreen } from './components/HindsightMemoryScreen';
import { ProductTeamAction } from './components/ProductTeamAction';
import { MemoryHistoryLoop } from './components/MemoryHistoryLoop';
import { SettingsModal } from './components/SettingsModal';
import { Sparkles, ArrowRight, Play, RotateCcw, AlertTriangle } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<'overview' | 'analysis' | 'hindsight' | 'action' | 'history'>('overview');
  const [systemStatus, setSystemStatus] = useState<SystemStatusResponse | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardOverview | null>(null);
  const [complaintInput, setComplaintInput] = useState('My payment failed three times.');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [history, setHistory] = useState<MemoryHistoryEntry[]>([]);
  
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    loadStatus();
    loadDashboard();
    loadHistory();
  }, []);

  const loadStatus = async () => {
    try {
      const res = await fetchSystemStatus();
      setSystemStatus(res);
    } catch (e) {
      console.error('Failed to load status:', e);
    }
  };

  const loadDashboard = async () => {
    setLoadingDashboard(true);
    try {
      const data = await fetchDashboardOverview();
      setDashboardData(data);
    } catch (e) {
      console.error('Failed to load dashboard:', e);
    } finally {
      setLoadingDashboard(false);
    }
  };

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await fetchMemoryHistory();
      setHistory(res.history);
    } catch (e) {
      console.error('Failed to load history:', e);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAnalyzeComplaint = async (complaintText: string) => {
    setAnalyzing(true);
    try {
      const res = await analyzeComplaint(complaintText);
      setAnalysisResult(res);
      // Auto switch to hindsight memory screen after analysis if on analysis screen
      setCurrentTab('hindsight');
    } catch (err: any) {
      alert(err.message || 'Failed to analyze complaint');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleRetainExperience = async (problem: string, action: string, result: string) => {
    const res = await retainExperience(problem, action, result);
    await loadHistory();
    await loadDashboard();
    return res;
  };

  const handleResetDemo = async () => {
    setIsResetting(true);
    try {
      await resetMemoryBank();
      setAnalysisResult(null);
      setComplaintInput('My payment failed three times.');
      await loadHistory();
      await loadDashboard();
      setCurrentTab('overview');
    } catch (e) {
      console.error('Reset failed:', e);
    } finally {
      setIsResetting(false);
    }
  };

  const handleStartPaymentDemo = () => {
    setComplaintInput('My payment failed three times.');
    setCurrentTab('analysis');
    handleAnalyzeComplaint('My payment failed three times.');
  };

  const handleTriggerSecondOccurrence = () => {
    const secondComplaint = 'Card checkout keeps declining at checkout.';
    setComplaintInput(secondComplaint);
    handleAnalyzeComplaint(secondComplaint);
  };

  const handleSaveConfig = async (config: any) => {
    await updateConfiguration(config);
    await loadStatus();
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-white">
      {/* Top Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={(tab: any) => setCurrentTab(tab)}
        status={systemStatus}
        onReset={handleResetDemo}
        onOpenSettings={() => setSettingsOpen(true)}
        isResetting={isResetting}
      />

      {/* Guided Judge Walkthrough Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/40 py-2.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px] tracking-wider uppercase border border-indigo-500/30">
              Interactive 60s Demo Guide
            </span>
            <span className="text-slate-400">
              Flow: 1. Payment Complaint → 2. No Memory → 3. Retain Action → 4. Second Complaint → 5. Recurring Recall!
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleStartPaymentDemo}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 text-white font-medium text-[11px] transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Step 1: First Occurrence</span>
            </button>

            <button
              onClick={handleTriggerSecondOccurrence}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-amber-600/80 hover:bg-amber-600 text-white font-medium text-[11px] transition-all cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Step 2: Second Occurrence (Recall)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'overview' && (
          <OverviewDashboard
            data={dashboardData}
            loading={loadingDashboard}
            onSelectProblemForDemo={(name, sample) => {
              if (sample) setComplaintInput(sample);
              setCurrentTab('analysis');
              if (sample) handleAnalyzeComplaint(sample);
            }}
            onStartPaymentDemo={handleStartPaymentDemo}
          />
        )}

        {currentTab === 'analysis' && (
          <ComplaintAnalysis
            complaintInput={complaintInput}
            setComplaintInput={setComplaintInput}
            onAnalyze={handleAnalyzeComplaint}
            analysisResult={analysisResult}
            loading={analyzing}
            onNavigateToHindsight={() => setCurrentTab('hindsight')}
          />
        )}

        {currentTab === 'hindsight' && (
          <HindsightMemoryScreen
            analysisResult={analysisResult}
            onRetain={handleRetainExperience}
            onAnalyzeNextComplaint={(nextComplaint) => {
              setComplaintInput(nextComplaint);
              handleAnalyzeComplaint(nextComplaint);
            }}
            onNavigateToHistory={() => {
              loadHistory();
              setCurrentTab('history');
            }}
            onNavigateToAnalysis={() => setCurrentTab('analysis')}
            hindsightStatus={systemStatus?.hindsight}
          />
        )}

        {currentTab === 'action' && (
          <ProductTeamAction
            currentProblem={analysisResult?.classification.detected_problem || 'Payment Failure'}
            analysisResult={analysisResult}
            onRetain={handleRetainExperience}
            onNavigateToHistory={() => {
              loadHistory();
              setCurrentTab('history');
            }}
            onTriggerSecondOccurrenceDemo={handleTriggerSecondOccurrence}
            hindsightStatus={systemStatus?.hindsight}
          />
        )}

        {currentTab === 'history' && (
          <MemoryHistoryLoop
            history={history}
            loading={loadingHistory}
            onRefreshHistory={loadHistory}
            onStartNewDemo={handleResetDemo}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-slate-400">RecallLoop</strong> — AI Product Memory Agent powered by{' '}
            <span className="text-cyan-400 font-mono">Hindsight SDK</span> &{' '}
            <span className="text-indigo-400 font-mono">Groq API</span>.
          </div>
          <div className="text-[11px] text-slate-600 font-mono">
            Persistent Memory Architecture • Hackathon Build
          </div>
        </div>
      </footer>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        status={systemStatus}
        onSaveConfig={handleSaveConfig}
      />
    </div>
  );
}

export default App;
