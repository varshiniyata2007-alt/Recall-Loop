import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  Repeat,
  Sparkles,
  Layers,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { AnalysisResponse } from '../types';

interface ComplaintAnalysisProps {
  complaintInput: string;
  setComplaintInput: (text: string) => void;
  onAnalyze: (text: string) => void;
  analysisResult: AnalysisResponse | null;
  loading: boolean;
  onNavigateToHindsight: () => void;
}

export const ComplaintAnalysis: React.FC<ComplaintAnalysisProps> = ({
  complaintInput,
  setComplaintInput,
  onAnalyze,
  analysisResult,
  loading,
  onNavigateToHindsight,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintInput.trim()) {
      setError('Please enter a customer complaint.');
      return;
    }
    setError(null);
    onAnalyze(complaintInput.trim());
  };

  const handleSelectPreset = (presetText: string) => {
    setComplaintInput(presetText);
    setError(null);
    onAnalyze(presetText);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Screen Header */}
      <div>
        <div className="flex items-center space-x-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
          <Search className="w-3.5 h-3.5" />
          <span>Screen 2: Complaint Analysis & Problem Detection</span>
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">
          Ingest & Understand Customer Complaints
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          The AI agent reads raw tickets, identifies the underlying product problem, evaluates similarity against existing clusters, and detects recurrence trends.
        </p>
      </div>

      {/* Input Section */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Enter a customer complaint
          </label>
          <div className="relative">
            <textarea
              rows={3}
              value={complaintInput}
              onChange={(e) => setComplaintInput(e.target.value)}
              placeholder="e.g. My payment failed three times."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-sans resize-none"
            />
          </div>

          {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            {/* Quick Demo Preset Chips */}
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs text-slate-500">Quick Demo Presets:</span>
              <button
                type="button"
                onClick={() => handleSelectPreset('My payment failed three times.')}
                className="px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 text-xs text-indigo-300 transition-all font-mono"
              >
                1. "My payment failed three times."
              </button>
              <button
                type="button"
                onClick={() => handleSelectPreset('Card checkout keeps declining at checkout.')}
                className="px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 border border-indigo-500/30 text-xs text-indigo-300 transition-all font-mono"
              >
                2. "Card checkout keeps declining..."
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Analyze Complaint</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Analysis Results Display */}
      {analysisResult && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400"></span>
              <h3 className="text-base font-semibold text-white">Analysis Findings</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Confidence: {Math.round(analysisResult.classification.confidence * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Detected Problem */}
            <div className="bg-slate-950/60 border border-indigo-500/30 rounded-xl p-4">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block mb-1">
                Detected Product Problem
              </span>
              <div className="text-xl font-bold text-white tracking-tight flex items-center space-x-2">
                <span>{analysisResult.classification.detected_problem}</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Category: {analysisResult.classification.category}
              </p>
            </div>

            {/* Recurrence & Trend */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Recurrence Status & Trend
                </span>
                <div className="flex items-center space-x-3 mt-1">
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                    <Repeat className="w-3.5 h-3.5" />
                    <span>{analysisResult.classification.recurrence_status}</span>
                  </span>

                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Trend: {analysisResult.classification.trend}</span>
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Complaint Volume: {analysisResult.classification.complaint_count.toLocaleString()} related tickets
              </p>
            </div>
          </div>

          {/* Similar Complaints Cluster */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Similar Complaints Clustered</span>
            </div>
            <ul className="space-y-1.5 pt-1">
              {analysisResult.classification.similar_complaints.map((item, idx) => (
                <li
                  key={idx}
                  className="text-xs text-slate-300 font-mono bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-800/60 flex items-center space-x-2"
                >
                  <span className="text-slate-500">#{idx + 1}</span>
                  <span>"{item}"</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Next Step Call to Action */}
          <div className="pt-2 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Complaint classified. Next: Query persistent Hindsight semantic memory.
            </div>
            <button
              onClick={onNavigateToHindsight}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 transition-all cursor-pointer"
            >
              <span>View Hindsight Memory Check</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
