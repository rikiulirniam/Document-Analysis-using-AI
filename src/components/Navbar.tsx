import React from 'react';
import { FileSearch, Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onReset?: () => void;
  hasResult?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onReset, hasResult }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0F0F11]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.35)] ring-1 ring-white/10">
            <FileSearch className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white">DocAudit AI</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
                <Sparkles className="h-3 w-3" /> Precision AI
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Intelligent Document Quality &amp; Compliance Audit
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-[#141417] px-3.5 py-1.5 rounded-xl border border-white/5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Stateless &amp; Private Analysis</span>
          </div>

          {hasResult && (
            <button
              onClick={onReset}
              id="new-audit-header-btn"
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2 text-xs font-semibold text-slate-200 shadow-xs hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5 text-indigo-400" />
              <span>New Audit</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

