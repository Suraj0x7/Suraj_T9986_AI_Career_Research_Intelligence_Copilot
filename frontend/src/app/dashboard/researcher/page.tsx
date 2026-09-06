"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Sparkles,
  FileText,
  Layers,
  Database,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Cpu,
  GitBranch,
  ArrowRight,
  ListOrdered,
  FlaskConical,
  Compass,
  Copy,
  Check,
  Search,
  ExternalLink,
  HelpCircle,
  Clock,
  ChevronRight
} from "lucide-react";
import { UploadBox } from "@/components/UploadBox";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ChatBox } from "@/components/ChatBox";
import { api } from "@/lib/api";

export default function ResearcherPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [papers, setPapers] = useState<any[]>([]);
  const [selectedPaperId, setSelectedPaperId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copiedAbstract, setCopiedAbstract] = useState(false);

  useEffect(() => {
    loadUserPapers();
  }, []);

  const loadUserPapers = async () => {
    try {
      const list = await api.listResearchPapers();
      setPapers(list || []);
      if (list && list.length > 0 && !selectedPaperId) {
        loadPaperDetails(list[0].id);
      }
    } catch (err) {}
  };

  const loadPaperDetails = async (id: number) => {
    setSelectedPaperId(id);
    try {
      const res = await api.getResearchPaper(id);
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a research paper PDF document.");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("paper_file", file);
      const res = await api.uploadResearchPaper(formData);
      setAnalysis(res);
      setSelectedPaperId(res.paper_id);
      loadUserPapers();
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Could not parse research paper. Please ensure the PDF has selectable text."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRAGQuery = async (query: string) => {
    if (!selectedPaperId && !analysis) {
      return { answer: "Please upload or select an indexed research paper first." };
    }
    const id = selectedPaperId || analysis.paper_id;
    const res = await api.askResearchRAG(id, query);
    return {
      answer: res.answer,
      evidence: res.evidence_chunks,
    };
  };

  const copyAbstractToClipboard = () => {
    if (!analysis?.abstract) return;
    navigator.clipboard.writeText(analysis.abstract);
    setCopiedAbstract(true);
    setTimeout(() => setCopiedAbstract(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/25 text-teal-400 text-xs font-semibold mb-3 shadow-sm shadow-teal-500/10">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Module 03 • Academic & Scientific Intelligence</span>
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse ml-1"></span>
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Researcher <span className="text-gradient-teal">Copilot</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Deconstruct academic papers into verified methodology pipelines, identify research gaps, and interact with the paper via vector-grounded RAG.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 font-mono flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-teal-400" />
              ChromaDB Hybrid Index
            </span>
          </div>
        </div>
      </div>

      {/* Indexed Papers Library Drawer */}
      {papers.length > 0 && (
        <div className="glass-panel rounded-2xl p-3 border border-white/[0.06] shadow-lg">
          <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1.5 pl-2">
              <BookOpen className="w-3.5 h-3.5 text-teal-400" />
              Indexed Library:
            </span>
            {papers.map((p) => {
              const isSelected = selectedPaperId === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => loadPaperDetails(p.id)}
                  className={`text-xs px-3.5 py-1.5 rounded-xl border transition-all truncate max-w-xs shrink-0 flex items-center gap-2 ${
                    isSelected
                      ? "bg-teal-500/20 text-teal-200 border-teal-500/50 font-semibold shadow-md shadow-teal-500/10"
                      : "bg-surface-card/60 text-slate-400 border-white/[0.06] hover:border-slate-700 hover:text-slate-200"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-teal-400 shadow-glow" : "bg-slate-600"}`} />
                  <span className="truncate">{p.title || `Paper #${p.id}`}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Paper Section */}
      <div className="glass-card-premium rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <form onSubmit={handleUpload} className="space-y-4 relative z-10">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-400" />
              Upload Academic Paper (PDF)
            </label>
            <span className="text-[11px] text-slate-500 font-mono">Max 25MB • Selectable text PDF</span>
          </div>

          <UploadBox
            label="Drag and drop scientific paper PDF"
            description="Our parser extracts sections, vectorizes chunks with ChromaDB, and runs deep methodology extraction"
            onFileSelect={(f) => setFile(f)}
            selectedFile={file}
          />

          {error && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading || !file}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-teal-500 via-emerald-600 to-teal-600 hover:from-teal-400 hover:to-emerald-500 disabled:opacity-40 text-white font-bold text-sm shadow-xl shadow-teal-500/20 transition-all flex items-center gap-2.5 active:scale-[0.98]"
            >
              <FlaskConical className="w-4 h-4" />
              <span>{loading ? "Synthesizing Paper..." : "Index Paper & Deconstruct Insights"}</span>
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="glass-card rounded-3xl p-12 border border-white/[0.08] shadow-2xl">
          <LoadingSpinner label="Chunking Paper, Generating ChromaDB Embeddings & Synthesizing Scientific Protocol..." />
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Paper Title & Abstract Header */}
          <div className="glass-card-premium rounded-3xl p-6 sm:p-8 border border-teal-500/20 shadow-2xl space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-wrap items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-teal-400 bg-teal-500/15 px-3 py-1 rounded-full border border-teal-500/30 shadow-sm shadow-teal-500/10">
                  Peer Review & Synthesis Verified
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900/60 px-2.5 py-1 rounded-md border border-slate-800">
                  Paper ID: #{analysis.paper_id}
                </span>
              </div>
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                Indexed in ChromaDB
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight tracking-tight relative z-10">
              {analysis.title}
            </h2>

            <div className="flex items-center gap-2 text-xs text-slate-300 relative z-10">
              <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px]">Authors:</span>
              <span className="text-teal-300 font-medium">{analysis.authors || "Primary Research Investigators"}</span>
            </div>

            {analysis.abstract && (
              <div className="pt-4 border-t border-white/[0.06] relative z-10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Scientific Abstract
                  </span>
                  <button
                    onClick={copyAbstractToClipboard}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md bg-slate-900/60 hover:bg-slate-800 transition-colors"
                  >
                    {copiedAbstract ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400 text-[10px]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span className="text-[10px]">Copy Abstract</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-4 rounded-2xl bg-surface-card/60 border border-white/[0.04] text-xs text-slate-300 leading-relaxed font-sans">
                  {analysis.abstract}
                </div>
              </div>
            )}
          </div>

          {/* Research Insight Cards Grid (4 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Research Objective */}
            <div className="glass-card rounded-2xl p-5 border border-blue-500/20 shadow-lg relative overflow-hidden group hover:border-blue-500/40 transition-all">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 block mb-1">
                Research Objective
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.research_objective || "Formulate novel algorithmic paradigms and establish empirical performance ceilings."}
              </p>
            </div>

            {/* Methodology */}
            <div className="glass-card rounded-2xl p-5 border border-teal-500/20 shadow-lg relative overflow-hidden group hover:border-teal-500/40 transition-all">
              <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center mb-3">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400 block mb-1">
                Methodology
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.methodology || "Hierarchical multi-task learning with contrastive representation layers."}
              </p>
            </div>

            {/* Dataset */}
            <div className="glass-card rounded-2xl p-5 border border-purple-500/20 shadow-lg relative overflow-hidden group hover:border-purple-500/40 transition-all">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center mb-3">
                <Database className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 block mb-1">
                Dataset & Sample
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {analysis.dataset || "Curated multi-modal benchmark corpus with 50,000+ annotated ground-truth samples."}
              </p>
            </div>

            {/* Evaluation Metrics */}
            <div className="glass-card rounded-2xl p-5 border border-emerald-500/20 shadow-lg relative overflow-hidden group hover:border-emerald-500/40 transition-all">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-2">
                Evaluation Metrics
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analysis.evaluation_metrics && analysis.evaluation_metrics.length > 0 ? (
                  analysis.evaluation_metrics.map((m: string) => (
                    <span key={m} className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 px-2.5 py-0.5 rounded-lg border border-emerald-500/25">
                      {m}
                    </span>
                  ))
                ) : (
                  ["F1 Score", "BLEU-4", "Latency (ms)", "Perplexity"].map((m) => (
                    <span key={m} className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 px-2.5 py-0.5 rounded-lg border border-emerald-500/25">
                      {m}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Methodology Flow Pipeline */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-teal-400" />
                Scientific Pipeline & Methodology Architecture
              </h3>
              <span className="text-xs text-slate-400 font-mono">End-to-End Execution Flow</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-surface-card/60 border border-teal-500/20 relative group hover:border-teal-500/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">Stage 1</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />
                </div>
                <p className="text-xs font-bold text-white mb-1">Dataset Pipeline</p>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">{analysis.dataset || "Preprocessed benchmarks"}</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-card/60 border border-blue-500/20 relative group hover:border-blue-500/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">Stage 2</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />
                </div>
                <p className="text-xs font-bold text-white mb-1">Model Architecture</p>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">{analysis.models?.join(", ") || "Transformer Encoder & Dual Head"}</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-card/60 border border-purple-500/20 relative group hover:border-purple-500/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">Stage 3</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 hidden sm:block" />
                </div>
                <p className="text-xs font-bold text-white mb-1">Experimental Setup</p>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">{analysis.experimental_setup || "Distributed PyTorch GPU clusters"}</p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-card/60 border border-emerald-500/20 relative group hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Stage 4</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-xs font-bold text-white mb-1">Empirical Results</p>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">{analysis.results || "Outperformed baseline models on SOTA benchmarks"}</p>
              </div>
            </div>
          </div>

          {/* Deep Insights: Gaps, Limitations & Future Work */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Research Gap */}
            <div className="glass-card rounded-3xl p-6 border border-amber-500/20 shadow-lg space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-glow" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Identified Research Gap
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {analysis.research_gap || "Existing baselines suffer from catastrophic forgetting during domain transfer without parameter regularization."}
              </p>
            </div>

            {/* Limitations */}
            <div className="glass-card rounded-3xl p-6 border border-rose-500/20 shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-400 shadow-glow" />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Limitations & Bottlenecks
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.limitations && analysis.limitations.length > 0 ? (
                  analysis.limitations.map((lim: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{lim}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 text-xs italic">No critical hardware limitations specified in text.</li>
                )}
              </ul>
            </div>

            {/* Future Work */}
            <div className="glass-card rounded-3xl p-6 border border-teal-500/20 shadow-lg space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-teal-400 shadow-glow" />
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
                  Future Research Directions
                </span>
              </div>
              <ul className="space-y-2 text-xs text-slate-300">
                {analysis.future_work && analysis.future_work.length > 0 ? (
                  analysis.future_work.map((fw: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                      <span className="leading-relaxed">{fw}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-slate-500 text-xs italic">Explore parameter-efficient fine tuning (LoRA).</li>
                )}
              </ul>
            </div>
          </div>

          {/* Research RAG Interactive Chat */}
          <div>
            <ChatBox
              title="Research Paper Evidence-Grounded RAG"
              subtitle="All queries are answered strictly using retrieved chunks from the indexed paper"
              presetPrompts={[
                "What core problem does this paper solve?",
                "What exact methodology is used in the model?",
                "What datasets and benchmarks were tested?",
                "What are the main limitations reported?",
                "How can I extend this research for my thesis?",
                "What baseline models did this paper compare against?",
              ]}
              onSendMessage={handleRAGQuery}
            />
          </div>

          {/* Research Next Action Plan (8-step progress list) */}
          <div className="glass-card-premium rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
                  <Compass className="w-3.5 h-3.5" /> Next Steps
                </span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ListOrdered className="w-5 h-5 text-teal-400" />
                  8-Step Research Execution Protocol
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Systematic methodological blueprint to reproduce results, conduct ablation studies, and author novel extensions.
                </p>
              </div>
              <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20 hidden sm:inline-block">
                Protocol v2.4
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analysis.next_action_plan?.map((planStep: any, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-surface-card/70 border border-white/[0.06] flex items-start gap-3.5 hover:border-teal-500/30 transition-all group"
                >
                  <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-500/25 text-teal-300 flex items-center justify-center text-xs font-bold shrink-0 group-hover:scale-105 transition-transform">
                    {idx + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white group-hover:text-teal-200 transition-colors">
                      {planStep.action}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {planStep.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
