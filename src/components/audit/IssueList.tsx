import React, { useState, useMemo } from 'react';
import { AuditIssue, IssueSeverity, IssueType } from '../../types/audit.js';
import { IssueCard } from './IssueCard.js';
import { Search, Filter, AlertOctagon, CheckCircle2, SlidersHorizontal } from 'lucide-react';

interface IssueListProps {
  issues: AuditIssue[];
}

export const IssueList: React.FC<IssueListProps> = ({ issues }) => {
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const severityCounts = useMemo(() => {
    return {
      all: issues.length,
      high: issues.filter((i) => i.severity === 'high').length,
      medium: issues.filter((i) => i.severity === 'medium').length,
      low: issues.filter((i) => i.severity === 'low').length,
    };
  }, [issues]);

  const uniqueTypes = useMemo(() => {
    const types = Array.from(new Set(issues.map((i) => i.type)));
    return types;
  }, [issues]);

  const filteredIssues = useMemo(() => {
    return issues.filter((issue) => {
      // Severity filter
      if (selectedSeverity !== 'all' && issue.severity !== selectedSeverity) {
        return false;
      }
      // Type filter
      if (selectedType !== 'all' && issue.type !== selectedType) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesExplanation = issue.explanation.toLowerCase().includes(query);
        const matchesOriginal = issue.originalText?.toLowerCase().includes(query);
        const matchesSuggestion = issue.suggestion?.toLowerCase().includes(query);
        return matchesExplanation || matchesOriginal || matchesSuggestion;
      }
      return true;
    });
  }, [issues, selectedSeverity, selectedType, searchQuery]);

  return (
    <div className="rounded-3xl border border-white/10 bg-[#141417] p-6 sm:p-8 shadow-xs">
      {/* Title and Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white">Audited Issues &amp; Corrections</h3>
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-xs font-bold text-slate-300 border border-white/10">
              {issues.length} {issues.length === 1 ? 'finding' : 'findings'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Detailed inspection log of identified typos, grammar flaws, missing elements, and suggested rewrites.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search issues..."
            className="w-full rounded-xl border border-white/10 bg-[#0F0F11] pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-hidden transition-all"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/5">
        {/* Severity Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setSelectedSeverity('all')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              selectedSeverity === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/5'
            }`}
          >
            All ({severityCounts.all})
          </button>

          <button
            type="button"
            onClick={() => setSelectedSeverity('high')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              selectedSeverity === 'high'
                ? 'bg-rose-600 text-white'
                : 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/20'
            }`}
          >
            High Priority ({severityCounts.high})
          </button>

          <button
            type="button"
            onClick={() => setSelectedSeverity('medium')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              selectedSeverity === 'medium'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/20'
            }`}
          >
            Medium ({severityCounts.medium})
          </button>

          <button
            type="button"
            onClick={() => setSelectedSeverity('low')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              selectedSeverity === 'low'
                ? 'bg-emerald-600 text-white'
                : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/20'
            }`}
          >
            Minor / Typo ({severityCounts.low})
          </button>
        </div>

        {/* Type Dropdown */}
        {uniqueTypes.length > 1 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Category:</span>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-lg border border-white/10 bg-[#0F0F11] px-3 py-1.5 text-xs font-medium text-slate-200 focus:border-indigo-500 focus:outline-hidden cursor-pointer"
            >
              <option value="all" className="bg-[#141417] text-white">All Categories</option>
              {uniqueTypes.map((type) => (
                <option key={type} value={type} className="bg-[#141417] text-white">
                  {type.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Issues List */}
      {filteredIssues.length > 0 ? (
        <div className="space-y-4">
          {filteredIssues.map((issue) => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-2xl border border-dashed border-white/10 bg-[#0F0F11]">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400 mb-2" />
          <h4 className="text-sm font-bold text-white">No issues found matching criteria</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No audit findings matched "${searchQuery}". Try clearing search.`
              : 'The document passed this criteria with no detected issues.'}
          </p>
          {(searchQuery || selectedSeverity !== 'all' || selectedType !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSeverity('all');
                setSelectedType('all');
              }}
              className="mt-3 inline-flex items-center text-xs font-semibold text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
