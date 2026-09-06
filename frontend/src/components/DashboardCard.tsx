import React from "react";
import { LucideIcon, ArrowUpRight } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  color?: "blue" | "purple" | "teal" | "emerald" | "amber";
  className?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  color = "blue",
  className = "",
}) => {
  const colorMap = {
    blue: {
      icon: "text-blue-400 bg-blue-500/10 border-blue-500/25",
      glow: "from-blue-600/15 via-blue-500/5 to-transparent",
      badge: "text-blue-300 bg-blue-500/15 border-blue-500/30",
    },
    purple: {
      icon: "text-purple-400 bg-purple-500/10 border-purple-500/25",
      glow: "from-purple-600/15 via-purple-500/5 to-transparent",
      badge: "text-purple-300 bg-purple-500/15 border-purple-500/30",
    },
    teal: {
      icon: "text-teal-400 bg-teal-500/10 border-teal-500/25",
      glow: "from-teal-600/15 via-teal-500/5 to-transparent",
      badge: "text-teal-300 bg-teal-500/15 border-teal-500/30",
    },
    emerald: {
      icon: "text-emerald-400 bg-emerald-500/10 border-emerald-500/25",
      glow: "from-emerald-600/15 via-emerald-500/5 to-transparent",
      badge: "text-emerald-300 bg-emerald-500/15 border-emerald-500/30",
    },
    amber: {
      icon: "text-amber-400 bg-amber-500/10 border-amber-500/25",
      glow: "from-amber-600/15 via-amber-500/5 to-transparent",
      badge: "text-amber-300 bg-amber-500/15 border-amber-500/30",
    },
  };

  const scheme = colorMap[color];

  return (
    <div
      className={`glass-card-premium rounded-2xl p-5 border border-white/[0.08] relative overflow-hidden group ${className}`}
    >
      {/* Ambient background glow on hover */}
      <div
        className={`absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br ${scheme.glow} blur-2xl pointer-events-none opacity-60 group-hover:opacity-100 transition-opacity duration-500`}
      />

      <div className="flex items-center justify-between relative z-10">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
          {title}
        </span>
        <div className={`p-2.5 rounded-xl border ${scheme.icon} shadow-inner transition-transform group-hover:scale-105 duration-300`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2.5 relative z-10">
        <span className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white font-sans">
          {value}
        </span>
        {trend && (
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-0.5">
            <ArrowUpRight className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-1.5 text-xs text-slate-400 font-normal leading-relaxed relative z-10">
          {subtitle}
        </p>
      )}
    </div>
  );
};
