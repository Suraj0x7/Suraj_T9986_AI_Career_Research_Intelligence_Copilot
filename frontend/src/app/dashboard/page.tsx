"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Briefcase,
  BookOpen,
  TrendingUp,
  Award,
  Flame,
  FileCheck,
  Target,
  Sparkles,
  ArrowRight,
  Clock,
  Compass,
  Zap,
  ChevronRight,
  Layers,
  Activity
} from "lucide-react";
import { DashboardCard } from "@/components/DashboardCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await api.getDashboardSummary();
        setStats(data);
      } catch (err) {
        // Fallback default stats for preview
        setStats({
          user_name: "Alex Mercer",
          profile_type: "Fresher / Student",
          career_readiness_score: 80.0,
          skills_learned: 4,
          active_learning_goals: 30,
          research_papers_analyzed: 2,
          job_matches: 2,
          learning_streak: 6,
          next_best_action: "Complete Kubernetes fundamentals and containerize your FastAPI ML application.",
          recent_activity: [
            {
              title: "Analyzed Resume for AI Engineer",
              type: "Career Analysis",
              score: "80.0% Match",
              time: "Today"
            },
            {
              title: "Indexed Paper: Efficient Attention Mechanisms for Low-Latency Transformers",
              type: "Research Intelligence",
              score: "RAG Ready",
              time: "Today"
            }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading Executive Intelligence Dashboard..." />;
  }

  const copilots = [
    {
      title: "Fresher Career Copilot",
      desc: "ATS analysis, deterministic skill extraction, and mock interview question simulation.",
      href: "/dashboard/fresher",
      icon: GraduationCap,
      badge: "ATS & Roadmap",
      color: "from-blue-600 to-cyan-500",
      stats: "ATS Ready",
    },
    {
      title: "Experienced Career Copilot",
      desc: "Benchmark your seniority against live cloud trends and architectural roadmaps.",
      href: "/dashboard/experienced",
      icon: Briefcase,
      badge: "Market Radar",
      color: "from-purple-600 to-pink-500",
      stats: "Market Trends",
    },
    {
      title: "Research Paper Copilot",
      desc: "Deconstruct academic papers into 8 structured stages with cited ChromaDB RAG.",
      href: "/dashboard/researcher",
      icon: BookOpen,
      badge: "Vector RAG",
      color: "from-teal-600 to-emerald-500",
      stats: `${stats?.research_papers_analyzed || 2} Papers`,
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-cyan-400 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Career & Research Orchestration Suite</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <span>Welcome back, {stats?.user_name || "Alex"}</span>
            <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider hidden md:inline-block">
              {stats?.profile_type || "Fresher / Student"}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time telemetry on candidate readiness, curriculum tasks, and document vector indices.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/dashboard/fresher"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/25 transition-all flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>New Analysis</span>
          </Link>
        </div>
      </div>

      {/* Immediate Next Best Action Card */}
      <div className="glass-card-premium rounded-3xl p-6 sm:p-8 border border-cyan-500/30 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-cyan-500/10 via-blue-500/5 to-transparent blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
              <Compass className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span>Prioritized Next Best Action</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug tracking-tight">
              "{stats?.next_best_action}"
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-normal">
              Derived from your target job description skill gaps, ATS keywords, and active 30-day curriculum.
            </p>
          </div>
          <Link
            href="/dashboard/learning"
            className="shrink-0 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs sm:text-sm shadow-xl transition-all flex items-center justify-center gap-2 group/btn"
          >
            <span>Execute In Learning Plan</span>
            <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* 6 Key Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
        <DashboardCard
          title="Readiness"
          value={`${Math.round(stats?.career_readiness_score || 80)}%`}
          subtitle="Qualification Index"
          icon={Award}
          color="blue"
          trend="+5.0%"
        />
        <DashboardCard
          title="Skills Learned"
          value={stats?.skills_learned || 4}
          subtitle="Tasks Completed"
          icon={TrendingUp}
          color="emerald"
        />
        <DashboardCard
          title="Active Goals"
          value={stats?.active_learning_goals || 30}
          subtitle="30-Day Curriculum"
          icon={Target}
          color="purple"
        />
        <DashboardCard
          title="Papers Analyzed"
          value={stats?.research_papers_analyzed || 2}
          subtitle="ChromaDB Indexed"
          icon={BookOpen}
          color="teal"
        />
        <DashboardCard
          title="Job Matches"
          value={stats?.job_matches || 2}
          subtitle="Target Role Profiles"
          icon={FileCheck}
          color="blue"
        />
        <DashboardCard
          title="Daily Streak"
          value={`${stats?.learning_streak || 6}d`}
          subtitle="Active Velocity"
          icon={Flame}
          color="amber"
          trend="Active"
        />
      </div>

      {/* Specialized Copilot Launchers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Intelligence Copilots</h3>
            <p className="text-xs text-slate-400">Launch a specialized AI copilot tailored to your workflow</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {copilots.map((c) => {
            const Icon = c.icon;
            return (
              <Link
                key={c.title}
                href={c.href}
                className="glass-card-premium rounded-2xl p-6 border border-white/[0.08] flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                      {c.badge}
                    </span>
                    <div className={`p-3 rounded-xl bg-gradient-to-tr ${c.color} text-white shadow-lg`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h4 className="text-base font-bold text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                    {c.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {c.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
                  <span className="text-slate-400 font-mono text-[11px]">{c.stats}</span>
                  <div className="flex items-center gap-1">
                    <span>Launch</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="glass-card-premium rounded-3xl p-6 sm:p-7 border border-white/[0.08]">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-cyan-400" />
            <h3 className="text-base font-bold text-white tracking-tight">Recent Activity Stream</h3>
          </div>
          <Link
            href="/dashboard/notifications"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            View All Logs →
          </Link>
        </div>

        <div className="divide-y divide-white/[0.04]">
          {(!stats?.recent_activity || stats.recent_activity.length === 0) ? (
            <p className="text-xs text-slate-400 py-6 text-center">No recent activity detected.</p>
          ) : (
            stats.recent_activity.map((act: any, idx: number) => (
              <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-200 tracking-tight">
                      {act.title}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {act.type} • {act.time}
                    </p>
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2.5 py-0.5 rounded-full">
                    {act.score}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
