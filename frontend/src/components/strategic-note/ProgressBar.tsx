"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
}

/**
 * ProgressBar - Barre de progression de lecture avec gradient rouge Drakkar
 */
export function ProgressBar({ progress, className }: ProgressBarProps) {
  return (
    <div
      className={cn(
        "fixed top-16 left-0 h-0.5 z-[999] transition-all duration-100 ease-out",
        "bg-gradient-to-r from-rouge via-rouge-vif to-rouge-sombre",
        className
      )}
      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      aria-label={`Progression de lecture: ${Math.round(progress)}%`}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  );
}
