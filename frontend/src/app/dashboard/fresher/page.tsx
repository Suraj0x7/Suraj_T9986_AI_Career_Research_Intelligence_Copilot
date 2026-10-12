"use client";

import React, { useState } from "react";
import {
  Sparkles,
  FileText,
  Briefcase,
  Award,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Video as Youtube,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Compass,
  Zap,
  HelpCircle,
  FolderGit2,
  ArrowRight,
  TrendingUp,
  Bot
} from "lucide-react";
import { UploadBox } from "@/components/UploadBox";
import { SkillBadge } from "@/components/SkillBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { ChatBox } from "@/components/ChatBox";
import { api } from "@/lib/api";

export default function FresherPage() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [targetRole, setTargetRole] = useState("AI Engineer");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [analysis, setAnalysis] = useState<any>(null);
  const [interviewQuestions, setInterviewQuestions] = useState<any[]>([]);
  const [loadingInterview, setLoadingInterview] = useState(false);
  const [expandedAnswers, setExpandedAnswers] = useState<{ [key: number]: boolean }>({});
  const [error, setError] = useState<string | null>(null);

  const predefinedRoles = [
    "AI Engineer",
    "Data Scientist",
    "Software Engineer",
    "Data Analyst",
    "Full Stack Developer",
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a resume PDF document.");
      return;
    }
    if (!jobDescription.trim()) {
      setError("Please paste the target job description.");
      return;
    }

    setError(null);
    setLoading(true);
    setLoadingStep("Extracting resume text with PyPDF...");

    try {
      const formData = new FormData();
      formData.append("resume_file", file);
      formData.append("job_description", jobDescription);
      formData.append("target_role", targetRole);

      setLoadingStep("Extracting deterministic skills & computing ATS compatibility...");
      const result = await api.analyzeFresher(formData);
      setAnalysis(result);
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "An error occurred during resume analysis. Please verify your PDF file."
      );
    } finally {
      setLoading(false);
      setLoadingStep("");
    }
  };

  const handleGenerateInterview = async () => {
    if (!analysis) return;
    setLoadingInterview(true);
    try {
      const res = await api.generateInterviewQuestions(analysis.analysis_id, targetRole);
      setInterviewQuestions(res.questions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInterview(false);
    }
  };

  const toggleAnswer = (id: number) => {
    setExpandedAnswers((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRAGQuery = async (query: string) => {
    if (!analysis) {
      return { answer: "Please analyze a resume first to index your background into the vector database." };
    }
    const res = await api.askFresherRAG(analysis.analysis_id, query);
    return {
      answer: res.answer,
      evidence: res.relevant_chunks,
    };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Module 1 • Fresher & Graduate Career Copilot</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Fresher Career Copilot
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Upload your resume PDF and paste a target job specification to calculate deterministic skill gaps, ATS screening compatibility, and vector-grounded Q&A.
        </p>
      </div>

      {/* Input Form Section */}
      <div className="glass-card-premium rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl">
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Step 1: Upload Resume */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center justify-between">
                <span>STEP 1: Upload Resume PDF</span>
                <span className="text-[10px] text-cyan-400 font-normal">PyPDF extraction</span>
              </label>
              <UploadBox
                label="Choose Resume PDF"
                description="Drop your PDF resume here or click to browse (Max 15MB)"
                onFileSelect={(f) => setFile(f)}
                selectedFile={file}
              />
            </div>

            {/* Step 2: Role & JD */}
            <div className="space-y-3">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 font-mono">
                STEP 2: Target Role & Job Specification
              </label>

              {/* Quick Role Select */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                {predefinedRoles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setTargetRole(r)}
                    className={`text-xs px-3 py-1 rounded-xl border transition-all duration-200 whitespace-nowrap font-medium ${
                      targetRole === r
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 font-bold shadow-md shadow-blue-600/20"
                        : "bg-slate-950/60 text-slate-400 border-white/[0.06] hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <textarea
                rows={5}
                required
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the target job description here (e.g. required skills, qualifications, responsibilities)..."
                className="w-full bg-slate-950/90 border border-white/[0.08] rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all font-mono leading-relaxed"
              />
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={loading || !file || !jobDescription.trim()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Analyze Resume & Compute ATS Match</span>
            </button>
          </div>
        </form>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="glass-card-premium rounded-3xl p-12 border border-white/[0.08] shadow-2xl">
          <LoadingSpinner
            label={loadingStep || "Analyzing Resume..."}
            subtext="Extracting technical keywords, parsing sections, and computing vector similarities"
          />
        </div>
      )}

      {/* Analysis Results */}
      {analysis && !loading && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Next Best Action Banner */}
          <div className="glass-card-premium rounded-3xl p-6 sm:p-7 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
            <div className="space-y-1 max-w-2xl">
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-cyan-400" /> Next Best Action
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug tracking-tight">
                "{analysis.next_best_action}"
              </h3>
            </div>
            <a
              href="#learning-recommendations"
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold shrink-0 transition-all shadow-lg flex items-center gap-2"
            >
              <span>View Learning Modules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Scores Overview Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Overall Match Donut Card */}
            <div className="glass-card-premium rounded-3xl p-6 sm:p-7 border border-white/[0.08] shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Skill Match Ratio
                </span>
                <span className="text-[11px] font-bold text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/25">
                  {analysis.target_role}
                </span>
              </div>
              <div className="py-6 flex items-center gap-6">
                <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800/80"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-cyan-400"
                      strokeDasharray={`${analysis.match_score}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-extrabold text-white font-sans">{analysis.match_score}%</span>
                    <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Matched</span>
                  </div>
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1 tracking-tight">
                    {analysis.match_score >= 70 ? "Strong Candidate Fit" : "Foundational Fit with Gaps"}
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-normal">
                    Identified {analysis.matched_skills.length} matching skills out of {analysis.matched_skills.length + analysis.missing_skills.length} required competencies.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-white/[0.06] text-xs font-mono">
                <div>
                  <span className="text-slate-400">Matched:</span>{" "}
                  <span className="font-bold text-emerald-400">{analysis.matched_skills.length}</span>
                </div>
                <div>
                  <span className="text-slate-400">Missing Gaps:</span>{" "}
                  <span className="font-bold text-rose-400">{analysis.missing_skills.length}</span>
                </div>
              </div>
            </div>

            {/* ATS Resume Score */}
            <div className="glass-card-premium rounded-3xl p-6 sm:p-7 border border-white/[0.08] shadow-xl flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  ATS Resume Compatibility
                </span>
                <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
                  Screening Ready
                </span>
              </div>
              <div className="py-4 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">{analysis.ats_score}</span>
                    <span className="text-sm text-slate-400 font-mono font-bold"> / 100</span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    Evaluated across standard ATS section presence, keyword density, and quantifiable impact.
                  </p>
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-white/[0.06]">
                <div className="flex items-start gap-2 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">
                    <strong className="text-white">Detected Sections:</strong> {analysis.good_sections?.join(", ") || "Contact Info, Education"}
                  </span>
                </div>
                {analysis.weak_sections?.length > 0 && (
                  <div className="flex items-start gap-2 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span className="text-slate-300">
                      <strong className="text-white">Expand with Metrics:</strong> {analysis.weak_sections?.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Skill Breakdown Badges */}
          <div className="glass-card-premium rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-xl space-y-6">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
              Deterministic Skill Extraction & Breakdown
            </h3>

            {/* Matched */}
            <div>
              <span className="text-xs font-bold text-emerald-400 block mb-2 font-mono">
                Matched Core Skills ({analysis.matched_skills.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {analysis.matched_skills.map((s: string) => (
                  <SkillBadge key={s} skill={s} variant="matched" />
                ))}
              </div>
            </div>

            {/* Missing */}
            <div>
              <span className="text-xs font-bold text-rose-400 block mb-2 font-mono">
                Missing Skill Gaps ({analysis.missing_skills.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {analysis.missing_skills.map((s: string) => (
                  <SkillBadge key={s} skill={s} variant="missing" />
                ))}
              </div>
            </div>

            {/* Priority */}
            {analysis.priority_skills?.length > 0 && (
              <div>
                <span className="text-xs font-bold text-amber-400 block mb-2 font-mono">
                  Priority Skills (Core Requirements):
                </span>
                <div className="flex flex-wrap gap-2">
                  {analysis.priority_skills.map((s: string) => (
                    <SkillBadge key={s} skill={s} variant="priority" />
                  ))}
                </div>
              </div>
            )}

            {/* Category Breakdown */}
            <div className="pt-4 border-t border-white/[0.06]">
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
                Category-Wise Alignment
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.entries(analysis.category_scores || {}).map(([cat, val]: [string, any]) => (
                  <div key={cat} className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/[0.06]">
                    <p className="text-[11px] font-bold text-slate-400 truncate">{cat}</p>
                    <p className="text-lg font-extrabold text-white mt-1 font-sans">{val.percentage}%</p>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${val.percentage}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">{val.matched_count} of {val.total} req</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations & ATS Feedback */}
          {analysis.recommendations?.length > 0 && (
            <div className="glass-card-premium rounded-3xl p-6 sm:p-7 border border-white/[0.08] shadow-xl">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3.5 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>ATS & Resume Optimization Actions</span>
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                {analysis.recommendations.map((rec: string, i: number) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span className="leading-relaxed">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Learning Recommendations Cards */}
          <div id="learning-recommendations" className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span>Personalized Learning Modules for Missing Skills</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Curated tutorials, project challenges, and documentation mapped to your missing requirements.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.skill_gaps?.map((gap: any, idx: number) => (
                <div
                  key={idx}
                  className="glass-card-premium rounded-3xl p-6 sm:p-7 border border-white/[0.08] flex flex-col justify-between shadow-xl"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-bold text-white tracking-tight">{gap.skill_name}</h4>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-500/15 text-blue-300 px-2 py-0.5 rounded-full border border-blue-500/25">
                          {gap.category}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-full border border-amber-500/30">
                        {gap.priority_level} • {gap.duration_days}d
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-normal">
                      {gap.why_learn}
                    </p>

                    {/* Mini Project */}
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-white/[0.06]">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                        <FolderGit2 className="w-3.5 h-3.5 text-cyan-400" /> Hands-On Portfolio Challenge
                      </span>
                      <p className="text-xs text-slate-200 leading-relaxed">{gap.recommended_project}</p>
                    </div>

                    {/* YouTube Tutorials */}
                    {gap.youtube_resources?.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                          <Youtube className="w-3.5 h-3.5 text-rose-400" /> Video Tutorials
                        </span>
                        {gap.youtube_resources.map((yt: any, yidx: number) => (
                          <a
                            key={yidx}
                            href={yt.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-2.5 rounded-xl bg-slate-950/50 hover:bg-slate-900 border border-white/[0.04] hover:border-blue-500/30 text-xs text-slate-300 hover:text-white transition-all"
                          >
                            <p className="font-semibold truncate text-slate-200">{yt.title}</p>
                            <span className="text-[10px] text-slate-500 font-mono">{yt.channel}</span>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  {gap.doc_url && (
                    <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-end">
                      <a
                        href={gap.doc_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors"
                      >
                        <span>Official Documentation</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Grounded RAG Chat */}
          <div>
            <ChatBox
              title="Career RAG Copilot"
              subtitle="Grounded strictly in your resume vectors & the target job description"
              presetPrompts={[
                "What are my highest priority skill gaps for this job?",
                "What project should I build first to demonstrate competency?",
                "Which bullet points on my resume should be quantified?",
                "How can I highlight my Python and Docker skills better?",
              ]}
              onSendMessage={handleRAGQuery}
            />
          </div>

          {/* AI Mock Interview Questions */}
          <div className="glass-card-premium rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2.5 tracking-tight">
                  <HelpCircle className="w-5 h-5 text-cyan-400" />
                  <span>Technical Interview Question Simulator</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  10 comprehensive questions tailored to your resume, job gaps, and technical categories.
                </p>
              </div>
              <button
                onClick={handleGenerateInterview}
                disabled={loadingInterview}
                className="px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-600/25 transition-all shrink-0 flex items-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loadingInterview ? "Generating 10 Questions..." : "Generate 10 Questions"}</span>
              </button>
            </div>

            {interviewQuestions.length > 0 && (
              <div className="space-y-3.5 pt-2">
                {interviewQuestions.map((q: any) => (
                  <div
                    key={q.id}
                    className="p-4 sm:p-5 rounded-2xl bg-slate-950/70 border border-white/[0.06] space-y-2.5 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/25">
                          {q.category}
                        </span>
                        <span className="text-xs font-bold text-slate-300">{q.topic}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-full">
                        {q.difficulty}
                      </span>
                    </div>

                    <p className="text-sm font-bold text-white pt-1 leading-snug">
                      {q.id}. {q.question}
                    </p>

                    <button
                      onClick={() => toggleAnswer(q.id)}
                      className="text-xs text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 pt-1 transition-colors"
                    >
                      <span>{expandedAnswers[q.id] ? "Hide Suggested Answer" : "Reveal Suggested Answer"}</span>
                      {expandedAnswers[q.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {expandedAnswers[q.id] && (
                      <div className="mt-2.5 p-3.5 rounded-xl bg-slate-900/90 border border-white/[0.08] text-xs text-slate-300 leading-relaxed animate-in fade-in duration-200">
                        <strong className="text-white block mb-1 font-mono uppercase text-[10px] text-cyan-400">
                          Suggested Engineering Answer:
                        </strong>
                        {q.suggested_answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
