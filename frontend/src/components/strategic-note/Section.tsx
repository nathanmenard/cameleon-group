"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface SectionProps {
  id: string;
  num?: string;
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Section - Wrapper de section avec numéro et titre optionnels
 */
export function Section({ id, num, title, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "mb-16 scroll-mt-[140px]",
        className
      )}
    >
      {/* Section number */}
      {num && (
        <div className="font-sans text-xs font-bold uppercase tracking-[0.1em] text-gris-500 mb-2">
          {num}
        </div>
      )}

      {/* Section title */}
      {title && (
        <h2 className="text-[1.85rem] md:text-2xl font-medium leading-[1.25] tracking-[-0.01em] mb-6 text-noir">
          {title}
        </h2>
      )}

      {/* Section content */}
      {children}
    </section>
  );
}

export default Section;
