"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface SectionProps {
  id: string;
  title: string;
  icon?: string;
  children: ReactNode;
  className?: string;
}

export function Section({ id, title, icon, children, className }: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 py-12 border-b border-gris-100 last:border-b-0",
        className
      )}
    >
      <div className="flex items-center gap-3 mb-6">
        {icon && <span className="text-2xl">{icon}</span>}
        <h2 className="font-serif text-2xl md:text-3xl font-semibold text-noir">
          {title}
        </h2>
      </div>
      <div className="prose prose-lg max-w-none text-gris-700">{children}</div>
    </section>
  );
}

export default Section;
