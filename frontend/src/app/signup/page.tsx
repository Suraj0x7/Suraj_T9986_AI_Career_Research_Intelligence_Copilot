"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, User, Mail, Lock, ArrowRight, AlertCircle, Loader2, GraduationCap, Briefcase, BookOpen, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileType, setProfileType] = useState("Fresher / Student");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const profileOptions = [
    {
      id: "Fresher / Student",
      label: "Fresher / Student",
      desc: "ATS resume scoring, deterministic skill gaps & 30-day curriculum",
      icon: GraduationCap,
      badge: "Student & Grad",
      accent: "from-blue-600 to-cyan-500",
    },
    {
      id: "Experienced Professional",
      label: "Experienced Professional",
      desc: "Benchmark seniority vs tech trends & architect target qualifications",
      icon: Briefcase,
      badge: "Senior & Lead",
      accent: "from-purple-600 to-pink-500",
    },
    {
      id: "Researcher",
      label: "Academic Researcher",
      desc: "Decompose papers into 8-stage action plans & evidence citations",
      icon: BookOpen,
      badge: "Academic & R&D",
      accent: "from-teal-600 to-emerald-500",
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify both fields.");
      return;
    }

    setLoading(true);
    try {
      await api.signup({
        name,
        email,
        password,
        confirm_password: confirmPassword,
        profile_type: profileType,
      });
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Registration failed. An account with this email may already exist."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-blue-600/15 via-purple-600/10 to-transparent blur-3xl pointer-events-none" />

      <div className="w-full max-w-xl relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-extrabold text-base tracking-tight text-white block">
                AI CAREER & RESEARCH
              </span>
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest block">
                COPILOT 2026
              </span>
            </div>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Create your account
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Select your copilot persona to tailor models, curriculum generation, and RAG retrieval.
          </p>
        </div>

        <div className="glass-card-premium rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Persona Selector */}
            <div>
              <label className="block text-[11px] font-bold text-slate-300 mb-2 uppercase tracking-wider font-mono">
                Select Your Copilot Persona
              </label>
              <div className="grid grid-cols-1 gap-2.5">
                {profileOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = profileType === opt.id;
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setProfileType(opt.id)}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex items-center gap-3.5 relative overflow-hidden ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-950/50 via-slate-900/80 to-slate-900/80 border-cyan-500/60 shadow-lg shadow-cyan-500/10 scale-[1.01]"
                          : "bg-slate-950/60 border-white/[0.06] text-slate-400 hover:border-slate-700 hover:bg-slate-900/60"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-xl border shrink-0 transition-colors ${
                          isSelected
                            ? `bg-gradient-to-tr ${opt.accent} text-white border-transparent shadow-md`
                            : "bg-slate-900 text-slate-400 border-slate-800"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs sm:text-sm font-bold truncate ${isSelected ? "text-white" : "text-slate-200"}`}>
                            {opt.label}
                          </p>
                          <span className="text-[9px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0">
                            {opt.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{opt.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Mercer"
                    className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@domain.com"
                    className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>Provisioning Account & Seeding Models...</span>
                </>
              ) : (
                <>
                  <span>Create Account & Launch Suite</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 font-normal">
          Already have an account?{" "}
          <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-bold ml-1 transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
