import React, { useState, useRef } from "react";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, X, Sparkles } from "lucide-react";

interface UploadBoxProps {
  label?: string;
  accept?: string;
  description?: string;
  onFileSelect: (file: File | null) => void;
  selectedFile?: File | null;
}

export const UploadBox: React.FC<UploadBoxProps> = ({
  label = "Upload PDF Document",
  accept = ".pdf,application/pdf",
  description = "Drag & drop your PDF here, or browse local files (Max 15MB)",
  onFileSelect,
  selectedFile,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const validateAndSelect = (file: File) => {
    setError(null);
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("Please upload a valid PDF document with selectable text.");
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setError("File size exceeds the 15MB limit.");
      return;
    }
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const handleClear = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setError(null);
    onFileSelect(null);
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="hidden"
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`cursor-pointer border-2 border-dashed rounded-2xl p-7 text-center transition-all duration-300 relative group overflow-hidden ${
            isDragging
              ? "border-blue-500 bg-blue-500/10 shadow-2xl shadow-blue-500/20 scale-[1.01]"
              : "border-slate-800 hover:border-blue-500/50 bg-slate-900/40 hover:bg-slate-900/70"
          }`}
        >
          {/* Subtle hover gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500/20 to-indigo-500/10 border border-blue-500/30 flex items-center justify-center mb-3.5 group-hover:scale-110 group-hover:border-blue-400/60 transition-all duration-300 shadow-md">
            <UploadCloud className="w-6 h-6 text-blue-400 group-hover:text-cyan-300 transition-colors" />
          </div>

          <p className="text-sm font-bold text-white tracking-tight flex items-center justify-center gap-1.5">
            <span>{label}</span>
            <Sparkles className="w-3.5 h-3.5 text-blue-400 opacity-80" />
          </p>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            {description}
          </p>

          <div className="mt-3.5 inline-flex items-center gap-2 text-[11px] font-semibold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
            <span>Click to browse</span>
            <span className="text-slate-500">•</span>
            <span className="font-mono uppercase text-slate-400">PDF ONLY</span>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-slate-900/60 p-4 flex items-center justify-between shadow-lg shadow-emerald-500/5 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-inner">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white flex items-center gap-2 tracking-tight">
                {selectedFile.name}
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              </p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {(selectedFile.size / 1024).toFixed(1)} KB • Ready for AI extraction & RAG indexing
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Remove file"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="mt-2.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
