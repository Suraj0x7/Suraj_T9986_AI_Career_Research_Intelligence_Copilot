"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  Code2,
  Sparkles,
  ChevronRight,
  Filter,
  Check,
  Flame,
  Target,
  Layers,
  ArrowUpRight,
  Compass
} from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api } from "@/lib/api";

export default function LearningPlanPage() {
  const [plan, setPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeWeek, setActiveWeek] = useState<number>(1);
  const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const data = await api.getLearningPlan();
      setPlan(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: number, newStatus: string) => {
    setUpdatingTaskId(taskId);
    try {
      const updatedPlan = await api.updateLearningTask(taskId, newStatus);
      setPlan(updatedPlan);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading 30-Day Personalized Learning Curriculum..." />;
  }

  const tasks = plan?.tasks || [];
  const currentWeekTasks = tasks.filter((t: any) => t.week_number === activeWeek);
  const completedCount = tasks.filter((t: any) => t.status === "COMPLETED").length;
  const progressPct = Math.round((completedCount / Math.max(tasks.length, 1)) * 100);

  const weekMeta = [
    { week: 1, title: "Week 1", label: "Core Foundation & Systems", focus: "Docker, Linux & Architecture", icon: Layers },
    { week: 2, title: "Week 2", label: "Cloud & Microservices", focus: "AWS, CI/CD & API Design", icon: Compass },
    { week: 3, title: "Week 3", label: "Advanced AI & RAG", focus: "ChromaDB, Embeddings & Agents", icon: Sparkles },
    { week: 4, title: "Week 4", label: "Capstone & Interview Simulation", focus: "Production Hardening & System Design", icon: Target },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Header */}
      <div className="relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold mb-3 shadow-sm shadow-blue-500/10">
          <CalendarCheck className="w-3.5 h-3.5" />
          <span>Curriculum Execution Engine • 30-Day Dynamic Roadmap</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse ml-1" />
        </div>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              30-Day Personalized <span className="text-gradient-blue">Learning Plan</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Daily theory breakdown, hands-on programming challenges, and architectural blueprints curated to eliminate identified skill gaps.
            </p>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3">
            <div className="glass-card-premium rounded-2xl p-3.5 border border-white/[0.08] shadow-lg flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold">
                {progressPct}%
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Curriculum Completed
                </span>
                <span className="text-sm font-extrabold text-white font-mono">
                  {completedCount} <span className="text-slate-500 font-normal text-xs">/ {tasks.length} tasks</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar with Milestone Markers */}
      <div className="glass-panel rounded-2xl p-4 border border-white/[0.06] space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            Curriculum Completion Velocity
          </span>
          <span className="text-white font-mono font-bold">{progressPct}% Finished</span>
        </div>
        <div className="relative w-full h-3 bg-surface-card rounded-full overflow-hidden border border-white/[0.06]">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-teal-400 rounded-full transition-all duration-700 shadow-glow"
            style={{ width: `${progressPct}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-0.5">
          <span>Week 1 (Day 1-7)</span>
          <span>Week 2 (Day 8-14)</span>
          <span>Week 3 (Day 15-21)</span>
          <span>Week 4 (Day 22-30)</span>
        </div>
      </div>

      {/* Week Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {weekMeta.map((w) => {
          const isSelected = activeWeek === w.week;
          const weekTasks = tasks.filter((t: any) => t.week_number === w.week);
          const weekCompleted = weekTasks.filter((t: any) => t.status === "COMPLETED").length;
          const weekTotal = Math.max(weekTasks.length, 7);
          const Icon = w.icon;

          return (
            <button
              key={w.week}
              onClick={() => setActiveWeek(w.week)}
              className={`p-5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group ${
                isSelected
                  ? "glass-card-premium border-blue-500/50 shadow-xl shadow-blue-500/10"
                  : "glass-card border-white/[0.06] hover:border-slate-700 hover:bg-surface-card/60"
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-teal-400" />
              )}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${
                      isSelected
                        ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      isSelected ? "text-blue-400" : "text-slate-400"
                    }`}
                  >
                    {w.title}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
                  {weekCompleted}/{weekTotal} done
                </span>
              </div>
              <p className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors truncate">
                {w.label}
              </p>
              <p className="text-[11px] text-slate-400 mt-1 truncate">{w.focus}</p>
            </button>
          );
        })}
      </div>

      {/* Week Daily Tasks List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <span>Week {activeWeek} Daily Schedule</span>
            <span className="text-xs font-mono text-slate-500 font-normal">
              ({currentWeekTasks.length} Days Allocated)
            </span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">Real-time sync enabled</span>
        </div>

        <div className="space-y-4">
          {currentWeekTasks.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center border border-white/[0.06]">
              <p className="text-xs text-slate-400">No tasks currently defined for this week.</p>
            </div>
          ) : (
            currentWeekTasks.map((task: any) => {
              const isCompleted = task.status === "COMPLETED";
              const isInProgress = task.status === "IN_PROGRESS";
              const isUpdating = updatingTaskId === task.id;

              return (
                <div
                  key={task.id}
                  className={`glass-card-premium rounded-2xl p-5 sm:p-6 border transition-all duration-300 ${
                    isCompleted
                      ? "border-emerald-500/30 bg-emerald-950/10 shadow-lg shadow-emerald-500/5"
                      : isInProgress
                      ? "border-blue-500/40 bg-blue-950/15 shadow-lg shadow-blue-500/10"
                      : "border-white/[0.06] hover:border-slate-700"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                    <div className="space-y-3 flex-1">
                      {/* Day & Title Row */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 ${
                            isCompleted
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : isInProgress
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                              : "bg-surface-card text-slate-300 border border-white/[0.08]"
                          }`}
                        >
                          D{task.day_number}
                        </div>
                        <h4
                          className={`text-base font-bold tracking-tight ${
                            isCompleted ? "line-through text-slate-400" : "text-white"
                          }`}
                        >
                          {task.topic}
                        </h4>
                        {isCompleted && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <Check className="w-3 h-3" /> Done
                          </span>
                        )}
                        {isInProgress && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" /> Active
                          </span>
                        )}
                      </div>

                      {/* Time Tags */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-card border border-white/[0.04]">
                          <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-slate-300">Theory:</span> {task.theory_duration}
                        </span>
                        <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-card border border-white/[0.04]">
                          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-slate-300">Lab Practice:</span> {task.practice_duration}
                        </span>
                      </div>

                      {/* Mini Task Description Box */}
                      <div className="p-4 rounded-xl bg-surface-card/80 border border-white/[0.04] space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Daily Practical Challenge
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed font-sans">
                          {task.mini_task}
                        </p>
                      </div>

                      {/* Resource Link */}
                      {task.resource_url && (
                        <div>
                          <a
                            href={task.resource_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors group"
                          >
                            <span>Official Documentation & Guided Repository</span>
                            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="flex sm:flex-col gap-2 shrink-0 pt-2 sm:pt-0">
                      <button
                        onClick={() =>
                          handleStatusChange(task.id, isCompleted ? "PENDING" : "COMPLETED")
                        }
                        disabled={isUpdating}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                          isCompleted
                            ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                            : "bg-surface-card hover:bg-slate-800 text-slate-300 hover:text-white border border-white/[0.08]"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{isCompleted ? "Completed" : "Mark Done"}</span>
                      </button>

                      {!isCompleted && (
                        <button
                          onClick={() =>
                            handleStatusChange(
                              task.id,
                              isInProgress ? "PENDING" : "IN_PROGRESS"
                            )
                          }
                          disabled={isUpdating}
                          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                            isInProgress
                              ? "bg-blue-600/25 border border-blue-500/40 text-blue-300"
                              : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-slate-800"
                          }`}
                        >
                          {isInProgress ? "In Progress" : "Start Task"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
