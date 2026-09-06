"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell, Sparkles, User as UserIcon, LogOut, Check, Menu, Radio, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

interface NavbarProps {
  onMenuToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (e) {}
      }
    }

    const fetchNotifs = async () => {
      try {
        const list = await api.getNotifications();
        setNotifications(list || []);
        const unread = (list || []).filter((n: any) => !n.is_read).length;
        setUnreadCount(unread);
      } catch (err) {}
    };

    fetchNotifs();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (err) {}
  };

  return (
    <header className="sticky top-0 z-40 w-full h-16 glass-panel border-b border-white/[0.08] px-4 lg:px-8 flex items-center justify-between">
      <div className="flex items-center gap-3.5">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm sm:text-base tracking-tight text-white font-sans">
              AI CAREER & RESEARCH
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20 font-mono">
              COPILOT
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Live System Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 border border-white/[0.08] text-[11px] font-medium text-slate-300 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Vector RAG Online</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="relative p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors border border-transparent hover:border-white/[0.06]"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gradient-to-tr from-blue-600 to-cyan-500 text-[10px] font-extrabold text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 animate-pulse font-mono">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2.5 w-80 sm:w-96 glass-card-premium rounded-2xl border border-white/[0.12] shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                    Activity & Alerts
                  </h4>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full font-mono font-semibold border border-blue-500/30">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.04] my-2 pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 py-8 text-center">No notifications yet.</p>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      className={`py-3 px-2.5 rounded-xl transition-colors ${
                        !n.is_read ? "bg-blue-500/5 border border-blue-500/10" : ""
                      }`}
                    >
                      <p className="text-xs font-semibold text-slate-200 tracking-tight">{n.title}</p>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                        {n.message}
                      </p>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2.5 border-t border-white/[0.08] text-center">
                <Link
                  href="/dashboard/notifications"
                  onClick={() => setShowNotifs(false)}
                  className="text-xs text-blue-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 transition-colors"
                >
                  <span>Open Notification Center</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Info & Profile Link */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.08]">
          <Link
            href="/dashboard/profile"
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800/60 border border-transparent hover:border-white/[0.06] transition-all"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 p-0.5 shadow-md shadow-blue-600/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-xs font-extrabold text-white">
                {user?.name ? user.name[0].toUpperCase() : "A"}
              </div>
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold text-white leading-tight tracking-tight">
                {user?.name || "Alex Mercer"}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                {user?.profile_type || "Student / Fresher"}
              </p>
            </div>
          </Link>

          <button
            onClick={() => api.logout()}
            title="Sign out of Copilot"
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
