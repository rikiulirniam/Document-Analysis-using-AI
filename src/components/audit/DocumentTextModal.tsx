import React, { useState } from 'react';
import { DocumentContent } from '../../types/audit.js';
import { X, FileText, Search, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface DocumentTextModalProps {
  document: DocumentContent;
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentTextModal: React.FC<DocumentTextModalProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const totalPages = document.pages.length || 1;
  const activePageObj = document.pages.find((p) => p.pageNumber === currentPage) || document.pages[0];

  const handleCopyText = () => {
    navigator.clipboard.writeText(document.fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightMatches = (text: string) => {
    if (!searchTerm.trim()) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-amber-200 text-amber-950 font-bold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col rounded-3xl bg-[#141417] shadow-2xl border border-white/10 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0F0F11]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white truncate max-w-md">
                {document.fileName}
              </h3>
              <p className="text-xs text-slate-400">
                {document.fileType.toUpperCase()} • {document.wordCount.toLocaleString()} words •{' '}
                {totalPages} {totalPages === 1 ? 'Page / Section' : 'Pages / Sections'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Full Text</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#141417]">
          {/* Search inside text */}
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Find text in document..."
              className="w-full rounded-lg border border-white/10 bg-[#0F0F11] pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Page Selector */}
          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold text-slate-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Text Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0A0A0B] font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap selection:bg-indigo-900/60 selection:text-indigo-200">
          {activePageObj ? (
            highlightMatches(activePageObj.text)
          ) : (
            <p className="text-slate-500 italic">No text found on this page.</p>
          )}
        </div>
      </div>
    </div>
  );
};
