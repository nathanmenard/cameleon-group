"use client";

import { cn } from "@/lib/utils";
import { useRef, useCallback, useEffect, useState } from "react";

interface TocNavItem {
  id: string;
  num: string;
  title: string;
}

interface TocNavProps {
  items: TocNavItem[];
  activeId: string;
  visible: boolean;
  className?: string;
}

/**
 * TocNav - Navigation sticky sous la navbar avec scroll horizontal
 */
export function TocNav({ items, activeId, visible, className }: TocNavProps) {
  const navInnerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = useCallback(() => {
    const inner = navInnerRef.current;
    if (!inner) return;
    setCanScrollLeft(inner.scrollLeft > 10);
    setCanScrollRight(inner.scrollLeft < inner.scrollWidth - inner.clientWidth - 10);
  }, []);

  const scrollNavLeft = useCallback(() => {
    navInnerRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  }, []);

  const scrollNavRight = useCallback(() => {
    navInnerRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const inner = navInnerRef.current;
    if (!inner) return;
    inner.addEventListener("scroll", updateArrows);
    updateArrows();
    return () => inner.removeEventListener("scroll", updateArrows);
  }, [updateArrows]);

  // Auto-scroll to active item
  useEffect(() => {
    if (visible && activeId && navInnerRef.current) {
      const activeLink = navInnerRef.current.querySelector(
        `a[href="#${activeId}"]`
      ) as HTMLElement;
      if (activeLink) {
        const inner = navInnerRef.current;
        const linkRect = activeLink.getBoundingClientRect();
        const navRect = inner.getBoundingClientRect();
        const linkCenter = linkRect.left + linkRect.width / 2;
        const navCenter = navRect.left + navRect.width / 2;
        inner.scrollTo({
          left: inner.scrollLeft + (linkCenter - navCenter),
          behavior: "smooth",
        });
      }
    }
  }, [visible, activeId]);

  return (
    <div
      className={cn(
        // Position and background
        "fixed top-16 left-0 right-0 bg-gris-800 z-[998]",
        // Transitions
        "transition-all duration-300 ease-in-out",
        // Border
        "border-b border-gris-700",
        // Flex layout
        "flex items-center",
        // Visibility state (mobile: bottom instead of top)
        "md:top-auto md:bottom-0",
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 md:translate-y-full",
        className
      )}
    >
      {/* Left arrow - hidden on mobile */}
      <button type="button"
        onClick={scrollNavLeft}
        className={cn(
          "flex-shrink-0 w-9 h-12 bg-gris-800 border-none text-gris-300",
          "text-2xl cursor-pointer flex items-center justify-center",
          "transition-all duration-200 ease-in-out",
          "border-r border-gris-700",
          "hover:text-blanc hover:bg-gris-700",
          "md:hidden"
        )}
        style={{ opacity: canScrollLeft ? 1 : 0.3 }}
        aria-label="Défiler vers la gauche"
      >
        ‹
      </button>

      {/* Nav items container */}
      <div
        ref={navInnerRef}
        className={cn(
          "flex-1 max-w-[1200px] mx-auto px-4 md:px-3",
          "flex items-center h-12 gap-1 md:gap-1.5",
          "overflow-x-auto scrollbar-none"
        )}
      >
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={cn(
              "font-sans text-[0.8rem] font-medium",
              "no-underline px-3.5 py-2 rounded",
              "whitespace-nowrap transition-all duration-150 ease-in-out",
              "flex items-center gap-1.5",
              activeId === item.id
                ? "text-blanc bg-gradient-to-r from-rouge via-rouge-vif to-rouge-sombre bg-[length:200%_200%] animate-[gradientShift_6s_ease-in-out_infinite]"
                : "text-gris-300 hover:text-blanc hover:bg-gris-700"
            )}
          >
            <span
              className={cn(
                "font-semibold",
                activeId === item.id ? "text-blanc" : "text-rouge-vif"
              )}
            >
              {item.num}
            </span>
            {item.title}
          </a>
        ))}
      </div>

      {/* Right arrow - hidden on mobile */}
      <button type="button"
        onClick={scrollNavRight}
        className={cn(
          "flex-shrink-0 w-9 h-12 bg-gris-800 border-none text-gris-300",
          "text-2xl cursor-pointer flex items-center justify-center",
          "transition-all duration-200 ease-in-out",
          "border-l border-gris-700",
          "hover:text-blanc hover:bg-gris-700",
          "md:hidden"
        )}
        style={{ opacity: canScrollRight ? 1 : 0.3 }}
        aria-label="Défiler vers la droite"
      >
        ›
      </button>
    </div>
  );
}
