"use client";

import React, { useState, useEffect } from "react";
import {
  Briefcase,
  Sparkles,
  TrendingUp,
  Compass,
  Radar as RadarIcon,
  ShieldCheck,
  FolderGit2,
  Globe,
  ArrowRight,
  Zap,
  CheckCircle2,
  Layers,
  Radio,
  ExternalLink
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { SkillBadge } from "@/components/SkillBadge";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api } from "@/lib/api";

export default function ExperiencedPage() {
  const [currentExp, setCurrentExp] = useState(
    "3 years experience developing Java Spring Boot and Python microservices using AWS and PostgreSQL. Implemented RESTful APIs, optimized SQL queries, and deployed services onto EC2."
  );
  const [targetJD, setTargetJD] = useState(
    "Seeking a Senior Backend / Systems Engineer with experience in Kubernetes, Docker, Kafka, Microservices, and Cloud Native design. Knowledge of Generative AI integration is a plus."
  );
  const [currentRole, setCurrentRole] = useState("Backend Software Engineer");
  const [targetRole, setTargetRole] = useState("Senior Cloud Systems Engineer");
  const [yearsExp, setYearsExp] = useState<number>(3);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [trendSources, setTrendSources] = useState<any[]>([]);

  useEffect(() => {
    const loadTrends = async () => {
      try {
        const data = await api.getIndustryTrends();
        setTrendSources(data.sources || []);
      } catch (err) {}
    };
    loadTrends();
  }, []);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.analyzeExperienced({
        current_experience: currentExp,
        target_job_description: targetJD,
        current_role: currentRole,
        target_role: targetRole,
        years_of_experience: yearsExp,
      });
      setAnalysis(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Custom Dark Recharts Tooltip
  const CustomRadarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card-premium rounded-xl p-3 border border-white/[0.12] shadow-2xl text-xs font-mono">
          <p className="font-bold text-white mb-1.5">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 py-0.5">
              <span style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-bold text-white">{entry.value}%</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold mb-2">
          <Briefcase className="w-3.5 h-3.5" />
          <span>Module 2 • Professional & Senior Career Positioning</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Experienced Career Copilot
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
          Benchmark your production tech stack against senior job requirements and live engineering trends scraped from official architecture publications.
        </p>
      </div>

      {/* Input Form */}
      <div className="glass-card-premium rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl">
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Current Role
              </label>
              <input
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Target Senior Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 transition-all font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Years of Experience
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={yearsExp}
                onChange={(e) => setYearsExp(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 transition-all font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                Your Current Experience Summary
              </label>
              <textarea
                rows={5}
                required
                value={currentExp}
                onChange={(e) => setCurrentExp(e.target.value)}
                placeholder="Describe your current tech stack, architectures built, and production responsibilities..."
                className="w-full bg-slate-950/90 border border-white/[0.08] rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 transition-all font-mono leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                Target Role Job Specification
              </label>
              <textarea
                rows={5}
                required
                value={targetJD}
                onChange={(e) => setTargetJD(e.target.value)}
                placeholder="Paste the target senior job description..."
                className="w-full bg-slate-950/90 border border-white/[0.08] rounded-2xl p-4 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/40 transition-all font-mono leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xl shadow-purple-600/25 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Benchmark Professional Gaps & Trends</span>
            </button>
          </div>
        </form>
      </div>

      {loading && (
        <div className="glass-card-premium rounded-3xl p-12 border border-white/[0.08] shadow-2xl">
          <LoadingSpinner
            label="Evaluating Technical Trajectory against 2026 Industry Trends..."
            subtext="Running taxonomy comparisons and scraping active engineering benchmarks"
          />
        </div>
      )}

      {analysis && !loading && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Next Best Action */}
          <div className="glass-card-premium rounded-3xl p-6 sm:p-7 border border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-purple-400" /> Executive Next Best Action
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-white leading-snug tracking-tight">
                "{analysis.next_best_action}"
              </h3>
            </div>
            <a
              href="#upskill-plan"
              className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold shrink-0 transition-all shadow-lg flex items-center gap-2"
            >
              <span>Review Senior Roadmap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* 3-Way Comparison Triad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Current Skills */}
            <div className="glass-card-premium rounded-3xl p-6 border border-white/[0.08] shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Your Current Stack
                </span>
                <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
                  {analysis.current_skills.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {analysis.current_skills.map((s: string) => (
                  <SkillBadge key={s} skill={s} variant="matched" />
                ))}
              </div>
            </div>

            {/* Target Role Skills */}
            <div className="glass-card-premium rounded-3xl p-6 border border-white/[0.08] shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Target Job Requirements
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/25">
                  {analysis.target_skills.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {analysis.target_skills.map((s: string) => (
                  <SkillBadge key={s} skill={s} variant="strong" />
                ))}
              </div>
            </div>

            {/* Industry Trending Skills */}
            <div className="glass-card-premium rounded-3xl p-6 border border-white/[0.08] shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Industry Tech Trends
                </span>
                <span className="text-xs font-mono font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full border border-purple-500/25">
                  {analysis.trending_skills.length}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {analysis.trending_skills.map((s: string) => (
                  <SkillBadge key={s} skill={s} variant="trending" />
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Recharts Radar / Category Visualizer */}
          {analysis.radar_data && analysis.radar_data.length > 0 && (
            <div className="glass-card-premium rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-white/[0.06] mb-6">
                <div>
                  <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <RadarIcon className="w-4 h-4 text-purple-400" />
                    <span>Multi-Dimensional Competency Radar</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Visual comparison across Current Experience vs Target Requirements vs Industry Trends
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> Current
                  </span>
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Target
                  </span>
                  <span className="flex items-center gap-1.5 text-purple-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400" /> Industry
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Radar Chart */}
                <div className="lg:col-span-7 h-72 sm:h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="75%" data={analysis.radar_data}>
                      <PolarGrid stroke="rgba(255, 255, 255, 0.08)" />
                      <PolarAngleAxis dataKey="category" stroke="#94a3b8" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="rgba(255, 255, 255, 0.15)" tick={false} />
                      <Tooltip content={<CustomRadarTooltip />} />
                      <Radar name="Your Stack" dataKey="Current" stroke="#10b981" fill="#10b981" fillOpacity={0.25} />
                      <Radar name="Target Role" dataKey="Target" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} />
                      <Radar name="Industry" dataKey="Industry" stroke="#a855f7" fill="#a855f7" fillOpacity={0.2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>

                {/* Progress bars list */}
                <div className="lg:col-span-5 space-y-3.5">
                  {analysis.radar_data.map((cat: any) => (
                    <div key={cat.category} className="p-3.5 rounded-2xl bg-slate-950/70 border border-white/[0.06] space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span>{cat.category}</span>
                        <span className="text-[10px] font-mono text-slate-400">{cat.Current}% / {cat.Target}%</span>
                      </div>
                      <div className="space-y-1">
                        <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden flex">
                          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${cat.Current}%` }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Strategic Upskill Classification */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* High Priority */}
            <div className="glass-card-premium rounded-3xl p-6 border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-400">
                  High Priority Gaps
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full">Target & Trend</span>
              </div>
              <div className="space-y-3">
                {analysis.high_priority_skills?.map((item: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/[0.06] space-y-1.5">
                    <p className="text-sm font-bold text-white tracking-tight">{item.skill}</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.reason}</p>
                    <p className="text-[10px] text-slate-400 font-mono pt-1 border-t border-white/[0.04]">{item.industry_trend}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Medium Priority */}
            <div className="glass-card-premium rounded-3xl p-6 border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                  Medium Priority
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full">Target Core</span>
              </div>
              <div className="space-y-3">
                {analysis.medium_priority_skills?.map((item: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/[0.06] space-y-1.5">
                    <p className="text-sm font-bold text-white tracking-tight">{item.skill}</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.reason}</p>
                    <p className="text-[10px] text-slate-400 font-mono pt-1 border-t border-white/[0.04]">{item.industry_trend}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Future Growth */}
            <div className="glass-card-premium rounded-3xl p-6 border border-white/[0.08] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                  Future Horizon
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full">Next-Gen Tech</span>
              </div>
              <div className="space-y-3">
                {analysis.future_growth_skills?.map((item: any, i: number) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/[0.06] space-y-1.5">
                    <p className="text-sm font-bold text-white tracking-tight">{item.skill}</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.reason}</p>
                    <p className="text-[10px] text-slate-400 font-mono pt-1 border-t border-white/[0.04]">{item.industry_trend}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 30-Day Executive Upskill Roadmap */}
          <div id="upskill-plan" className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2 tracking-tight">
                <FolderGit2 className="w-5 h-5 text-purple-400" />
                <span>30-Day Executive Upskill Roadmap (Architectural Level)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Week-by-week architectural milestones designed for senior authority and technical leadership.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {analysis.thirty_day_roadmap?.map((wk: any) => (
                <div key={wk.week} className="glass-card-premium rounded-3xl p-6 sm:p-7 border border-white/[0.08] flex flex-col justify-between shadow-xl">
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
                        Week {wk.week} Focus
                      </span>
                      <span className="text-xs font-bold text-white bg-slate-900 border border-slate-800 px-3 py-1 rounded-full font-mono">
                        {wk.focus}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Why Learn This?</span>
                      <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{wk.why_learn}</p>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">Target JD Alignment</span>
                      <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{wk.target_alignment}</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900/60 to-slate-900/60 border border-purple-800/40 mt-2">
                      <span className="text-[10px] font-mono font-bold text-purple-300 uppercase tracking-wider block mb-1">
                        Recommended Architectural Deliverable
                      </span>
                      <p className="text-xs text-slate-100 font-semibold leading-relaxed">{wk.recommended_project}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Industry Source Feeds */}
          {trendSources.length > 0 && (
            <div className="glass-card-premium rounded-3xl p-6 sm:p-7 border border-white/[0.08] shadow-xl">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                    Live Industry Architecture Feeds
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full">
                  ● Real-time Ingestion
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {trendSources.map((src, i) => (
                  <div key={i} className="p-3.5 rounded-2xl bg-slate-950/60 border border-white/[0.06] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{src.category}</span>
                      <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-cyan-400">
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <p className="text-xs font-bold text-white tracking-tight">{src.source_name}</p>
                    <div className="flex flex-wrap gap-1 pt-1">
                      {src.extracted_skills?.map((sk: string) => (
                        <span key={sk} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
