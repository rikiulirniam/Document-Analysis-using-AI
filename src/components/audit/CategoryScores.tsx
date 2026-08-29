import React from 'react';
import { AuditCategoryScores, AuditMode } from '../../types/audit.js';
import {
  SpellCheck,
  CheckCircle,
  FileText,
  Target,
  Layers,
  ListOrdered,
  HelpCircle,
} from 'lucide-react';

interface CategoryScoresProps {
  categories: AuditCategoryScores;
  auditMode: AuditMode;
}

export const CategoryScores: React.FC<CategoryScoresProps> = ({
  categories,
  auditMode,
}) => {
  const categoryItems = [
    {
      id: 'spelling',
      name: 'Spelling & Typos',
      score: categories.spelling,
      icon: SpellCheck,
      desc: 'Misspelled words, character errors, and word form accuracy.',
    },
    {
      id: 'grammar',
      name: 'Grammar & Syntax',
      score: categories.grammar,
      icon: CheckCircle,
      desc: 'Grammatical construction, verb agreement, and punctuation.',
    },
    {
      id: 'sentenceQuality',
      name: 'Sentence Quality',
      score: categories.sentenceQuality,
      icon: FileText,
      desc: 'Clarity, conciseness, phrasing flow, and lack of redundancy.',
    },
    {
      id: 'relevance',
      name: 'Relevance',
      score: categories.relevance,
      icon: Target,
      desc: 'Focus on the designated subject matter without off-topic drift.',
    },
    {
      id: 'completeness',
      name: 'Completeness',
      score: categories.completeness,
      icon: Layers,
      desc: 'Depth of explanation, key concepts covered, and required elements.',
    },
    {
      id: 'structure',
      name: 'Structure & Flow',
      score: categories.structure,
      icon: ListOrdered,
      desc: 'Logical progression, introduction, body discussions, and conclusions.',
    },
    {
      id: 'questionCoverage',
      name: 'Assignment Coverage',
      score: categories.questionCoverage,
      icon: HelpCircle,
      desc:
        auditMode === 'document_only'
          ? 'No specific assignment rubric provided (general audit).'
          : 'Fulfillment of all prompt instructions and question requirements.',
      isN_A: auditMode === 'document_only',
    },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 85)
      return {
        text: 'text-emerald-400',
        bg: 'bg-emerald-500',
        pill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      };
    if (score >= 70)
      return {
        text: 'text-amber-400',
        bg: 'bg-amber-500',
        pill: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      };
    return {
      text: 'text-rose-400',
      bg: 'bg-rose-500',
      pill: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    };
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#141417] p-6 sm:p-8 shadow-xs">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-bold text-white">Quality Breakdown by Category</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Individual assessment scores across language, structure, and prompt requirements.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryItems.map((item) => {
          const Icon = item.icon;
          const style = getScoreColor(item.score);

          return (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-white/5 bg-[#0F0F11] p-4 transition-all hover:bg-[#18181C] hover:border-white/10"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-indigo-400">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-white">{item.name}</span>
                  </div>

                  <span
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold border ${
                      item.isN_A
                        ? 'bg-white/5 text-slate-400 border-white/10'
                        : style.pill
                    }`}
                  >
                    {item.isN_A ? '100 (N/A)' : `${item.score}/100`}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-4 line-clamp-2">{item.desc}</p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/5">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      item.isN_A ? 'bg-slate-600' : style.bg
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
