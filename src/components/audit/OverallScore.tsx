import React from 'react';
import { AuditResult } from '../../types/audit.js';
import { FileText, Award, AlertTriangle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';

interface OverallScoreProps {
  result: AuditResult;
}

export const OverallScore: React.FC<OverallScoreProps> = ({ result }) => {
  const { overallScore, summary, issues, requirements, documentMeta, auditMode } = result;

  const highSeverityCount = issues.filter((i) => i.severity === 'high').length;
  const mediumSeverityCount = issues.filter((i) => i.severity === 'medium').length;
  const lowSeverityCount = issues.filter((i) => i.severity === 'low').length;

  const getScoreColor = (score: number) => {
    if (score >= 85)
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        stroke: '#34d399',
        badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      };
    if (score >= 70)
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/20',
        stroke: '#fbbf24',
        badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      };
    return {
      text: 'text-rose-400',
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      stroke: '#fb7185',
      badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    };
  };

  const getScoreRating = (score: number) => {
    if (score >= 90) return 'Exceptional Quality';
    if (score >= 80) return 'Good Quality';
    if (score >= 70) return 'Satisfactory / Minor Fixes';
    if (score >= 60) return 'Needs Revision';
    return 'Significant Revisions Required';
  };

  const colors = getScoreColor(overallScore);
  const ratingText = getScoreRating(overallScore);

  // SVG Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (overallScore / 100) * circumference;

  return (
    <div className="rounded-3xl border border-white/10 bg-[#141417] p-6 sm:p-8 shadow-xs">
      <div className="flex flex-col lg:flex-row items-center lg:items-stretch gap-8">
        {/* Score Radial Meter */}
        <div className="flex flex-col items-center justify-center text-center shrink-0 min-w-[220px]">
          <div className="relative flex items-center justify-center">
            <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r={radius}
                className="stroke-white/5"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r={radius}
                stroke={colors.stroke}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-4xl font-extrabold tracking-tight ${colors.text}`}>
                {overallScore}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                out of 100
              </span>
            </div>
          </div>

          <div className="mt-3 space-y-1">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${colors.badge}`}>
              {ratingText}
            </span>
            <p className="text-[11px] text-slate-400 font-medium">AI-generated document quality score</p>
          </div>
        </div>

        {/* Summary & Metrics */}
        <div className="flex-1 flex flex-col justify-between space-y-5 w-full">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-400" /> Executive Audit Summary
              </h3>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-white/10">
                  {documentMeta.fileType.toUpperCase()} • {documentMeta.pageCount}{' '}
                  {documentMeta.pageCount === 1 ? 'Page' : 'Pages'}
                </span>
                <span className="rounded-md bg-white/5 px-2.5 py-1 text-[11px] font-medium text-slate-300 border border-white/10">
                  {documentMeta.wordCount.toLocaleString()} words
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-200 leading-relaxed bg-[#0F0F11] rounded-2xl p-4 border border-white/5">
              {summary}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="rounded-xl border border-white/5 bg-[#0F0F11] p-3 shadow-2xs">
              <span className="text-xs text-slate-400 font-medium block">Total Findings</span>
              <span className="text-lg font-bold text-white mt-0.5 block">{issues.length}</span>
            </div>

            <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3">
              <span className="text-xs text-rose-300 font-medium flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-rose-400"></span> High Priority
              </span>
              <span className="text-lg font-bold text-rose-200 mt-0.5 block">{highSeverityCount}</span>
            </div>

            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3">
              <span className="text-xs text-amber-300 font-medium flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-amber-400"></span> Medium Issue
              </span>
              <span className="text-lg font-bold text-amber-200 mt-0.5 block">{mediumSeverityCount}</span>
            </div>

            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
              <span className="text-xs text-emerald-300 font-medium flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Minor / Typo
              </span>
              <span className="text-lg font-bold text-emerald-200 mt-0.5 block">{lowSeverityCount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
