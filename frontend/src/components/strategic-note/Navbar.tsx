"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ClientConfig } from "@/types";

interface NavbarProps {
  client: ClientConfig;
  className?: string;
}

export function Navbar({ client, className }: NavbarProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-noir text-blanc",
        "flex items-center justify-between px-6 py-3",
        "border-b border-gris-800",
        className
      )}
    >
      <button
        onClick={scrollToTop}
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
      >
        <Image
          src="/logos/logo_drakkar_blanc.png"
          alt="Drakkar"
          width={100}
          height={28}
          className="h-7 w-auto"
        />
        <span className="text-gris-500 text-lg font-light">&times;</span>
        <span className="font-medium">{client.name}</span>
      </button>

      <div className="flex items-center gap-4">
        <span className="text-xs text-gris-400 hidden sm:block">
          Document confidentiel
        </span>
      </div>
    </nav>
  );
}

export default Navbar;
