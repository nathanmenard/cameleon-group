"use client";

import { cn } from "@/lib/utils";

interface TocGridItem {
  id: string;
  num: string;
  title: string;
}

interface DocHeaderProps {
  type: string;
  title: string;
  subtitle?: string;
  tocItems?: TocGridItem[];
  className?: string;
}

/**
 * DocHeader - En-tête du document avec titre principal et grille TOC
 */
export function DocHeader({
  type,
  title,
  subtitle,
  tocItems,
  className,
}: DocHeaderProps) {
  return (
    <header className={cn("mb-12 pb-10 border-b border-gris-200", className)}>
      {/* Type label */}
      <div className="font-sans text-[0.8rem] font-bold uppercase tracking-[0.12em] text-rouge-sombre mb-5">
        {type}
      </div>

      {/* Title */}
      <h1 className="text-[2.75rem] md:text-[1.75rem] font-medium leading-[1.15] tracking-[-0.02em] mb-3 text-noir">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-xl md:text-base text-gris-500 italic mb-0">
          {subtitle}
        </p>
      )}

      {/* TOC Grid */}
      {tocItems && tocItems.length > 0 && (
        <div
          id="tocBlock"
          className="bg-noir p-10 md:p-6 mt-16 rounded-lg relative overflow-hidden"
        >
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rouge via-rouge-vif to-rouge-sombre bg-[length:200%_200%] animate-[gradientShift_6s_ease-in-out_infinite]" />

          {/* TOC header */}
          <div className="flex items-center justify-between mb-7">
            <div className="font-sans text-xs font-bold uppercase tracking-[0.15em] text-blanc">
              Sommaire
            </div>
            <div className="font-sans text-[0.8rem] text-gris-300">
              {tocItems.length} sections
            </div>
          </div>

          {/* TOC grid */}
          <div className="grid grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-y-3 gap-x-6 md:gap-2">
            {tocItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={cn(
                  "flex items-center gap-3.5 px-4 py-3.5 md:py-3",
                  "bg-gris-800 rounded-md no-underline",
                  "transition-all duration-150 ease-in-out",
                  "border border-gris-700",
                  "hover:bg-gris-700 hover:border-gris-500"
                )}
              >
                <span className="font-sans text-[0.8rem] font-bold text-rouge-vif min-w-[1.5rem]">
                  {item.num}
                </span>
                <span className="font-sans text-sm font-medium text-blanc leading-[1.4]">
                  {item.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
