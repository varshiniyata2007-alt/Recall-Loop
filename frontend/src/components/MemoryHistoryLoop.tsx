import React from 'react';
import {
  Brain,
  ArrowDown,
  Repeat,
  CheckCircle2,
  Database,
  ShieldCheck,
  Sparkles,
  Layers,
  ArrowRight,
  Clock,
  RotateCcw
} from 'lucide-react';
import { MemoryHistoryEntry } from '../types';

interface MemoryHistoryLoopProps {
  history: MemoryHistoryEntry[];
  loading: boolean;
  onRefreshHistory: () => void;
  onStartNewDemo: () => void;
}

export const MemoryHistoryLoop: React.FC<MemoryHistoryLoopProps> = ({
  history,
  loading,
  onRefreshHistory,
  onStartNewDemo,
}) => {
  const hasHistory = history && history.length > 0;
  const isCompleteDemo = history && history.length >= 2;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Title Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
            <Repeat className="w-4 h-4 text-indigo-400" />
            <span>Screen 6: Persistent Learning Loop Visualizer</span>
            <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
              The Main Innovation
            </span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            The Product Memory Learning Loop
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Proving that previous product-solving experience becomes persistent, reusable agent memory across team generations.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onStartNewDemo}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-all shadow-md cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-run Full Demo</span>
          </button>
        </div>
      </div>

      {/* CORE INNOVATION ARCHITECTURE DIAGRAM */}
      <div className="bg-slate-900/90 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-6">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Visual Execution Flow (Problem → Action → Result → Recall Loop)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30">
            Hindsight Retain & Recall Loop
          </span>
        </div>

        {/* Vertical Connected Flow Diagram */}
        <div className="max-w-xl mx-auto space-y-3 relative">
          {/* Node 1: Problem */}
          <div className="bg-slate-950 border border-slate-700/80 rounded-xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center justify-center font-bold text-xs">
                1
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Initial Incident
                </span>
                <h4 className="text-sm font-bold text-white">Problem: Payment Failure</h4>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-mono">2,300 complaints</span>
          </div>

          <div className="flex justify-center">
            <div className="h-6 w-0.5 bg-indigo-500/50 flex items-center justify-center">
              <ArrowDown className="w-3.5 h-3.5 text-indigo-400 -mb-2" />
            </div>
          </div>

          {/* Node 2: Action */}
          <div className="bg-slate-950 border border-indigo-500/30 rounded-xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                2
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Product Team Decision
                </span>
                <h4 className="text-sm font-bold text-white">
                  Previous Action: Payment gateway changed
                </h4>
              </div>
            </div>
            <span className="text-xs text-indigo-300 font-mono">1st Mitigation</span>
          </div>

          <div className="flex justify-center">
            <div className="h-6 w-0.5 bg-indigo-500/50 flex items-center justify-center">
              <ArrowDown className="w-3.5 h-3.5 text-indigo-400 -mb-2" />
            </div>
          </div>

          {/* Node 3: Result */}
          <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
                3
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                  Observed Outcome (Retained in Hindsight)
                </span>
                <h4 className="text-sm font-bold text-white">
                  Previous Result: Complaints decreased temporarily
                </h4>
              </div>
            </div>
            <span className="text-xs text-amber-300 font-mono">Temporary Fix</span>
          </div>

          <div className="flex justify-center">
            <div className="h-6 w-0.5 bg-rose-500/50 flex items-center justify-center">
              <ArrowDown className="w-3.5 h-3.5 text-rose-400 -mb-2" />
            </div>
          </div>

          {/* Node 4: Problem Returns */}
          <div className="bg-gradient-to-r from-rose-950/60 to-slate-950 border-2 border-rose-500/40 rounded-xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-lg bg-rose-500/30 text-rose-200 border border-rose-500/50 flex items-center justify-center font-bold text-xs">
                4
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold text-rose-400 tracking-wider">
                  Recurrence Trigger
                </span>
                <h4 className="text-sm font-bold text-rose-200">
                  Problem Returns: Payment complaints resume
                </h4>
              </div>
            </div>
            <span className="text-xs text-rose-400 font-mono font-bold">RECURRING</span>
          </div>

          <div className="flex justify-center">
            <div className="h-6 w-0.5 bg-cyan-500/50 flex items-center justify-center">
              <ArrowDown className="w-3.5 h-3.5 text-cyan-400 -mb-2" />
            </div>
          </div>

          {/* Node 5: Hindsight Recall */}
          <div className="bg-gradient-to-r from-cyan-950/60 to-slate-950 border-2 border-cyan-500/40 rounded-xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-lg bg-cyan-500/30 text-cyan-200 border border-cyan-500/50 flex items-center justify-center font-bold text-xs">
                5
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold text-cyan-400 tracking-wider">
                  Persistent Agent Recall
                </span>
                <h4 className="text-sm font-bold text-cyan-200">
                  Hindsight Recall: Previous Action & Result Retrieved
                </h4>
              </div>
            </div>
            <span className="text-xs text-cyan-300 font-mono">Agent Insight</span>
          </div>

          <div className="flex justify-center">
            <div className="h-6 w-0.5 bg-indigo-500/50 flex items-center justify-center">
              <ArrowDown className="w-3.5 h-3.5 text-indigo-400 -mb-2" />
            </div>
          </div>

          {/* Node 6: New Action */}
          <div className="bg-slate-950 border border-indigo-500/40 rounded-xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center font-bold text-xs">
                6
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  Informed Decision
                </span>
                <h4 className="text-sm font-bold text-white">
                  New Action: Updated payment gateway
                </h4>
              </div>
            </div>
            <span className="text-xs text-indigo-300 font-mono">2nd Iteration</span>
          </div>

          <div className="flex justify-center">
            <div className="h-6 w-0.5 bg-emerald-500/50 flex items-center justify-center">
              <ArrowDown className="w-3.5 h-3.5 text-emerald-400 -mb-2" />
            </div>
          </div>

          {/* Node 7: New Result */}
          <div className="bg-slate-950 border-2 border-emerald-500/40 rounded-xl p-4 flex items-center justify-between shadow-md">
            <div className="flex items-center space-x-3">
              <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center font-bold text-xs">
                7
              </span>
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Sustainable Resolution
                </span>
                <h4 className="text-sm font-bold text-emerald-200">
                  New Result: Payment complaints decreased
                </h4>
              </div>
            </div>
            <span className="text-xs text-emerald-300 font-mono font-bold">LEARNING COMPLETE</span>
          </div>
        </div>
      </div>

      {/* PERSISTENT MEMORY AUDIT LOG (Real Records Stored) */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <Database className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Chronological Hindsight Memory Units
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {history.length} persistent experience{history.length === 1 ? '' : 's'}
          </span>
        </div>

        {!hasHistory ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No memories recorded in this session yet. Run the demo steps to retain experiences.
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((mem, idx) => (
              <div
                key={mem.id || idx}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 hover:border-slate-700 transition-all space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono text-[10px] border border-indigo-500/20">
                      Iteration #{idx + 1}
                    </span>
                    <span className="font-semibold text-white">{mem.problem}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {mem.timestamp ? new Date(mem.timestamp).toLocaleTimeString() : 'Recent'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                      Action Taken
                    </span>
                    <span className="text-slate-200 font-mono">{mem.action}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                      Observed Result
                    </span>
                    <span className="text-emerald-300 font-mono">{mem.result}</span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                  <span>Source: {mem.source}</span>
                  <span className="font-mono text-cyan-400/80">Bank: {mem.hindsight_bank}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
