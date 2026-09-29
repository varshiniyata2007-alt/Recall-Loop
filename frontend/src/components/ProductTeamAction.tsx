import React, { useState } from 'react';
import {
  ShieldAlert,
  Send,
  Save,
  CheckCircle2,
  Database,
  ArrowRight,
  Sparkles,
  Info,
  Clock,
  RotateCcw
} from 'lucide-react';
import { AnalysisResponse, HindsightStatus } from '../types';

interface ProductTeamActionProps {
  currentProblem: string;
  analysisResult: AnalysisResponse | null;
  onRetain: (problem: string, action: string, result: string) => Promise<any>;
  onNavigateToHistory: () => void;
  onTriggerSecondOccurrenceDemo: () => void;
  hindsightStatus?: HindsightStatus;
}

export const ProductTeamAction: React.FC<ProductTeamActionProps> = ({
  currentProblem,
  analysisResult,
  onRetain,
  onNavigateToHistory,
  onTriggerSecondOccurrenceDemo,
  hindsightStatus,
}) => {
  const [actionInput, setActionInput] = useState('');
  const [resultInput, setResultInput] = useState('');
  const [actionRecorded, setActionRecorded] = useState(false);
  const [isRetaining, setIsRetaining] = useState(false);
  const [retainedData, setRetainedData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const problem = currentProblem || analysisResult?.classification.detected_problem || 'Payment Failure';
  const hasPriorMemory = analysisResult?.insight_synthesis.fact.has_memory || false;

  // Preset suggestions based on whether this is 1st or 2nd occurrence
  const actionPreset = !hasPriorMemory ? 'Payment gateway changed' : 'Updated payment gateway';
  const resultPreset = !hasPriorMemory ? 'Complaints decreased temporarily' : 'Payment complaints decreased';

  const handleRecordAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionInput.trim()) {
      setError('Please input the Action Taken by the product team.');
      return;
    }
    setError(null);
    setActionRecorded(true);
  };

  const handleSaveExperience = async () => {
    if (!actionInput.trim() || !resultInput.trim()) {
      setError('Both Action Taken and Result Outcome are required to retain this experience.');
      return;
    }
    setError(null);
    setIsRetaining(true);
    try {
      const res = await onRetain(problem, actionInput.trim(), resultInput.trim());
      setRetainedData(res);
    } catch (err: any) {
      setError(err.message || 'Failed to retain experience in Hindsight.');
    } finally {
      setIsRetaining(false);
    }
  };

  const handleFillDemoValues = () => {
    setActionInput(actionPreset);
    setResultInput(resultPreset);
    setActionRecorded(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Title */}
      <div>
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Database className="w-3.5 h-3.5" />
          <span>Screens 4 & 5: Product Team Action & Experience Retention</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Record Decision & Retain into Hindsight
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          The product team decides what to do. Once executed, the action and its resulting outcome are stored in persistent Hindsight memory to close the learning loop.
        </p>
      </div>

      {/* Target Problem Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <span className="text-xs text-slate-400">Target Problem:</span>
          <span className="px-3 py-1 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 font-semibold text-sm">
            {problem}
          </span>
          <span className="text-xs text-slate-400">
            Phase:{' '}
            <strong className="text-slate-200">
              {!hasPriorMemory ? '1st Incident Baseline' : '2nd Iteration (Recurring Fix)'}
            </strong>
          </span>
        </div>

        {/* 1-Click Demo Auto-Fill Button */}
        <button
          type="button"
          onClick={handleFillDemoValues}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/30 text-xs text-indigo-300 transition-all font-mono cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Auto-fill Demo Inputs: "{actionPreset}"</span>
        </button>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300">
          {error}
        </div>
      )}

      {/* STEP 4: PRODUCT TEAM ACTION */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs flex items-center justify-center font-bold">
              4
            </span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Product Team Action
            </h3>
          </div>
          {actionRecorded && (
            <span className="inline-flex items-center space-x-1 text-xs text-emerald-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Action Staged</span>
            </span>
          )}
        </div>

        <form onSubmit={handleRecordAction} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Action Taken by the Team
            </label>
            <input
              type="text"
              value={actionInput}
              onChange={(e) => {
                setActionInput(e.target.value);
                setActionRecorded(false);
              }}
              placeholder={`e.g. ${actionPreset}`}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => {
                  setActionInput(actionPreset);
                  setActionRecorded(true);
                }}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-mono"
              >
                Use Preset: "{actionPreset}"
              </button>
            </div>

            <button
              type="submit"
              className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-medium text-xs shadow transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Record Action</span>
            </button>
          </div>
        </form>
      </div>

      {/* STEP 5: OUTCOME & HINDSIGHT SAVE */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-full bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 text-xs flex items-center justify-center font-bold">
              5
            </span>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Outcome / Result (Save into Hindsight)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-cyan-400">
            Retains into: {hindsightStatus?.bank_id || 'recallloop-product-memory'}
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Result / Observed Impact
            </label>
            <input
              type="text"
              value={resultInput}
              onChange={(e) => setResultInput(e.target.value)}
              placeholder={`e.g. ${resultPreset}`}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all font-mono"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setResultInput(resultPreset)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 underline font-mono"
            >
              Use Preset: "{resultPreset}"
            </button>

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
                  <span>Save Experience</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* RETAIN CONFIRMATION & NAVIGATION */}
      {retainedData && (
        <div className="bg-slate-900/95 border-2 border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white">
                Experience Successfully Retained in Hindsight!
              </h4>
              <p className="text-xs text-emerald-300/90 font-mono">
                Memory Unit ID: {retainedData.memory.id} • Bank: {retainedData.memory.hindsight_bank}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-950/70 p-4 rounded-xl border border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 font-semibold block uppercase">Action Logged:</span>
              <span className="text-white font-mono mt-0.5 block">{retainedData.memory.action}</span>
            </div>
            <div>
              <span className="text-slate-400 font-semibold block uppercase">Result Logged:</span>
              <span className="text-emerald-300 font-mono mt-0.5 block">{retainedData.memory.result}</span>
            </div>
          </div>

          {/* Next Demo Navigation Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            {!hasPriorMemory ? (
              <button
                onClick={onTriggerSecondOccurrenceDemo}
                className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg transition-all cursor-pointer"
              >
                <span>Trigger Second Occurrence (See Hindsight Recall!)</span>
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs text-slate-400">
                Second iteration saved! Full history loop is now complete.
              </span>
            )}

            <button
              onClick={onNavigateToHistory}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs border border-slate-600 shadow transition-all cursor-pointer"
            >
              <span>View Learning Loop History (Screen 6)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
