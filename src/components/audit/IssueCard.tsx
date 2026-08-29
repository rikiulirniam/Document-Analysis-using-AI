import React, { useState } from 'react';
import { AuditIssue } from '../../types/audit.js';
import {
  AlertCircle,
  Check,
  Copy,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  SpellCheck,
  BookOpen,
  HelpCircle,
  FileQuestion,
} from 'lucide-react';

interface IssueCardProps {
  issue: AuditIssue;
}

export const IssueCard: React.FC<IssueCardProps> = ({ issue }) => {
  const [copied, setCopied] = useState(false);

  const getSeverityBadge = (severity: AuditIssue['severity']) => {
    switch (severity) {
      case 'high':
        return {
          label: 'High Severity',
          className: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          dot: 'bg-rose-400',
        };
      case 'medium':
        return {
          label: 'Medium Severity',
          className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          dot: 'bg-amber-400',
        };
      case 'low':
        return {
          label: 'Minor / Low',
          className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          dot: 'bg-emerald-400',
        };
    }
  };

  const getTypeLabel = (type: AuditIssue['type']) => {
    switch (type) {
      case 'spelling':
        return { label: 'Spelling & Typo', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' };
      case 'grammar':
        return { label: 'Grammar & Syntax', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' };
      case 'sentence_quality':
        return { label: 'Sentence Quality', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' };
      case 'relevance':
        return { label: 'Relevance', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' };
      case 'missing_point':
        return { label: 'Missing Point', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' };
      case 'structure':
        return { label: 'Structure', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' };
      case 'accuracy':
        return { label: 'Accuracy', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' };
      case 'question_coverage':
        return { label: 'Coverage', color: 'bg-teal-500/10 text-teal-400 border-teal-500/20' };
      default:
        return { label: 'General Issue', color: 'bg-white/5 text-slate-300 border-white/10' };
    }
  };

  const handleCopySuggestion = () => {
    if (issue.suggestion) {
      navigator.clipboard.writeText(issue.suggestion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const severityBadge = getSeverityBadge(issue.severity);
  const typeBadge = getTypeLabel(issue.type);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#141417] p-5 shadow-2xs hover:border-white/15 transition-all">
      {/* Header Tags */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* Severity */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold border ${severityBadge.className}`}
          >
            <span className={`h-2 w-2 rounded-full ${severityBadge.dot}`} />
            {severityBadge.label}
          </span>

          {/* Type */}
          <span
            className={`rounded-md px-2.5 py-1 text-xs font-semibold border ${typeBadge.color}`}
          >
            {typeBadge.label}
          </span>

          {/* Location */}
          {issue.location && (issue.location.pageNumber || issue.location.paragraph || issue.location.section) && (
            <span className="inline-flex items-center gap-1 rounded-md bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 border border-white/10">
              <MapPin className="h-3 w-3 text-slate-400" />
              {issue.location.pageNumber && `Page ${issue.location.pageNumber}`}
              {issue.location.paragraph && ` • Para ${issue.location.paragraph}`}
              {issue.location.section && ` (${issue.location.section})`}
            </span>
          )}
        </div>

        {/* Confidence pill */}
        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          {issue.confidence}% confidence
        </span>
      </div>

      {/* Explanation */}
      <p className="text-sm font-medium text-slate-200 mb-4 leading-relaxed">
        {issue.explanation}
      </p>

      {/* Context Comparison / Diff */}
      {(issue.originalText || issue.suggestion) && (
        <div className="rounded-xl border border-white/5 bg-[#0F0F11] p-3.5 space-y-2.5 text-xs">
          {issue.originalText && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                Original Text:
              </span>
              <div className="rounded-lg bg-rose-500/10 p-2.5 text-rose-200 font-mono border border-rose-500/20 leading-relaxed break-words">
                &ldquo;{issue.originalText}&rdquo;
              </div>
            </div>
          )}

          {issue.suggestion && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                  <Sparkles className="h-3 w-3 text-emerald-400" /> Suggested Revision:
                </span>
                <button
                  type="button"
                  onClick={handleCopySuggestion}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>Copy Fix</span>
                    </>
                  )}
                </button>
              </div>
              <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-200 font-mono border border-emerald-500/20 leading-relaxed break-words">
                {issue.suggestion}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
