import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle2, Clock, FileText, Search, Sparkles } from 'lucide-react';

interface LoadingProgressProps {
  fileName?: string;
  hasAssignment?: boolean;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({
  fileName,
  hasAssignment,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { label: 'Reading and validating document', detail: 'Parsing text structure and page flow' },
    { label: 'Analyzing language & grammar', detail: 'Detecting spelling typos and awkward phrasing' },
    {
      label: hasAssignment ? 'Evaluating assignment requirements' : 'Analyzing document completeness',
      detail: hasAssignment ? 'Matching content against assignment questions' : 'Reviewing core arguments and structure',
    },
    { label: 'Synthesizing audit report', detail: 'Compiling scores, priority fixes, and actionable suggestions' },
  ];

  useEffect(() => {
    const timer1 = setTimeout(() => setCurrentStep(1), 1600);
    const timer2 = setTimeout(() => setCurrentStep(2), 3800);
    const timer3 = setTimeout(() => setCurrentStep(3), 6400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-white/10 bg-[#141417] p-8 sm:p-10 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
      <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-[0_0_30px_rgba(79,70,229,0.4)] border border-white/10">
        <Loader2 className="h-10 w-10 animate-spin text-white" />
      </div>

      <h3 className="mt-6 text-xl font-bold text-white">Auditing Document...</h3>
      {fileName && (
        <p className="mt-1 text-sm font-medium text-slate-400 truncate max-w-sm mx-auto">
          {fileName}
        </p>
      )}

      <div className="mt-8 space-y-3.5 text-left">
        {steps.map((step, idx) => {
          const isDone = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              className={`flex items-start gap-3.5 rounded-xl p-3.5 transition-all duration-300 ${
                isCurrent
                  ? 'bg-indigo-500/10 border border-indigo-500/20 shadow-xs'
                  : isDone
                  ? 'bg-white/5 border border-white/5 text-slate-300'
                  : 'opacity-30 border border-transparent'
              }`}
            >
              <div className="mt-0.5 shrink-0">
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : isCurrent ? (
                  <Loader2 className="h-5 w-5 text-indigo-400 animate-spin" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-slate-700" />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-semibold ${
                    isCurrent ? 'text-indigo-200' : isDone ? 'text-slate-200' : 'text-slate-500'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{step.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-slate-500">
        <Clock className="h-3.5 w-3.5 text-indigo-400" />
        <span>Gemini 3.7 Flash is analyzing your document. Usually takes 5–10 seconds.</span>
      </div>
    </div>
  );
};
