"use client";

import React from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  GraduationCap,
  Briefcase,
  BookOpen,
  CheckCircle2,
  TrendingUp,
  Cpu,
  Layers,
  Database,
  Terminal,
  ShieldCheck,
  ChevronRight,
  FileSearch,
  Compass,
  Zap,
  Target,
  BarChart3,
  Bot
} from "lucide-react";

export default function LandingPage() {
  const modules = [
    {
      title: "Fresher & Student Copilot",
      category: "Career Acceleration",
      description:
        "Instant ATS resume score, deterministic skill gap extraction, and an evidence-grounded vector RAG copilot directly queryable on your profile.",
      icon: GraduationCap,
      href: "/dashboard/fresher",
      color: "from-blue-600 to-indigo-600",
      accent: "text-blue-400",
      tags: ["ATS Resume Scorer", "Skill Gap Extraction", "Mock Interview Simulation"],
    },
    {
      title: "Experienced Professional Copilot",
      category: "Market Positioning",
      description:
        "Benchmark your senior engineering background against target qualifications and live technology trends extracted from official cloud architectures.",
      icon: Briefcase,
      href: "/dashboard/experienced",
      color: "from-purple-600 to-pink-600",
      accent: "text-purple-400",
      tags: ["Skill Radar Chart", "Market Trend Ingestion", "Executive Roadmap"],
    },
    {
      title: "Research & Paper Intelligence",
      category: "Academic Synthesis",
      description:
        "Upload academic papers to automatically generate structured breakdowns of problem statements, novelty, datasets, and step-by-step action plans.",
      icon: BookOpen,
      href: "/dashboard/researcher",
      color: "from-teal-600 to-emerald-600",
      accent: "text-teal-400",
      tags: ["Paper Decomposition", "Citation Grounding", "8-Stage Action Plan"],
    },
  ];

  const features = [
    {
      title: "Deterministic Skill Extractor",
      desc: "Regex and taxonomy matching over 300+ canonical technical competencies with 100% predictable precision.",
      icon: Terminal,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "Vector RAG with ChromaDB",
      desc: "Custom chunking and vector embeddings ensure career and paper questions are answered using only verified citations.",
      icon: Database,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    },
    {
      title: "Gemini 1.5 Intelligence",
      desc: "High-reasoning LLM synthesis for interview question generation, research action planning, and tailored career feedback.",
      icon: Sparkles,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    },
    {
      title: "Longitudinal Progress Tracker",
      desc: "Interactive Recharts visual trajectory tracking career readiness, weekly task streaks, and ATS evolution.",
      icon: TrendingUp,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 selection:bg-blue-600 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[600px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[800px] right-0 w-[550px] h-[550px] bg-purple-600/10 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-[1400px] left-0 w-[550px] h-[550px] bg-teal-600/10 blur-3xl pointer-events-none -z-10" />

      {/* Navigation Header */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-blue-500/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight text-white font-sans">
              AI CAREER & RESEARCH
            </span>
            <span className="ml-2 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              COPILOT
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-400">
          <a href="#modules" className="hover:text-white transition-colors">Copilots</a>
          <a href="#features" className="hover:text-white transition-colors">Architecture</a>
          <a href="#metrics" className="hover:text-white transition-colors">Outcomes</a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-xs sm:text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl hover:bg-slate-900 border border-transparent hover:border-white/[0.08] transition-all"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 px-5 py-2.5 rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2 group"
          >
            <span>Get Started</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 sm:pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-cyan-300 text-xs font-semibold mb-8 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          <span>Next-Generation AI Career Orchestration & Research Synthesis</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Engineer your career. <br />
          <span className="text-gradient-primary">Accelerate your research.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          An evidence-grounded AI copilot built on ChromaDB vector retrieval, deterministic skill matching, and Gemini 1.5. Tailored for students, software engineers, and researchers.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold text-sm sm:text-base shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2.5 group"
          >
            <span>Start Free Analysis</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="w-full sm:w-auto px-8 py-4 rounded-xl glass-card-premium text-slate-200 hover:text-white font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2"
          >
            <span>Launch Demo Account</span>
          </Link>
        </div>

        {/* Hero Product Preview Mockup */}
        <div className="mt-16 sm:mt-20 relative max-w-4xl mx-auto">
          <div className="glass-card-premium rounded-3xl border border-white/[0.12] p-4 sm:p-6 shadow-2xl relative overflow-hidden text-left">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-3 text-xs font-mono text-slate-400">career-copilot-dashboard.app</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full font-bold">
                ● 100% Vector Grounded
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/[0.06] space-y-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Candidate Readiness</div>
                <div className="text-3xl font-extrabold text-white">80.0%</div>
                <div className="text-xs text-emerald-400 font-medium">+12.5% vs baseline</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/[0.06] space-y-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">ATS Resume Match</div>
                <div className="text-3xl font-extrabold text-cyan-400">49 / 100</div>
                <div className="text-xs text-slate-400 font-medium">5 Sections Optimized</div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-white/[0.06] space-y-2">
                <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Curriculum Tasks</div>
                <div className="text-3xl font-extrabold text-purple-400">30 Days</div>
                <div className="text-xs text-slate-400 font-medium">Docker • FastAPI • K8s</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            Targeted Intelligence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            Three Specialized Copilots in One Platform
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            Choose the module aligned with your immediate goals, or switch seamlessly across the full suite.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.title}
                className="glass-card-premium rounded-3xl p-7 border border-white/[0.08] flex flex-col justify-between group hover:border-blue-500/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {m.category}
                    </span>
                    <div className={`p-3 rounded-2xl bg-gradient-to-tr ${m.color} text-white shadow-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors">
                    {m.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
                    {m.description}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {m.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] font-mono text-slate-300 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06]">
                  <Link
                    href={m.href}
                    className="text-xs font-bold text-cyan-400 group-hover:text-cyan-300 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Launch Copilot</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Architecture Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/[0.06]">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
            Under the Hood
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            Engineered for Grounded Accuracy
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            No generic hallucinated career advice. Every recommendation is anchored in database models and vector similarity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="glass-card-premium rounded-2xl p-6 border border-white/[0.08]"
              >
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white tracking-tight">{f.title}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="w-full border-t border-white/[0.08] bg-[#05070e] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
              AI
            </div>
            <span className="text-xs font-bold tracking-tight text-white">
              AI Career & Research Copilot • 2026 Production Edition
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
            <Link href="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link href="/signup" className="hover:text-white transition-colors">Create Account</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
