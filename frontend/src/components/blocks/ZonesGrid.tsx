import type { ZonesGridBlock } from "@/types/document";
import { cn } from "@/lib/utils";

interface ZonesGridProps {
  data: ZonesGridBlock;
}

export function ZonesGrid({ data }: ZonesGridProps) {
  const getZoneClasses = (variant: string) => {
    const variantMap: Record<string, { bg: string; border: string; label: string }> = {
      red: {
        bg: "bg-[#fef2f2]",
        border: "border-rouge border-2",
        label: "text-rouge-sombre"
      },
      orange: {
        bg: "bg-[#fffbeb]",
        border: "border-[#f59e0b] border-2",
        label: "text-[#92400e]"
      },
      green: {
        bg: "bg-[#f0fdf4]",
        border: "border-[#22c55e] border-2",
        label: "text-[#166534]"
      }
    };
    return variantMap[variant] || variantMap.green;
  };

  return (
    <div className="grid grid-cols-3 gap-4 my-8">
      {data.zones.map((zone, index) => {
        const classes = getZoneClasses(zone.variant);
        return (
          <div
            key={`${zone.title}_${index}`}
            className={cn("p-6 rounded-md text-center", classes.bg, classes.border)}
          >
            <div
              className={cn(
                "font-sans text-[0.7rem] font-bold uppercase tracking-wider mb-2",
                classes.label
              )}
            >
              {zone.title}
            </div>
            <div className="font-sans text-[0.8rem] font-medium text-gris-700 mb-2">
              {zone.description}
            </div>
            <div className="text-[0.8rem] text-gris-500 italic">{zone.example}</div>
          </div>
        );
      })}
    </div>
  );
}
