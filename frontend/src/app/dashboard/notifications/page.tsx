"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  Sparkles,
  AlertCircle,
  Info,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Filter
} from "lucide-react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { api } from "@/lib/api";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await api.getNotifications();
      setNotifications(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: number) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {}
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    } catch (err) {}
  };

  const filtered = notifications.filter((n) =>
    filter === "unread" ? !n.is_read : true
  );

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  if (loading) {
    return <LoadingSpinner label="Loading Real-Time Notification Stream..." />;
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16 max-w-4xl">
      {/* Header */}
      <div className="relative">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs font-semibold mb-3 shadow-sm shadow-blue-500/10">
          <Bell className="w-3.5 h-3.5" />
          <span>Real-time Stream & Copilot Push Alerts</span>
          {unreadCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping ml-1" />
          )}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Notification <span className="text-gradient-blue">Center</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Live updates regarding resume parse milestones, RAG chunk indexing completions, and daily learning goals.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="px-4 py-2 rounded-xl bg-surface-card hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-white/[0.08] transition-colors flex items-center gap-2 active:scale-[0.98]"
              >
                <CheckCheck className="w-4 h-4 text-blue-400" />
                <span>Mark All Read</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            filter === "all"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              : "text-slate-400 hover:text-white hover:bg-surface-card"
          }`}
        >
          <span>All Alerts</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/10 font-mono">
            {notifications.length}
          </span>
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            filter === "unread"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              : "text-slate-400 hover:text-white hover:bg-surface-card"
          }`}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-400 text-slate-900 font-bold font-mono">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* Notifications Stream */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="glass-card rounded-3xl p-12 text-center border border-white/[0.08] shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-surface-card border border-white/[0.06] flex items-center justify-center mx-auto mb-3 text-slate-500">
              <Bell className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-white">All caught up!</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              You have no pending alerts. As you upload resumes, papers, or complete curriculum tasks, new milestones will appear here.
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const isSuccess = item.type === "SUCCESS";
            return (
              <div
                key={item.id}
                className={`glass-card rounded-2xl p-5 border transition-all duration-300 flex items-start justify-between gap-4 ${
                  !item.is_read
                    ? "border-blue-500/30 bg-blue-950/20 shadow-lg shadow-blue-500/5"
                    : "border-white/[0.06] hover:border-slate-700"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isSuccess
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25"
                        : "bg-blue-500/10 text-blue-400 border border-blue-500/25"
                    }`}
                  >
                    {isSuccess ? (
                      <Sparkles className="w-5 h-5" />
                    ) : (
                      <Info className="w-5 h-5" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      {!item.is_read && (
                        <span className="w-2 h-2 rounded-full bg-blue-400 shadow-glow" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">{item.message}</p>
                    <span className="text-[10px] text-slate-500 pt-1 block flex items-center gap-1.5 font-mono">
                      <Clock className="w-3 h-3 text-slate-600" />
                      {new Date(item.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>

                {!item.is_read && (
                  <button
                    onClick={() => handleMarkRead(item.id)}
                    title="Mark as read"
                    className="p-2 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors shrink-0"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
