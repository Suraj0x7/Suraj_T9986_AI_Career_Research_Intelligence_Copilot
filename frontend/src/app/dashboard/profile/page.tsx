"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Briefcase,
  Target,
  Clock,
  FileText,
  CheckCircle2,
  AlertCircle,
  Save,
  Shield,
  Sparkles,
  Award
} from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [yearsExp, setYearsExp] = useState<number>(1.0);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.getMe();
      setUser(data);
      setName(data.name || "");
      if (data.profile) {
        setCurrentRole(data.profile.current_role || "");
        setTargetRole(data.profile.target_role || "");
        setYearsExp(data.profile.years_of_experience || 1.0);
        setBio(data.profile.bio || "");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setError(null);

    try {
      const updated = await api.updateProfile({
        name,
        current_role: currentRole,
        target_role: targetRole,
        years_of_experience: yearsExp,
        bio,
      });
      setUser(updated);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setError("Failed to update profile settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading Profile & Personalized Preferences..." />;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-4xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold mb-3 shadow-sm shadow-blue-500/10">
          <User className="w-3.5 h-3.5" />
          <span>Candidate Identity & Career Preferences</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Profile & <span className="text-gradient-blue">Target Career</span>
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Configure your professional goals, current experience level, and background to tailor AI Copilot recommendations.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="glass-card-premium rounded-3xl p-6 sm:p-8 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 p-0.5 shadow-xl shadow-blue-500/20">
              <div className="w-full h-full bg-surface-base rounded-2xl flex items-center justify-center text-white font-extrabold text-xl">
                {name ? name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{name || "Candidate"}</h2>
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-[10px] font-bold">
                  {user?.profile_type || "Fresher"}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>{user?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 rounded-xl bg-surface-card border border-white/[0.06] text-right">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Target Role
              </span>
              <span className="text-xs font-bold text-blue-300">
                {targetRole || "Software Engineer"}
              </span>
            </div>
          </div>
        </div>

        {savedSuccess && (
          <div className="mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-3 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>Profile settings successfully saved to your AI Copilot database!</span>
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-3">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-400" />
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-surface-card border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                Registered Email
              </label>
              <input
                type="email"
                disabled
                value={user?.email || ""}
                className="w-full bg-surface-base/80 border border-white/[0.04] rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                Persona Track
              </label>
              <input
                type="text"
                disabled
                value={user?.profile_type || "Fresher"}
                className="w-full bg-surface-base/80 border border-white/[0.04] rounded-xl px-4 py-3 text-sm text-slate-400 font-semibold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-teal-400" />
                Current Role / Title
              </label>
              <input
                type="text"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                placeholder="Student / Junior Engineer"
                className="w-full bg-surface-card border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-all placeholder-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-purple-400" />
                Target Enterprise Role
              </label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="AI Engineer / Backend Architect"
                className="w-full bg-surface-card border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Years of Experience
            </label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={yearsExp}
              onChange={(e) => setYearsExp(parseFloat(e.target.value) || 0)}
              className="w-full sm:w-56 bg-surface-card border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-blue-500 transition-all font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              Professional Bio & Ambitions
            </label>
            <textarea
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Highlight your academic focus, preferred stack, or dream engineering challenges..."
              className="w-full bg-surface-card border border-white/[0.08] rounded-2xl p-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-blue-600/25 transition-all flex items-center gap-2 active:scale-[0.98]"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? "Saving Changes..." : "Save Preferences"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
