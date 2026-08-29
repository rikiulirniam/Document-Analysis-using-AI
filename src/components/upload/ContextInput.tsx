import React, { useState } from 'react';
import { HelpCircle, BookOpen, Layers, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface ContextInputProps {
  assignment: string;
  onAssignmentChange: (val: string) => void;
  referenceMaterial: string;
  onReferenceMaterialChange: (val: string) => void;
  onLoadSample?: (presetName: string) => void;
}

export const ContextInput: React.FC<ContextInputProps> = ({
  assignment,
  onAssignmentChange,
  referenceMaterial,
  onReferenceMaterialChange,
  onLoadSample,
}) => {
  const [showReference, setShowReference] = useState(false);

  const samplePresets = [
    {
      id: 'docker',
      label: 'Docker & Containerization Task',
      prompt:
        'Jelaskan bagaimana Docker bekerja, apa perbedaan arsitektur antara container dan virtual machine, serta sebutkan minimal 3 manfaat utama containerization dalam pengembangan software modern.',
      reference:
        'Docker adalah platform open-source berbasis Linux cgroups dan namespaces. Perbedaan utama dengan VM adalah container berbagi kernel OS host tanpa hypervisor overhead. Manfaat meliputi: 1. Portabilitas lintas environment, 2. Efisiensi resource dan booting cepat, 3. Isolasi dependency aplikasi.',
    },
    {
      id: 'ai-ethics',
      label: 'AI Ethics & Governance Essay',
      prompt:
        'Discuss key ethical considerations in deploying generative AI models. Address algorithmic bias, copyright/intellectual property concerns, and accountability mechanisms for autonomous decisions.',
      reference:
        'Key ethical pillars include: Fair representation (preventing demographic bias), provenance tracking (content authenticity, watermarking), transparent data consent, and human-in-the-loop oversight for high-risk deployments.',
    },
    {
      id: 'business',
      label: 'Market Strategy Proposal',
      prompt:
        'Evaluate the go-to-market strategy for a B2B SaaS platform. Outline customer acquisition channels, unit economics targets (CAC & LTV), and competitive differentiation pillars.',
      reference:
        'B2B SaaS GTM focuses on inbound content marketing, product-led growth (PLG) trial conversion, CAC payback under 12 months, and an LTV:CAC ratio greater than 3:1.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Assignment / Prompt Instructions */}
      <div className="rounded-2xl border border-white/10 bg-[#141417] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <label htmlFor="assignment-prompt" className="text-sm font-bold text-white">
                Assignment / Question Prompt
              </label>
              <span className="ml-2 text-xs font-medium text-slate-400">(Optional but recommended)</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-amber-400" /> Presets:
            </span>
            {samplePresets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onAssignmentChange(preset.prompt);
                  if (preset.reference) {
                    onReferenceMaterialChange(preset.reference);
                    setShowReference(true);
                  }
                  if (onLoadSample) onLoadSample(preset.id);
                }}
                className="rounded-md bg-white/5 border border-white/10 px-2 py-1 text-[11px] font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                {preset.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-400 mb-2.5">
          Provide the prompt or rubric questions. DocAudit AI will evaluate whether your document satisfies each requirement.
        </p>

        <textarea
          id="assignment-prompt"
          rows={3}
          value={assignment}
          onChange={(e) => onAssignmentChange(e.target.value)}
          placeholder="e.g., Explain how Docker works and provide at least 3 distinct benefits of containerization..."
          className="w-full rounded-xl border border-white/10 bg-[#0F0F11] p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden resize-y transition-all"
        />
      </div>

      {/* Reference Material (Optional) */}
      <div className="rounded-2xl border border-white/10 bg-[#141417] overflow-hidden shadow-xs">
        <button
          type="button"
          onClick={() => setShowReference(!showReference)}
          className="w-full flex items-center justify-between p-4 bg-[#141417] hover:bg-[#18181C] text-left transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <BookOpen className="h-4 w-4" />
            </div>
            <div>
              <span className="text-sm font-bold text-white">Reference Material / Fact Sheet</span>
              <span className="ml-2 text-xs text-slate-400 font-normal">
                {showReference || referenceMaterial ? '(Expanded)' : '(Optional — click to expand)'}
              </span>
            </div>
          </div>
          {showReference ? (
            <ChevronUp className="h-4 w-4 text-slate-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-slate-400" />
          )}
        </button>

        {(showReference || referenceMaterial.length > 0) && (
          <div className="p-5 border-t border-white/5 space-y-2.5 bg-[#0F0F11]">
            <p className="text-xs text-slate-400">
              Paste source textbook notes, guidelines, or reference facts to detect contradictions or factual inconsistencies.
            </p>
            <textarea
              id="reference-material"
              rows={3}
              value={referenceMaterial}
              onChange={(e) => onReferenceMaterialChange(e.target.value)}
              placeholder="e.g., Docker is an open-source container engine. Containers share the operating system kernel..."
              className="w-full rounded-xl border border-white/10 bg-[#141417] p-3.5 text-sm text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-hidden resize-y transition-all"
            />
          </div>
        )}
      </div>
    </div>
  );
};
