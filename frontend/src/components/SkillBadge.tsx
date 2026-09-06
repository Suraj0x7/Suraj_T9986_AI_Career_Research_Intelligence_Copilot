import React from "react";

interface SkillBadgeProps {
  skill: string;
  category?: string;
  variant?: "matched" | "missing" | "strong" | "priority" | "neutral" | "trending";
  size?: "sm" | "md";
  className?: string;
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({
  skill,
  category,
  variant = "neutral",
  size = "md",
  className = "",
}) => {
  const variantStyles = {
    matched: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:border-emerald-400/50 shadow-sm shadow-emerald-500/10",
    missing: "bg-rose-500/10 text-rose-300 border-rose-500/30 hover:border-rose-400/50 shadow-sm shadow-rose-500/10",
    strong: "bg-blue-500/10 text-blue-300 border-blue-500/30 hover:border-blue-400/50 shadow-sm shadow-blue-500/10",
    priority: "bg-amber-500/10 text-amber-300 border-amber-500/30 hover:border-amber-400/50 shadow-sm shadow-amber-500/10",
    trending: "bg-purple-500/10 text-purple-300 border-purple-500/30 hover:border-purple-400/50 shadow-sm shadow-purple-500/10",
    neutral: "bg-slate-800/70 text-slate-300 border-slate-700/70 hover:border-slate-600 shadow-sm",
  };

  const dotColors = {
    matched: "bg-emerald-400",
    missing: "bg-rose-400",
    strong: "bg-blue-400",
    priority: "bg-amber-400 animate-ping",
    trending: "bg-purple-400",
    neutral: "bg-slate-400",
  };

  const sizeStyles = {
    sm: "text-[11px] px-2.5 py-0.5 font-medium",
    md: "text-xs px-3 py-1 font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all duration-200 cursor-default select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        {variant === "priority" && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
        )}
        <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotColors[variant]}`} />
      </span>
      <span>{skill}</span>
      {category && (
        <span className="text-[9px] opacity-60 ml-0.5 uppercase tracking-wider font-mono font-bold">
          {category}
        </span>
      )}
    </span>
  );
};
