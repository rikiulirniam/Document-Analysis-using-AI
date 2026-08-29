import React from 'react';
import { AlertTriangle, CheckCircle, ArrowRight, Star } from 'lucide-react';

interface PriorityFixesAndStrengthsProps {
  priorityFixes: string[];
  strengths: string[];
}

export const PriorityFixesAndStrengths: React.FC<PriorityFixesAndStrengthsProps> = ({
  priorityFixes,
  strengths,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Priority Fixes */}
      <div className="rounded-3xl border border-white/10 bg-[#141417] p-6 sm:p-8 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-white">Priority Fixes</h3>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            Key actionable revisions recommended to produce the greatest quality improvement.
          </p>

          {priorityFixes && priorityFixes.length > 0 ? (
            <ul className="space-y-3">
              {priorityFixes.map((fix, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-xl bg-[#0F0F11] p-3 text-xs text-slate-200 border border-white/5"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-[11px] font-bold text-rose-300 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="font-medium leading-relaxed">{fix}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic py-4">No critical fixes identified.</p>
          )}
        </div>
      </div>

      {/* Document Strengths */}
      <div className="rounded-3xl border border-white/10 bg-[#141417] p-6 sm:p-8 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Star className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-white">Document Strengths</h3>
          </div>
          <p className="text-xs text-slate-400 mb-5">
            Strong qualities, well-structured arguments, and effective elements observed.
          </p>

          {strengths && strengths.length > 0 ? (
            <ul className="space-y-3">
              {strengths.map((str, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 rounded-xl bg-[#0F0F11] p-3 text-xs text-slate-200 border border-white/5"
                >
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span className="font-medium leading-relaxed">{str}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic py-4">No specific strengths cataloged.</p>
          )}
        </div>
      </div>
    </div>
  );
};
