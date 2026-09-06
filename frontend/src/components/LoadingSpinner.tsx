import React from "react";
import { Sparkles } from "lucide-react";

interface LoadingSpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
  subtext?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = "Processing with AI Intelligence...",
  size = "md",
  subtext = "Synthesizing vector embeddings & career insights",
}) => {
  const sizeMap = {
    sm: { container: "w-8 h-8", ring: "border-2", icon: "w-3 h-3" },
    md: { container: "w-14 h-14", ring: "border-2", icon: "w-5 h-5" },
    lg: { container: "w-20 h-20", ring: "border-3", icon: "w-7 h-7" },
  };

  const current = sizeMap[size];

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center select-none">
      <div className={`relative ${current.container} flex items-center justify-center mb-5`}>
        {/* Ambient background glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-teal-400 blur-xl opacity-35 animate-pulse" />
        
        {/* Outer orbital ring */}
        <div className={`absolute inset-0 rounded-full border border-blue-500/20 border-t-blue-400 animate-spin`} />
        
        {/* Middle reverse orbital ring */}
        <div className={`absolute inset-1 rounded-full border border-purple-500/20 border-b-purple-400 animate-spin [animation-direction:reverse] [animation-duration:1.5s]`} />
        
        {/* Center core */}
        <div className="w-1/2 h-1/2 rounded-full bg-slate-900/90 border border-slate-700/80 flex items-center justify-center text-blue-400 shadow-inner">
          <Sparkles className={`${current.icon} animate-pulse text-cyan-400`} />
        </div>
      </div>

      <p className="text-slate-100 font-semibold text-sm tracking-tight flex items-center gap-2">
        <span>{label}</span>
      </p>

      {subtext && (
        <p className="text-slate-400 text-xs mt-1.5 max-w-sm tracking-normal leading-relaxed">
          {subtext}
        </p>
      )}
    </div>
  );
};
