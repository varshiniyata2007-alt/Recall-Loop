import React from 'react';
import {
  TrendingUp,
  AlertCircle,
  Repeat,
  Flame,
  ArrowRight,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { DashboardOverview, ProblemItem } from '../types';

interface OverviewDashboardProps {
  data: DashboardOverview | null;
  loading: boolean;
  onSelectProblemForDemo: (problemName: string, sampleComplaint?: string) => void;
  onStartPaymentDemo: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  data,
  loading,
  onSelectProblemForDemo,
  onStartPaymentDemo,
}) => {
  if (loading || !data) {
    return (
      <div className="py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-500 mx-auto"></div>
        <p className="mt-4 text-slate-400 text-sm">Loading dashboard telemetry...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Primary Hackathon Demo Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PRIMARY DEMO: PAYMENT FAILURE</span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Demonstrate the Product Memory Loop
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl">
              See how RecallLoop identifies <span className="text-white font-medium">Payment Failure</span>,
              checks <span className="text-cyan-400 font-medium">Hindsight memory</span> for previous fixes and results,
              and enables the product team to accumulate persistent experience.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onStartPaymentDemo}
              className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/30 transition-all cursor-pointer whitespace-nowrap"
            >
              <span>Launch Payment Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Complaints */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Complaints</span>
            <AlertCircle className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {data.total_complaints.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-medium">ingested tickets</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Aggregated across feedback channels</p>
        </div>

        {/* Active Problems */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Problems</span>
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {data.active_problems}
            </span>
            <span className="text-xs text-slate-400 font-medium">clustered issues</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Grouped by underlying product area</p>
        </div>

        {/* Recurring Problems */}
        <div className="bg-slate-900/60 border border-amber-500/20 rounded-xl p-5 hover:border-amber-500/40 transition-all bg-gradient-to-b from-amber-500/5 to-transparent">
          <div className="flex items-center justify-between text-amber-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Recurring Problems</span>
            <Repeat className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-amber-300 tracking-tight">
              {data.recurring_problems}
            </span>
            <span className="text-xs text-amber-400/80 font-medium">previously observed</span>
          </div>
          <p className="text-xs text-amber-400/70 mt-2">Requires previous mitigation context</p>
        </div>

        {/* Problems Increasing */}
        <div className="bg-slate-900/60 border border-rose-500/20 rounded-xl p-5 hover:border-rose-500/40 transition-all bg-gradient-to-b from-rose-500/5 to-transparent">
          <div className="flex items-center justify-between text-rose-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Problems Increasing</span>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-rose-300 tracking-tight">
              {data.increasing_problems}
            </span>
            <span className="text-xs text-rose-400/80 font-medium">surge detected</span>
          </div>
          <p className="text-xs text-rose-400/70 mt-2">Payment Failure volume up 44%</p>
        </div>
      </div>

      {/* Main Problem List Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-white">Underlying Product Problems</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live complaint volume, trend velocity, and recurrence classification
            </p>
          </div>
          <span className="text-xs font-mono text-slate-500">5 Clustered Problems</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950/70 text-slate-400 uppercase text-[11px] font-semibold tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-5">Problem Name</th>
                <th className="py-3 px-5">Complaint Count</th>
                <th className="py-3 px-5">Trend</th>
                <th className="py-3 px-5">Recurrence</th>
                <th className="py-3 px-5">Severity</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-normal text-slate-300">
              {data.problems.map((problem: ProblemItem) => {
                const isPayment = problem.name === 'Payment Failure';
                return (
                  <tr
                    key={problem.id}
                    className={`hover:bg-slate-800/40 transition-colors ${
                      isPayment ? 'bg-indigo-950/20 ring-1 ring-inset ring-indigo-500/20' : ''
                    }`}
                  >
                    {/* Problem Name & Category */}
                    <td className="py-4 px-5">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{problem.name}</span>
                        {isPayment && (
                          <span className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                            Primary Demo
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500">{problem.category}</span>
                    </td>

                    {/* Complaint Count */}
                    <td className="py-4 px-5">
                      <div className="font-mono font-semibold text-white">
                        {problem.count.toLocaleString()}
                      </div>
                      <span className="text-xs text-slate-500">complaints</span>
                    </td>

                    {/* Trend */}
                    <td className="py-4 px-5">
                      {problem.trend === 'Increasing' && (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <TrendingUp className="w-3.5 h-3.5" />
                          <span>Increasing</span>
                        </span>
                      )}
                      {problem.trend === 'Stable' && (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Stable</span>
                        </span>
                      )}
                      {problem.trend === 'Decreasing' && (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Decreasing</span>
                        </span>
                      )}
                    </td>

                    {/* Recurrence Status */}
                    <td className="py-4 px-5">
                      {problem.recurrence === 'Recurring' ? (
                        <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                          <Repeat className="w-3.5 h-3.5" />
                          <span>Recurring</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800/80 text-slate-400 border border-slate-700/60">
                          {problem.recurrence}
                        </span>
                      )}
                    </td>

                    {/* Severity */}
                    <td className="py-4 px-5">
                      <span
                        className={`text-xs font-medium ${
                          problem.severity === 'Critical'
                            ? 'text-rose-400 font-bold'
                            : problem.severity === 'High'
                            ? 'text-amber-400'
                            : problem.severity === 'Medium'
                            ? 'text-yellow-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {problem.severity}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={() =>
                          onSelectProblemForDemo(
                            problem.name,
                            problem.sample_complaints?.[0]
                          )
                        }
                        className="inline-flex items-center space-x-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer"
                      >
                        <span>Analyze Complaints</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
