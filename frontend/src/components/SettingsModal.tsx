import React, { useState } from 'react';
import {
  X,
  Settings,
  Database,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  Save,
  CheckCircle2,
  Key
} from 'lucide-react';
import { SystemStatusResponse } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: SystemStatusResponse | null;
  onSaveConfig: (config: {
    hindsight_api_key?: string;
    hindsight_api_url?: string;
    hindsight_bank_id?: string;
    groq_api_key?: string;
  }) => Promise<any>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  status,
  onSaveConfig,
}) => {
  if (!isOpen) return null;

  const [hindsightKey, setHindsightKey] = useState('');
  const [hindsightUrl, setHindsightUrl] = useState(
    status?.environment?.hindsight_api_url || 'https://api.hindsight.vectorize.io'
  );
  const [bankId, setBankId] = useState(
    status?.environment?.hindsight_bank_id || 'recallloop-product-memory'
  );
  const [groqKey, setGroqKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isHindsightActive = status?.hindsight?.is_real_hindsight_active;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      await onSaveConfig({
        hindsight_api_key: hindsightKey.trim() || undefined,
        hindsight_api_url: hindsightUrl.trim() || undefined,
        hindsight_bank_id: bankId.trim() || undefined,
        groq_api_key: groqKey.trim() || undefined,
      });
      setSuccessMsg('Configuration updated and reloaded successfully!');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update configuration');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">System & Memory Settings</h3>
              <p className="text-xs text-slate-400">
                Configure official Hindsight SDK connection & Groq API
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Card */}
        <div
          className={`p-4 rounded-xl border text-xs space-y-1.5 ${
            isHindsightActive
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
              : 'bg-amber-950/40 border-amber-500/30 text-amber-200'
          }`}
        >
          <div className="flex items-center space-x-2 font-bold uppercase tracking-wider">
            {isHindsightActive ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Real Hindsight Cloud Connected</span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Real Hindsight: Setup Required</span>
              </>
            )}
          </div>
          <p className="text-[11px] leading-relaxed text-slate-300">
            {status?.hindsight?.message ||
              'Real Hindsight retain/recall is active and ready to store persistent memory units.'}
          </p>
        </div>

        {/* Documentation Links */}
        <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 space-y-2 text-xs">
          <span className="font-semibold text-slate-300 uppercase tracking-wider text-[10px] block">
            Official Documentation & SDK
          </span>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://hindsight.vectorize.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 underline"
            >
              <span>hindsight.vectorize.io</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://github.com/vectorize-io/hindsight"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 underline"
            >
              <span>GitHub: vectorize-io/hindsight</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/30 text-emerald-300 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs">
            {errorMsg}
          </div>
        )}

        {/* Settings Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Hindsight API Key */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">
              HINDSIGHT_API_KEY (Vectorize Hindsight Cloud Key)
            </label>
            <input
              type="password"
              value={hindsightKey}
              onChange={(e) => setHindsightKey(e.target.value)}
              placeholder={status?.environment?.has_hindsight_key ? '•••••••••••••••• (Configured)' : 'hsk_...'}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Required for real Vectorize Cloud retain/recall. If absent, fallback local audit log applies.
            </span>
          </div>

          {/* Hindsight API URL */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">
              HINDSIGHT_API_URL
            </label>
            <input
              type="text"
              value={hindsightUrl}
              onChange={(e) => setHindsightUrl(e.target.value)}
              placeholder="https://api.hindsight.vectorize.io or http://localhost:8888"
              className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>

          {/* Bank ID */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">
              HINDSIGHT_BANK_ID
            </label>
            <input
              type="text"
              value={bankId}
              onChange={(e) => setBankId(e.target.value)}
              placeholder="recallloop-product-memory"
              className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
          </div>

          {/* Groq API Key */}
          <div>
            <label className="block font-medium text-slate-300 mb-1">
              GROQ_API_KEY (Optional for LLM synthesis)
            </label>
            <input
              type="password"
              value={groqKey}
              onChange={(e) => setGroqKey(e.target.value)}
              placeholder={status?.environment?.has_groq_key ? '•••••••••••••••• (Configured)' : 'gsk_...'}
              className="w-full bg-slate-950/80 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
            />
            <span className="text-[10px] text-slate-500 mt-1 block">
              Used for Groq LLM synthesis (`llama-3.3-70b-versatile`). If omitted, factual synthesis engine is used.
            </span>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md transition-all disabled:opacity-50 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Updating...' : 'Save & Reload Config'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
