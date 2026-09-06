"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  Briefcase,
  BookOpen,
  CalendarCheck,
  Bell,
  TrendingUp,
  User,
  LogOut,
  X,
  Compass,
  Sparkles,
  Layers,
} from "lucide-react";
import { api } from "@/lib/api";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();

  const sections = [
    {
      title: "Overview",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Intelligence Copilots",
      items: [
        { name: "Fresher Copilot", href: "/dashboard/fresher", icon: GraduationCap, badge: "ATS" },
        { name: "Experienced Copilot", href: "/dashboard/experienced", icon: Briefcase, badge: "Trends" },
        { name: "Research Copilot", href: "/dashboard/researcher", icon: BookOpen, badge: "RAG" },
      ],
    },
    {
      title: "Growth & Execution",
      items: [
        { name: "30-Day Learning Plan", href: "/dashboard/learning", icon: CalendarCheck },
        { name: "Progress & Milestones", href: "/dashboard/progress", icon: TrendingUp },
      ],
    },
    {
      title: "Settings",
      items: [
        { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
        { name: "Profile & Career Goals", href: "/dashboard/profile", icon: User },
      ],
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#080b14] border-r border-white/[0.08] p-4 select-none">
      {/* Mobile Close Header */}
      <div className="flex items-center justify-between lg:hidden mb-4 pb-3 border-b border-white/[0.08]">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
          Menu Navigation
        </span>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Intelligence Suite Badge */}
      <div className="hidden lg:flex items-center gap-2.5 px-3.5 py-2.5 mb-5 rounded-xl bg-gradient-to-r from-blue-950/40 via-indigo-950/20 to-transparent border border-blue-500/20">
        <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
        <div className="text-left">
          <span className="text-xs font-bold text-white block tracking-tight">
            Intelligence Suite
          </span>
          <span className="text-[10px] text-slate-400 block font-mono">
            Deterministic + RAG Grounded
          </span>
        </div>
      </div>

      {/* Grouped Nav Links */}
      <nav className="flex-1 space-y-5 overflow-y-auto pr-1 no-scrollbar">
        {sections.map((section) => (
          <div key={section.title} className="space-y-1">
            <h5 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              {section.title}
            </h5>
            <div className="space-y-0.5 pt-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={onClose}
                    className={`group flex items-center justify-between px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg shadow-blue-600/20"
                        : "text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 hover:border-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive ? "text-white" : "text-slate-400 group-hover:text-cyan-400"
                        }`}
                      />
                      <span className="truncate">{item.name}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-800 text-slate-400 group-hover:text-cyan-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Signout Card */}
      <div className="pt-4 mt-auto border-t border-white/[0.08]">
        <button
          onClick={() => api.logout()}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all duration-200"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-[calc(100vh-4rem)] sticky top-16 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={onClose}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-full shadow-2xl z-50 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
