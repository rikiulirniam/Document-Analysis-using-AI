import React, { useState } from 'react';
import { Navbar } from './components/Navbar.js';
import { FileDropzone } from './components/upload/FileDropzone.js';
import { ContextInput } from './components/upload/ContextInput.js';
import { LoadingProgress } from './components/audit/LoadingProgress.js';
import { OverallScore } from './components/audit/OverallScore.js';
import { CategoryScores } from './components/audit/CategoryScores.js';
import { RequirementList } from './components/audit/RequirementList.js';
import { PriorityFixesAndStrengths } from './components/audit/PriorityFixesAndStrengths.js';
import { IssueList } from './components/audit/IssueList.js';
import { DocumentTextModal } from './components/audit/DocumentTextModal.js';
import { ExportReportModal } from './components/audit/ExportReportModal.js';
import { SAMPLE_DOCUMENTS, SampleDocumentPreset } from './data/samples.js';
import { AuditResult } from './types/audit.js';
import {
  FileSearch,
  Sparkles,
  ArrowRight,
  RefreshCw,
  FileText,
  Download,
  AlertCircle,
  ShieldCheck,
  Zap,
  Info,
} from 'lucide-react';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [assignment, setAssignment] = useState<string>('');
  const [referenceMaterial, setReferenceMaterial] = useState<string>('');
  const [result, setResult] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [showDocumentModal, setShowDocumentModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  const handleReset = () => {
    setResult(null);
    setFile(null);
    setAssignment('');
    setReferenceMaterial('');
    setError(null);
  };

  const handleLoadPreset = (preset: SampleDocumentPreset) => {
    setAssignment(preset.assignment);
    setReferenceMaterial(preset.referenceMaterial);

    // Create a mock File object from preset text for instant audit demo
    const blob = new Blob([preset.sampleText], {
      type: preset.type === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const sampleFile = new File([blob], preset.name, {
      type: preset.type === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    setFile(sampleFile);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a PDF or DOCX file to begin audit.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      if (assignment.trim()) {
        formData.append('assignment', assignment.trim());
      }
      if (referenceMaterial.trim()) {
        formData.append('referenceMaterial', referenceMaterial.trim());
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(
          json.error?.message || 'Document analysis failed. Please verify file integrity and try again.'
        );
      }

      setResult(json.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'An unexpected error occurred during document audit.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-100 flex flex-col font-sans selection:bg-indigo-900/60 selection:text-indigo-200">
      <Navbar onReset={handleReset} hasResult={!!result} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* VIEW 1: LOADING STATE */}
        {loading && (
          <div className="py-12">
            <LoadingProgress fileName={file?.name} hasAssignment={!!assignment.trim()} />
          </div>
        )}

        {/* VIEW 2: UPLOAD & AUDIT CONFIGURATION SCREEN */}
        {!loading && !result && (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
            {/* Header Hero Title */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/20">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Automated Quality &amp; Compliance Audit
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Audit Your Documents with Precision AI
              </h1>
              <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Upload your essay, assignment, or report to evaluate grammar, detect typos, verify question coverage, and receive actionable corrections.
              </p>
            </div>

            {/* Quick Demo Samples Bar */}
            <div className="rounded-2xl border border-white/10 bg-[#141417] p-4 sm:p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Try a Ready-to-Audit Sample</h3>
                    <p className="text-[11px] text-slate-400">
                      Click a sample below to load a document, assignment prompt, and reference notes instantly:
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {SAMPLE_DOCUMENTS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleLoadPreset(sample)}
                      className="rounded-xl border border-white/10 bg-[#0F0F11] px-3 py-1.5 text-xs font-semibold text-slate-200 shadow-2xs hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${
                          sample.type === 'pdf' ? 'bg-rose-500' : 'bg-indigo-500'
                        }`}
                      />
                      {sample.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Upload Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-white">1. Upload Document</label>
                <span className="text-xs text-slate-400 font-medium">Required • PDF or DOCX</span>
              </div>
              <FileDropzone
                file={file}
                onFileSelect={setFile}
                error={error}
                onErrorChange={setError}
              />
            </div>

            {/* Context Inputs (Assignment Prompt & Reference Material) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-white">2. Context &amp; Instructions</label>
                <span className="text-xs text-slate-400 font-medium">Modes A, B, or C</span>
              </div>
              <ContextInput
                assignment={assignment}
                onAssignmentChange={setAssignment}
                referenceMaterial={referenceMaterial}
                onReferenceMaterialChange={setReferenceMaterial}
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="button"
                id="start-audit-button"
                disabled={!file}
                onClick={handleAnalyze}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 hover:bg-indigo-500 px-6 py-4 text-sm font-bold text-white shadow-[0_0_25px_rgba(79,70,229,0.35)] disabled:opacity-40 disabled:hover:bg-indigo-600 disabled:shadow-none disabled:cursor-not-allowed transition-all cursor-pointer group"
              >
                <span>Analyze Document</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="mt-4 flex items-center justify-center gap-4 text-xs text-slate-500 text-center">
                <span>Stateless Execution</span>
                <span>•</span>
                <span>No Data Stored Permanently</span>
                <span>•</span>
                <span>Gemini 3.7 Flash Engine</span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: AUDIT RESULT DASHBOARD */}
        {!loading && result && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Top Bar with Document Info & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-indigo-500/10 px-2.5 py-0.5 text-xs font-bold text-indigo-300 border border-indigo-500/20">
                    Audit Report
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(result.analyzedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <h2 className="text-2xl font-extrabold text-white mt-1 flex items-center gap-2">
                  {result.documentMeta.fileName}
                </h2>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  type="button"
                  id="view-document-btn"
                  onClick={() => setShowDocumentModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-slate-200 shadow-2xs hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-slate-400" />
                  <span>Inspect Extracted Text</span>
                </button>

                <button
                  type="button"
                  id="export-report-btn"
                  onClick={() => setShowExportModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-bold text-slate-200 shadow-2xs hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                >
                  <Download className="h-4 w-4 text-slate-400" />
                  <span>Export Report</span>
                </button>

                <button
                  type="button"
                  id="new-audit-dashboard-btn"
                  onClick={handleReset}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-2 text-xs font-bold text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-colors cursor-pointer"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>New Audit</span>
                </button>
              </div>
            </div>

            {/* Overall Score & Executive Summary */}
            <OverallScore result={result} />

            {/* Category Breakdown (7 Quality Categories) */}
            <CategoryScores
              categories={result.categories}
              auditMode={result.auditMode}
            />

            {/* Priority Fixes and Strengths Grid */}
            <PriorityFixesAndStrengths
              priorityFixes={result.priorityFixes}
              strengths={result.strengths}
            />

            {/* Assignment Requirements Checklist (if applicable) */}
            {result.requirements && result.requirements.length > 0 && (
              <RequirementList requirements={result.requirements} />
            )}

            {/* Detailed Issues List with Filtering & Diffs */}
            <IssueList issues={result.issues} />
          </div>
        )}
      </main>

      {/* Extracted Document Text Modal */}
      {result && (
        <DocumentTextModal
          document={result.documentMeta}
          isOpen={showDocumentModal}
          onClose={() => setShowDocumentModal(false)}
        />
      )}

      {/* Export Report Modal */}
      {result && (
        <ExportReportModal
          result={result}
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-white/5 bg-[#0F0F11] mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">DocAudit AI</span>
            <span>•</span>
            <span>Intelligent Document Quality &amp; Compliance Engine</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Powered by Gemini 3.7 Flash</span>
            <span>•</span>
            <span>Stateless Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
