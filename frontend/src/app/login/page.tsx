"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles, Mail, Lock, ArrowRight, AlertCircle, Loader2, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filledDemo, setFilledDemo] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await api.login({ email, password });
      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.detail || "Invalid credentials. Please verify your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail("demo@copilot.ai");
    setPassword("password123");
    setFilledDemo(true);
    setError(null);
    setTimeout(() => setFilledDemo(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-blue-600/15 to-purple-600/10 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
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
            Welcome back
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1.5">
            Authenticate to access your active curriculum, copilots, and vector indices.
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
                  placeholder="demo@copilot.ai"
                  className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950/80 border border-white/[0.08] rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/40 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 mt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                  <span>Validating Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Fill Button */}
          <div className="mt-6 pt-5 border-t border-white/[0.08] text-center">
            <button
              type="button"
              onClick={handleDemoFill}
              className={`w-full py-2.5 rounded-xl border text-xs font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                filledDemo
                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                  : "bg-slate-900/80 hover:bg-slate-800 border-white/[0.08] text-slate-300 hover:text-white"
              }`}
            >
              {filledDemo ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Demo Credentials Filled (Ready to Sign In)</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Auto-fill Demo Credentials (demo@copilot.ai)</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 font-normal">
          New to AI Career Copilot?{" "}
          <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-bold ml-1 transition-colors">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
