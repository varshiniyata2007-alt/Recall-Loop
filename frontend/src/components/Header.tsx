import React from 'react';
import { Database, Sparkles, RefreshCw, Settings, ShieldCheck, AlertTriangle } from 'lucide-react';
import { SystemStatusResponse } from '../types';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  status: SystemStatusResponse | null;
  onReset: () => void;
  onOpenSettings: () => void;
  isResetting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  status,
  onReset,
  onOpenSettings,
  isResetting,
}) => {
  const isHindsightActive = status?.hindsight?.is_real_hindsight_active;

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Subtitle */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('overview')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Database className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                  RECALLLOOP
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  AI Product Memory Agent
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Persistent Problem → Action → Result Learning Loop
              </p>
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-3">
            {/* Real Hindsight Status Pill */}
            <button
              onClick={onOpenSettings}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                isHindsightActive
                  ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40'
                  : 'bg-amber-950/50 border-amber-500/30 text-amber-300 hover:bg-amber-900/40'
              }`}
            >
              {isHindsightActive ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real Hindsight Connected</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Hindsight: Setup Guide</span>
                </>
              )}
            </button>

            {/* Reset Memory Demo */}
            <button
              onClick={onReset}
              disabled={isResetting}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-all disabled:opacity-50"
              title="Reset memory bank to clean demonstration state"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span>Reset Demo State</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all"
              title="API Keys and Hindsight Configuration"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 overflow-x-auto py-2 border-t border-slate-900 scrollbar-none">
          <button
            onClick={() => setCurrentTab('overview')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              currentTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            1. Overview Dashboard
          </button>

          <button
            onClick={() => setCurrentTab('analysis')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              currentTab === 'analysis'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            2. Complaint Analysis
          </button>

          <button
            onClick={() => setCurrentTab('hindsight')}
            className={`relative px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap flex items-center space-x-1.5 ${
              currentTab === 'hindsight'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/40 ring-1 ring-cyan-400/40'
                : 'text-slate-300 hover:text-white bg-slate-900/60 hover:bg-slate-900 border border-indigo-500/20'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>3. Hindsight Memory</span>
            <span className="ml-1 px-1.5 py-0.2 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-mono">
              Core Screen
            </span>
          </button>

          <button
            onClick={() => setCurrentTab('action')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              currentTab === 'action'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            4 & 5. Action & Outcome
          </button>

          <button
            onClick={() => setCurrentTab('history')}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap ${
              currentTab === 'history'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            6. Learning Loop History
          </button>
        </div>
      </div>
    </header>
  );
};
