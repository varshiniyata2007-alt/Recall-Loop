import React, { useState } from 'react';
import {
  Brain,
  Database,
  History,
  AlertTriangle,
  ArrowRight,
  Send,
  Save,
  CheckCircle2,
  Sparkles,
  Info,
  RotateCcw,
  Layers
} from 'lucide-react';
import type { AnalysisResponse, HindsightStatus } from '../types';

interface HindsightMemoryScreenProps {
  analysisResult: AnalysisResponse | null;
  onRetain: (problem: string, action: string, result: string) => Promise<any>;
  onAnalyzeNextComplaint: (complaintText: string) => void;
  onNavigateToHistory: () => void;
  onNavigateToAnalysis: () => void;
  hindsightStatus?: HindsightStatus;
}

export const HindsightMemoryScreen: React.FC<HindsightMemoryScreenProps> = ({
  analysisResult,
  onRetain,
  onAnalyzeNextComplaint,
  onNavigateToHistory,
  onNavigateToAnalysis,
  hindsightStatus,
}) => {
  const [actionInput, setActionInput] = useState('');
  const [resultInput, setResultInput] = useState('');
  const [actionRecorded, setActionRecorded] = useState(false);
  const [isRetaining, setIsRetaining] = useState(false);
  const [retainedData, setRetainedData] = useState<any | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  if (!analysisResult) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
          <Brain className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">No Active Complaint Analysis</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Please enter or analyze a customer complaint first to check Hindsight for previous product-solving experience.
        </p>
        <button
          onClick={onNavigateToAnalysis}
          className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-lg transition-all"
        >
          <span>Go to Complaint Analysis</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  const { classification, hindsight_recall, insight_synthesis } = analysisResult;
  const { fact, agent_insight } = insight_synthesis;
  const hasMemory = fact.has_memory;
  const problemName = classification.detected_problem;

  // Preset demo values based on whether memory was recalled or not
  const defaultActionPreset = !hasMemory ? 'Payment gateway changed' : 'Updated payment gateway';
  const defaultResultPreset = !hasMemory ? 'Complaints decreased temporarily' : 'Payment complaints decreased';

  const handleRecordAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionInput.trim()) {
      setActionError('Please enter the Action Taken by the product team.');
      return;
    }
    setActionError(null);
    setActionRecorded(true);
  };

  const handleSaveExperience = async () => {
    if (!actionInput.trim() || !resultInput.trim()) {
      setActionError('Both Action Taken and Result Outcome are required to retain this experience.');
      return;
    }
    setActionError(null);
    setIsRetaining(true);
    try {
      const res = await onRetain(problemName, actionInput.trim(), resultInput.trim());
      setRetainedData(res);
    } catch (err: any) {
      setActionError(err.message || 'Failed to retain experience in Hindsight.');
    } finally {
      setIsRetaining(false);
    }
  };

  const handlePreFill = (actionText: string, resultText: string) => {
    setActionInput(actionText);
    setResultInput(resultText);
    setActionRecorded(true);
    setActionError(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Screen Title & Hindsight Verification Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Brain className="w-4 h-4 text-cyan-400" />
            <span>Screen 3: Hindsight Memory Recall & Product Team Action</span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
              Core Innovation
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Persistent Product-Solving Memory
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real Hindsight retain/recall loop for previous actions, results, and learned outcomes.
          </p>
        </div>

        {/* Live Bank Indicator */}
        <div className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 border border-indigo-500/30">
          <Database className="w-4 h-4 text-cyan-400" />
          <div className="text-left">
            <div className="text-[11px] font-semibold text-slate-200">
              Bank: <span className="font-mono text-cyan-400">{hindsight_recall.hindsight_status?.bank_id || 'recallloop-product-memory'}</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Source: <span className="font-mono text-slate-300">{hindsight_recall.source}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Complaint Under Review */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400">Detected Problem:</span>
          <div className="px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 font-semibold text-sm">
            {problemName}
          </div>
          <div className="text-xs text-slate-400">
            Complaint: <span className="font-mono text-slate-200">"{analysisResult.complaint}"</span>
          </div>
        </div>
        <span className="text-xs font-mono text-slate-500">
          Volume: {classification.complaint_count.toLocaleString()} complaints
        </span>
      </div>

      {/* ========================================================================= */}
      {/* 1ST OCCURRENCE: NO RELEVANT PREVIOUS EXPERIENCE FOUND                     */}
      {/* ========================================================================= */}
      {!hasMemory && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <History className="w-7 h-7 text-slate-400" />
            </div>

            <div className="space-y-1.5 max-w-lg mx-auto">
              <span className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                First Occurrence • Clean Memory State
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                No relevant previous experience found.
              </h3>
              <p className="text-xs text-slate-400">
                {fact.statement}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 max-w-xl mx-auto text-left space-y-1">
              <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Strict Memory Guarantee: Never Invent History</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                RecallLoop does not hallucinate previous fixes. Because this is the first incident in persistent Hindsight memory, the product team records their action and result below to establish the baseline.
              </p>
            </div>
          </div>

          {/* ===================================================================== */}
          {/* PRODUCT TEAM ACTION + OUTCOME SECTIONS (Required by Hackathon)        */}
          {/* ===================================================================== */}
          <div className="bg-slate-900/90 border-2 border-indigo-500/30 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                  Product Team Decision Panel
                </span>
                <h3 className="text-lg font-bold text-white">
                  Record Mitigation & Save into Hindsight
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handlePreFill('Payment gateway changed', 'Complaints decreased temporarily')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-950 hover:bg-indigo-900 border border-indigo-500/30 text-xs text-indigo-300 transition-all font-mono cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Auto-fill Demo Inputs</span>
              </button>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-xs text-rose-300">
                {actionError}
              </div>
            )}

            {/* Section 1: Product Team Action */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs flex items-center justify-center font-bold">
                    1
                  </span>
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    Product Team Action
                  </label>
                </div>
                {actionRecorded && (
                  <span className="inline-flex items-center space-x-1 text-xs text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Action Recorded</span>
                  </span>
                )}
              </div>

              <form onSubmit={handleRecordAction} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={actionInput}
                    onChange={(e) => {
                      setActionInput(e.target.value);
                      setActionRecorded(false);
                    }}
                    placeholder="e.g. Payment gateway changed"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="flex items-center justify-center space-x-1.5 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-medium text-xs shadow transition-all cursor-pointer whitespace-nowrap"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Record Action</span>
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                  <span>Preset:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setActionInput('Payment gateway changed');
                      setActionRecorded(true);
                    }}
                    className="text-indigo-400 hover:underline font-mono"
                  >
                    "Payment gateway changed"
                  </button>
                </div>
              </form>
            </div>

            {/* Section 2: Outcome & Save Experience */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs flex items-center justify-center font-bold">
                    2
                  </span>
                  <label className="text-xs font-bold text-white uppercase tracking-wider">
                    Outcome / Result (Save into Hindsight)
                  </label>
                </div>
                <span className="text-[10px] font-mono text-cyan-400">
                  Bank: {hindsightStatus?.bank_id || 'recallloop-product-memory'}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={resultInput}
                    onChange={(e) => setResultInput(e.target.value)}
                    placeholder="e.g. Complaints decreased temporarily"
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleSaveExperience}
                    disabled={isRetaining || !actionInput.trim() || !resultInput.trim()}
                    className="flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap"
                  >
                    {isRetaining ? (
                      <>
                        <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                        <span>Retaining in Hindsight...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        <span>Save Experience</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 flex items-center space-x-2">
                  <span>Preset:</span>
                  <button
                    type="button"
                    onClick={() => setResultInput('Complaints decreased temporarily')}
                    className="text-cyan-400 hover:underline font-mono"
                  >
                    "Complaints decreased temporarily"
                  </button>
                </div>
              </div>
            </div>

            {/* Clear Success State Card */}
            {retainedData && (
              <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Experience Successfully Retained in Hindsight!
                    </h4>
                    <p className="text-xs text-emerald-300 font-mono">
                      Unit ID: {retainedData.memory.id} • Bank: {retainedData.memory.hindsight_bank}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-900/60 p-3 rounded-lg border border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                      Problem & Action Retained:
                    </span>
                    <span className="text-white font-mono mt-0.5 block">
                      {retainedData.memory.problem} → "{retainedData.memory.action}"
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase font-semibold text-[10px] block">
                      Result Retained:
                    </span>
                    <span className="text-emerald-300 font-mono mt-0.5 block">
                      "{retainedData.memory.result}"
                    </span>
                  </div>
                </div>

                {/* Next Step: Trigger Second Occurrence */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    onClick={() => onAnalyzeNextComplaint('Card checkout keeps declining at checkout.')}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-indigo-600 to-indigo-500 hover:from-amber-500 hover:to-indigo-400 text-white font-bold text-xs shadow-xl transition-all cursor-pointer"
                  >
                    <span>Analyze Second Complaint (Verify Hindsight Recall!)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onNavigateToHistory}
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700 cursor-pointer"
                  >
                    <span>View Memory History Loop</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2ND OCCURRENCE: RECURRING PROBLEM RECALLED DYNAMICALLY FROM HINDSIGHT     */}
      {/* ========================================================================= */}
      {hasMemory && (
        <div className="space-y-6">
          {/* Prominent RECURRING PROBLEM Alert Header */}
          <div className="rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/40 border-2 border-amber-500/50 p-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-start space-x-4">
              <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <AlertTriangle className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    RECURRING PROBLEM
                  </span>
                  <span className="text-xs font-mono text-amber-400/80">
                    Retrieved via Hindsight Recall
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1">
                  "{problemName} is recurring. A previous fix reduced complaints temporarily, but the problem returned."
                </h3>
                <p className="text-xs text-amber-200/80 max-w-3xl">
                  Hindsight recalled the exact previous action and result so the team does not repeat a failed or temporary fix.
                </p>
              </div>
            </div>
          </div>

          {/* TWO COLUMN GRID: FACT (Hindsight Recall) vs AGENT INSIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* COLUMN 1: FACT */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Database className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      FACT (From Persistent Hindsight Memory)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    Recalled Live
                  </span>
                </div>

                {/* Previous Problem */}
                <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-slate-400 tracking-wider">
                    Previous Problem
                  </span>
                  <p className="text-sm font-semibold text-white">
                    {fact.problem}
                  </p>
                </div>

                {/* Previous Action */}
                <div className="bg-slate-950/70 border border-indigo-500/30 rounded-xl p-3.5 space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-indigo-400 tracking-wider">
                    Previous Action Taken
                  </span>
                  <p className="text-sm font-medium text-white font-mono">
                    "{fact.previous_action || 'No action recorded'}"
                  </p>
                </div>

                {/* Previous Result */}
                <div className="bg-slate-950/70 border border-amber-500/30 rounded-xl p-3.5 space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-amber-400 tracking-wider">
                    Previous Result / Outcome
                  </span>
                  <p className="text-sm font-medium text-amber-200 font-mono">
                    "{fact.previous_result || 'No outcome recorded'}"
                  </p>
                </div>

                {/* What happened next */}
                <div className="bg-slate-950/70 border border-rose-500/30 rounded-xl p-3.5 space-y-1">
                  <span className="text-[11px] font-semibold uppercase text-rose-400 tracking-wider">
                    What Happened Next
                  </span>
                  <p className="text-xs text-rose-300">
                    {fact.what_happened_next || "Problem returned in incoming complaints with recurring volume."}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Storage: Hindsight Memory Bank</span>
                <span className="font-mono text-cyan-400">Persistent Vector Store</span>
              </div>
            </div>

            {/* COLUMN 2: AGENT INSIGHT */}
            <div className="bg-slate-900/80 border border-indigo-500/30 rounded-2xl p-6 shadow-xl flex flex-col justify-between bg-gradient-to-br from-indigo-950/20 via-slate-900 to-slate-950">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                      AGENT INSIGHT (Product Team Context)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    AI Synthesis
                  </span>
                </div>

                {/* Summary */}
                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white">
                    {agent_insight.headline}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
                    {agent_insight.summary}
                  </p>
                </div>

                {/* Suggested Focus */}
                <div className="space-y-1.5">
                  <span className="text-[11px] font-semibold uppercase text-indigo-300 tracking-wider">
                    Suggested Investigation Focus
                  </span>
                  <p className="text-xs text-slate-300 bg-indigo-950/30 p-3 rounded-xl border border-indigo-500/20 leading-relaxed">
                    {agent_insight.suggested_focus}
                  </p>
                </div>

                {/* Human Responsibility Notice */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <div className="flex items-center space-x-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    <span>HUMAN-IN-THE-LOOP RESPONSIBILITY</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {agent_insight.notice}
                  </p>
                </div>
              </div>

              {/* View History Loop */}
              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={onNavigateToHistory}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-700 shadow transition-all cursor-pointer"
                >
                  <span>View Full Learning Loop History (Screen 6) →</span>
                </button>
              </div>
            </div>
          </div>

          {/* RECORD SECOND ITERATION ACTION & OUTCOME */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block">
                  Next Product Decision
                </span>
                <h3 className="text-base font-bold text-white">
                  Record New Action & Outcome (2nd Iteration)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => handlePreFill('Updated payment gateway', 'Payment complaints decreased')}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/30 text-xs text-cyan-300 transition-all font-mono cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Auto-fill: "Updated payment gateway"</span>
              </button>
            </div>

            {actionError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-xs text-rose-300">
                {actionError}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  New Action Taken
                </label>
                <input
                  type="text"
                  value={actionInput}
                  onChange={(e) => setActionInput(e.target.value)}
                  placeholder="e.g. Updated payment gateway"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  New Observed Outcome
                </label>
                <input
                  type="text"
                  value={resultInput}
                  onChange={(e) => setResultInput(e.target.value)}
                  placeholder="e.g. Payment complaints decreased"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-slate-500">
                Retaining adds to accumulated Hindsight memory for future recall.
              </span>
              <button
                type="button"
                onClick={handleSaveExperience}
                disabled={isRetaining || !actionInput.trim() || !resultInput.trim()}
                className="flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isRetaining ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                    <span>Retaining in Hindsight...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Save New Experience</span>
                  </>
                )}
              </button>
            </div>

            {retainedData && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Second experience retained! Full cycle stored in persistent Hindsight memory.</span>
                </div>
                <button
                  onClick={onNavigateToHistory}
                  className="underline font-semibold hover:text-white"
                >
                  View Loop Diagram →
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
