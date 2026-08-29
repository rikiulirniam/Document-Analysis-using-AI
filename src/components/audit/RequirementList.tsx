import React from 'react';
import { Requirement } from '../../types/audit.js';
import { CheckCircle2, AlertCircle, XCircle, ListChecks } from 'lucide-react';

interface RequirementListProps {
  requirements: Requirement[];
}

export const RequirementList: React.FC<RequirementListProps> = ({ requirements }) => {
  if (!requirements || requirements.length === 0) {
    return null;
  }

  const metCount = requirements.filter((r) => r.status === 'met').length;
  const partialCount = requirements.filter((r) => r.status === 'partially_met').length;
  const notMetCount = requirements.filter((r) => r.status === 'not_met').length;

  const getStatusBadge = (status: Requirement['status']) => {
    switch (status) {
      case 'met':
        return {
          icon: CheckCircle2,
          text: 'Requirement Met',
          className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          iconColor: 'text-emerald-400',
        };
      case 'partially_met':
        return {
          icon: AlertCircle,
          text: 'Partially Met',
          className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          iconColor: 'text-amber-400',
        };
      case 'not_met':
        return {
          icon: XCircle,
          text: 'Not Met / Missing',
          className: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          iconColor: 'text-rose-400',
        };
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#141417] p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ListChecks className="h-4 w-4" />
            </div>
            <h3 className="text-base font-bold text-white">Assignment Requirements Coverage</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Verification of how thoroughly the document answers each question or rubric instruction.
          </p>
        </div>

        {/* Coverage Counters */}
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="h-3.5 w-3.5" /> {metCount} Met
          </span>
          {partialCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-400 border border-amber-500/20">
              <AlertCircle className="h-3.5 w-3.5" /> {partialCount} Partial
            </span>
          )}
          {notMetCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 px-2.5 py-1 text-xs font-semibold text-rose-400 border border-rose-500/20">
              <XCircle className="h-3.5 w-3.5" /> {notMetCount} Missing
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3.5">
        {requirements.map((req, idx) => {
          const badge = getStatusBadge(req.status);
          const Icon = badge.icon;

          return (
            <div
              key={req.id || idx}
              className={`rounded-2xl border p-4.5 transition-all ${
                req.status === 'not_met'
                  ? 'border-rose-500/20 bg-rose-500/5'
                  : req.status === 'partially_met'
                  ? 'border-amber-500/20 bg-amber-500/5'
                  : 'border-white/5 bg-[#0F0F11]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2.5">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/10 text-xs font-bold text-slate-300 mt-0.5">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-bold text-white">{req.requirement}</h4>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">{req.explanation}</p>
                  </div>
                </div>

                <div className="sm:shrink-0 self-start sm:self-auto">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border ${badge.className}`}
                  >
                    <Icon className={`h-3.5 w-3.5 ${badge.iconColor}`} />
                    {badge.text}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
