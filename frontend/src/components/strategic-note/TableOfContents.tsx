"use client";

import { cn } from "@/lib/utils";
import type { TocItem } from "@/types";

interface TableOfContentsProps {
  items: TocItem[];
  className?: string;
}

export function TableOfContents({ items, className }: TableOfContentsProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className={cn("bg-gris-50 rounded-xl p-6", className)}>
      <h3 className="font-serif text-lg font-semibold text-noir mb-4">
        Sommaire
      </h3>
      <nav className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollToSection(item.id)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-left",
              "text-sm text-gris-600 hover:text-noir hover:bg-blanc",
              "transition-colors duration-150"
            )}
          >
            {item.icon && <span>{item.icon}</span>}
            <span className="truncate">{item.title}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

export default TableOfContents;
