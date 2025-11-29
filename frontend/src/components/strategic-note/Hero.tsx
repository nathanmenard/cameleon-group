import { cn } from "@/lib/utils";
import type { ClientConfig } from "@/types";

interface HeroProps {
  client: ClientConfig;
  title: string;
  subtitle?: string;
  className?: string;
}

export function Hero({ client, title, subtitle, className }: HeroProps) {
  return (
    <header
      className={cn(
        "pt-24 pb-12 px-6 bg-gradient-to-b from-gris-50 to-blanc",
        className
      )}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blanc rounded-full shadow-sm border border-gris-200 mb-6">
          <span className="w-2 h-2 bg-rouge rounded-full animate-pulse" />
          <span className="text-xs font-medium text-gris-600 uppercase tracking-wider">
            Note stratégique
          </span>
        </div>

        <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-noir mb-4 leading-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="text-xl text-gris-600 max-w-2xl mx-auto">{subtitle}</p>
        )}

        <div className="mt-8 flex items-center justify-center gap-4 text-sm text-gris-500">
          <span>Préparé pour {client.name}</span>
          <span className="w-1 h-1 bg-gris-300 rounded-full" />
          <span>Par Drakkar.io</span>
        </div>
      </div>
    </header>
  );
}

export default Hero;
