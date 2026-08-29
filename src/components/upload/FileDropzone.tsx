import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, X, AlertCircle, FileCheck, CheckCircle2 } from 'lucide-react';

interface FileDropzoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  error?: string | null;
  onErrorChange?: (error: string | null) => void;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  file,
  onFileSelect,
  error,
  onErrorChange,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

  const handleFiles = (selectedFile: File | null) => {
    if (!selectedFile) return;

    const fileName = selectedFile.name.toLowerCase();
    const isPdf = fileName.endsWith('.pdf') || selectedFile.type === 'application/pdf';
    const isDocx =
      fileName.endsWith('.docx') ||
      selectedFile.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    if (!isPdf && !isDocx) {
      if (onErrorChange) {
        onErrorChange('Invalid file format. Please upload a PDF (.pdf) or Word document (.docx).');
      }
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      if (onErrorChange) {
        onErrorChange('File size exceeds the 10 MB limit. Please select a smaller document.');
      }
      return;
    }

    if (onErrorChange) onErrorChange(null);
    onFileSelect(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files[0]);
          }
        }}
      />

      {!file ? (
        <div
          id="file-dropzone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-10 transition-all duration-200 cursor-pointer text-center ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.008]'
              : 'border-white/15 bg-[#141417] hover:border-indigo-500/40 hover:bg-[#18181C]'
          }`}
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-[0_0_20px_rgba(79,70,229,0.15)] transition-transform group-hover:scale-105">
            <UploadCloud className="h-8 w-8" />
          </div>

          <div className="mt-4 space-y-1">
            <p className="text-base font-semibold text-slate-200">
              Drag and drop your document here, or{' '}
              <span className="text-indigo-400 underline decoration-indigo-400/40 underline-offset-2 hover:text-indigo-300">
                browse files
              </span>
            </p>
            <p className="text-xs text-slate-500">
              Supports PDF and Word (.docx) documents up to 10 MB
            </p>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span> PDF Document
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-slate-300 border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span> Word (.docx)
            </span>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl border border-white/10 bg-[#141417] p-5 shadow-xs transition-all">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl font-bold text-xs ${
                  file.name.toLowerCase().endsWith('.pdf')
                    ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                }`}
              >
                {file.name.toLowerCase().endsWith('.pdf') ? 'PDF' : 'DOCX'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="truncate text-sm font-semibold text-white">{file.name}</h4>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="h-3 w-3" /> Ready
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{formatFileSize(file.size)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              >
                Change
              </button>
              <button
                type="button"
                onClick={() => onFileSelect(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors cursor-pointer"
                title="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-rose-500/10 p-3 text-xs font-medium text-rose-300 border border-rose-500/20">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
